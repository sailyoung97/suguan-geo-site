"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearStoredSiteAssets,
  readStoredSiteAssets,
  readRemoteSiteAssets,
  removeStoredSiteAsset,
  setStoredSiteAssetPath,
  siteAssetChangedEvent,
  siteAssetStorageKey,
  type StoredSiteAssets,
  writeRemoteSiteAssets,
  writeStoredSiteAssets
} from "@/src/lib/siteAssetStore";

export function useSiteAssets() {
  const [uploadedAssets, setUploadedAssets] = useState<StoredSiteAssets>({});

  const refresh = useCallback(() => {
    setUploadedAssets(readStoredSiteAssets());
  }, []);

  useEffect(() => {
    refresh();
    readRemoteSiteAssets().then((remoteAssets) => {
      if (Object.keys(remoteAssets).length) {
        writeStoredSiteAssets(remoteAssets);
        setUploadedAssets(remoteAssets);
      }
    }).catch(() => undefined);

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === siteAssetStorageKey) {
        refresh();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(siteAssetChangedEvent, refresh);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(siteAssetChangedEvent, refresh);
    };
  }, [refresh]);

  const setAssetPath = useCallback(async (assetKey: string, path: string) => {
    const cleanPath = path.trim();
    const currentAssets = readStoredSiteAssets();
    const nextAssets = { ...currentAssets, [assetKey]: cleanPath };
    await writeRemoteSiteAssets(nextAssets);
    const result = setStoredSiteAssetPath(assetKey, cleanPath);
    setUploadedAssets(readStoredSiteAssets());
    return result;
  }, []);

  const removeAsset = useCallback(async (assetKey: string) => {
    const nextAssets = { ...readStoredSiteAssets() };
    delete nextAssets[assetKey];
    await writeRemoteSiteAssets(nextAssets);
    const result = removeStoredSiteAsset(assetKey);
    setUploadedAssets(readStoredSiteAssets());
    return result;
  }, []);

  const clearAssets = useCallback(async () => {
    await writeRemoteSiteAssets({});
    const result = clearStoredSiteAssets();
    setUploadedAssets({});
    return result;
  }, []);

  const getAssetSrc = useCallback(
    (assetKey?: string) => {
      if (!assetKey) {
        return "";
      }
      return uploadedAssets[assetKey] || "";
    },
    [uploadedAssets]
  );

  return {
    uploadedAssets,
    getAssetSrc,
    setAssetPath,
    removeAsset,
    clearAssets
  };
}
