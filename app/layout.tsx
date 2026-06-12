import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "溯观｜文化创意运营与在地项目策划",
  description: "溯观深耕西南地区城市更新、乡村振兴、农文旅融合、品牌文创与项目运营服务。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="grain">{children}</body>
    </html>
  );
}
