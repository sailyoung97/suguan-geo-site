"use client";

const maxUploadFileSize = 5 * 1024 * 1024;
const allowedUploadMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateUploadImage(file: File) {
  if (!allowedUploadMimeTypes.has(file.type)) {
    return "仅支持 jpg、jpeg、png、webp 图片。";
  }

  if (file.size > maxUploadFileSize) {
    return "单张图片不能超过 5MB。";
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

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const [, base64 = ""] = result.split(",");
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("图片读取失败。"));
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File, options: UploadImageOptions = {}) {
  const validationError = validateUploadImage(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const base64 = await readFileAsBase64(file);
  const response = await fetch("/.netlify/functions/upload-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...options,
      fileName: file.name,
      mimeType: file.type,
      base64
    })
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
