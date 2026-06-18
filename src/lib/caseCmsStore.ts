import { defaultCaseCmsItems, type CampCaseSection, type CaseCmsItem, type CaseGalleryImage } from "@/src/config/caseCms";
import {
  businessCategories,
  caseDisplayPriority,
  hiddenCaseNames,
  legacyCaseSlugMap,
  officialCaseMeta,
  type BusinessCategory
} from "@/src/data/cases";

export const caseCmsStorageKey = "suguan.cases.v1";
export const caseCmsChangedEvent = "suguan-cases-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeSlug(slug: string) {
  return legacyCaseSlugMap[slug] || slug;
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : [];
}

function normalizeGalleryImages(value: unknown, legacyImages: string[]): CaseGalleryImage[] {
  if (!Array.isArray(value)) {
    return legacyImages.map((url, index) => ({ url, caption: `项目实景图 ${index + 1}` }));
  }

  return value
    .map((image, index) => {
      if (typeof image === "string") {
        return { url: image, caption: `项目实景图 ${index + 1}` };
      }
      if (image && typeof image === "object") {
        const record = image as Partial<CaseGalleryImage>;
        return {
          url: record.url || "",
          caption: record.caption || `项目实景图 ${index + 1}`
        };
      }
      return { url: "", caption: `项目实景图 ${index + 1}` };
    })
    .filter((image) => image.url);
}

function normalizeCampCaseSections(value: unknown): CampCaseSection[] {
  if (!Array.isArray(value)) return [];

  return value.map((section, index) => {
    const record = section && typeof section === "object" ? (section as Partial<CampCaseSection>) : {};
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
}

function normalizeCase(item: Partial<CaseCmsItem>, index: number): CaseCmsItem {
  const slug = normalizeSlug(item.slug || `case-${index + 1}`);
  const officialMeta = officialCaseMeta[slug];
  const defaultCase = defaultCaseCmsItems.find((caseItem) => caseItem.slug === slug);
  const candidateCategory = item.businessCategory as BusinessCategory | undefined;
  const legacyGalleryImages = [item.heroImage, item.sceneImage01, item.sceneImage02].filter(
    (image): image is string => typeof image === "string" && Boolean(image)
  );

  return {
    projectName: item.projectName || defaultCase?.projectName || "",
    slug,
    location: item.location || defaultCase?.location || "",
    projectType: item.projectType || defaultCase?.projectType || "",
    status: item.status || defaultCase?.status || "",
    year: officialMeta?.year || item.year || defaultCase?.year || "",
    city: item.city || defaultCase?.city || "",
    businessCategory:
      officialMeta?.businessCategory ||
      (candidateCategory && businessCategories.includes(candidateCategory) ? candidateCategory : defaultCase?.businessCategory || "研学亲子营地"),
    order: officialMeta?.order || (Number.isFinite(Number(item.order)) ? Number(item.order) : defaultCase?.order || index + 1),
    isPublished: item.isPublished ?? defaultCase?.isPublished ?? true,
    isFeatured: item.isFeatured ?? defaultCase?.isFeatured ?? false,
    coverImage: item.coverImage || defaultCase?.coverImage || "",
    heroImage: item.heroImage || defaultCase?.heroImage || "",
    sceneImage01: item.sceneImage01 || defaultCase?.sceneImage01 || "",
    sceneImage02: item.sceneImage02 || defaultCase?.sceneImage02 || "",
    sceneImage03: item.sceneImage03 || defaultCase?.sceneImage03 || "",
    guideMapImage: item.guideMapImage || defaultCase?.guideMapImage || "",
    guideMapCaption: item.guideMapCaption || defaultCase?.guideMapCaption || "项目导览图",
    galleryImages: normalizeGalleryImages(item.galleryImages, defaultCase?.galleryImages?.length ? [] : legacyGalleryImages).length
      ? normalizeGalleryImages(item.galleryImages, defaultCase?.galleryImages?.length ? [] : legacyGalleryImages)
      : defaultCase?.galleryImages || [],
    assetImages: normalizeStringArray(item.assetImages),
    campCaseSections: normalizeCampCaseSections(item.campCaseSections),
    summary: item.summary || defaultCase?.summary || "",
    background: item.background || defaultCase?.background || "",
    painPoints: Array.isArray(item.painPoints) ? item.painPoints : defaultCase?.painPoints || [],
    services: Array.isArray(item.services) ? item.services : defaultCase?.services || [],
    strategy: Array.isArray(item.strategy) ? item.strategy : defaultCase?.strategy || [],
    results: Array.isArray(item.results) ? item.results : defaultCase?.results || [],
    value: item.value || defaultCase?.value || "",
    capabilities: Array.isArray(item.capabilities) ? item.capabilities : defaultCase?.capabilities || [],
    suitableClients: Array.isArray(item.suitableClients) ? item.suitableClients : defaultCase?.suitableClients || [],
    geoKeywords: Array.isArray(item.geoKeywords) ? item.geoKeywords : defaultCase?.geoKeywords || [],
    tags: Array.isArray(item.tags) ? item.tags : defaultCase?.tags || []
  };
}

function shouldHideCase(item: CaseCmsItem) {
  return hiddenCaseNames.includes(item.projectName) || item.slug === "camp-case-system" || item.slug === "camp-case-sections";
}

function dedupeCases(items: CaseCmsItem[]) {
  const seen = new Set<string>();
  const result: CaseCmsItem[] = [];

  for (const item of items) {
    if (shouldHideCase(item) || seen.has(item.slug)) continue;
    seen.add(item.slug);
    result.push(item);
  }

  return result;
}

function mergeWithDefaultCases(items: CaseCmsItem[]) {
  const cleanedItems = dedupeCases(items);
  const existingSlugs = new Set(cleanedItems.map((item) => item.slug));
  return sortCaseCmsItems([...cleanedItems, ...defaultCaseCmsItems.filter((item) => !existingSlugs.has(item.slug))]);
}

export function sortCaseCmsItems(items: CaseCmsItem[]) {
  return dedupeCases(items).sort((a, b) => {
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
