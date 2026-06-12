import Link from "next/link";
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

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        isDark ? "border-paper/16 bg-ink text-paper" : "border-line/70 bg-paper text-ink"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="溯观首页">
          <SiteAssetImage
            asset={siteAssets.logo}
            className={`h-9 w-9 border ${isDark ? "border-paper/35 bg-paper/10" : "border-ink bg-ink"}`}
            fallbackLabel="观"
            variant="mark"
          />
          <span>
            <span className={`block text-base font-semibold tracking-[0.18em] ${isDark ? "text-paper" : "text-ink"}`}>
              溯观
            </span>
            <span className={`block text-[11px] uppercase tracking-[0.22em] ${isDark ? "text-paper/48" : "text-moss"}`}>
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
        <Link
          href="/contact#project-consultation"
          className={`shrink-0 border px-4 py-2 text-sm font-medium transition ${
            isDark
              ? "border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink"
              : "border-ink text-ink hover:bg-ink hover:text-paper"
          }`}
        >
          项目咨询
        </Link>
      </div>
      <nav className={`mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 text-sm sm:px-6 md:hidden ${isDark ? "text-paper/70" : "text-ink/72"}`}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 border px-3 py-2 transition ${
              isDark
                ? "border-paper/18 bg-paper/5 hover:border-paper hover:text-paper"
                : "border-line bg-paper hover:border-ink hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
