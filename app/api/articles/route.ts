import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getDefaultContentTopics, normalizeContentTopic } from "@/src/lib/contentTopics";
import { apiError, unauthorized } from "@/src/server/apiResponse";
import { isAdminApiRequest } from "@/src/server/apiAuth";
import { readJsonData, writeJsonData } from "@/src/server/jsonStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const articles = await readJsonData<unknown[]>("articles", getDefaultContentTopics());
  return NextResponse.json(articles.map((article, index) => normalizeContentTopic(article, index)));
}

export async function POST(request: NextRequest) {
  if (!isAdminApiRequest(request)) return unauthorized();

  try {
    const body = await request.json();
    const articles = Array.isArray(body) ? body : body.articles;
    if (!Array.isArray(articles)) {
      return NextResponse.json({ error: "文章数据必须为数组。" }, { status: 400 });
    }
    const normalizedArticles = articles.map((article, index) => normalizeContentTopic(article, index));
    await writeJsonData("articles", normalizedArticles);
    return NextResponse.json({ ok: true, articles: normalizedArticles });
  } catch (error) {
    return apiError(error);
  }
}

export const PUT = POST;
