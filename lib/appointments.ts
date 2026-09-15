import {
  CLOSED_WEEKDAYS,
  GRID_MINUTES,
  addMinutes,
  durationForService,
  formatBookingService,
  isGridTime,
  rangesOverlap,
  startTimesForDuration,
  ticksCovered,
} from "@/lib/business";
import { deleteItem, getItem, putItem, queryItems, type Item } from "@/lib/db";

export type Appointment = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  serviceKind: string;
  serviceDetail: string;
  service: string;
  durationMinutes: number;
  createdAt: string;
};

const COLLECTION = "appointment";
const BUSY = "busy";

function slotKey(date: string, time: string) {
  return `${date}#${time}`;
}

export function appointmentDuration(item: Pick<Appointment, "durationMinutes" | "serviceKind">) {
  return item.durationMinutes || durationForService(item.serviceKind);
}

function toAppointment(item: Item): Appointment {
  const serviceKind = String(item.serviceKind ?? "");
  const serviceDetail = String(item.serviceDetail ?? "");
  const stored = String(item.service ?? "");
  const durationMinutes = Number(item.durationMinutes) || durationForService(serviceKind);
  return {
    id: String(item.id),
    name: String(item.name),
    phone: String(item.phone),
    date: String(item.date),
    time: String(item.time),
    serviceKind,
    serviceDetail,
    service: stored || formatBookingService(serviceKind, serviceDetail),
    durationMinutes,
    createdAt: String(item.createdAt),
  };
}

export async function listAppointmentsForDate(date: string): Promise<Appointment[]> {
  const items = await queryItems(COLLECTION, `${date}#`);
  return items.map(toAppointment);
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const items = await queryItems(COLLECTION);
  const match = items.find((item) => item.id === id);
  return match ? toAppointment(match) : null;
}

export async function getAppointmentAt(date: string, time: string) {
  const item = await getItem(COLLECTION, slotKey(date, time));
  return item ? toAppointment(item) : null;
}

async function releaseBusy(date: string, ticks: string[]) {
  await Promise.all(ticks.map((tick) => deleteItem(BUSY, slotKey(date, tick))));
}

/** Returns false when the chair is already taken for any part of the visit. */
export async function createAppointment(appointment: Appointment): Promise<boolean> {
  const duration = appointmentDuration(appointment);
  const existing = await listAppointmentsForDate(appointment.date);
  const overlapsGuest = existing.some((item) =>
    rangesOverlap(item.time, appointmentDuration(item), appointment.time, duration),
  );
  if (overlapsGuest) return false;

  const ticks = ticksCovered(appointment.time, duration);
  const claimed: string[] = [];
  for (const tick of ticks) {
    const reserved = await putItem(
      { pk: BUSY, sk: slotKey(appointment.date, tick), appointmentId: appointment.id },
      true,
    );
    if (!reserved) {
      await releaseBusy(appointment.date, claimed);
      return false;
    }
    claimed.push(tick);
  }

  const saved = await putItem(
    { pk: COLLECTION, sk: slotKey(appointment.date, appointment.time), ...appointment },
    true,
  );
  if (!saved) {
    await releaseBusy(appointment.date, claimed);
    return false;
  }
  return true;
}

export function isClosedDate(date: Date) {
  return (CLOSED_WEEKDAYS as readonly number[]).includes(date.getDay());
}

export function isPastDate(dateIso: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(`${dateIso}T00:00:00`);
  return selected < today;
}

export function isSlotInThePast(dateIso: string, time: string) {
  const now = new Date();
  const slot = new Date(`${dateIso}T${time}:00`);
  return slot.getTime() <= now.getTime();
}

export type SlotStatus = {
  time: string;
  endTime: string;
  available: boolean;
  booked: boolean;
  blocked: boolean;
};

export function getAvailableSlots(
  dateIso: string,
  appointments: Appointment[],
  blockedTimes: Iterable<string> = [],
  durationMinutes = 60,
): SlotStatus[] {
  const blocked = new Set(blockedTimes);
  const dayAppointments = appointments.filter((item) => item.date === dateIso);
  const starts = startTimesForDuration(durationMinutes);

  return starts.map((time) => {
    const ticks = ticksCovered(time, durationMinutes);
    const booked = dayAppointments.some((item) =>
      rangesOverlap(item.time, appointmentDuration(item), time, durationMinutes),
    );
    const closed = ticks.some((tick) => blocked.has(tick));
    const past = isSlotInThePast(dateIso, time);
    return {
      time,
      endTime: addMinutes(time, durationMinutes),
      booked,
      blocked: closed,
      available: !booked && !closed && !past,
    };
  });
}

export function getAdminSlots(
  dateIso: string,
  appointments: Appointment[],
  blockedTimes: Iterable<string> = [],
): SlotStatus[] {
  return getAvailableSlots(dateIso, appointments, blockedTimes, GRID_MINUTES);
}

export function isValidDateIso(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isValidTimeSlot(value: string) {
  return isGridTime(value);
}

export function isValidStartTime(time: string, durationMinutes: number) {
  return startTimesForDuration(durationMinutes).includes(time);
}

export function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function isValidName(name: string) {
  return name.trim().length >= 2 && name.trim().length <= 80;
}
