import type { Metadata } from "next";
import "./globals.css";
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
      <body className="grain overflow-x-hidden">{children}</body>
    </html>
  );
}
