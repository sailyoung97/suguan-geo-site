import { createHmac, timingSafeEqual } from "crypto";

const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

type AdminCredentials = {
  username: string;
  password: string;
};

export function getAdminCredentials(): AdminCredentials | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (username && password) {
    return { username, password };
  }

  if (process.env.NODE_ENV !== "production") {
    return {
      username: "suguan",
      password: "Suguan@2026"
    };
  }

  return null;
}

export function isAdminCredentialsConfigured() {
  return Boolean(getAdminCredentials());
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminCredentials()?.password || "unconfigured-admin-session";
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function validateAdminCredentials(username: string, password: string) {
  const expected = getAdminCredentials();
  if (!expected) return false;
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
