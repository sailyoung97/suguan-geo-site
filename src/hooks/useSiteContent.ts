"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SiteContentKey } from "@/src/config/siteContent";
import {
  clearStoredSiteContent,
  readStoredSiteContent,
  removeStoredSiteContent,
  setStoredSiteContent,
  siteContentChangedEvent,
  siteContentStorageKey,
  type StoredSiteContent
} from "@/src/lib/siteContentStore";

export function useSiteContent() {
  const [content, setContentState] = useState<StoredSiteContent>({});

  useEffect(() => {
    const syncContent = () => setContentState(readStoredSiteContent());

    syncContent();
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

  const setContent = useCallback((key: SiteContentKey, value: string) => {
    setStoredSiteContent(key, value);
    setContentState(readStoredSiteContent());
  }, []);

  const resetContent = useCallback((key: SiteContentKey) => {
    removeStoredSiteContent(key);
    setContentState(readStoredSiteContent());
  }, []);

  const resetAll = useCallback(() => {
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
