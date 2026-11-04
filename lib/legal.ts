import { business } from "@/lib/business";

export const LEGAL_EFFECTIVE_DATE = "November 3, 2026";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  sections: LegalSection[];
};

export const legalDocs: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of Use",
    summary: "Rules for using this website and booking services at the studio.",
    sections: [
      {
        heading: "Agreement",
        paragraphs: [
          `By using the ${business.name} website or booking an appointment, you agree to these Terms of Use. If you do not agree, please do not use the site or book online.`,
        ],
      },
      {
        heading: "Services",
        paragraphs: [
          "This site lets you learn about the studio, view selected work, and request an appointment. Online booking reserves a time slot; it does not guarantee a specific result. Final services and pricing are confirmed with the studio.",
        ],
      },
      {
        heading: "Your responsibilities",
        paragraphs: [
          "Provide accurate name and contact information. Arrive on time for scheduled visits. Follow aftercare guidance for services such as lashes, brows, and makeup.",
          "You must be at least 18 years old to book, or have a parent/guardian present and responsible for the visit.",
        ],
      },
      {
        heading: "Website use",
        paragraphs: [
          "Do not misuse the site (including automated scraping, attempting to break security, or submitting false bookings). We may refuse or cancel bookings that appear fraudulent or abusive.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "To the fullest extent allowed by law, the studio is not liable for indirect or consequential damages arising from use of the website. Beauty services involve individual results; see the Service Disclaimer for service-specific notices.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          `Questions about these terms: ${business.email} or ${business.phoneDisplay}.`,
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "How we collect, use, and protect information when you book or browse.",
    sections: [
      {
        heading: "Information we collect",
        paragraphs: [
          "When you book, we collect your name, phone number, selected service, date/time, and any service notes you provide. We also receive basic technical data such as IP address for security and rate limiting.",
          "If you opt in to SMS, we use your phone number to send appointment-related texts.",
        ],
      },
      {
        heading: "How we use information",
        paragraphs: [
          "We use booking details to schedule and confirm appointments, contact you about your visit, operate the studio calendar, and improve our services. We do not sell your personal information.",
        ],
      },
      {
        heading: "Text messaging",
        paragraphs: [
          "If you check the SMS consent box on the booking form, we send appointment confirmation messages to the number you provide. Message frequency varies and is typically one to two messages per booking. Message and data rates may apply. Reply HELP for help or STOP to opt out. Consent to text is not a condition of purchasing services—you may book by calling the studio instead.",
        ],
      },
      {
        heading: "Sharing",
        paragraphs: [
          "We use service providers such as Twilio to deliver SMS and hosting providers to run this website. They process data only to provide those services. We may disclose information if required by law.",
        ],
      },
      {
        heading: "Retention",
        paragraphs: [
          "Appointment records are kept as needed for studio operations and customer service. You may request updates or deletion of your contact details by emailing or calling the studio, subject to legitimate business needs (for example, recent booking history).",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          `Privacy requests: ${business.email} or ${business.phoneDisplay}.`,
        ],
      },
    ],
  },
  {
    slug: "sms-terms",
    title: "SMS Terms",
    summary: "Program details for appointment confirmation texts.",
    sections: [
      {
        heading: "Program description",
        paragraphs: [
          `${business.name} sends SMS messages for appointment confirmations and related booking updates (for example, a link to add the visit to your calendar).`,
        ],
      },
      {
        heading: "Opt-in",
        paragraphs: [
          "You opt in by checking the SMS consent checkbox on our web booking form (it is never pre-checked) and submitting the form with your phone number. Checking the box is separate from agreeing to our Terms of Use and Privacy Policy.",
        ],
      },
      {
        heading: "Message frequency",
        paragraphs: [
          "Message frequency varies. Guests typically receive about 1–2 messages per booking. You will not be enrolled in marketing blasts through this program.",
        ],
      },
      {
        heading: "Rates, help, and opt-out",
        paragraphs: [
          "Message and data rates may apply.",
          "Reply HELP for help.",
          "Reply STOP to opt out. After opting out you will not receive further appointment texts to that number unless you opt in again.",
        ],
      },
      {
        heading: "Support",
        paragraphs: [
          `For support, reply HELP, call ${business.phoneDisplay}, or email ${business.email}.`,
        ],
      },
    ],
  },
  {
    slug: "booking-policy",
    title: "Booking Policy",
    summary: "Scheduling, punctuality, and changes to appointments.",
    sections: [
      {
        heading: "Reservations",
        paragraphs: [
          "Online booking holds a start time for the selected service length. The studio is open Monday–Saturday; Sunday is closed. Visits may run until 8:00 PM depending on the service.",
        ],
      },
      {
        heading: "Changes and cancellations",
        paragraphs: [
          `To reschedule or cancel, call or text the studio at ${business.phoneDisplay} as soon as you can so the chair can be offered to another guest.`,
        ],
      },
      {
        heading: "Late arrivals",
        paragraphs: [
          "If you arrive late, the visit may be shortened so the next guest stays on schedule, or may need to be rescheduled.",
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Service Disclaimer",
    summary: "Important notices about beauty services and results.",
    sections: [
      {
        heading: "Individual results",
        paragraphs: [
          "Lash, brow, makeup, and related services involve personal factors (skin, hair, allergies, aftercare). Results vary. The studio will discuss suitability during your visit and may decline a service that is not safe or appropriate.",
        ],
      },
      {
        heading: "Health disclosures",
        paragraphs: [
          "Tell the artist about allergies, skin conditions, recent procedures, pregnancy, or medications that could affect treatment before service begins.",
        ],
      },
      {
        heading: "Not medical care",
        paragraphs: [
          "Services offered here are cosmetic beauty services, not medical diagnosis or treatment.",
        ],
      },
    ],
  },
  {
    slug: "photo-policy",
    title: "Photo Policy",
    summary: "How portfolio photos are used and how to request removal.",
    sections: [
      {
        heading: "Portfolio use",
        paragraphs: [
          "Identifiable photos are posted in the Past Customers gallery with guest permission. Photos may be cropped and are used to show the studio’s work.",
        ],
      },
      {
        heading: "Removal requests",
        paragraphs: [
          `To request removal of a photo, contact ${business.email} or ${business.phoneDisplay} with enough detail to find the image. We will remove it from the public gallery within a reasonable time.`,
        ],
      },
    ],
  },
];

export const legalNav = legalDocs.map((doc) => ({
  href: `/legal/${doc.slug}`,
  label: doc.title,
}));

export function getLegalDoc(slug: string) {
  return legalDocs.find((doc) => doc.slug === slug) ?? null;
}
