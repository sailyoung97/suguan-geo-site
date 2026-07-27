"use client";

import Link from "next/link";
import { CaseImage } from "@/components/CaseImage";
import { useCaseCms } from "@/src/hooks/useCaseCms";

export function CasesList() {
  const { publishedCases } = useCaseCms();

  if (publishedCases.length === 0) {
    return (
      <div className="border border-line bg-paper px-6 py-16 text-center">
        <p className="font-serif text-3xl font-semibold text-ink">案例内容正在整理中</p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink/56">
          当前没有已发布案例，您可以先查看服务内容，或提交项目需求与我们沟通。
        </p>
        <Link href="/contact#project-consultation" className="mt-7 inline-flex min-h-11 items-center bg-ink px-5 text-sm font-medium text-paper transition hover:bg-moss">
          提交项目咨询
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {publishedCases.map((item, index) => (
        <Link
          key={item.slug}
          href={`/cases/${item.slug}`}
          className="group min-w-0 overflow-hidden border border-line bg-paper shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft"
        >
          <CaseImage
            src={item.coverImage}
            className="aspect-[16/10]"
            fallbackLabel={`Case Image ${String(index + 1).padStart(2, "0")}`}
            alt={`${item.projectName}案例封面图`}
          />
          <div className="flex min-h-[330px] min-w-0 flex-col p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2 text-xs text-moss">
              <span>{item.location}</span>
              <span className="h-px w-8 bg-line" />
              <span>{item.projectType}</span>
              <span className="h-px w-8 bg-line" />
              <span>{item.status}</span>
            </div>

            <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight text-ink">{item.projectName}</h2>
            <p className="mt-4 line-clamp-3 text-sm leading-7 text-ink/66">{item.summary}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="border border-line bg-rice px-3 py-1.5 text-xs text-ink/62">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-auto flex items-end justify-between gap-5 border-t border-line pt-6">
              <span className="font-serif text-4xl text-ink/10">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-h-11 border border-ink px-5 py-3 text-sm font-medium text-ink transition group-hover:bg-ink group-hover:text-paper">
                查看详情
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
