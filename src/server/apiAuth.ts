import type { NextRequest } from "next/server";
import { adminAuthCookieName } from "@/src/config/adminAuth";
import { verifyAdminSession } from "@/src/server/adminSession";

export function isAdminApiRequest(request: NextRequest) {
  return Boolean(verifyAdminSession(request.cookies.get(adminAuthCookieName)?.value));
}
