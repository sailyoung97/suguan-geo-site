"use client";

import { siteAssets } from "@/src/config/siteAssets";
import { useSiteAssets } from "@/src/hooks/useSiteAssets";

export function AboutHeroSection() {
  const { getAssetSrc } = useSiteAssets();
  const uploadedSrc = getAssetSrc(siteAssets.aboutHeroImage.key);
  const backgroundSrc = uploadedSrc || siteAssets.aboutHeroImage.src;

  return (
    <section className="relative overflow-hidden bg-ink sm:min-h-[720px]">
      {backgroundSrc ? (
        <img
          src={backgroundSrc}
          alt={siteAssets.aboutHeroImage.alt}
          className="block h-auto w-full object-contain sm:absolute sm:inset-0 sm:h-full sm:w-full sm:object-cover"
        />
      ) : (
        <div className="h-[320px] bg-[linear-gradient(135deg,#1f2421,#111310)] sm:absolute sm:inset-0 sm:h-auto" />
      )}
    </section>
  );
}
