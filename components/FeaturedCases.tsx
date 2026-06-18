"use client";

import Link from "next/link";
import { CaseImage } from "@/components/CaseImage";
import { useCaseCms } from "@/src/hooks/useCaseCms";

export function FeaturedCases() {
  const { featuredCases } = useCaseCms();
  const visibleCases = featuredCases.length ? featuredCases.slice(0, 4) : [];

  return (
    <div className="grid gap-px overflow-hidden border border-paper/14 bg-paper/14 md:grid-cols-2 xl:grid-cols-4">
      {visibleCases.map((item) => (
        <Link key={item.slug} href={`/cases/${item.slug}`} className="group bg-ink transition hover:bg-paper/8">
          <CaseImage
            src={item.coverImage}
            className="aspect-[4/3] border-b border-paper/14 bg-paper/8"
            fallbackLabel={item.projectName}
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
