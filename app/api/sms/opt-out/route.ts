import { NextResponse } from "next/server";
import { checkRateLimit, clientIdentifier } from "@/lib/rate-limit";
import { isSmsOptedOut, optInSms, optOutSms, parseOptOutPhone } from "@/lib/sms-opt-out";

const ATTEMPTS_PER_HOUR = 12;

export async function POST(request: Request) {
  const allowed = await checkRateLimit(
    "sms-opt-out",
    clientIdentifier(request),
    ATTEMPTS_PER_HOUR,
    60 * 60,
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a little while." },
      { status: 429 },
    );
  }

  const body = (await request.json()) as { phone?: string; action?: string };
  const phone = parseOptOutPhone(typeof body.phone === "string" ? body.phone : "");
  const action = body.action === "start" ? "start" : "stop";
  if (!phone) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  if (action === "start") {
    await optInSms(phone);
    return NextResponse.json({ ok: true, action, optedOut: false });
  }

  const alreadyOptedOut = await isSmsOptedOut(phone);
  await optOutSms(phone, "web");
  return NextResponse.json({
    ok: true,
    action,
    optedOut: true,
    alreadyOptedOut,
  });
}
