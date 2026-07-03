"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SiteContentKey } from "@/src/config/siteContent";
import {
  clearStoredSiteContent,
  readRemoteSiteContent,
  readStoredSiteContent,
  removeStoredSiteContent,
  setStoredSiteContent,
  siteContentChangedEvent,
  siteContentStorageKey,
  type StoredSiteContent,
  writeRemoteSiteContent
} from "@/src/lib/siteContentStore";

export function useSiteContent() {
  const [content, setContentState] = useState<StoredSiteContent>({});

  useEffect(() => {
    const syncContent = () => setContentState(readStoredSiteContent());

    syncContent();
    readRemoteSiteContent()
      .then((remoteContent) => {
        window.localStorage.setItem(siteContentStorageKey, JSON.stringify(remoteContent));
        window.dispatchEvent(new Event(siteContentChangedEvent));
        setContentState(remoteContent);
      })
      .catch(() => undefined);
    window.addEventListener("storage", syncContent);
    window.addEventListener(siteContentChangedEvent, syncContent);

    return () => {
      window.removeEventListener("storage", syncContent);
      window.removeEventListener(siteContentChangedEvent, syncContent);
    };
  }, []);

  const getContent = useCallback(
    (key: SiteContentKey, defaultValue: string) => content[key] || defaultValue,
    [content]
  );

  const setContent = useCallback(async (key: SiteContentKey, value: string) => {
    const nextContent = { ...content, [key]: value.trim() };
    await writeRemoteSiteContent(nextContent);
    setStoredSiteContent(key, value);
    setContentState(nextContent);
  }, [content]);

  const resetContent = useCallback(async (key: SiteContentKey) => {
    const nextContent = { ...content };
    delete nextContent[key];
    await writeRemoteSiteContent(nextContent);
    removeStoredSiteContent(key);
    setContentState(nextContent);
  }, [content]);

  const resetAll = useCallback(async () => {
    await writeRemoteSiteContent({});
    clearStoredSiteContent();
    setContentState({});
  }, []);

  return useMemo(
    () => ({
      content,
      storageKey: siteContentStorageKey,
      getContent,
      setContent,
      resetContent,
      resetAll
    }),
    [content, getContent, resetAll, resetContent, setContent]
  );
}
