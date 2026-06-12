"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearStoredSiteAssets,
  readStoredSiteAssets,
  removeStoredSiteAsset,
  setStoredSiteAssetPath,
  siteAssetChangedEvent,
  siteAssetStorageKey,
  type StoredSiteAssets
} from "@/src/lib/siteAssetStore";

export function useSiteAssets() {
  const [uploadedAssets, setUploadedAssets] = useState<StoredSiteAssets>({});

  const refresh = useCallback(() => {
    setUploadedAssets(readStoredSiteAssets());
  }, []);

  useEffect(() => {
    refresh();

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

  const setAssetPath = useCallback((assetKey: string, path: string) => {
    const result = setStoredSiteAssetPath(assetKey, path);
    setUploadedAssets(readStoredSiteAssets());
    return result;
  }, []);

  const removeAsset = useCallback((assetKey: string) => {
    const result = removeStoredSiteAsset(assetKey);
    setUploadedAssets(readStoredSiteAssets());
    return result;
  }, []);

  const clearAssets = useCallback(() => {
    const result = clearStoredSiteAssets();
    setUploadedAssets(readStoredSiteAssets());
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
