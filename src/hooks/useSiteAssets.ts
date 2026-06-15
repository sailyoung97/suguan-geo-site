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
    });

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
    const nextAssets = readStoredSiteAssets();
    setUploadedAssets(nextAssets);
    if (result.ok) {
      writeRemoteSiteAssets(nextAssets);
    }
    return result;
  }, []);

  const removeAsset = useCallback((assetKey: string) => {
    const result = removeStoredSiteAsset(assetKey);
    const nextAssets = readStoredSiteAssets();
    setUploadedAssets(nextAssets);
    if (result.ok) {
      writeRemoteSiteAssets(nextAssets);
    }
    return result;
  }, []);

  const clearAssets = useCallback(() => {
    const result = clearStoredSiteAssets();
    const nextAssets = readStoredSiteAssets();
    setUploadedAssets(nextAssets);
    if (result.ok) {
      writeRemoteSiteAssets(nextAssets);
    }
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
