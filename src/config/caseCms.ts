import { caseStudies } from "@/data/mock";
import { officialCaseMeta, type BusinessCategory } from "@/src/data/cases";

export type CaseCmsItem = {
  projectName: string;
  slug: string;
  location: string;
  projectType: string;
  status: string;
  year: string;
  city: string;
  businessCategory: BusinessCategory;
  order: number;
  isPublished: boolean;
  isFeatured: boolean;
  coverImage: string;
  heroImage: string;
  sceneImage01: string;
  sceneImage02: string;
  sceneImage03: string;
  galleryImages: string[];
  assetImages: string[];
  summary: string;
  background: string;
  painPoints: string[];
  services: string[];
  strategy: string[];
  results: string[];
  value: string;
  capabilities: string[];
  suitableClients: string[];
  geoKeywords: string[];
  tags: string[];
};

const defaultImagePaths: Record<string, Partial<Pick<CaseCmsItem, "coverImage" | "heroImage" | "sceneImage01" | "sceneImage02">>> = {
  "kaibu-heritage-park": {
    coverImage: "/uploads/case-kaibu-cover.png",
    heroImage: "/uploads/case-kaibu-hero.png",
    sceneImage01: "/uploads/case-kaibu-scene-01.png",
    sceneImage02: "/uploads/case-kaibu-scene-02.jpg"
  },
  "shancheng-baba": {
    coverImage: "/uploads/case-shanchengbaba-cover.png",
    heroImage: "/uploads/case-shanchengbaba-hero.png",
    sceneImage01: "/uploads/case-shanchengbaba-scene-01.png",
    sceneImage02: "/uploads/case-shanchengbaba-scene-02.png"
  },
  "ufx-yaan": {
    coverImage: "/uploads/case-ufx-cover.jpg",
    heroImage: "/uploads/case-ufx-hero.jpg",
    sceneImage01: "/uploads/case-ufx-scene-01.png",
    sceneImage02: "/uploads/case-ufx-scene-02.png"
  },
  baicaohuxiang: {
    coverImage: "/uploads/case-baicaohuxiang-cover.jpg",
    heroImage: "/uploads/case-baicaohuxiang-hero.png",
    sceneImage01: "/uploads/case-baicaohuxiang-scene-01.jpg",
    sceneImage02: "/uploads/case-baicaohuxiang-scene-02.jpg"
  },
  xiaosangtian: {
    coverImage: "/uploads/case-xiaosangtian-cover.png",
    heroImage: "/uploads/case-xiaosangtian-hero.png",
    sceneImage01: "/uploads/case-xiaosangtian-scene-01.jpg",
    sceneImage02: "/uploads/case-xiaosangtian-scene-02.jpg"
  }
};

function cityFromLocation(location: string) {
  if (location.includes("雅安")) return "雅安";
  if (location.includes("重庆")) return "重庆";
  return location.replace(/[市省区县片]/g, "").slice(0, 8) || "未设置";
}

export const defaultCaseCmsItems: CaseCmsItem[] = caseStudies.map((item, index) => {
  const imagePaths = defaultImagePaths[item.id] || {};

  return {
    projectName: item.title,
    slug: item.id,
    location: item.location,
    projectType: item.category,
    status: item.status,
    year: item.year,
    city: cityFromLocation(item.location),
    businessCategory: officialCaseMeta[item.id]?.businessCategory || "都市文旅",
    order: index + 1,
    isPublished: true,
    isFeatured: true,
    coverImage: imagePaths.coverImage || "",
    heroImage: imagePaths.heroImage || "",
    sceneImage01: imagePaths.sceneImage01 || "",
    sceneImage02: imagePaths.sceneImage02 || "",
    sceneImage03: "",
    galleryImages: [imagePaths.heroImage, imagePaths.sceneImage01, imagePaths.sceneImage02].filter(Boolean) as string[],
    assetImages: [],
    summary: item.brief,
    background: item.background,
    painPoints: item.painPoints,
    services: item.services,
    strategy: item.coreStrategy,
    results: item.outcomes,
    value: item.value,
    capabilities: item.capabilityEvidence,
    suitableClients: item.referenceClients,
    geoKeywords: item.geoKeywords,
    tags: item.tags
  };
});

export function createEmptyCaseCmsItem(order: number): CaseCmsItem {
  return {
    projectName: "",
    slug: "",
    location: "",
    projectType: "",
    status: "策划中",
    year: String(new Date().getFullYear()),
    city: "",
    businessCategory: "都市文旅",
    order,
    isPublished: true,
    isFeatured: false,
    coverImage: "",
    heroImage: "",
    sceneImage01: "",
    sceneImage02: "",
    sceneImage03: "",
    galleryImages: [],
    assetImages: [],
    summary: "",
    background: "",
    painPoints: [],
    services: [],
    strategy: [],
    results: [],
    value: "",
    capabilities: [],
    suitableClients: [],
    geoKeywords: [],
    tags: []
  };
}
