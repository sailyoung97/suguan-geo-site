import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { adminAuthCookieName } from "@/src/config/adminAuth";
import { verifyAdminSession } from "@/src/server/adminSession";

export const metadata: Metadata = {
  title: "溯观 GEO 中台",
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = verifyAdminSession(cookies().get(adminAuthCookieName)?.value);
  if (!session) {
    redirect("/login?redirect=/admin/leads");
  }
  return <AdminShell>{children}</AdminShell>;
}
