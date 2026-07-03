import { adminAuthStorageKey } from "@/src/config/adminAuth";

type AdminAuthState = {
  authenticated: true;
  username: string;
  loggedInAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readAdminAuth() {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(adminAuthStorageKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<AdminAuthState>;
    return parsed.authenticated === true && typeof parsed.username === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeAdminAuth(username: string) {
  if (!canUseStorage()) {
    return false;
  }

  try {
    const nextState: AdminAuthState = {
      authenticated: true,
      username,
      loggedInAt: new Date().toISOString()
    };
    window.localStorage.setItem(adminAuthStorageKey, JSON.stringify(nextState));
    return true;
  } catch {
    return false;
  }
}

export function clearAdminAuth() {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(adminAuthStorageKey);
  } catch {
    // Ignore storage failures; navigation away from admin still completes.
  }
}
