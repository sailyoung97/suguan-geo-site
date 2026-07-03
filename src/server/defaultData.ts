import { siteAssets, type SiteAsset } from "@/src/config/siteAssets";

function collectAssets(value: unknown, result: Record<string, string>) {
  if (!value || typeof value !== "object") return;

  if ("key" in value && "src" in value) {
    const asset = value as SiteAsset;
    if (asset.key && asset.src && !result[asset.key]) {
      result[asset.key] = asset.src;
    }
    return;
  }

  Object.values(value).forEach((item) => collectAssets(item, result));
}

export function getDefaultSiteAssetPaths() {
  const result: Record<string, string> = {};
  collectAssets(siteAssets, result);
  return result;
}
