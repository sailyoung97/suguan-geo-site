import { CaseDetailTemplate } from "@/components/CaseDetailTemplate";
import { SiteHeader } from "@/components/SiteHeader";

type CaseDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: CaseDetailPageProps) {
  return {
    title: `${params.slug} | 溯观项目案例`,
    description: "溯观项目案例详情"
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
