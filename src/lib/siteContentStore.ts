import type { SiteContentKey } from "@/src/config/siteContent";
import { readServerJson, writeServerJson } from "@/src/lib/serverDataClient";
import { hasTextEncodingDamage } from "@/src/lib/textIntegrity";

export const siteContentStorageKey = "suguan.siteContent.v1";
export const siteContentChangedEvent = "suguan-site-content-changed";

export type StoredSiteContent = Partial<Record<SiteContentKey, string>>;

function isBrowser() {
  return typeof window !== "undefined";
}

export function readStoredSiteContent(): StoredSiteContent {
  if (!isBrowser()) {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(siteContentStorageKey);
    if (!rawValue) {
      return {};
    }

    const parsed = JSON.parse(rawValue);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => typeof value === "string" && !hasTextEncodingDamage(value))
    ) as StoredSiteContent;
  } catch {
    return {};
  }
}

function writeStoredSiteContent(nextContent: StoredSiteContent) {
  if (!isBrowser()) {
    return;
  }

  const cleanContent = Object.fromEntries(
    Object.entries(nextContent).filter(([, value]) => typeof value === "string" && value.trim())
  );

  window.localStorage.setItem(siteContentStorageKey, JSON.stringify(cleanContent));
  window.dispatchEvent(new Event(siteContentChangedEvent));
}

export function setStoredSiteContent(key: SiteContentKey, value: string) {
  const currentContent = readStoredSiteContent();
  writeStoredSiteContent({
    ...currentContent,
    [key]: value.trim()
  });
}

export function removeStoredSiteContent(key: SiteContentKey) {
  const currentContent = readStoredSiteContent();
  delete currentContent[key];
  writeStoredSiteContent(currentContent);
}

export function clearStoredSiteContent() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(siteContentStorageKey);
  window.dispatchEvent(new Event(siteContentChangedEvent));
}

export async function readRemoteSiteContent() {
  return readServerJson<StoredSiteContent>("/api/site-content");
}

export async function writeRemoteSiteContent(content: StoredSiteContent) {
  await writeServerJson("/api/site-content", { content });
  return content;
}
