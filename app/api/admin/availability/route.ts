import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin";
import {
  appointmentDuration,
  getAdminSlots,
  isClosedDate,
  isPastDate,
  isValidDateIso,
  isValidTimeSlot,
  listAppointmentsForDate,
} from "@/lib/appointments";
import {
  getBlockedTimes,
  listUpcomingBlockedDays,
  setBlockedTimes,
} from "@/lib/blocked-hours";
import { TIME_SLOTS, rangesOverlap } from "@/lib/business";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const date = new URL(request.url).searchParams.get("date") ?? "";
  if (!date) {
    return NextResponse.json({ days: await listUpcomingBlockedDays() });
  }
  if (!isValidDateIso(date)) {
    return NextResponse.json({ error: "Choose a valid date." }, { status: 400 });
  }

  const selected = new Date(`${date}T00:00:00`);
  if (Number.isNaN(selected.getTime()) || isClosedDate(selected) || isPastDate(date)) {
    return NextResponse.json({ error: "That date is not available to edit." }, { status: 400 });
  }

  const appointments = await listAppointmentsForDate(date);
  const blocked = await getBlockedTimes(date);
  return NextResponse.json({ slots: getAdminSlots(date, appointments, blocked) });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const body = (await request.json()) as {
    date?: string;
    time?: string;
    blocked?: boolean;
    blockAll?: boolean;
    unblockAll?: boolean;
  };
  const date = typeof body.date === "string" ? body.date : "";
  if (!isValidDateIso(date)) {
    return NextResponse.json({ error: "Choose a valid date." }, { status: 400 });
  }

  const selected = new Date(`${date}T00:00:00`);
  if (Number.isNaN(selected.getTime()) || isClosedDate(selected) || isPastDate(date)) {
    return NextResponse.json({ error: "That date is not available to edit." }, { status: 400 });
  }

  const appointments = await listAppointmentsForDate(date);
  const current = await getBlockedTimes(date);

  function cellBooked(time: string) {
    return appointments.some((item) =>
      rangesOverlap(item.time, appointmentDuration(item), time, 30),
    );
  }

  if (body.unblockAll) {
    await setBlockedTimes(date, []);
  } else if (body.blockAll) {
    const times = TIME_SLOTS.filter((time) => !cellBooked(time));
    await setBlockedTimes(date, times);
  } else {
    const time = typeof body.time === "string" ? body.time : "";
    if (!isValidTimeSlot(time)) {
      return NextResponse.json({ error: "Choose a valid time." }, { status: 400 });
    }
    if (cellBooked(time)) {
      return NextResponse.json(
        { error: "That time already has a guest. It cannot be blocked." },
        { status: 409 },
      );
    }
    if (body.blocked) {
      current.add(time);
    } else {
      current.delete(time);
    }
    await setBlockedTimes(date, [...current]);
  }

  const blocked = await getBlockedTimes(date);
  return NextResponse.json({
    ok: true,
    slots: getAdminSlots(date, appointments, blocked),
  });
}
