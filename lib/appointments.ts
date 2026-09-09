import { CLOSED_WEEKDAYS, TIME_SLOTS } from "@/lib/business";
import { getItem, putItem, queryItems, type Item } from "@/lib/db";

export type Appointment = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  createdAt: string;
};

const COLLECTION = "appointment";

// One record per date+time, so the store itself enforces one booking per slot.
function slotKey(date: string, time: string) {
  return `${date}#${time}`;
}

function toAppointment(item: Item): Appointment {
  return {
    id: String(item.id),
    name: String(item.name),
    phone: String(item.phone),
    date: String(item.date),
    time: String(item.time),
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

/** Returns false when the slot was claimed by someone else first. */
export async function createAppointment(appointment: Appointment): Promise<boolean> {
  return putItem(
    { pk: COLLECTION, sk: slotKey(appointment.date, appointment.time), ...appointment },
    true,
  );
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
  available: boolean;
  booked: boolean;
  blocked: boolean;
};

export function getAvailableSlots(
  dateIso: string,
  appointments: Appointment[],
  blockedTimes: Iterable<string> = [],
): SlotStatus[] {
  const taken = new Set(
    appointments.filter((item) => item.date === dateIso).map((item) => item.time),
  );
  const blocked = new Set(blockedTimes);

  return TIME_SLOTS.map((time) => {
    const booked = taken.has(time);
    const closed = blocked.has(time);
    const past = isSlotInThePast(dateIso, time);
    return {
      time,
      booked,
      blocked: closed,
      available: !booked && !closed && !past,
    };
  });
}

export function isValidDateIso(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isValidTimeSlot(value: string) {
  return (TIME_SLOTS as readonly string[]).includes(value);
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
