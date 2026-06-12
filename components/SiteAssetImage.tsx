"use client";

import { useEffect, useState } from "react";
import { useSiteAssets } from "@/src/hooks/useSiteAssets";
import type { SiteAsset } from "@/src/config/siteAssets";

type SiteAssetImageProps = {
  asset?: SiteAsset;
  className?: string;
  imageClassName?: string;
  fallbackLabel?: string;
  variant?: "default" | "mark" | "qr";
  fit?: "cover" | "contain";
  srcOverride?: string;
  fallbackAsset?: SiteAsset;
  hideFallback?: boolean;
};

export function SiteAssetImage({
  asset,
  className = "",
  imageClassName = "",
  fallbackLabel,
  variant = "default",
  fit,
  srcOverride,
  fallbackAsset,
  hideFallback = false
}: SiteAssetImageProps) {
  const [failed, setFailed] = useState(false);
  const { getAssetSrc } = useSiteAssets();
  const uploadedSrc = getAssetSrc(asset?.key);
  const fallbackUploadedSrc = getAssetSrc(fallbackAsset?.key);
  const src = srcOverride || uploadedSrc || asset?.src?.trim() || fallbackUploadedSrc || fallbackAsset?.src?.trim();

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (src && !failed) {
    const fitClassName = fit === "contain" || variant !== "default" ? "object-contain" : "object-cover";
    return (
      <div className={`relative overflow-hidden bg-[#d9d7d1] ${className}`}>
        <img
          src={src}
          alt={asset?.alt || fallbackLabel || "图片"}
          className={`h-full w-full ${fitClassName} ${imageClassName}`}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  if (hideFallback) {
    return null;
  }

  if (variant === "mark") {
    return (
      <div className={`grid place-items-center overflow-hidden bg-ink text-sm font-semibold text-paper ${className}`}>
        {fallbackLabel || "Logo"}
      </div>
    );
  }

  if (variant === "qr") {
    return (
      <div className={`grid place-items-center overflow-hidden bg-paper ${className}`}>
        <div className="grid h-24 w-24 place-items-center border border-ink/20 bg-[linear-gradient(90deg,rgba(31,36,33,0.08)_1px,transparent_1px),linear-gradient(rgba(31,36,33,0.08)_1px,transparent_1px)] bg-[size:12px_12px] text-center text-xs font-medium text-ink/54">
          {fallbackLabel || "QR"}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#d9d7d1] ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_34%),linear-gradient(45deg,rgba(31,36,33,0.1)_0%,transparent_42%),linear-gradient(180deg,transparent,rgba(31,36,33,0.12))]" />
      <div className="absolute inset-5 border border-paper/60" />
      <div className="absolute bottom-5 left-5 text-xs uppercase tracking-[0.24em] text-ink/42">
        {fallbackLabel || asset?.alt || "Image Placeholder"}
      </div>
    </div>
  );
}
