import { randomUUID } from "crypto";
import path from "path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiError, unauthorized } from "@/src/server/apiResponse";
import { isAdminApiRequest } from "@/src/server/apiAuth";
import { saveUploadedImage } from "@/src/server/jsonStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxSize = 10 * 1024 * 1024;
const extensions: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

function safePrefix(value: FormDataEntryValue | null) {
  return String(value || "image")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";
}

export async function POST(request: NextRequest) {
  if (!isAdminApiRequest(request)) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请选择要上传的图片。" }, { status: 400 });
    }
    const extension = extensions[file.type];
    if (!extension) {
      return NextResponse.json({ error: "仅支持 jpg、jpeg、png、webp 图片。" }, { status: 400 });
    }
    if (file.size > maxSize) {
      return NextResponse.json({ error: "单张图片不能超过 10MB。" }, { status: 400 });
    }

    const prefix = safePrefix(formData.get("fieldKey") || formData.get("assetKey") || path.parse(file.name).name);
    const fileName = `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;
    await saveUploadedImage(fileName, new Uint8Array(await file.arrayBuffer()));

    return NextResponse.json({
      ok: true,
      fileName,
      path: `/uploads/${fileName}`,
      url: `/uploads/${fileName}`
    });
  } catch (error) {
    return apiError(error);
  }
}
