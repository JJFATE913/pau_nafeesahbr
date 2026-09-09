import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  createAppointment,
  getAvailableSlots,
  isClosedDate,
  isPastDate,
  isValidDateIso,
  isValidName,
  isValidPhone,
  isValidTimeSlot,
  listAppointmentsForDate,
  normalizePhone,
  type Appointment,
} from "@/lib/appointments";
import { sendAppointmentTexts } from "@/lib/sms";
import { getBlockedTimes } from "@/lib/blocked-hours";
import { checkRateLimit, clientIdentifier } from "@/lib/rate-limit";

// Each booking sends two text messages, so the endpoint is capped per caller.
const BOOKINGS_PER_HOUR = 5;

export async function POST(request: Request) {
  const allowed = await checkRateLimit(
    "book",
    clientIdentifier(request),
    BOOKINGS_PER_HOUR,
    60 * 60,
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please call the studio to finish booking." },
      { status: 429 },
    );
  }

  const body = (await request.json()) as Partial<Appointment>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const date = typeof body.date === "string" ? body.date : "";
  const time = typeof body.time === "string" ? body.time : "";

  if (!isValidName(name)) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (!isValidDateIso(date) || !isValidTimeSlot(time)) {
    return NextResponse.json({ error: "Please choose a date and time." }, { status: 400 });
  }

  const selected = new Date(`${date}T00:00:00`);
  if (Number.isNaN(selected.getTime()) || isClosedDate(selected) || isPastDate(date)) {
    return NextResponse.json({ error: "That date is not available." }, { status: 400 });
  }

  const appointments = await listAppointmentsForDate(date);
  const blocked = await getBlockedTimes(date);
  const slot = getAvailableSlots(date, appointments, blocked).find((item) => item.time === time);
  if (!slot?.available) {
    return NextResponse.json({ error: "That time is not available. Please choose another." }, { status: 409 });
  }

  const appointment: Appointment = {
    id: randomUUID(),
    name,
    phone: normalizePhone(phone),
    date,
    time,
    createdAt: new Date().toISOString(),
  };

  // The store rejects the write if another guest claimed the slot in the meantime.
  const reserved = await createAppointment(appointment);
  if (!reserved) {
    return NextResponse.json(
      { error: "That time was just taken. Please choose another." },
      { status: 409 },
    );
  }

  const sms = await sendAppointmentTexts(appointment);
  return NextResponse.json({
    ok: true,
    appointment: { id: appointment.id, date, time },
    sms,
  });
}
