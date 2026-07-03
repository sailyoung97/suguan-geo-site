"use client";

import { usePathname } from "next/navigation";
import { contactInfo } from "@/src/data/contact";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs leading-6 text-paper/58 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>溯观文化发展有限公司</p>
        <a
          href={contactInfo.icpUrl}
          target="_blank"
          rel="noreferrer"
          className="w-fit transition hover:text-paper"
        >
          {contactInfo.icpNumber}
        </a>
      </div>
    </footer>
  );
}
