"use client";

import { siteAssets } from "@/src/config/siteAssets";
import { useSiteAssets } from "@/src/hooks/useSiteAssets";

export function AboutHeroSection() {
  const { getAssetSrc } = useSiteAssets();
  const uploadedSrc = getAssetSrc(siteAssets.aboutHeroImage.key);
  const backgroundSrc = uploadedSrc || siteAssets.aboutHeroImage.src;

  return (
    <section
      className="relative min-h-[680px] overflow-hidden bg-ink bg-cover bg-center bg-no-repeat sm:min-h-[720px]"
      style={backgroundSrc ? { backgroundImage: `url("${backgroundSrc}")` } : undefined}
    >
      {!backgroundSrc ? <div className="absolute inset-0 bg-[linear-gradient(135deg,#1f2421,#111310)]" /> : null}
    </section>
  );
}
