import { createHmac, timingSafeEqual } from "crypto";

const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

function credentials() {
  return {
    username: process.env.ADMIN_USERNAME || "suguan",
    password: process.env.ADMIN_PASSWORD || "Suguan@2026"
  };
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || credentials().password;
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function validateAdminCredentials(username: string, password: string) {
  const expected = credentials();
  return username.trim() === expected.username && password === expected.password;
}

export function createAdminSession(username: string) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      expiresAt: Date.now() + sessionLifetimeSeconds * 1000
    })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(token?: string | null) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: string;
      expiresAt?: number;
    };
    if (!session.username || !session.expiresAt || session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export const adminSessionMaxAge = sessionLifetimeSeconds;
