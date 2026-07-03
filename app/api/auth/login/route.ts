import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminAuthCookieName } from "@/src/config/adminAuth";
import {
  adminSessionMaxAge,
  createAdminSession,
  validateAdminCredentials
} from "@/src/server/adminSession";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ error: "账号或密码错误。" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, username });
  const secure =
    request.headers.get("x-forwarded-proto") === "https" || request.nextUrl.protocol === "https:";
  response.cookies.set(adminAuthCookieName, createAdminSession(username), {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: adminSessionMaxAge
  });
  return response;
}
