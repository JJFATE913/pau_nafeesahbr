export const business = {
  name: "Pau-Nafeesah Beauty Room",
  shortName: "Pau-Nafeesah",
  tagline: "Luxury beauty, tailored to you",
  phoneDisplay: "(555) 214-8800",
  phoneHref: "tel:+15552148800",
  email: "hello@paunafeesahbeauty.com",
  addressLines: ["Private studio suite", "By appointment only"],
  instagram: "@paunafeesahbeauty",
  hours: [
    { day: "Sunday", value: "Closed" },
    { day: "Monday", value: "Closed" },
    { day: "Tuesday", value: "10:00 AM – 6:00 PM" },
    { day: "Wednesday", value: "10:00 AM – 6:00 PM" },
    { day: "Thursday", value: "10:00 AM – 6:00 PM" },
    { day: "Friday", value: "10:00 AM – 6:00 PM" },
    { day: "Saturday", value: "10:00 AM – 6:00 PM" },
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

export const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export const CLOSED_WEEKDAYS = [0, 1] as const;

export function formatSlotLabel(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}
