"use client";

import { SiteAssetImage } from "@/components/SiteAssetImage";

type CaseImageProps = {
  src?: string;
  fallbackSrc?: string;
  className?: string;
  fallbackLabel?: string;
};

export function CaseImage({ src, fallbackSrc, className, fallbackLabel }: CaseImageProps) {
  return (
    <SiteAssetImage
      srcOverride={src || fallbackSrc || ""}
      className={className}
      fallbackLabel={fallbackLabel}
    />
  );
}
