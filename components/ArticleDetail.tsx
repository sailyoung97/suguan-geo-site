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

  const relatedCases = splitList(article.relatedCases || article.relatedCase);
  const keywords = splitList(article.coreKeywords);
  const references = article.references
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <article>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 text-xs font-medium text-clay">
            <span>观点文章</span>
            <span>/</span>
            <span>{article.category}</span>
          </div>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">{article.title}</h1>
          {article.subtitle ? <p className="mt-5 max-w-3xl text-xl leading-8 text-ink/72">{article.subtitle}</p> : null}
          <div className="mt-6 text-sm text-ink/50">{article.plannedDate || "发布时间待定"}</div>
          {article.summary ? <p className="mt-8 max-w-3xl border-l-2 border-clay pl-5 text-lg leading-8 text-ink/68">{article.summary}</p> : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,840px)_18rem] lg:px-8">
        <div className="min-w-0">
          <div className="max-w-[840px]">
            <StructuredContent content={article.content} />
            <ReferencesList references={references} />
            <div className="mt-12 border-t border-line pt-8">
              <p className="max-w-2xl text-sm leading-7 text-ink/62">
                如果项目正处在前期研判、存量资产盘活、空间更新或运营转型阶段，欢迎与溯观进一步沟通。
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/articles" className="border border-ink px-5 py-3 text-center text-sm font-medium text-ink transition hover:bg-ink hover:text-paper">
                  返回观点文章
                </Link>
                <Link href="/contact#project-consultation" className="bg-ink px-5 py-3 text-center text-sm font-medium text-paper transition hover:bg-moss">
                  项目咨询
                </Link>
              </div>
            </div>
          </div>
        </div>

        <aside className="grid content-start gap-6 lg:sticky lg:top-24">
          <InfoBlock title="核心关键词" items={keywords} emptyText="暂未填写" />
          <InfoBlock title="关联案例" items={relatedCases} emptyText="暂未关联" />
        </aside>
      </section>
    </article>
  );
}

function StructuredContent({ content }: { content: string }) {
  const blocks = content
    .trim()
    .split(/\n{2,}|\r\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return <div className="border border-line bg-rice p-8 text-sm text-ink/62">文章内容正在整理中。</div>;
  }

  return (
    <div className="space-y-8 text-[17px] leading-[2] text-ink/76">
      {blocks.map((block, index) => {
        if (isHeading(block)) {
          return (
            <h2 key={`${block}-${index}`} className="pt-5 font-serif text-2xl font-semibold leading-snug text-ink">
              {stripHeadingMarker(block)}
            </h2>
          );
        }

        if (block.startsWith("> ")) {
          return (
            <blockquote key={`${block}-${index}`} className="border-l-2 border-ink/30 bg-rice px-5 py-5 text-lg leading-8 text-ink/72">
              {block.replace(/^>\s*/, "")}
            </blockquote>
          );
        }

        if (block.startsWith("数据参考：") || block.startsWith("数据：")) {
          return (
            <div key={`${block}-${index}`} className="border border-line bg-paper p-5">
              <p className="text-xs font-medium text-clay">数据参考</p>
              <p className="mt-3 text-base leading-8 text-ink/70">{block.replace(/^数据参考：|^数据：/, "")}</p>
            </div>
          );
        }

        if (block.startsWith("重点：")) {
          return (
            <div key={`${block}-${index}`} className="border-l-2 border-clay bg-rice px-5 py-5 text-lg leading-8 text-ink/76">
              {block.replace(/^重点：/, "")}
            </div>
          );
        }

        return (
          <p key={`${block}-${index}`} className="text-[17px] leading-[2] text-ink/76">
            {block}
          </p>
        );
      })}
    </div>
  );
}

function ReferencesList({ references }: { references: string[] }) {
  if (references.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-line pt-8">
      <h2 className="text-sm font-semibold text-ink">参考资料</h2>
      <ol className="mt-4 grid gap-2 text-sm leading-7 text-ink/54">
        {references.map((reference, index) => (
          <li key={`${reference}-${index}`}>
            {index + 1}. {reference.replace(/^\d+[.、]\s*/, "")}
          </li>
        ))}
      </ol>
    </section>
  );
}

function InfoBlock({ title, items, emptyText }: { title: string; items: string[]; emptyText: string }) {
  return (
    <div className="border border-line bg-paper p-5">
      <p className="text-xs font-medium text-clay">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(items.length > 0 ? items : [emptyText]).map((item) => (
          <span key={item} className="border border-line bg-rice px-3 py-1 text-xs text-ink/62">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function isHeading(value: string) {
  return /^##\s+/.test(value) || /^[一二三四五六七八九十]+、/.test(value);
}

function stripHeadingMarker(value: string) {
  return value.replace(/^##\s+/, "");
}

function splitList(value: string) {
  return value
    .split(/[,，、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
