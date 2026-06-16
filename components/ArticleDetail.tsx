"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GeoContentTopic, getPublishedContentTopics, readStoredContentTopics } from "@/src/lib/contentTopics";

export function ArticleDetail({ slug }: { slug: string }) {
  const [articles, setArticles] = useState<GeoContentTopic[]>([]);

  useEffect(() => {
    setArticles(getPublishedContentTopics(readStoredContentTopics()));
  }, []);

  const article = useMemo(() => articles.find((item) => item.slug === slug), [articles, slug]);

  if (articles.length > 0 && !article) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-clay">ARTICLE NOT FOUND</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold text-ink">文章不存在</h1>
        <p className="mt-5 text-sm leading-7 text-ink/62">这篇文章可能还未发布，或路径已经调整。</p>
        <Link href="/articles" className="mt-8 inline-flex border border-ink px-5 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper">
          返回观点文章
        </Link>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="h-44 animate-pulse border border-line bg-rice" />
      </section>
    );
  }

  const content = article.content.trim();
  const paragraphs = content ? content.split(/\n{2,}|\r\n{2,}/).map((item) => item.trim()).filter(Boolean) : [];
  const relatedCases = splitList(article.relatedCases || article.relatedCase);
  const keywords = splitList(article.coreKeywords);

  return (
    <article>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 text-xs font-medium text-clay">
            <span>{article.category}</span>
            <span>/</span>
            <span>{article.publishChannel}</span>
          </div>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">{article.title}</h1>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-ink/56">
            <span>{article.plannedDate || "发布时间待定"}</span>
            <span>负责人：{article.owner}</span>
            <span>GEO 意图：{article.geoIntent}</span>
          </div>
          {article.summary ? <p className="mt-8 max-w-3xl text-lg leading-8 text-ink/68">{article.summary}</p> : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_18rem] lg:px-8">
        <div className="min-w-0">
          {paragraphs.length > 0 ? (
            <div className="space-y-6 text-base leading-8 text-ink/76">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <div className="border border-line bg-rice p-8 text-sm text-ink/62">文章内容正在整理中。</div>
          )}

          {article.targetSearchQuestion ? (
            <div className="mt-10 border-l-2 border-clay bg-rice p-5">
              <p className="text-xs font-medium text-clay">TARGET SEARCH QUESTION</p>
              <p className="mt-2 text-sm leading-7 text-ink/70">{article.targetSearchQuestion}</p>
            </div>
          ) : null}

          <div className="mt-12 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row">
            <Link href="/articles" className="border border-ink px-5 py-3 text-center text-sm font-medium text-ink transition hover:bg-ink hover:text-paper">
              返回观点文章
            </Link>
            <Link href="/contact#project-consultation" className="bg-ink px-5 py-3 text-center text-sm font-medium text-paper transition hover:bg-moss">
              项目咨询
            </Link>
          </div>
        </div>

        <aside className="grid content-start gap-6">
          <InfoBlock title="核心关键词" items={keywords.length > 0 ? keywords : [article.geoIntent]} />
          <InfoBlock title="关联案例" items={relatedCases.length > 0 ? relatedCases : ["暂未关联"]} />
          <div className="border border-line bg-paper p-5">
            <p className="text-xs font-medium text-clay">GEO TRACKING</p>
            <div className="mt-4 grid gap-3 text-sm text-ink/62">
              <div>AI 识别溯观：{article.aiRecognized ? "是" : "否"}</div>
              <div>AI 引用内容：{article.aiCited ? "是" : "否"}</div>
              <div>带来线索：{article.leads}</div>
            </div>
          </div>
        </aside>
      </section>
    </article>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-line bg-paper p-5">
      <p className="text-xs font-medium text-clay">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="border border-line bg-rice px-3 py-1 text-xs text-ink/62">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function splitList(value: string) {
  return value
    .split(/[,，、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
