import {
  defaultCampCaseSections,
  defaultCaseCmsItems,
  type CampCaseSection,
  type CaseCmsItem
} from "@/src/config/caseCms";
import { businessCategories, caseDisplayPriority, officialCaseMeta, type BusinessCategory } from "@/src/data/cases";

export const caseCmsStorageKey = "suguan.cases.v1";
export const caseCmsChangedEvent = "suguan-cases-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeCampCaseSections(value: unknown, slug: string, defaultSections: CampCaseSection[] = []) {
  if (!Array.isArray(value)) {
    return slug === "baicaohuxiang" ? defaultCampCaseSections : defaultSections;
  }

  const normalizedSections = value.map((section, index) => {
    const record = section && typeof section === "object" ? section as Partial<CampCaseSection> : {};
    return {
      id: record.id || `camp-section-${index + 1}`,
      projectName: record.projectName || "",
      location: record.location || "",
      intro: record.intro || "",
      guideMapImage: record.guideMapImage || "",
      guideMapCaption: record.guideMapCaption || "项目导览图",
      realImages: Array.isArray(record.realImages)
        ? record.realImages.slice(0, 5).map((image, imageIndex) => ({
            url: image?.url || "",
            caption: image?.caption || `营地实景图 ${imageIndex + 1}`
          }))
        : []
    };
  });

  if (slug !== "baicaohuxiang") {
    return normalizedSections;
  }

  const existingIds = new Set(normalizedSections.map((section) => section.id));
  return [...normalizedSections, ...defaultCampCaseSections.filter((section) => !existingIds.has(section.id))];
}

function normalizeCase(item: Partial<CaseCmsItem>, index: number): CaseCmsItem {
  const slug = item.slug || `case-${index + 1}`;
  const officialMeta = officialCaseMeta[slug];
  const defaultCase = defaultCaseCmsItems.find((caseItem) => caseItem.slug === slug);
  const candidateCategory = item.businessCategory as BusinessCategory | undefined;
  const legacyGalleryImages = [item.heroImage, item.sceneImage01, item.sceneImage02].filter(
    (image): image is string => typeof image === "string" && Boolean(image)
  );

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
      (candidateCategory && businessCategories.includes(candidateCategory) ? candidateCategory : "研学亲子营地"),
    order: officialMeta?.order || (Number.isFinite(Number(item.order)) ? Number(item.order) : index + 1),
    isPublished: item.isPublished ?? true,
    isFeatured: item.isFeatured ?? false,
    coverImage: item.coverImage || "",
    heroImage: item.heroImage || "",
    sceneImage01: item.sceneImage01 || "",
    sceneImage02: item.sceneImage02 || "",
    sceneImage03: item.sceneImage03 || "",
    galleryImages: Array.isArray(item.galleryImages) ? item.galleryImages.filter(Boolean) : legacyGalleryImages,
    assetImages: Array.isArray(item.assetImages) ? item.assetImages.filter(Boolean) : [],
    campCaseSections: normalizeCampCaseSections(item.campCaseSections, slug, defaultCase?.campCaseSections),
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

function mergeWithDefaultCases(items: CaseCmsItem[]) {
  const existingSlugs = new Set(items.map((item) => item.slug));
  return sortCaseCmsItems([...items, ...defaultCaseCmsItems.filter((item) => !existingSlugs.has(item.slug))]);
}

export function sortCaseCmsItems(items: CaseCmsItem[]) {
  return [...items].sort((a, b) => {
    const priorityA = caseDisplayPriority.indexOf(a.slug);
    const priorityB = caseDisplayPriority.indexOf(b.slug);
    const normalizedPriorityA = priorityA === -1 ? Number.POSITIVE_INFINITY : priorityA;
    const normalizedPriorityB = priorityB === -1 ? Number.POSITIVE_INFINITY : priorityB;

    return normalizedPriorityA - normalizedPriorityB || a.order - b.order || a.projectName.localeCompare(b.projectName, "zh-CN");
  });
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

    return mergeWithDefaultCases(parsed.map(normalizeCase));
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

export async function readRemoteCases(): Promise<CaseCmsItem[]> {
  try {
    const response = await fetch("/.netlify/functions/cases", {
      cache: "no-store"
    });
    if (!response.ok) return [];
    const parsed = await response.json();
    if (!Array.isArray(parsed)) return [];
    return mergeWithDefaultCases(parsed.map(normalizeCase));
  } catch {
    return [];
  }
}

export async function writeRemoteCases(items: CaseCmsItem[]) {
  try {
    await fetch("/.netlify/functions/cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cases: sortCaseCmsItems(items.map(normalizeCase)) })
    });
  } catch {
    // Remote sync is best-effort; local state still updates immediately.
  }
}
