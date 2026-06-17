"use client";

import { SiteAssetImage } from "@/components/SiteAssetImage";

type CaseImageProps = {
  src?: string;
  fallbackSrc?: string;
  className?: string;
  imageClassName?: string;
  fallbackLabel?: string;
};

export function CaseImage({ src, fallbackSrc, className, imageClassName, fallbackLabel }: CaseImageProps) {
  return (
    <SiteAssetImage
      srcOverride={src || fallbackSrc || ""}
      className={className}
      imageClassName={imageClassName}
      fallbackLabel={fallbackLabel}
    />
  );
}
