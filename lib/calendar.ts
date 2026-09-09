import { business, formatSlotLabel } from "@/lib/business";
import { salonTimezone, siteUrl } from "@/lib/site";
import type { Appointment } from "@/lib/appointments";

export type CalendarAudience = "guest" | "studio";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function localStamp(dateIso: string, time: string) {
  const [year, month, day] = dateIso.split("-");
  const [hours, minutes] = time.split(":");
  return `${year}${month}${day}T${hours}${minutes}00`;
}

function endTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const endHours = hours + 1;
  return `${pad(endHours)}:${pad(minutes)}`;
}

function isoLocal(dateIso: string, time: string) {
  return `${dateIso}T${time}:00`;
}

function eventCopy(appointment: Appointment, audience: CalendarAudience) {
  const when = `${appointment.date} at ${formatSlotLabel(appointment.time)}`;
  const location = business.addressLines.join(", ");
  if (audience === "studio") {
    return {
      title: `${appointment.name} — ${business.shortName}`,
      details: `Studio booking with ${appointment.name}. Phone: ${appointment.phone}. ${when}.`,
      location,
    };
  }
  return {
    title: `${business.name} appointment`,
    details: `Your appointment at ${business.name} on ${when}. ${business.phoneDisplay}`,
    location,
  };
}

export function calendarPageUrl(id: string) {
  return `${siteUrl()}/book/confirmed/${id}`;
}

export function icsPath(id: string, audience: CalendarAudience) {
  return `/api/appointments/${id}/calendar?for=${audience}`;
}

export function googleCalendarUrl(appointment: Appointment, audience: CalendarAudience) {
  const { title, details, location } = eventCopy(appointment, audience);
  const start = localStamp(appointment.date, appointment.time);
  const end = localStamp(appointment.date, endTime(appointment.time));
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details,
    location,
    ctz: salonTimezone(),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(appointment: Appointment, audience: CalendarAudience) {
  const { title, details, location } = eventCopy(appointment, audience);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    body: details,
    location,
    startdt: isoLocal(appointment.date, appointment.time),
    enddt: isoLocal(appointment.date, endTime(appointment.time)),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function foldIcsLine(line: string) {
  const chunks: string[] = [];
  let remaining = line;
  while (remaining.length > 75) {
    chunks.push(remaining.slice(0, 75));
    remaining = ` ${remaining.slice(75)}`;
  }
  chunks.push(remaining);
  return chunks.join("\r\n");
}

export function buildIcs(appointment: Appointment, audience: CalendarAudience) {
  const { title, details, location } = eventCopy(appointment, audience);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const tz = salonTimezone();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pau-Nafeesah Beauty Room//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${appointment.id}@paunafeesahbeauty.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${tz}:${localStamp(appointment.date, appointment.time)}`,
    `DTEND;TZID=${tz}:${localStamp(appointment.date, endTime(appointment.time))}`,
    foldIcsLine(`SUMMARY:${title}`),
    foldIcsLine(`DESCRIPTION:${details.replace(/\n/g, "\\n")}`),
    foldIcsLine(`LOCATION:${location}`),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.join("\r\n")}\r\n`;
}

export function calendarLinks(appointment: Appointment, audience: CalendarAudience) {
  return {
    google: googleCalendarUrl(appointment, audience),
    outlook: outlookCalendarUrl(appointment, audience),
    ics: icsPath(appointment.id, audience),
    page: calendarPageUrl(appointment.id),
  };
}
