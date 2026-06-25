"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CaseImage } from "@/components/CaseImage";
import { GeoContentTopic, getPublishedContentTopics, readStoredContentTopics } from "@/src/lib/contentTopics";

export function ArticlesList() {
  const [articles, setArticles] = useState<GeoContentTopic[]>([]);

  useEffect(() => {
    setArticles(getPublishedContentTopics(readStoredContentTopics()));
  }, []);

  return (
    <div className="mt-10 divide-y divide-line border-y border-line">
      {articles.map((article) => (
        <article key={article.id} className="grid gap-4 py-7 md:grid-cols-[1fr_10rem]">
          <div>
            <div className="flex flex-wrap gap-2 text-xs text-moss">
              <span>{article.category}</span>
              <span>/</span>
              <span>{article.coreKeywords || article.geoIntent}</span>
            </div>
            <Link href={`/articles/${article.slug}`} className="group mt-3 block">
              <h2 className="text-2xl font-semibold text-ink transition group-hover:text-clay">{article.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60">{article.summary || "文章内容正在整理中。"}</p>
              {article.coverImage ? (
                <div className="mt-5">
                  <CaseImage
                    src={article.coverImage}
                    className="aspect-[16/9] w-full max-w-3xl overflow-hidden border border-line bg-rice"
                    fallbackLabel={article.coverImageCaption || "文章主图"}
                    alt={article.coverImageAlt || article.coverImageCaption || article.title}
                  />
                  <p className="mt-2 text-xs text-ink/46">{article.coverImageCaption || "项目实景图"}</p>
                </div>
              ) : null}
            </Link>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink/48">
              <span>{article.publishChannel}</span>
              {article.relatedCases ? <span>关联案例：{article.relatedCases}</span> : null}
            </div>
          </div>
          <div className="text-sm text-ink/56 md:text-right">
            <div>{article.status}</div>
            <div className="mt-2">{article.plannedDate || "待发布"}</div>
          </div>
        </article>
      ))}
    </div>
  );
}
