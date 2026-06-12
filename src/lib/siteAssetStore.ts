export type StoredSiteAssets = Record<string, string>;

export const siteAssetStorageKey = "suguan.siteAssets.v1";
export const siteAssetChangedEvent = "suguan-site-assets-changed";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function isPathValue(value: string) {
  const cleanValue = value.trim();
  return Boolean(cleanValue) && !cleanValue.startsWith("data:") && !cleanValue.startsWith("blob:");
}

function normalizeStoredAssets(parsed: unknown): StoredSiteAssets {
  if (!parsed || typeof parsed !== "object") {
    return {};
  }

  return Object.entries(parsed as Record<string, unknown>).reduce<StoredSiteAssets>((nextAssets, [assetKey, value]) => {
    if (typeof value === "string" && isPathValue(value)) {
      nextAssets[assetKey] = value.trim();
      return nextAssets;
    }

    if (value && typeof value === "object") {
      const legacyValue = value as { path?: unknown };
      if (typeof legacyValue.path === "string" && isPathValue(legacyValue.path)) {
        nextAssets[assetKey] = legacyValue.path.trim();
      }
    }

    return nextAssets;
  }, {});
}

export function readStoredSiteAssets(): StoredSiteAssets {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(siteAssetStorageKey);
    if (!raw) {
      return {};
    }
    return normalizeStoredAssets(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function writeStoredSiteAssets(nextAssets: StoredSiteAssets) {
  if (!canUseStorage()) {
    return { ok: false, error: "storage-unavailable" };
  }

  try {
    window.localStorage.setItem(siteAssetStorageKey, JSON.stringify(nextAssets));
    window.dispatchEvent(new Event(siteAssetChangedEvent));
    return { ok: true };
  } catch {
    return { ok: false, error: "quota-exceeded" };
  }
}

export function setStoredSiteAssetPath(assetKey: string, path: string) {
  const cleanPath = path.trim();
  if (!isPathValue(cleanPath)) {
    return { ok: false, error: "invalid-path" };
  }

  return writeStoredSiteAssets({
    ...readStoredSiteAssets(),
    [assetKey]: cleanPath
  });
}

export function removeStoredSiteAsset(assetKey: string) {
  const nextAssets = { ...readStoredSiteAssets() };
  delete nextAssets[assetKey];
  return writeStoredSiteAssets(nextAssets);
}

export function clearStoredSiteAssets() {
  if (!canUseStorage()) {
    return { ok: false, error: "storage-unavailable" };
  }

  try {
    window.localStorage.removeItem(siteAssetStorageKey);
    window.dispatchEvent(new Event(siteAssetChangedEvent));
    return { ok: true };
  } catch {
    return { ok: false, error: "quota-exceeded" };
  }
}
