import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defaultCaseCmsItems, type CaseCmsItem } from "@/src/config/caseCms";
import { apiError, unauthorized } from "@/src/server/apiResponse";
import { isAdminApiRequest } from "@/src/server/apiAuth";
import { readJsonData, writeJsonData } from "@/src/server/jsonStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readJsonData<CaseCmsItem[]>("cases", defaultCaseCmsItems));
}

export async function POST(request: NextRequest) {
  if (!isAdminApiRequest(request)) return unauthorized();

  try {
    const body = await request.json();
    const cases = Array.isArray(body) ? body : body.cases;
    if (!Array.isArray(cases)) {
      return NextResponse.json({ error: "案例数据必须为数组。" }, { status: 400 });
    }
    await writeJsonData("cases", cases);
    return NextResponse.json({ ok: true, cases });
  } catch (error) {
    return apiError(error);
  }
}

export const PUT = POST;
