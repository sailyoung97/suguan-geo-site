import { defaultCaseCmsItems, type CaseCmsItem } from "@/src/config/caseCms";
import { businessCategories, officialCaseMeta, type BusinessCategory } from "@/src/data/cases";

export const caseCmsStorageKey = "suguan.cases.v1";
export const caseCmsChangedEvent = "suguan-cases-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeCase(item: Partial<CaseCmsItem>, index: number): CaseCmsItem {
  const slug = item.slug || `case-${index + 1}`;
  const officialMeta = officialCaseMeta[slug];
  const candidateCategory = item.businessCategory as BusinessCategory | undefined;

  return {
    projectName: item.projectName || "",
    slug,
    location: item.location || "",
    projectType: item.projectType || "",
    status: item.status || "",
    year: officialMeta?.year || item.year || "",
    city: item.city || "",
    businessCategory:
      officialMeta?.businessCategory ||
      (candidateCategory && businessCategories.includes(candidateCategory) ? candidateCategory : "都市文旅"),
    order: Number.isFinite(Number(item.order)) ? Number(item.order) : index + 1,
    isPublished: item.isPublished ?? true,
    isFeatured: item.isFeatured ?? false,
    coverImage: item.coverImage || "",
    heroImage: item.heroImage || "",
    sceneImage01: item.sceneImage01 || "",
    sceneImage02: item.sceneImage02 || "",
    sceneImage03: item.sceneImage03 || "",
    summary: item.summary || "",
    background: item.background || "",
    painPoints: Array.isArray(item.painPoints) ? item.painPoints : [],
    services: Array.isArray(item.services) ? item.services : [],
    strategy: Array.isArray(item.strategy) ? item.strategy : [],
    results: Array.isArray(item.results) ? item.results : [],
    value: item.value || "",
    capabilities: Array.isArray(item.capabilities) ? item.capabilities : [],
    suitableClients: Array.isArray(item.suitableClients) ? item.suitableClients : [],
    geoKeywords: Array.isArray(item.geoKeywords) ? item.geoKeywords : [],
    tags: Array.isArray(item.tags) ? item.tags : []
  };
}

export function sortCaseCmsItems(items: CaseCmsItem[]) {
  return [...items].sort((a, b) => a.order - b.order || a.projectName.localeCompare(b.projectName, "zh-CN"));
}

export function readStoredCases(): CaseCmsItem[] {
  if (!isBrowser()) {
    return defaultCaseCmsItems;
  }

  try {
    const rawValue = window.localStorage.getItem(caseCmsStorageKey);
    if (!rawValue) {
      return defaultCaseCmsItems;
    }

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return defaultCaseCmsItems;
    }

    return sortCaseCmsItems(parsed.map(normalizeCase));
  } catch {
    return defaultCaseCmsItems;
  }
}

export function writeStoredCases(items: CaseCmsItem[]) {
  if (!isBrowser()) {
    return;
  }

  const normalizedCases = items.map(normalizeCase);
  window.localStorage.setItem(caseCmsStorageKey, JSON.stringify(sortCaseCmsItems(normalizedCases)));
  window.dispatchEvent(new Event(caseCmsChangedEvent));
}

export function clearStoredCases() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(caseCmsStorageKey);
  window.dispatchEvent(new Event(caseCmsChangedEvent));
}
