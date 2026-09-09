import { incrementCounter } from "@/lib/db";

/**
 * Fixed-window limiter. The window number is part of the key, so each window starts from a
 * fresh counter and expired rows fall away on their own.
 */
export async function checkRateLimit(
  action: string,
  identifier: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const window = Math.floor(Date.now() / 1000 / windowSeconds);
  const key = `${action}#${identifier}#${window}`;
  const expiresAt = (window + 2) * windowSeconds;

  try {
    const count = await incrementCounter(key, expiresAt);
    return count <= limit;
  } catch {
    // Never block a real booking because the limiter itself failed.
    return true;
  }
}

/**
 * Best-effort client address. Cloudflare sets cf-connecting-ip on every request and, unlike
 * x-forwarded-for, a client cannot forge it. The value only spreads out rate limit buckets.
 */
export function clientIdentifier(request: Request) {
  const cloudflare = request.headers.get("cf-connecting-ip");
  if (cloudflare) return cloudflare;
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
