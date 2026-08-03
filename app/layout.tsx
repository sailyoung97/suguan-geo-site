import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { siteDescription, siteName, siteUrl } from "@/src/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "溯观文化发展有限公司｜研学亲子营地、乡村文旅与在地项目策划运营",
    template: `%s｜${siteName}`
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: ["研学亲子营地", "乡村文旅", "农文旅融合", "亲子农场", "营地建设", "自然教育", "乡村运营", "文旅策划设计运营"],
  verification: {
    other: {
      "baidu-site-verification": "codeva-SMiXaUr3PP",
      "360-site-verification": "6d3d56c88ca4d6f8df05d09ef1b0a8ed",
      "msvalidate.01": "0638C467888EF2C5CB3D48BE54D402FE"
    }
  },
  openGraph: {
    title: "溯观文化发展有限公司｜研学亲子营地、乡村文旅与在地项目策划运营",
    description: siteDescription,
    url: "/",
    siteName,
    type: "website",
    locale: "zh_CN",
    images: [{ url: "/uploads/home-hero.png", alt: "溯观文化发展有限公司" }]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="grain overflow-x-hidden">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 bg-paper px-4 py-3 text-sm font-medium text-ink shadow-soft transition focus:translate-y-0"
        >
          跳到主要内容
        </a>
        <div id="main-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
