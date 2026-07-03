import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminAuthCookieName } from "@/src/config/adminAuth";
import {
  adminSessionMaxAge,
  createAdminSession,
  isAdminCredentialsConfigured,
  validateAdminCredentials
} from "@/src/server/adminSession";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!isAdminCredentialsConfigured()) {
    return NextResponse.json(
      {
        error:
          "后台账号尚未配置。请在服务器 .env.production.local 中设置 ADMIN_USERNAME 和 ADMIN_PASSWORD，然后重启服务。"
      },
      { status: 503 }
    );
  }

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
