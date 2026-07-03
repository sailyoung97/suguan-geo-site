import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getDefaultContentTopics, type GeoContentTopic } from "@/src/lib/contentTopics";
import { apiError, unauthorized } from "@/src/server/apiResponse";
import { isAdminApiRequest } from "@/src/server/apiAuth";
import { readJsonData, writeJsonData } from "@/src/server/jsonStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readJsonData<GeoContentTopic[]>("articles", getDefaultContentTopics()));
}

export async function POST(request: NextRequest) {
  if (!isAdminApiRequest(request)) return unauthorized();

  try {
    const body = await request.json();
    const articles = Array.isArray(body) ? body : body.articles;
    if (!Array.isArray(articles)) {
      return NextResponse.json({ error: "文章数据必须为数组。" }, { status: 400 });
    }
    await writeJsonData("articles", articles);
    return NextResponse.json({ ok: true, articles });
  } catch (error) {
    return apiError(error);
  }
}

export const PUT = POST;
