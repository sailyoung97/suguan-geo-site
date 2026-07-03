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

  return (
    <div className="mt-10 divide-y divide-line border-y border-line">
      {articles.map((article) => (
        <article key={article.id} className="grid gap-4 py-7 md:grid-cols-[1fr_10rem]">
          <div>
            <div className="flex flex-wrap gap-2 text-xs text-moss">
              <span>{article.category}</span>
              {article.coreKeywords ? (
                <>
                  <span>/</span>
                  <span>{article.coreKeywords}</span>
                </>
              ) : null}
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
            {article.relatedCases ? <div className="mt-4 text-xs text-ink/48">关联案例：{article.relatedCases}</div> : null}
          </div>
          <div className="text-sm text-ink/56 md:text-right">
            <div>{article.plannedDate || "发布时间待定"}</div>
          </div>
        </article>
      ))}
    </div>
  );
}
