import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signs the session cookie so it can't be forged.
 *
 * The cookie payload (base64 JSON) is HMAC-signed with a server secret. On
 * read we recompute and constant-time-compare the signature — a cookie that
 * wasn't minted by our login action is rejected.
 *
 * Secret precedence:
 *   1. AUTH_SECRET (set one in production for a stable, dedicated key)
 *   2. derived from WP_ADMIN_APP_PASSWORD (already a server secret, so this
 *      works out of the box once WP admin creds are configured)
 *   3. an insecure dev fallback (local only; logs nothing, never used in prod
 *      because WP_ADMIN_APP_PASSWORD is set)
 */
function secret(): string {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  const wp = process.env.WP_ADMIN_APP_PASSWORD?.replace(/\s+/g, "");
  if (wp) return `jm-session:${wp}`;
  return "jm-insecure-dev-secret";
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

/** Wrap a base64 payload as `payload.signature`. */
export function signToken(payloadB64: string): string {
  return `${payloadB64}.${sign(payloadB64)}`;
}

/** Return the payload if the signature is valid, else null. */
export function verifyToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? payload : null;
}
