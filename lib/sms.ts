import { business, formatSlotLabel } from "@/lib/business";
import { calendarPageUrl } from "@/lib/calendar";
import { toE164 } from "@/lib/site";
import type { Appointment } from "@/lib/appointments";

export type SmsResult = {
  client: boolean;
  studio: boolean;
  skipped: boolean;
  error?: string;
};

function twilioConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const studioPhone = process.env.OWNER_PHONE || process.env.STUDIO_PHONE;
  if (!accountSid || !authToken || !fromNumber || !studioPhone) return null;
  return { accountSid, authToken, fromNumber, studioPhone };
}

async function sendTwilioSms(to: string, body: string) {
  const config = twilioConfig();
  if (!config) throw new Error("SMS is not configured.");
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;
  const payload = new URLSearchParams({
    To: toE164(to),
    From: toE164(config.fromNumber),
    Body: body,
  });
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text.slice(0, 280) || "Twilio could not send the text.");
  }
}

export async function sendAppointmentTexts(appointment: Appointment): Promise<SmsResult> {
  const config = twilioConfig();
  if (!config) {
    return {
      client: false,
      studio: false,
      skipped: true,
      error: "Add Twilio credentials and OWNER_PHONE to send confirmation texts.",
    };
  }

  const when = `${appointment.date} at ${formatSlotLabel(appointment.time)}`;
  const page = calendarPageUrl(appointment.id);
  const clientBody = `${business.name}: you're confirmed for ${when}. Add it to your calendar here: ${page}`;
  const studioBody = `New booking — ${appointment.name} (${appointment.phone}) on ${when}. Add to your calendar: ${page}`;

  const result: SmsResult = { client: false, studio: false, skipped: false };

  try {
    await sendTwilioSms(appointment.phone, clientBody);
    result.client = true;
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Client text failed.";
  }

  try {
    await sendTwilioSms(config.studioPhone, studioBody);
    result.studio = true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Studio text failed.";
    result.error = result.error ? `${result.error} ${message}` : message;
  }

  return result;
}
