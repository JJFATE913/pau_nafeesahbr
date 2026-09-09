import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { adminPassword, clearAdminCookie, isAdminAuthenticated, setAdminCookie } from "@/lib/admin";
import { checkRateLimit, clientIdentifier } from "@/lib/rate-limit";

const ATTEMPTS_PER_15_MIN = 10;

function passwordMatches(supplied: string) {
  const a = Buffer.from(supplied);
  const b = Buffer.from(adminPassword());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET() {
  return NextResponse.json({ authenticated: await isAdminAuthenticated() });
}

export async function POST(request: Request) {
  const allowed = await checkRateLimit(
    "admin-login",
    clientIdentifier(request),
    ATTEMPTS_PER_15_MIN,
    15 * 60,
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  const body = (await request.json()) as { password?: string };
  if (typeof body.password !== "string" || !passwordMatches(body.password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
