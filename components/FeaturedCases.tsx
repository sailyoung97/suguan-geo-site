"use client";

import Link from "next/link";
import { CaseImage } from "@/components/CaseImage";
import { useCaseCms } from "@/src/hooks/useCaseCms";

const homeFeaturedSlugs = ["baicaohuxiang", "xiaosangtian", "kaibu-heritage-park", "shancheng-baba"];

export function FeaturedCases() {
  const { publishedCases } = useCaseCms();
  const visibleCases = homeFeaturedSlugs.flatMap((slug) => {
    const item = publishedCases.find((caseItem) => caseItem.slug === slug);
    return item ? [item] : [];
  });

  if (visibleCases.length === 0) {
    return (
      <div className="border border-paper/14 bg-paper/5 px-6 py-14 text-center">
        <p className="font-serif text-2xl font-semibold text-paper">精选案例正在整理中</p>
        <Link href="/cases" className="mt-6 inline-flex min-h-11 items-center border border-paper/35 px-5 text-sm text-paper transition hover:border-paper hover:bg-paper hover:text-ink">
          查看项目案例
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-px overflow-hidden border border-paper/14 bg-paper/14 md:grid-cols-2 xl:grid-cols-4">
      {visibleCases.map((item) => (
        <Link key={item.slug} href={`/cases/${item.slug}`} className="group bg-ink transition hover:bg-paper/8">
          <CaseImage
            src={item.coverImage}
            className="aspect-[4/3] border-b border-paper/14 bg-paper/8"
            fallbackLabel={item.projectName}
            alt={`${item.projectName}精选案例封面图`}
          />
          <div className="p-5">
            <div className="text-xs text-paper/48">{item.location} / {item.year}</div>
            <h3 className="mt-4 min-h-20 text-lg font-semibold leading-7 transition group-hover:text-clay">{item.projectName}</h3>
            <p className="mt-5 line-clamp-4 text-sm leading-6 text-paper/62">{item.summary}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
