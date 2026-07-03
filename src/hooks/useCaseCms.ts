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
    }).catch(() => undefined);
    window.addEventListener("storage", syncCases);
    window.addEventListener(caseCmsChangedEvent, syncCases);

    return () => {
      window.removeEventListener("storage", syncCases);
      window.removeEventListener(caseCmsChangedEvent, syncCases);
    };
  }, []);

  const saveCases = useCallback(async (nextCases: CaseCmsItem[]) => {
    const sortedCases = sortCaseCmsItems(nextCases);
    await writeRemoteCases(sortedCases);
    writeStoredCases(sortedCases);
    setCasesState(sortedCases);
    return sortedCases;
  }, []);

  const upsertCase = useCallback(
    async (nextCase: CaseCmsItem, originalSlug?: string) => {
      const nextCases = cases.filter((item) => item.slug !== (originalSlug || nextCase.slug));
      return saveCases([...nextCases, nextCase]);
    },
    [cases, saveCases]
  );

  const deleteCase = useCallback(
    async (slug: string) => {
      return saveCases(cases.filter((item) => item.slug !== slug));
    },
    [cases, saveCases]
  );

  const restoreDefaults = useCallback(async () => {
    await writeRemoteCases(defaultCaseCmsItems);
    clearStoredCases();
    setCasesState(defaultCaseCmsItems);
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
