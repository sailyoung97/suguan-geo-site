"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lead } from "@/data/mock";
import { leadsChangedEvent, readStoredLeads, writeStoredLeads } from "@/src/lib/leadsStore";

export function useLeads(initialLeads: Lead[]) {
  const [leads, setLeadsState] = useState<Lead[]>(initialLeads);

  useEffect(() => {
    const syncLeads = () => setLeadsState(readStoredLeads());
    syncLeads();
    window.addEventListener("storage", syncLeads);
    window.addEventListener(leadsChangedEvent, syncLeads);
    return () => {
      window.removeEventListener("storage", syncLeads);
      window.removeEventListener(leadsChangedEvent, syncLeads);
    };
  }, []);

  const setLeads = useCallback((updater: Lead[] | ((current: Lead[]) => Lead[])) => {
    setLeadsState((current) => {
      const nextLeads = typeof updater === "function" ? updater(current) : updater;
      writeStoredLeads(nextLeads);
      return nextLeads;
    });
  }, []);

  return { leads, setLeads };
}
