import { put } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";
import { adminAuthCookieName } from "@/src/config/adminAuth";

export const runtime = "nodejs";

const maxFileSize = 10 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const extensionByMimeType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

function sanitizeFileName(fileName: string, mimeType: string) {
  const fallbackExtension = extensionByMimeType[mimeType] || "jpg";
  const originalExtension = fileName.split(".").pop()?.toLowerCase();
  const extension = originalExtension && ["jpg", "jpeg", "png", "webp"].includes(originalExtension)
    ? originalExtension.replace("jpeg", "jpg")
    : fallbackExtension;
  const baseName = fileName
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${baseName || "image"}.${extension}`;
}

export async function POST(request: NextRequest) {
  const authCookie = request.cookies.get(adminAuthCookieName)?.value;
  if (authCookie !== "authenticated") {
    return NextResponse.json({ error: "未登录，不能上传图片。" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请上传图片文件。" }, { status: 400 });
    }

    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json({ error: "仅支持 jpg、jpeg、png、webp 图片。" }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ error: "单张图片不能超过 10MB。" }, { status: 400 });
    }

    const safeFileName = sanitizeFileName(file.name, file.type);
    const pathname = `suguan/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeFileName}`;
    const blob = await put(pathname, file, {
      access: "public"
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Vercel Blob upload failed:", error);
    return NextResponse.json(
      { error: "图片上传失败，请检查 BLOB_READ_WRITE_TOKEN 或稍后重试。" },
      { status: 500 }
    );
  }
}
