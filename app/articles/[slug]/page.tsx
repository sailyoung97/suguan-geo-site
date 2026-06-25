import type { Metadata } from "next";
import { ArticleDetail } from "@/components/ArticleDetail";
import { SiteHeader } from "@/components/SiteHeader";
import { getDefaultContentTopics } from "@/src/lib/contentTopics";

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
    openGraph: {
      title,
      description,
      images: article?.coverImage ? [article.coverImage] : undefined,
      type: "article"
    }
  };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  return (
    <main>
      <SiteHeader />
      <ArticleDetail slug={params.slug} />
    </main>
  );
}
