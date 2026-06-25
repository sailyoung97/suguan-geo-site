import { Buffer } from "node:buffer";
import { connectLambda, getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

const adminAuthCookieName = "suguan.admin.auth.v1";
const maxFileSize = 5 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const extensionByMimeType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

type UploadPayload = {
  fileName?: string;
  mimeType?: string;
  base64?: string;
  scope?: "site-assets" | "cases" | "articles";
  assetKey?: string;
  caseSlug?: string;
  articleSlug?: string;
  fieldKey?: string;
};

function json(statusCode: number, payload: Record<string, unknown>) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(payload)
  };
}

function isLoggedIn(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .some((item) => item === `${adminAuthCookieName}=authenticated`);
}

function toKebabCase(value: string) {
  return value
    .normalize("NFKD")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^\w.-]+/g, "-")
    .replace(/_/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function getSafeExtension(fileName: string, mimeType: string) {
  const fallbackExtension = extensionByMimeType[mimeType] || "jpg";
  const originalExtension = fileName.split(".").pop()?.toLowerCase();
  return originalExtension && ["jpg", "jpeg", "png", "webp"].includes(originalExtension)
    ? originalExtension
    : fallbackExtension;
}

function normalizeFieldKey(fieldKey = "image") {
  const fieldMap: Record<string, string> = {
    coverImage: "cover",
    heroImage: "hero",
    sceneImage01: "scene-01",
    sceneImage02: "scene-02",
    sceneImage03: "scene-03"
  };
  return fieldMap[fieldKey] || toKebabCase(fieldKey) || "image";
}

function buildStorageKey(payload: UploadPayload) {
  const timestamp = Date.now();
  const fileName = payload.fileName || "image.jpg";
  const mimeType = payload.mimeType || "image/jpeg";
  const extension = getSafeExtension(fileName, mimeType);

  if (payload.scope === "cases") {
    const caseSlug = toKebabCase(payload.caseSlug || "case") || "case";
    const fieldKey = normalizeFieldKey(payload.fieldKey);
    return `cases/${caseSlug}-${fieldKey}-${timestamp}.${extension}`;
  }

  if (payload.scope === "articles") {
    const articleSlug = toKebabCase(payload.articleSlug || "article") || "article";
    const fieldKey = normalizeFieldKey(payload.fieldKey);
    return `articles/${articleSlug}-${fieldKey}-${timestamp}.${extension}`;
  }

  const assetKey = toKebabCase(payload.assetKey || fileName.replace(/\.[^.]+$/, "")) || "image";
  return `site-assets/${assetKey}-${timestamp}.${extension}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  if (!isLoggedIn(event.headers.cookie || event.headers.Cookie || "")) {
    return json(401, { error: "未登录，不能上传图片。" });
  }

  try {
    const payload = JSON.parse(event.body || "{}") as UploadPayload;

    if (!payload.base64 || !payload.fileName || !payload.mimeType) {
      return json(400, { error: "缺少图片文件数据。" });
    }

    if (!allowedMimeTypes.has(payload.mimeType)) {
      return json(400, { error: "仅支持 jpg、jpeg、png、webp 图片。" });
    }

    const fileBuffer = Buffer.from(payload.base64, "base64");
    if (fileBuffer.byteLength > maxFileSize) {
      return json(400, { error: "单张图片不能超过 5MB。" });
    }

    connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
    const key = buildStorageKey(payload);
    const store = getStore("suguan-images");
    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength
    );

    await store.set(key, arrayBuffer, {
      metadata: {
        contentType: payload.mimeType,
        fileName: payload.fileName
      }
    });

    return json(200, {
      url: `/.netlify/functions/blob-image?key=${encodeURIComponent(key)}`,
      path: key
    });
  } catch (error) {
    console.error("Netlify image upload failed:", error);
    return json(500, { error: "图片上传失败，请稍后重试。" });
  }
};
