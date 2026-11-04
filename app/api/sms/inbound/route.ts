import { NextResponse } from "next/server";
import { business } from "@/lib/business";
import { runtimeString } from "@/lib/cloudflare";
import { optInSms, optOutSms, smsKeywordFromBody } from "@/lib/sms-opt-out";
import { isValidTwilioSignature, twilioFormParams, twimlMessage } from "@/lib/twilio-webhook";

function xml(body: string, status = 200) {
  return new NextResponse(twimlMessage(body), {
    status,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

export async function GET() {
  return new NextResponse("SMS inbound webhook", { status: 200 });
}

export async function POST(request: Request) {
  const authToken = runtimeString("TWILIO_AUTH_TOKEN");
  if (!authToken) {
    return xml(`${business.name}: text opt-out is not connected yet.`, 503);
  }

  const params = twilioFormParams(await request.formData());
  const signature = request.headers.get("x-twilio-signature");
  if (!isValidTwilioSignature(authToken, signature, request, params)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const from = params.From?.trim() ?? "";
  const keyword = smsKeywordFromBody(params.Body ?? "");

  if (!from) {
    return xml(`Thanks for contacting ${business.name}. Call ${business.phoneDisplay} for help.`);
  }

  if (keyword === "stop") {
    await optOutSms(from, "sms");
    return xml(
      `You are opted out of appointment texts from ${business.name}. We will not text this number. Reply START to opt back in. You can still call ${business.phoneDisplay}.`,
    );
  }

  if (keyword === "start") {
    await optInSms(from);
    return xml(
      `${business.name}: you are opted in to appointment texts (confirmations, calendar links, and scheduling updates). Message frequency varies; typically 1-2 messages per appointment. Msg & data rates may apply. Reply HELP for help. Reply STOP to opt out.`,
    );
  }

  if (keyword === "help") {
    return xml(
      `${business.name} appointment texts. Msg & data rates may apply. Reply STOP to opt out. Call ${business.phoneDisplay}.`,
    );
  }

  return xml(
    `${business.name}: reply STOP to opt out of appointment texts, START to opt back in, or HELP for help. Call ${business.phoneDisplay}.`,
  );
}
