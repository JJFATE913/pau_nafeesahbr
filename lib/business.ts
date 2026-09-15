export const business = {
  name: "Pau-Nafeesah Beauty Room",
  shortName: "Pau-Nafeesah",
  tagline: "Luxury beauty, tailored to you",
  phoneDisplay: "(787) 464-2599",
  phoneE164: "+17874642599",
  phoneHref: "tel:+17874642599",
  email: "hello@paunafeesahbeauty.com",
  addressLines: ["Private studio suite", "By appointment only"],
  instagram: "@pau_nafeesah_br",
  hours: [
    { day: "Sunday", value: "Closed" },
    { day: "Monday", value: "9:00 AM – 7:00 PM" },
    { day: "Tuesday", value: "9:00 AM – 7:00 PM" },
    { day: "Wednesday", value: "9:00 AM – 7:00 PM" },
    { day: "Thursday", value: "9:00 AM – 7:00 PM" },
    { day: "Friday", value: "9:00 AM – 7:00 PM" },
    { day: "Saturday", value: "9:00 AM – 7:00 PM" },
  ],
  services: [
    {
      title: "Hair Design",
      description:
        "Precision cuts, silk presses, color, and protective styling finished with a polished, camera-ready look.",
    },
    {
      title: "Lash & Brow Studio",
      description:
        "Classic and hybrid lash sets, brow mapping, tint, and lamination for a framed, lifted finish.",
    },
    {
      title: "Makeup & Glam",
      description:
        "Soft glam to full beat for events, portraits, and everyday confidence — built to last through your day.",
    },
    {
      title: "Nail Artistry",
      description:
        "Clean prep, structured sets, and custom art in the house palette of black, magenta, pink, and violet.",
    },
  ],
} as const;

export const STUDIO_OPEN_MINUTES = 9 * 60;
export const STUDIO_CLOSE_MINUTES = 19 * 60;
export const AFTER_HOURS_MINUTES = 60;
export const STUDIO_LATEST_END_MINUTES = STUDIO_CLOSE_MINUTES + AFTER_HOURS_MINUTES;
export const GRID_MINUTES = 30;
export const CLOSED_WEEKDAYS = [0] as const;

export const BOOKING_SERVICES = [
  { id: "powder-brows", label: "Powder brows", durationMinutes: 120 },
  { id: "brow-epilation", label: "Brow Epilation", durationMinutes: 30 },
  { id: "brow-lamination", label: "Brow Lamination", durationMinutes: 60 },
  { id: "lash-lift", label: "Lash lift", durationMinutes: 60 },
  { id: "lash-extensions", label: "Lash extensions", durationMinutes: 120 },
  { id: "other", label: "Other", durationMinutes: 60 },
] as const;

export type BookingServiceId = (typeof BOOKING_SERVICES)[number]["id"];

export function minutesFromTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function timeFromMinutes(total: number) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function addMinutes(time: string, minutes: number) {
  return timeFromMinutes(minutesFromTime(time) + minutes);
}

function buildGridTimes() {
  const times: string[] = [];
  for (let time = STUDIO_OPEN_MINUTES; time < STUDIO_LATEST_END_MINUTES; time += GRID_MINUTES) {
    times.push(timeFromMinutes(time));
  }
  return times;
}

export const TIME_SLOTS = buildGridTimes();

export function isGridTime(value: string) {
  return (TIME_SLOTS as readonly string[]).includes(value);
}

export function durationForService(kind: string) {
  return BOOKING_SERVICES.find((service) => service.id === kind)?.durationMinutes ?? 60;
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes === 60) return "1 hour";
  if (minutes % 60 === 0) return `${minutes / 60} hours`;
  return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
}

export function startTimesForDuration(durationMinutes: number) {
  const step = durationMinutes <= 30 ? GRID_MINUTES : 60;
  const times: string[] = [];
  for (
    let time = STUDIO_OPEN_MINUTES;
    time + durationMinutes <= STUDIO_LATEST_END_MINUTES;
    time += step
  ) {
    times.push(timeFromMinutes(time));
  }
  return times;
}

export function ticksCovered(start: string, durationMinutes: number) {
  const ticks: string[] = [];
  const end = minutesFromTime(start) + durationMinutes;
  for (let time = minutesFromTime(start); time < end; time += GRID_MINUTES) {
    ticks.push(timeFromMinutes(time));
  }
  return ticks;
}

export function rangesOverlap(
  startA: string,
  durationA: number,
  startB: string,
  durationB: number,
) {
  const a = minutesFromTime(startA);
  const b = minutesFromTime(startB);
  return a < b + durationB && b < a + durationA;
}

export function isBookingServiceId(value: string): value is BookingServiceId {
  return BOOKING_SERVICES.some((service) => service.id === value);
}

export function formatBookingService(kind: string, detail = "") {
  if (kind === "other") {
    const note = detail.trim();
    return note ? `Other: ${note}` : "Other";
  }
  return BOOKING_SERVICES.find((service) => service.id === kind)?.label ?? "";
}

export function isValidBookingService(kind: string, detail = "") {
  if (!isBookingServiceId(kind)) return false;
  if (kind !== "other") return true;
  const note = detail.trim();
  return note.length >= 2 && note.length <= 80;
}

export function formatSlotLabel(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function formatSlotRange(start: string, durationMinutes: number) {
  return `${formatSlotLabel(start)} – ${formatSlotLabel(addMinutes(start, durationMinutes))}`;
}

