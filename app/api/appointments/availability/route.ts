import { NextResponse } from "next/server";
import {
  getAvailableSlots,
  isClosedDate,
  isPastDate,
  isValidDateIso,
  listAppointmentsForDate,
} from "@/lib/appointments";
import { durationForService, isBookingServiceId } from "@/lib/business";
import { getBlockedTimes } from "@/lib/blocked-hours";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? "";
  const service = searchParams.get("service") ?? "";

  if (!isValidDateIso(date)) {
    return NextResponse.json({ error: "Choose a valid date." }, { status: 400 });
  }
  if (!isBookingServiceId(service)) {
    return NextResponse.json({ error: "Choose a service to see open times." }, { status: 400 });
  }

  const selected = new Date(`${date}T00:00:00`);
  if (Number.isNaN(selected.getTime()) || isClosedDate(selected) || isPastDate(date)) {
    return NextResponse.json({ error: "That date is not available." }, { status: 400 });
  }

  const durationMinutes = durationForService(service);
  const appointments = await listAppointmentsForDate(date);
  const blocked = await getBlockedTimes(date);
  return NextResponse.json({
    durationMinutes,
    slots: getAvailableSlots(date, appointments, blocked, durationMinutes),
  });
}
