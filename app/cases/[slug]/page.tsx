import type { Metadata } from "next";
import { CaseDetailTemplate } from "@/components/CaseDetailTemplate";
import { SiteHeader } from "@/components/SiteHeader";
import { defaultCaseCmsItems } from "@/src/config/caseCms";
import { siteName } from "@/src/config/site";

type CaseDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: CaseDetailPageProps): Metadata {
  const item = defaultCaseCmsItems.find((caseItem) => caseItem.slug === params.slug);
  const title = item
    ? `${item.projectName}｜${item.projectType}案例`
    : `${params.slug}｜溯观项目案例`;
  const description = item?.summary || "溯观项目案例详情，包含项目地点、项目类型、策略方法、项目结果与关键词。";
  const image = item?.coverImage || item?.guideMapImage || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/cases/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `/cases/${params.slug}`,
      images: image ? [image] : undefined,
      type: "article",
      siteName
    }
  };
}

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  const item = defaultCaseCmsItems.find((caseItem) => caseItem.slug === params.slug);
  const structuredData = item
    ? {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: item.projectName,
        description: item.summary,
        image: [item.coverImage, item.guideMapImage, ...item.galleryImages.map((image) => image.url)].filter(Boolean),
        spatialCoverage: item.location,
        dateCreated: item.year,
        keywords: item.geoKeywords.join(","),
        publisher: {
          "@type": "Organization",
          name: siteName
        }
      }
    : null;

  return (
    <main>
      <SiteHeader />
      <CaseDetailTemplate slug={params.slug} />
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      ) : null}
    </main>
  );
}
