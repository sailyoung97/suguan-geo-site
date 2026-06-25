"use client";

import { SiteAssetImage } from "@/components/SiteAssetImage";

type CaseImageProps = {
  src?: string;
  fallbackSrc?: string;
  className?: string;
  imageClassName?: string;
  fallbackLabel?: string;
  alt?: string;
};

export function CaseImage({ src, fallbackSrc, className, imageClassName, fallbackLabel, alt }: CaseImageProps) {
  return (
    <SiteAssetImage
      srcOverride={src || fallbackSrc || ""}
      className={className}
      imageClassName={imageClassName}
      fallbackLabel={fallbackLabel}
      alt={alt}
    />
  );
}
