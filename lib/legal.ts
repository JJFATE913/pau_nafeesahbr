import { business } from "@/lib/business";

export const LEGAL_EFFECTIVE_DATE = "October 27, 2026";

export type LegalBlock = { type: "p"; text: string } | { type: "ul"; items: string[] };

export type LegalDoc = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  footerLabel: string;
  sections: { heading: string; blocks: LegalBlock[] }[];
};

const studio = business.name;
const phone = business.phoneDisplay;
const email = business.email;
const contact = `${email} or ${phone}`;

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    kicker: "Your information",
    footerLabel: "Privacy Policy",
    description: `How ${studio} collects, uses, and shares information from this website and appointment bookings.`,
    sections: [
      {
        heading: "Who we are",
        blocks: [
          {
            type: "p",
            text: `${studio} (“we,” “us,” or “the studio”) operates this website and the private, appointment-only beauty studio described on it. We are based in Puerto Rico. The studio location is shared when a visit is confirmed; it is not a walk-in shop.`,
          },
          {
            type: "p",
            text: `Questions about this policy: ${contact}.`,
          },
        ],
      },
      {
        heading: "Information we collect",
        blocks: [
          {
            type: "p",
            text: "We collect only what we need to book and run appointments:",
          },
          {
            type: "ul",
            items: [
              "Name and phone number you enter on the booking form",
              "Service requested, appointment date and start time, and any note you add for an “Other” service",
              "Technical basics the host may log to keep the site working and to limit abuse (such as IP address and time of a request)",
              "Photos the studio takes or that you allow us to use in the Past Customers gallery",
              "Messages you send us by text, call, or email",
            ],
          },
          {
            type: "p",
            text: "We do not ask for payment card numbers on this website. We do not knowingly collect information from children under 13. Beauty services are for guests 18 or older, or minors accompanied by a parent or legal guardian.",
          },
        ],
      },
      {
        heading: "How we use it",
        blocks: [
          {
            type: "ul",
            items: [
              "Hold your chair, confirm the visit, and send calendar details",
              "Text or call you about that appointment (reminders, changes, running late, aftercare)",
              "Notify the studio of a new booking",
              "Keep the schedule accurate and prevent double-booking",
              "Show finished looks in our gallery when we have permission",
              "Protect the site, staff, and other guests (fraud, abuse, or safety)",
              "Comply with law if we are legally required to keep or disclose records",
            ],
          },
        ],
      },
      {
        heading: "Texts",
        blocks: [
          {
            type: "p",
            text: "If you book online and give a phone number, we use it to send transactional appointment messages (confirmation, calendar link, and scheduling updates). Details are in our SMS Terms. We do not sell your number. We do not use it for unrelated marketing blasts.",
          },
        ],
      },
      {
        heading: "Photos",
        blocks: [
          {
            type: "p",
            text: "Gallery images are stored so we can display our work. We post a guest’s face or identifiable look only with permission, as described in the Photo Policy. You may ask us to take a photo down at any time.",
          },
        ],
      },
      {
        heading: "Cookies",
        blocks: [
          {
            type: "p",
            text: "Public pages do not use advertising or analytics cookies. A signed-in staff browser may store an essential login cookie so the owner can manage the calendar and gallery. See the Cookie Notice.",
          },
        ],
      },
      {
        heading: "Who we share with",
        blocks: [
          {
            type: "p",
            text: "We do not sell your personal information. We share it only as needed:",
          },
          {
            type: "ul",
            items: [
              "Cloudflare, which hosts this website, the appointment database, and gallery files",
              "Twilio, which delivers text messages when SMS is connected",
              "The studio owner and authorized staff who run the book",
              "Authorities if the law requires it, or to protect someone’s safety",
            ],
          },
        ],
      },
      {
        heading: "How long we keep it",
        blocks: [
          {
            type: "p",
            text: "Appointment records are kept as long as needed to run the studio, honor your visits, and meet bookkeeping or legal duties, then deleted or de-identified when they are no longer needed. SMS opt-out records are kept so we do not text a number that asked us to stop. Gallery photos stay up until we replace them or you ask us to remove yours. Staff login cookies expire on their own (currently 14 days) or when we sign out.",
          },
        ],
      },
      {
        heading: "Security",
        blocks: [
          {
            type: "p",
            text: "We use HTTPS, access controls for staff tools, and hosting security provided by Cloudflare. No website is perfectly secure. Do not send payment card numbers or medical records through the public booking form.",
          },
        ],
      },
      {
        heading: "Your choices",
        blocks: [
          {
            type: "p",
            text: `You may ask us to confirm what we have, correct a name or number, cancel or change an appointment, stop appointment texts, or delete a gallery photo of you. Email or text ${contact}. We may need to verify it is you. We may retain a limited record if the law requires it (for example, that a visit occurred).`,
          },
        ],
      },
      {
        heading: "Changes",
        blocks: [
          {
            type: "p",
            text: `We will post updates on this page and change the date at the top. Continued use of the site after an update means you accept the revised policy.`,
          },
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Use",
    kicker: "Using this site",
    footerLabel: "Terms of Use",
    description: `Rules for using the ${studio} website, booking tools, and related content.`,
    sections: [
      {
        heading: "Agreement",
        blocks: [
          {
            type: "p",
            text: `These Terms of Use govern this website, including booking, the Past Customers gallery, and any confirmation or calendar pages. By using the site or submitting a booking, you agree to these Terms, the Privacy Policy, Booking Policy, SMS Terms, Service Disclaimer, and Photo Policy. If you do not agree, do not use the site — call or text the studio instead at ${phone}.`,
          },
        ],
      },
      {
        heading: "The studio",
        blocks: [
          {
            type: "p",
            text: `${studio} is a private, appointment-only beauty studio in Puerto Rico. The website is an invitation to request a chair time. It is not medical care, not a walk-in salon, and not a guarantee that a particular stylist, product, or result is available on a given day.`,
          },
        ],
      },
      {
        heading: "Eligibility",
        blocks: [
          {
            type: "p",
            text: "You must provide accurate information. Online booking is intended for guests 18 or older. A parent or legal guardian must book and attend with a minor, and may be asked to sign studio intake forms.",
          },
        ],
      },
      {
        heading: "Acceptable use",
        blocks: [
          {
            type: "p",
            text: "You agree not to:",
          },
          {
            type: "ul",
            items: [
              "Book under a false name or phone number, or hold slots you do not intend to use",
              "Scrape, copy, or republish gallery photos, the logo, or site content for commercial use",
              "Probe, overload, or interfere with the site, staff login, or other guests’ appointments",
              "Upload malware or illegal content",
              "Use the site to harass the studio or other people",
            ],
          },
        ],
      },
      {
        heading: "Intellectual property",
        blocks: [
          {
            type: "p",
            text: `The ${studio} name, logo, site design, and gallery images are owned by the studio or used with permission. You may not copy them except to book or to share a personal appointment confirmation for your own calendar.`,
          },
        ],
      },
      {
        heading: "Appointments and services",
        blocks: [
          {
            type: "p",
            text: "Booking, cancellation, lateness, and no-shows are governed by the Booking Policy. Health, results, and service risks are governed by the Service Disclaimer. Those pages are part of these Terms.",
          },
        ],
      },
      {
        heading: "Website provided “as is”",
        blocks: [
          {
            type: "p",
            text: "We work to keep the calendar accurate, but slots, hours, and prices described online can change. The site may be unavailable, slow, or contain errors. To the fullest extent allowed by Puerto Rico and U.S. law, we disclaim implied warranties of merchantability, fitness for a particular purpose, and non-infringement for the website itself.",
          },
        ],
      },
      {
        heading: "Limitation of liability",
        blocks: [
          {
            type: "p",
            text: "To the fullest extent permitted by law, the studio and its owner are not liable for indirect, incidental, special, or consequential damages arising from use of the website (including missed appointments caused by a technical failure, a filtered text message, or an outdated browser). For website-related claims, our total liability is limited to the amount you paid the studio for the visit at issue, or $50 if you paid nothing through this site. This does not limit liability that the law does not allow us to limit, including certain claims for personal injury caused by our gross negligence or willful misconduct.",
          },
        ],
      },
      {
        heading: "Indemnity",
        blocks: [
          {
            type: "p",
            text: "You agree to indemnify and hold the studio harmless from claims that arise out of your misuse of the site, your breach of these Terms, or content you submit, except to the extent caused by our own willful misconduct.",
          },
        ],
      },
      {
        heading: "Governing law",
        blocks: [
          {
            type: "p",
            text: "These Terms are governed by the laws of the Commonwealth of Puerto Rico, without regard to conflict-of-law rules. Courts located in Puerto Rico have exclusive jurisdiction, except that we may seek injunctive relief anywhere to protect the brand, photos, or safety.",
          },
        ],
      },
      {
        heading: "Changes",
        blocks: [
          {
            type: "p",
            text: `We may update these Terms by posting a new version on this page. The date at the top will change. If a court finds a section unenforceable, the rest still applies. Contact: ${contact}.`,
          },
        ],
      },
    ],
  },
  {
    slug: "booking-policy",
    title: "Booking & Cancellation Policy",
    kicker: "The chair",
    footerLabel: "Booking Policy",
    description: `Appointment holds, arrival, cancellation, and no-show rules for ${studio}.`,
    sections: [
      {
        heading: "What a booking is",
        blocks: [
          {
            type: "p",
            text: "Submitting the form holds a start time on the studio calendar. This website does not charge your card. Completing a booking is a request for service, not a guarantee of a specific product, shade, or identical result to a gallery photo.",
          },
        ],
      },
      {
        heading: "Confirmations",
        blocks: [
          {
            type: "p",
            text: `We may confirm by text, call, or in-person at the studio. If we cannot reach you, we may release the chair. Keep the phone number on your booking able to receive calls and SMS. Add the visit to your calendar from the confirmation page or text when those links are provided.`,
          },
        ],
      },
      {
        heading: "Please arrive on time",
        blocks: [
          {
            type: "p",
            text: "The suite is appointment-only. Please arrive a few minutes early. If you are more than 15 minutes late, we may shorten the service to finish on time, move you to another opening, or treat the visit as a no-show so the next guest is not delayed.",
          },
        ],
      },
      {
        heading: "Cancel or reschedule",
        blocks: [
          {
            type: "p",
            text: `Call or text ${phone} at least 24 hours before your start time. Same-day cancellations and no-shows take a chair that another guest could have used.`,
          },
        ],
      },
      {
        heading: "No-shows",
        blocks: [
          {
            type: "p",
            text: "If you miss a visit without notice, we may decline future online holds, ask for a deposit or prepayment before rebooking, or require that you schedule by phone. We do not currently collect deposits through this website; any deposit would be arranged directly with the studio.",
          },
        ],
      },
      {
        heading: "When we must change a visit",
        blocks: [
          {
            type: "p",
            text: "We may cancel or move an appointment for illness, emergency, equipment issues, or schedule errors. We will contact you at the number you gave and help you find another time.",
          },
        ],
      },
      {
        heading: "Service and intake",
        blocks: [
          {
            type: "p",
            text: "We may ask you to complete a paper or digital intake and consent form before lashes, lamination, epilation, henna, makeup, or powder brows. We may decline or stop a service if it is unsafe, if you arrive unwell, or if the request is outside what we offer. See the Service Disclaimer.",
          },
        ],
      },
      {
        heading: "Minors",
        blocks: [
          {
            type: "p",
            text: "A parent or legal guardian must be present for guests under 18 and must approve the service.",
          },
        ],
      },
      {
        heading: "Prices",
        blocks: [
          {
            type: "p",
            text: "Ask the studio for current pricing. Amounts mentioned in conversation or on social media can change. Payment is collected at the studio unless we agree otherwise.",
          },
        ],
      },
    ],
  },
  {
    slug: "sms-terms",
    title: "SMS Terms",
    kicker: "Appointment texts",
    footerLabel: "SMS Terms",
    description: `Consent and opt-out rules for ${studio} appointment text messages.`,
    sections: [
      {
        heading: "The program",
        blocks: [
          {
            type: "p",
            text: `${studio} may send transactional text messages about appointments you request: confirmations, calendar links, time changes, running-late notices, and similar scheduling messages. These are not advertising campaigns.`,
          },
        ],
      },
      {
        heading: "Consent",
        blocks: [
          {
            type: "p",
            text: "You consent to appointment texts only by checking the SMS box on the booking form. That box is separate from agreeing to the Terms of Use and Privacy Policy. Consent is not a condition of purchase; you may book by calling the studio instead if you do not want SMS.",
          },
        ],
      },
      {
        heading: "Frequency and cost",
        blocks: [
          {
            type: "p",
            text: "You will typically receive a small number of messages per booking (often one confirmation, plus a notice only if something changes). Message and data rates may apply. Carriers are not liable for delayed or undelivered messages. Delivery depends on your carrier, your phone, and (when applicable) Twilio and carrier registration rules.",
          },
        ],
      },
      {
        heading: "Opt out",
        blocks: [
          {
            type: "p",
            text: `Reply STOP to an appointment text, or use the SMS opt-out page on this website, to stop texts to that number. Reply START to opt back in, or HELP for help. You can also tell us at ${phone} / ${email}. After you opt out, we may still call you about an existing appointment if we cannot reach you another way.`,
          },
        ],
      },
      {
        heading: "Your number",
        blocks: [
          {
            type: "p",
            text: "You represent that you are the subscriber or customary user of the number you provide, and that you will update us if the number changes. Privacy practices for the number are in the Privacy Policy.",
          },
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Service Disclaimer",
    kicker: "Your visit",
    footerLabel: "Service Disclaimer",
    description: `Health, results, and risk information for beauty services at ${studio}.`,
    sections: [
      {
        heading: "Beauty services, not medical care",
        blocks: [
          {
            type: "p",
            text: `${studio} provides cosmetic beauty services such as lashes, brow mapping, henna, lamination, epilation, makeup, and powder brows. We are not a medical clinic. Nothing on this website is a diagnosis, treatment, or medical advice. If you have an eye, skin, or health condition, ask a licensed clinician before booking.`,
          },
        ],
      },
      {
        heading: "Results are not guaranteed",
        blocks: [
          {
            type: "p",
            text: "Hair, skin, lash, and brow results vary. Gallery photos are examples of past work, not a promise that your outcome will match. Products, wear time, and healing (including powder brows) depend on aftercare, your body, and how you sleep, sweat, and cleanse.",
          },
        ],
      },
      {
        heading: "Tell us about risks",
        blocks: [
          {
            type: "p",
            text: "Before service, tell us about allergies, contacts or eye conditions, recent procedures, pregnancy or nursing, medications (including Accutane or blood thinners), keloid history, infections, or anything that could make lashes, waxing/epilation, tint, adhesive, or cosmetic tattooing unsafe. We may refuse or postpone service. Failure to disclose can increase your risk.",
          },
        ],
      },
      {
        heading: "Patch tests and powder brows",
        blocks: [
          {
            type: "p",
            text: "We may require or recommend a patch test for tints, adhesives, or other products. Powder brows are a form of semi-permanent cosmetic tattooing. They involve needles, pigment, and a healing period. Infection, scarring, allergic reaction, uneven color, and fading can occur even when work is performed carefully. Follow all aftercare. A touch-up, if offered, is not a guarantee of a specific look.",
          },
        ],
      },
      {
        heading: "Assumption of ordinary cosmetic risk",
        blocks: [
          {
            type: "p",
            text: "By booking and sitting for a service, you understand that ordinary cosmetic services carry risks (redness, irritation, product reaction, discomfort, or a result you like less than a photo). To the fullest extent permitted by law, you release the studio and its owner from claims arising out of those ordinary, disclosed risks and from results that differ from a reference photo, except for harm caused by our gross negligence or willful misconduct, or any liability the law does not allow you to waive.",
          },
        ],
      },
      {
        heading: "Intake forms control",
        blocks: [
          {
            type: "p",
            text: "The studio may require additional written consents on the day of service. Those forms, and the conversation in the suite, supplement this page. If you are not comfortable, say so before we begin.",
          },
        ],
      },
    ],
  },
  {
    slug: "photo-policy",
    title: "Photo Policy",
    kicker: "The gallery",
    footerLabel: "Photo Policy",
    description: `How ${studio} uses guest photos and how to request removal.`,
    sections: [
      {
        heading: "Portfolio",
        blocks: [
          {
            type: "p",
            text: "The Past Customers page shows finished looks so future guests can see our work. Photos are taken at the studio or provided by guests. We intend to post identifiable photos only with the guest’s permission (verbal or written, including a message or tagged social post you authorize us to share).",
          },
        ],
      },
      {
        heading: "You can say no",
        blocks: [
          {
            type: "p",
            text: "You may decline photos. Declining does not by itself cancel a booked service. If a photo of you is already online and you want it down, tell us. We will remove it from this website within a reasonable time after we confirm the request. Copies that other people downloaded or that appear on search-engine caches may take longer to disappear.",
          },
        ],
      },
      {
        heading: "Our rights in the images",
        blocks: [
          {
            type: "p",
            text: `Unless we agree otherwise, the studio owns or is licensed to use photographs we take of our work, including for this website, social media under ${business.instagram}, and printed portfolios. That license does not let us sell your name or contact information.`,
          },
        ],
      },
      {
        heading: "Visitors",
        blocks: [
          {
            type: "p",
            text: "Do not copy, scrape, or reuse gallery images in ads or another business’s portfolio. Personal, non-commercial viewing on this site is allowed.",
          },
        ],
      },
      {
        heading: "Requests",
        blocks: [
          {
            type: "p",
            text: `Email ${email} or text ${phone} with “photo removal,” a description of the image, and a way to recognize you. We may ask for confirmation so we do not remove someone else’s photo by mistake.`,
          },
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Notice",
    kicker: "This browser",
    footerLabel: "Cookie Notice",
    description: `Cookies used by the ${studio} website.`,
    sections: [
      {
        heading: "What we use",
        blocks: [
          {
            type: "p",
            text: "This site is built to run without advertising or analytics cookies on public pages. Booking does not require you to accept marketing cookies.",
          },
        ],
      },
      {
        heading: "Staff login cookie",
        blocks: [
          {
            type: "p",
            text: "If you sign in as staff, we set an essential cookie named pnbr_admin so the browser stays signed in to manage hours and photos. It is a session credential, not a tracker. It expires after 14 days, when you sign out, or when we rotate the staff secret. It is not used to advertise to you.",
          },
        ],
      },
      {
        heading: "Hosting",
        blocks: [
          {
            type: "p",
            text: "Cloudflare, which hosts the site, may process technical data (such as IP address) to deliver pages, block attacks, and apply rate limits. That is security and operations, not a studio marketing cookie.",
          },
        ],
      },
      {
        heading: "Your browser",
        blocks: [
          {
            type: "p",
            text: "You can block or delete cookies in your browser. Blocking all cookies may keep staff login from working. If we later add optional analytics, we will update this notice.",
          },
        ],
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    kicker: "Everyone is welcome",
    footerLabel: "Accessibility",
    description: `Accessibility commitments and how to request help at ${studio}.`,
    sections: [
      {
        heading: "Our aim",
        blocks: [
          {
            type: "p",
            text: `We want ${studio}’s website and studio visits to be usable. The site uses semantic headings, keyboard-reachable controls, and contrast appropriate to the dark design. We continue to improve it.`,
          },
        ],
      },
      {
        heading: "In the suite",
        blocks: [
          {
            type: "p",
            text: `This is a private appointment-only room. If you need extra time, a different chair setup, a verbal walkthrough instead of the online form, or another reasonable accommodation, tell us when you book. Call or text ${phone}.`,
          },
        ],
      },
      {
        heading: "If something on the site is hard to use",
        blocks: [
          {
            type: "p",
            text: `Email ${email} with the page and what went wrong. We will work to fix it. You can always complete a booking by phone if the form is not usable for you.`,
          },
        ],
      },
    ],
  },
];

export function getLegalDoc(slug: string) {
  return legalDocs.find((doc) => doc.slug === slug) ?? null;
}

export const legalNav = legalDocs.map((doc) => ({
  href: `/legal/${doc.slug}`,
  label: doc.footerLabel,
}));
