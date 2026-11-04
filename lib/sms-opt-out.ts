import { isValidPhone } from "@/lib/appointments";
import { deleteItem, getItem, putItem } from "@/lib/db";
import { toE164 } from "@/lib/site";

const COLLECTION = "sms-opt-out";

const STOP_WORDS = new Set(["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"]);
const START_WORDS = new Set(["START", "YES", "UNSTOP"]);
const HELP_WORDS = new Set(["HELP", "INFO"]);

export type SmsKeyword = "stop" | "start" | "help" | null;
export type SmsOptOutSource = "sms" | "web";

export function smsKeywordFromBody(body: string): SmsKeyword {
  const word = body.trim().split(/\s+/)[0]?.toUpperCase() ?? "";
  if (STOP_WORDS.has(word)) return "stop";
  if (START_WORDS.has(word)) return "start";
  if (HELP_WORDS.has(word)) return "help";
  return null;
}

export function optOutPhoneKey(phone: string) {
  return toE164(phone);
}

export async function isSmsOptedOut(phone: string) {
  if (!phone.trim()) return false;
  return Boolean(await getItem(COLLECTION, optOutPhoneKey(phone)));
}

export async function optOutSms(phone: string, source: SmsOptOutSource) {
  const e164 = optOutPhoneKey(phone);
  await putItem({
    pk: COLLECTION,
    sk: e164,
    phone: e164,
    source,
    optedOutAt: new Date().toISOString(),
  });
}

export async function optInSms(phone: string) {
  await deleteItem(COLLECTION, optOutPhoneKey(phone));
}

export function parseOptOutPhone(phone: string) {
  const trimmed = phone.trim();
  if (!isValidPhone(trimmed)) return null;
  return optOutPhoneKey(trimmed);
}
