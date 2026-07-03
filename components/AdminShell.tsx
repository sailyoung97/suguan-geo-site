"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAdminAuth } from "@/src/lib/adminAuth";

const adminNav = [
  { href: "/admin/leads", label: "客户线索 CRM" },
  { href: "/admin/geo-tests", label: "GEO 测试记录" },
  { href: "/admin/cases", label: "案例管理" },
  { href: "/admin/articles", label: "文章选题管理" },
  { href: "/admin/resources", label: "资料包管理" },
  { href: "/admin/site-assets", label: "网站素材管理" },
  { href: "/admin/site-content", label: "网页文案管理" },
  { href: "/admin/system-guide", label: "系统说明" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          router.replace(`/login?redirect=${encodeURIComponent(pathname || "/admin/leads")}`);
          return;
        }
        setIsReady(true);
      })
      .catch(() => router.replace(`/login?redirect=${encodeURIComponent(pathname || "/admin/leads")}`));
  }, [pathname, router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    clearAdminAuth();
    router.replace("/login");
    router.refresh();
  };

  if (!isReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f0e6] px-4 text-ink">
        <div className="border border-line bg-paper px-6 py-5 text-sm text-ink/62">正在检查登录状态...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-line bg-ink px-5 py-6 text-paper lg:flex lg:flex-col">
        <Link href="/" className="block">
          <span className="text-xl font-semibold">溯观 GEO 中台</span>
          <span className="mt-2 block text-sm text-paper/58">Mock Admin Prototype</span>
        </Link>
        <nav className="mt-10 flex-1 space-y-2">
          {adminNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block border px-4 py-3 text-sm transition ${
                  active
                    ? "border-paper/25 bg-paper/12 text-paper"
                    : "border-transparent text-paper/76 hover:border-paper/20 hover:bg-paper/8 hover:text-paper"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="mt-6 w-full border border-paper/28 px-4 py-3 text-left text-sm text-paper/76 transition hover:bg-paper hover:text-ink"
        >
          退出登录
        </button>
      </aside>
      <div className="lg:pl-72">
        <header className="border-b border-line bg-paper/90 px-4 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div className="font-semibold">溯观 GEO 中台</div>
            <button type="button" onClick={logout} className="border border-ink px-3 py-2 text-xs text-ink">
              退出登录
            </button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 border border-line px-3 py-2 text-xs text-ink/72"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
