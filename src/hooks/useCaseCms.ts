"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultCaseCmsItems, type CaseCmsItem } from "@/src/config/caseCms";
import {
  caseCmsChangedEvent,
  caseCmsStorageKey,
  clearStoredCases,
  readRemoteCases,
  readStoredCases,
  sortCaseCmsItems,
  writeRemoteCases,
  writeStoredCases
} from "@/src/lib/caseCmsStore";

export function useCaseCms() {
  const [cases, setCasesState] = useState<CaseCmsItem[]>(defaultCaseCmsItems);

  useEffect(() => {
    const syncCases = () => setCasesState(readStoredCases());

    syncCases();
    readRemoteCases().then((remoteCases) => {
      if (remoteCases.length) {
        writeStoredCases(remoteCases);
        setCasesState(remoteCases);
      }
    });
    window.addEventListener("storage", syncCases);
    window.addEventListener(caseCmsChangedEvent, syncCases);

    return () => {
      window.removeEventListener("storage", syncCases);
      window.removeEventListener(caseCmsChangedEvent, syncCases);
    };
  }, []);

  const saveCases = useCallback((nextCases: CaseCmsItem[]) => {
    const sortedCases = sortCaseCmsItems(nextCases);
    writeStoredCases(sortedCases);
    setCasesState(sortedCases);
    writeRemoteCases(sortedCases);
  }, []);

  const upsertCase = useCallback(
    (nextCase: CaseCmsItem, originalSlug?: string) => {
      const nextCases = cases.filter((item) => item.slug !== (originalSlug || nextCase.slug));
      saveCases([...nextCases, nextCase]);
    },
    [cases, saveCases]
  );

  const deleteCase = useCallback(
    (slug: string) => {
      saveCases(cases.filter((item) => item.slug !== slug));
    },
    [cases, saveCases]
  );

  const restoreDefaults = useCallback(() => {
    clearStoredCases();
    setCasesState(defaultCaseCmsItems);
    writeRemoteCases(defaultCaseCmsItems);
  }, []);

  const publishedCases = useMemo(
    () => sortCaseCmsItems(cases.filter((item) => item.isPublished)),
    [cases]
  );

  const featuredCases = useMemo(
    () => sortCaseCmsItems(cases.filter((item) => item.isPublished && item.isFeatured)),
    [cases]
  );

  return {
    cases,
    publishedCases,
    featuredCases,
    storageKey: caseCmsStorageKey,
    saveCases,
    upsertCase,
    deleteCase,
    restoreDefaults
  };
}
