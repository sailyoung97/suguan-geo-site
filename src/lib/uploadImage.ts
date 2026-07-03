"use client";

const maxUploadFileSize = 10 * 1024 * 1024;
const allowedUploadMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateUploadImage(file: File) {
  if (!allowedUploadMimeTypes.has(file.type)) {
    return "仅支持 jpg、jpeg、png、webp 图片。";
  }

  if (file.size > maxUploadFileSize) {
    return "单张图片不能超过 10MB。";
  }

  return "";
}

type UploadImageOptions = {
  scope?: "site-assets" | "cases" | "articles";
  assetKey?: string;
  caseSlug?: string;
  articleSlug?: string;
  fieldKey?: string;
};

export async function uploadImage(file: File, options: UploadImageOptions = {}) {
  const validationError = validateUploadImage(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const formData = new FormData();
  formData.set("file", file);
  Object.entries(options).forEach(([key, value]) => {
    if (value) formData.set(key, value);
  });

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(typeof payload.error === "string" ? payload.error : "图片上传失败。");
  }

  if (typeof payload.url !== "string" || !payload.url) {
    throw new Error("上传成功但未返回图片 URL。");
  }

  return payload.url as string;
}
