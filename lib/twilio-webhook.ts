import { createHmac, timingSafeEqual } from "crypto";
import { siteUrl } from "@/lib/site";

export function twilioFormParams(form: FormData) {
  const params: Record<string, string> = {};
  form.forEach((value, key) => {
    if (typeof value === "string" && !(key in params)) params[key] = value;
  });
  return params;
}

function signedPayload(url: string, params: Record<string, string>) {
  return (
    url +
    Object.keys(params)
      .sort()
      .map((key) => `${key}${params[key]}`)
      .join("")
  );
}

function signatureMatches(authToken: string, signature: string, payload: string) {
  const expected = createHmac("sha1", authToken).update(payload, "utf8").digest("base64");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function twilioRequestUrls(request: Request) {
  const incoming = request.url.split("?")[0];
  const path = new URL(request.url).pathname;
  const published = `${siteUrl()}${path}`;
  return [...new Set([incoming, published])];
}

export function isValidTwilioSignature(
  authToken: string,
  signature: string | null,
  request: Request,
  params: Record<string, string>,
) {
  if (!signature || !authToken) return false;
  return twilioRequestUrls(request).some((url) =>
    signatureMatches(authToken, signature, signedPayload(url, params)),
  );
}

export function twimlMessage(body: string) {
  const escaped = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escaped}</Message></Response>`;
}
