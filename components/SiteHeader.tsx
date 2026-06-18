"use client";

import Link from "next/link";
import { useState } from "react";
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

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        isDark ? "border-paper/16 bg-ink text-paper" : "border-line/70 bg-paper text-ink"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="溯观首页">
          <SiteAssetImage
            asset={siteAssets.logo}
            className={`h-9 w-9 shrink-0 border ${isDark ? "border-paper/35 bg-paper/10" : "border-ink bg-ink"}`}
            fallbackLabel="观"
            variant="mark"
          />
          <span className="min-w-0">
            <span className={`block text-base font-semibold tracking-[0.18em] ${isDark ? "text-paper" : "text-ink"}`}>
              溯观
            </span>
            <span className={`block text-[10px] uppercase tracking-[0.18em] sm:text-[11px] sm:tracking-[0.22em] ${isDark ? "text-paper/48" : "text-moss"}`}>
              Culture Operation
            </span>
          </span>
        </Link>

        <nav className={`hidden items-center gap-7 text-sm md:flex ${isDark ? "text-paper/68" : "text-ink/74"}`}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`transition ${isDark ? "hover:text-paper" : "hover:text-ink"}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/contact#project-consultation"
            className={`shrink-0 border px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
              isDark
                ? "border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink"
                : "border-ink text-ink hover:bg-ink hover:text-paper"
            }`}
          >
            项目咨询
          </Link>
          <button
            type="button"
            className={`inline-flex h-9 w-9 items-center justify-center border text-lg leading-none md:hidden ${
              isDark ? "border-paper/28 text-paper" : "border-line text-ink"
            }`}
            aria-label="打开导航菜单"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className={`mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 pb-4 text-sm sm:px-6 md:hidden ${isDark ? "text-paper/70" : "text-ink/72"}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`border px-3 py-2 transition ${
                isDark
                  ? "border-paper/18 bg-paper/5 hover:border-paper hover:text-paper"
                  : "border-line bg-paper hover:border-ink hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
