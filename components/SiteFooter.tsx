"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { contactInfo } from "@/src/data/contact";

const footerLinks = [
  { href: "/about", label: "关于溯观" },
  { href: "/services", label: "服务内容" },
  { href: "/cases", label: "项目案例" },
  { href: "/articles", label: "观点文章" },
  { href: "/contact", label: "联系我们" }
];

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-9 border-b border-paper/12 pb-9 md:grid-cols-[1.1fr_0.8fr_1.1fr] md:gap-10">
          <div>
            <Link href="/" className="inline-flex items-baseline gap-3" aria-label="返回溯观首页">
              <span className="font-serif text-2xl font-semibold">溯观</span>
              <span className="text-[10px] uppercase tracking-[0.24em] text-paper/48">Culture Operation</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-paper/58">
              研学亲子营地、乡村文旅与在地项目的策划、设计、建设及持续运营服务。
            </p>
          </div>

          <nav aria-label="页脚导航">
            <p className="text-xs uppercase tracking-[0.2em] text-clay">Navigation</p>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-paper/68">
              {footerLinks.map((item) => (
                <Link key={item.href} href={item.href} className="w-fit transition hover:text-paper">
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-clay">Contact</p>
            <div className="mt-4 grid gap-2 text-sm leading-6 text-paper/68">
              <a href={`tel:${contactInfo.businessPhone}`} className="w-fit transition hover:text-paper">
                商务电话：{contactInfo.businessPhone}
              </a>
              <a href={`tel:${contactInfo.projectPhone}`} className="w-fit transition hover:text-paper">
                项目咨询：{contactInfo.projectPhone}
              </a>
              <p className="max-w-md">地址：{contactInfo.address}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs leading-6 text-paper/46 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 溯观文化发展有限公司</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={contactInfo.icpUrl}
              target="_blank"
              rel="noreferrer"
              className="w-fit transition hover:text-paper"
            >
              {contactInfo.icpNumber}
            </a>
            <Link href="/login" className="transition hover:text-paper">
              内部入口
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
