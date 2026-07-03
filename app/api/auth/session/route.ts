import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminAuthCookieName } from "@/src/config/adminAuth";
import { verifyAdminSession } from "@/src/server/adminSession";

export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request.cookies.get(adminAuthCookieName)?.value);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, username: session.username });
}
