import type { Metadata } from "next";
import { CaseDetailTemplate } from "@/components/CaseDetailTemplate";
import { SiteHeader } from "@/components/SiteHeader";
import { defaultCaseCmsItems } from "@/src/config/caseCms";

type CaseDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: CaseDetailPageProps): Metadata {
  const item = defaultCaseCmsItems.find((caseItem) => caseItem.slug === params.slug);
  const title = item
    ? `${item.projectName}｜${item.projectType}案例｜溯观文化`
    : `${params.slug}｜溯观项目案例`;
  const description = item?.summary || "溯观项目案例详情，包含项目地点、项目类型、策略方法、项目结果与关键词。";
  const image = item?.coverImage || item?.guideMapImage || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
      type: "article"
    }
  };
}

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  return (
    <main>
      <SiteHeader />
      <CaseDetailTemplate slug={params.slug} />
    </main>
  );
}
