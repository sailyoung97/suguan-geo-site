import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminAuthCookieName } from "@/src/config/adminAuth";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  const secure =
    request.headers.get("x-forwarded-proto") === "https" || request.nextUrl.protocol === "https:";
  response.cookies.set(adminAuthCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0
  });
  return response;
}
