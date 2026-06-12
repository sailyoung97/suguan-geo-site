import { SiteHeader } from "@/components/SiteHeader";
import { articles } from "@/data/mock";

export default function InsightsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-clay">INSIGHTS</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold text-ink">观点文章</h1>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {articles.map((article) => (
            <article key={article.id} className="grid gap-4 py-6 md:grid-cols-[1fr_9rem]">
              <div>
                <div className="text-xs text-moss">{article.column} · {article.keyword}</div>
                <h2 className="mt-3 text-2xl font-semibold">{article.title}</h2>
              </div>
              <div className="text-sm text-ink/56 md:text-right">{article.status}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
