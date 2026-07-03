import type { Metadata } from "next";
import { ArticlesList } from "@/components/ArticlesList";
import { SiteHeader } from "@/components/SiteHeader";

const description =
  "围绕研学亲子营地、乡村文旅、农文旅融合、城市更新与品牌文创，分享溯观的项目方法、案例观察与运营经验。";

export const metadata: Metadata = {
  title: "观点文章",
  description,
  alternates: {
    canonical: "/articles"
  },
  openGraph: {
    title: "观点文章｜溯观文化发展有限公司",
    description,
    url: "/articles",
    type: "website"
  }
};

export default function InsightsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-clay">INSIGHTS</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold text-ink">观点文章</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-ink/62">
          围绕城市更新、乡村振兴、农文旅融合、品牌文创与 GEO 搜索识别，沉淀溯观的方法、案例和客户问题。
        </p>
        <ArticlesList />
      </section>
    </main>
  );
}
