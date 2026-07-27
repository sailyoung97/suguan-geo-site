import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { leads as defaultLeads, type Lead } from "@/data/mock";
import { apiError, unauthorized } from "@/src/server/apiResponse";
import { isAdminApiRequest } from "@/src/server/apiAuth";
import { readJsonData, writeJsonData } from "@/src/server/jsonStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const recentSubmissions = new Map<string, number>();

export async function GET(request: NextRequest) {
  if (!isAdminApiRequest(request)) return unauthorized();
  return NextResponse.json(await readJsonData<Lead[]>("leads", defaultLeads));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (Array.isArray(body?.leads)) {
      if (!isAdminApiRequest(request)) return unauthorized();
      await writeJsonData("leads", body.leads);
      return NextResponse.json({ ok: true, leads: body.leads });
    }

    if (body?.website) {
      return NextResponse.json({ ok: true });
    }

    const lead = normalizePublicLead(body?.lead);
    if (!lead) {
      return NextResponse.json({ error: "请填写姓名、联系电话和需求描述。" }, { status: 400 });
    }

    const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const now = Date.now();
    const lastSubmittedAt = recentSubmissions.get(clientKey) || 0;
    if (now - lastSubmittedAt < 20_000) {
      return NextResponse.json({ error: "提交过于频繁，请稍后再试。" }, { status: 429 });
    }

    const currentLeads = await readJsonData<Lead[]>("leads", defaultLeads);
    await writeJsonData("leads", [lead, ...currentLeads]);
    recentSubmissions.set(clientKey, now);
    return NextResponse.json({ ok: true, lead });
  } catch (error) {
    return apiError(error);
  }
}

export const PUT = POST;

function normalizePublicLead(value: Partial<Lead> | undefined): Lead | null {
  if (!value) return null;
  const name = String(value.name || "").trim().slice(0, 80);
  const contact = String(value.contact || "").trim().slice(0, 160);
  const demand = String(value.demand || "").trim().slice(0, 3000);
  if (!name || !contact || !demand) return null;

  const today = new Date().toISOString().slice(0, 10);
  return {
    id: `L-WEB-${Date.now()}`,
    entryDate: today,
    name,
    organization: String(value.organization || "").trim().slice(0, 160),
    contact,
    source: "官网表单",
    projectType: value.projectType || "亲子营地",
    projectLocation: String(value.projectLocation || "").trim().slice(0, 160),
    city: String(value.city || value.projectLocation || "待定").trim().slice(0, 40),
    stage: "新线索",
    demand,
    intent: demand,
    sentMaterials: [],
    intentLevel: "B",
    owner: "待分配",
    nextFollowUp: "",
    followStatus: "新线索",
    lastContact: today,
    remarks: String(value.remarks || "").trim().slice(0, 500),
    budget: "待评估",
    score: 75,
    followRecords: []
  };
}
