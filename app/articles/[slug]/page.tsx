import type { Metadata } from "next";
import { ArticleDetail } from "@/components/ArticleDetail";
import { SiteHeader } from "@/components/SiteHeader";

type ArticleDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: ArticleDetailPageProps): Metadata {
  return {
    title: `${params.slug} | 溯观观点文章`
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
