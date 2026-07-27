"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lead } from "@/data/mock";
import {
  leadsChangedEvent,
  readRemoteLeads,
  readStoredLeads,
  writeRemoteLeads,
  writeStoredLeads
} from "@/src/lib/leadsStore";

export function useLeads(initialLeads: Lead[]) {
  const [leads, setLeadsState] = useState<Lead[]>(initialLeads);
  const [saveStatus, setSaveStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const syncLeads = () => setLeadsState(readStoredLeads());

    readRemoteLeads()
      .then((remoteLeads) => {
        if (cancelled) return;
        setLeadsState(remoteLeads);
        writeStoredLeads(remoteLeads);
        setSaveStatus("idle");
      })
      .catch(() => {
        if (cancelled) return;
        syncLeads();
        setSaveStatus("error");
        setSaveError("服务器线索读取失败，当前显示本地缓存。");
      });

    window.addEventListener("storage", syncLeads);
    window.addEventListener(leadsChangedEvent, syncLeads);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", syncLeads);
      window.removeEventListener(leadsChangedEvent, syncLeads);
    };
  }, []);

  const setLeads = useCallback((updater: Lead[] | ((current: Lead[]) => Lead[])) => {
    setLeadsState((current) => {
      const nextLeads = typeof updater === "function" ? updater(current) : updater;
      writeStoredLeads(nextLeads);
      setSaveStatus("saving");
      setSaveError("");
      writeRemoteLeads(nextLeads)
        .then(() => setSaveStatus("saved"))
        .catch((error) => {
          setSaveStatus("error");
          setSaveError(error instanceof Error ? error.message : "服务器保存失败。");
        });
      return nextLeads;
    });
  }, []);

  return { leads, setLeads, saveStatus, saveError };
}
