import { leads as defaultLeads, type Lead } from "@/data/mock";
import { readServerJson, writeServerJson } from "@/src/lib/serverDataClient";

export const leadsStorageKey = "suguan.leads.v1";
export const leadsChangedEvent = "suguan-leads-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeLead(item: Partial<Lead>, index: number): Lead {
  return {
    id: item.id || `L-LOCAL-${index + 1}`,
    entryDate: item.entryDate || new Date().toISOString().slice(0, 10),
    name: item.name || "",
    organization: item.organization || "",
    contact: item.contact || "",
    source: item.source || "官网表单",
    projectType: item.projectType || "城市更新",
    projectLocation: item.projectLocation || "",
    city: item.city || item.projectLocation?.slice(0, 2) || "待定",
    stage: item.stage || "新线索",
    demand: item.demand || "",
    intent: item.intent || item.demand || "",
    sentMaterials: Array.isArray(item.sentMaterials) ? item.sentMaterials : [],
    intentLevel: item.intentLevel || "B",
    owner: item.owner || "待分配",
    nextFollowUp: item.nextFollowUp || "",
    followStatus: item.followStatus || "新线索",
    lastContact: item.lastContact || item.entryDate || "",
    remarks: item.remarks || "",
    budget: item.budget || "待评估",
    score: Number.isFinite(Number(item.score)) ? Number(item.score) : 75,
    followRecords: Array.isArray(item.followRecords) ? item.followRecords : []
  };
}

export function readStoredLeads(): Lead[] {
  if (!isBrowser()) {
    return defaultLeads;
  }

  try {
    const rawValue = window.localStorage.getItem(leadsStorageKey);
    if (!rawValue) {
      return defaultLeads;
    }
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return defaultLeads;
    }
    return parsed.map(normalizeLead);
  } catch {
    return defaultLeads;
  }
}

export function writeStoredLeads(nextLeads: Lead[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(leadsStorageKey, JSON.stringify(nextLeads.map(normalizeLead)));
  window.dispatchEvent(new Event(leadsChangedEvent));
}

export function appendStoredLead(nextLead: Lead) {
  const currentLeads = readStoredLeads();
  writeStoredLeads([nextLead, ...currentLeads]);
}

export async function readRemoteLeads() {
  return readServerJson<Lead[]>("/api/leads");
}

export async function writeRemoteLeads(leads: Lead[]) {
  return writeServerJson<{ ok: boolean; leads: Lead[] }>("/api/leads", { leads });
}

export async function submitWebsiteLead(lead: Lead, website = "") {
  return writeServerJson<{ ok: boolean; lead?: Lead }>("/api/leads", { lead, website });
}
