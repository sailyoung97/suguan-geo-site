"use client";

import Link from "next/link";
import { CaseImage } from "@/components/CaseImage";
import { useCaseCms } from "@/src/hooks/useCaseCms";

export function CasesList() {
  const { publishedCases } = useCaseCms();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {publishedCases.map((item, index) => (
        <Link
          key={item.slug}
          href={`/cases/${item.slug}`}
          className="group border border-line bg-paper shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft"
        >
          <CaseImage
            src={item.coverImage}
            className="aspect-[16/10]"
            fallbackLabel={`Case Image ${String(index + 1).padStart(2, "0")}`}
            alt={`${item.projectName}案例封面图`}
          />
          <div className="flex min-h-[390px] flex-col p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-moss">
              <span>{item.location}</span>
              <span className="h-px w-8 bg-line" />
              <span>{item.projectType}</span>
              <span className="h-px w-8 bg-line" />
              <span>{item.status}</span>
            </div>

            <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight text-ink">{item.projectName}</h2>
            <p className="mt-5 text-sm leading-7 text-ink/66">{item.summary}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="border border-line bg-rice px-3 py-1.5 text-xs text-ink/62">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
              <div>
                <div className="text-xs text-ink/44">核心策略</div>
                <p className="mt-2 text-sm leading-6 text-ink/70">{item.strategy[0] || "待补充"}</p>
              </div>
              <div>
                <div className="text-xs text-ink/44">适合参考</div>
                <p className="mt-2 text-sm leading-6 text-ink/70">{item.suitableClients[0] || "待补充"}</p>
              </div>
            </div>

            <div className="mt-auto flex items-end justify-between gap-5 pt-8">
              <span className="font-serif text-5xl text-ink/10">{String(index + 1).padStart(2, "0")}</span>
              <span className="border border-ink px-5 py-3 text-sm font-medium text-ink transition group-hover:bg-ink group-hover:text-paper">
                查看详情
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
