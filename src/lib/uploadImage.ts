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

export async function uploadImageToBlob(file: File) {
  const validationError = validateUploadImage(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const formData = new FormData();
  formData.append("file", file);

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
