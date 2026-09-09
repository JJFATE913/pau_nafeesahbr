import { NextResponse } from "next/server";
import { getAppointmentById } from "@/lib/appointments";
import { buildIcs, type CalendarAudience } from "@/lib/calendar";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const appointment = await getAppointmentById(id);
  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }

  const audience = new URL(request.url).searchParams.get("for");
  const role: CalendarAudience = audience === "studio" ? "studio" : "guest";
  const ics = buildIcs(appointment, role);

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="pau-nafeesah-${appointment.date}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
