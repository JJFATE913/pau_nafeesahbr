import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "pnbr_admin";
const SESSION_DAYS = 14;

function secret() {
  const value = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Set ADMIN_SECRET before running in production.");
    }
    return "local-dev-secret";
  }
  return value;
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "beautyroom";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

/**
 * Sessions are stateless but carry a random nonce and an expiry that is signed into the
 * token, so every sign-in produces a different value and old tokens stop working on their
 * own. Rotating ADMIN_SECRET invalidates every outstanding session.
 */
export function createAdminToken() {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const nonce = randomBytes(16).toString("hex");
  const payload = `${expiresAt}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiresAt, nonce, signature] = parts;
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) < Date.now()) return false;

  const expected = sign(`${expiresAt}.${nonce}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE)?.value);
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set(COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}
