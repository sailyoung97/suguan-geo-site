"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteAssetImage } from "@/components/SiteAssetImage";
import { siteAssets } from "@/src/config/siteAssets";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于溯观" },
  { href: "/services", label: "服务内容" },
  { href: "/cases", label: "项目案例" },
  { href: "/articles", label: "观点文章" },
  { href: "/contact", label: "联系我们" }
];

type SiteHeaderProps = {
  variant?: "light" | "dark";
};

export function SiteHeader({ variant = "dark" }: SiteHeaderProps) {
  const isDark = variant === "dark";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        isDark ? "border-paper/16 bg-ink text-paper" : "border-line/70 bg-paper text-ink"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="溯观首页">
          <SiteAssetImage
            asset={siteAssets.logo}
            className={`h-9 w-9 shrink-0 border ${isDark ? "border-paper/35 bg-paper/10" : "border-ink bg-ink"}`}
            fallbackLabel="观"
            variant="mark"
            priority
          />
          <span className="min-w-0 max-[390px]:hidden">
            <span className={`block text-base font-semibold tracking-[0.18em] ${isDark ? "text-paper" : "text-ink"}`}>
              溯观
            </span>
            <span className={`block text-[10px] uppercase tracking-[0.18em] sm:text-[11px] sm:tracking-[0.22em] ${isDark ? "text-paper/48" : "text-moss"}`}>
              Culture Operation
            </span>
          </span>
        </Link>

        <nav aria-label="主导航" className={`hidden items-center gap-7 text-sm md:flex ${isDark ? "text-paper/68" : "text-ink/74"}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative py-2 transition after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:transition-transform ${
                isActive(item.href) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
              } ${isDark ? "hover:text-paper after:bg-paper" : "hover:text-ink after:bg-ink"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/contact#project-consultation"
            className={`min-h-9 shrink-0 border px-2.5 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
              isDark
                ? "border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink"
                : "border-ink text-ink hover:bg-ink hover:text-paper"
            }`}
          >
            <span className="hidden min-[420px]:inline">项目咨询</span>
            <span className="min-[420px]:hidden">咨询</span>
          </Link>
          <button
            type="button"
            className={`inline-flex h-9 w-9 items-center justify-center border text-lg leading-none md:hidden ${
              isDark ? "border-paper/28 text-paper" : "border-line text-ink"
            }`}
            aria-label={isMenuOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="移动端主导航"
          className={`mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 pb-4 text-sm sm:px-6 md:hidden ${isDark ? "text-paper/70" : "text-ink/72"}`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              onClick={() => setIsMenuOpen(false)}
              className={`min-h-11 border px-3 py-3 transition ${
                isDark
                  ? "border-paper/18 bg-paper/5 hover:border-paper hover:text-paper"
                  : "border-line bg-paper hover:border-ink hover:text-ink"
              } ${isActive(item.href) ? (isDark ? "border-paper text-paper" : "border-ink text-ink") : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
