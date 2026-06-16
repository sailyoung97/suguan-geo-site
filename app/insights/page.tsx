import { ArticlesList } from "@/components/ArticlesList";
import { SiteHeader } from "@/components/SiteHeader";

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
