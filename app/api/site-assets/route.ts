import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiError, unauthorized } from "@/src/server/apiResponse";
import { isAdminApiRequest } from "@/src/server/apiAuth";
import { getDefaultSiteAssetPaths } from "@/src/server/defaultData";
import { readJsonData, writeJsonData } from "@/src/server/jsonStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeAssets(value: unknown) {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, path]) => typeof path === "string" && path.trim() && !path.startsWith("data:") && !path.startsWith("blob:"))
      .map(([key, path]) => [key, String(path).trim()])
  );
}

export async function GET() {
  return NextResponse.json(
    await readJsonData<Record<string, string>>("siteAssets", getDefaultSiteAssetPaths())
  );
}

export async function POST(request: NextRequest) {
  if (!isAdminApiRequest(request)) return unauthorized();

  try {
    const body = await request.json();
    const assets = normalizeAssets(body.assets || body);
    await writeJsonData("siteAssets", assets);
    return NextResponse.json({ ok: true, assets });
  } catch (error) {
    return apiError(error);
  }
}

export const PUT = POST;
