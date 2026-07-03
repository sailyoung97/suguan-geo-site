import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { resolveBundledImage, resolveUploadedImage } from "@/src/server/jsonStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

export async function GET(_: Request, { params }: { params: { path: string[] } }) {
  const fileName = path.basename(params.path.join("/"));
  const extension = path.extname(fileName).toLowerCase();
  if (!contentTypes[extension]) {
    return new NextResponse("Not found", { status: 404 });
  }

  for (const filePath of [resolveUploadedImage(fileName), resolveBundledImage(fileName)]) {
    try {
      const bytes = await readFile(filePath);
      return new NextResponse(bytes, {
        headers: {
          "Content-Type": contentTypes[extension],
          "Cache-Control": "public, max-age=31536000, immutable"
        }
      });
    } catch {
      // Try the next storage location.
    }
  }

  return new NextResponse("Not found", { status: 404 });
}
