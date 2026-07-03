import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { siteContentDefaults, type SiteContentKey } from "@/src/config/siteContent";
import type { StoredSiteContent } from "@/src/lib/siteContentStore";
import { apiError, unauthorized } from "@/src/server/apiResponse";
import { isAdminApiRequest } from "@/src/server/apiAuth";
import { readJsonData, writeJsonData } from "@/src/server/jsonStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeContent(value: unknown): StoredSiteContent {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, content]) => typeof content === "string" && content.trim())
      .map(([key, content]) => [key as SiteContentKey, String(content).trim()])
  );
}

export async function GET() {
  return NextResponse.json(
    await readJsonData<StoredSiteContent>("siteContent", siteContentDefaults)
  );
}

export async function POST(request: NextRequest) {
  if (!isAdminApiRequest(request)) return unauthorized();

  try {
    const body = await request.json();
    const content = normalizeContent(body.content || body);
    await writeJsonData("siteContent", content);
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    return apiError(error);
  }
}

export const PUT = POST;
