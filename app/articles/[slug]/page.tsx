import type { Metadata } from "next";
import { ArticleDetail } from "@/components/ArticleDetail";
import { SiteHeader } from "@/components/SiteHeader";
import { getDefaultContentTopics } from "@/src/lib/contentTopics";
import { siteName } from "@/src/config/site";

type ArticleDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: ArticleDetailPageProps): Metadata {
  const article = getDefaultContentTopics().find((item) => item.slug === params.slug);
  const title = article ? `${article.title}｜溯观观点` : `${params.slug}｜溯观观点文章`;
  const description = article?.summary || "溯观观点文章，围绕研学亲子营地、乡村文旅、农文旅融合、城市更新和 GEO 内容识别展开。";

  return {
    title,
    description,
    keywords: article?.coreKeywords || undefined,
    alternates: { canonical: `/articles/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `/articles/${params.slug}`,
      images: article?.coverImage ? [article.coverImage] : undefined,
      type: "article",
      siteName,
      publishedTime: article?.plannedDate || undefined,
      authors: article?.owner ? [article.owner] : undefined
    }
  };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const article = getDefaultContentTopics().find((item) => item.slug === params.slug);
  const structuredData = article
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.summary,
        image: article.coverImage || undefined,
        datePublished: article.plannedDate || undefined,
        dateModified: article.plannedDate || undefined,
        articleSection: article.category,
        keywords: article.coreKeywords,
        author: {
          "@type": "Organization",
          name: siteName
        },
        publisher: {
          "@type": "Organization",
          name: siteName
        }
      }
    : null;

  return (
    <main>
      <SiteHeader />
      <ArticleDetail slug={params.slug} />
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      ) : null}
    </main>
  );
}
