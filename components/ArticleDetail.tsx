"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CaseImage } from "@/components/CaseImage";
import { MarkdownArticleContent } from "@/components/MarkdownArticleContent";
import { extractMarkdownImages, getArticleMarkdown } from "@/src/lib/articleMarkdown";
import {
  GeoContentTopic,
  getDefaultContentTopics,
  getPublishedContentTopics,
  readRemoteContentTopics,
  readStoredContentTopics
} from "@/src/lib/contentTopics";

type LightboxImage = {
  src: string;
  caption: string;
};

export function ArticleDetail({ slug }: { slug: string }) {
  const [articles, setArticles] = useState<GeoContentTopic[]>(() =>
    getPublishedContentTopics(getDefaultContentTopics())
  );
  const [isResolved, setIsResolved] = useState(false);
  const [lightbox, setLightbox] = useState<{ images: LightboxImage[]; index: number } | null>(null);

  useEffect(() => {
    setArticles(getPublishedContentTopics(readStoredContentTopics()));
    readRemoteContentTopics()
      .then((remoteArticles) => setArticles(getPublishedContentTopics(remoteArticles)))
      .catch(() => undefined)
      .finally(() => setIsResolved(true));
  }, []);

  const article = useMemo(() => articles.find((item) => item.slug === slug), [articles, slug]);

  useEffect(() => {
    if (!lightbox) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft") {
        setLightbox((current) => current
          ? { ...current, index: current.index === 0 ? current.images.length - 1 : current.index - 1 }
          : current);
      }
      if (event.key === "ArrowRight") {
        setLightbox((current) => current
          ? { ...current, index: current.index === current.images.length - 1 ? 0 : current.index + 1 }
          : current);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  if (!article && !isResolved) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="h-44 animate-pulse border border-line bg-rice" />
      </section>
    );
  }

  if (!article) {
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

  const articleTitle = article.title || "未命名文章";
  const articleContent = getArticleMarkdown(article.content, article.blocks);
  const relatedCases = splitList(article.relatedCases || article.relatedCase || "");
  const keywords = splitList(article.coreKeywords || "");
  const references = (article.references || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const contentImages = extractMarkdownImages(articleContent);
  const coverImage = article.coverImage ? [{ src: article.coverImage, caption: article.coverImageCaption || "文章主图" }] : [];
  const allImages = [...coverImage, ...contentImages];
  const activeImage = lightbox ? lightbox.images[lightbox.index] : null;

  function openLightbox(images: LightboxImage[], index: number) {
    if (!images.length) return;
    setLightbox({ images, index });
  }

  function showPreviousImage() {
    setLightbox((current) => {
      if (!current) return current;
      return { ...current, index: current.index === 0 ? current.images.length - 1 : current.index - 1 };
    });
  }

  function showNextImage() {
    setLightbox((current) => {
      if (!current) return current;
      return { ...current, index: current.index === current.images.length - 1 ? 0 : current.index + 1 };
    });
  }

  return (
    <article>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 text-xs font-medium text-clay">
            <span>观点文章</span>
            <span>/</span>
            <span>{article.category || "观点文章"}</span>
          </div>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">{articleTitle}</h1>
          {article.subtitle ? <p className="mt-5 max-w-3xl text-xl leading-8 text-ink/72">{article.subtitle}</p> : null}
          <div className="mt-6 text-sm text-ink/50">{article.plannedDate || "发布时间待定"}</div>
          {article.summary ? <p className="mt-8 max-w-3xl border-l-2 border-clay pl-5 text-lg leading-8 text-ink/68">{article.summary}</p> : null}
          {article.coverImage ? (
            <button type="button" onClick={() => openLightbox(allImages, 0)} className="mt-10 block w-full text-left">
              <CaseImage
                src={article.coverImage}
                className="aspect-[16/9] w-full overflow-hidden border border-line bg-rice"
                fallbackLabel={article.coverImageCaption || "文章主图"}
                alt={article.coverImageAlt || article.coverImageCaption || articleTitle}
              />
              <p className="mt-3 text-center text-sm text-ink/46">{article.coverImageCaption || "项目实景图"}</p>
            </button>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,840px)_18rem] lg:px-8">
        <div className="min-w-0">
          <div className="max-w-[840px]">
            <MarkdownArticleContent content={articleContent} articleTitle={articleTitle} onOpenImage={openLightbox} />
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
      {activeImage && lightbox ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 py-6 backdrop-blur-md">
          <button type="button" className="absolute inset-0 cursor-default" onClick={() => setLightbox(null)} aria-label="关闭图片" />
          <div className="relative z-10 w-full max-w-6xl">
            <div className="mb-4 flex items-center justify-between gap-4 text-paper">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-paper/50">Image</p>
                <p className="mt-1 text-sm">{activeImage.caption || "项目实景图"}</p>
              </div>
              <button type="button" onClick={() => setLightbox(null)} className="border border-paper/30 px-4 py-2 text-sm text-paper transition hover:bg-paper hover:text-ink">
                关闭
              </button>
            </div>
            <div className="relative border border-paper/20 bg-ink">
              <CaseImage src={activeImage.src} className="max-h-[85vh] w-full bg-ink" imageClassName="max-h-[85vh] object-contain" fallbackLabel={activeImage.caption || "文章图片"} alt={activeImage.caption || articleTitle} />
              {lightbox.images.length > 1 ? (
                <>
                  <button type="button" onClick={showPreviousImage} className="absolute left-3 top-1/2 -translate-y-1/2 border border-paper/30 bg-ink/50 px-4 py-3 text-paper transition hover:bg-paper hover:text-ink">
                    上一张
                  </button>
                  <button type="button" onClick={showNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 border border-paper/30 bg-ink/50 px-4 py-3 text-paper transition hover:bg-paper hover:text-ink">
                    下一张
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </article>
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

function splitList(value?: string | null) {
  if (typeof value !== "string") return [];
  return value
    .split(/[,，、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
