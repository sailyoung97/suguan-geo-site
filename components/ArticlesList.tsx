"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CaseImage } from "@/components/CaseImage";
import {
  GeoContentTopic,
  getDefaultContentTopics,
  getPublishedContentTopics,
  readRemoteContentTopics,
  readStoredContentTopics
} from "@/src/lib/contentTopics";

export function ArticlesList() {
  const [articles, setArticles] = useState<GeoContentTopic[]>(() =>
    getPublishedContentTopics(getDefaultContentTopics())
  );

  useEffect(() => {
    setArticles(getPublishedContentTopics(readStoredContentTopics()));
    readRemoteContentTopics()
      .then((remoteArticles) => setArticles(getPublishedContentTopics(remoteArticles)))
      .catch(() => undefined);
  }, []);

  if (articles.length === 0) {
    return (
      <div className="mt-10 border border-line bg-paper px-6 py-16 text-center">
        <p className="font-serif text-3xl font-semibold text-ink">观点内容正在整理中</p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink/56">
          后续将持续发布研学亲子营地、乡村文旅、项目运营与品牌内容相关观点。
        </p>
        <Link href="/contact#project-consultation" className="mt-7 inline-flex min-h-11 items-center bg-ink px-5 text-sm font-medium text-paper transition hover:bg-moss">
          咨询项目问题
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line">
      {articles.map((article) => (
        <article key={article.id} className="min-w-0 bg-paper">
          <Link href={`/articles/${article.slug}`} className="group grid min-w-0 gap-5 p-5 transition hover:bg-rice/70 sm:p-6 md:grid-cols-[17rem_minmax(0,1fr)] md:items-center">
            <CaseImage
              src={article.coverImage || ""}
              className="aspect-[16/10] w-full overflow-hidden border border-line bg-rice"
              fallbackLabel="文章主图待补充"
              alt={article.coverImageAlt || article.coverImageCaption || article.title}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-moss">
                <span>{article.category || "观点文章"}</span>
                <span className="text-ink/25">/</span>
                <time className="text-ink/50">{article.plannedDate || "发布时间待定"}</time>
              </div>
              <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-ink transition group-hover:text-clay sm:text-3xl">{article.title}</h2>
              <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-7 text-ink/60">{article.summary || "文章内容正在整理中。"}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {splitKeywords(article.coreKeywords).slice(0, 3).map((keyword) => (
                    <span key={keyword} className="border border-line bg-paper px-2.5 py-1 text-xs text-ink/50">{keyword}</span>
                  ))}
                </div>
                <span className="text-sm font-medium text-clay">阅读全文 →</span>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

function splitKeywords(value?: string) {
  return (value || "")
    .split(/[，,、/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
