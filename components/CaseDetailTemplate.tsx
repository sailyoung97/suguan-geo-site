"use client";

import Link from "next/link";
import { CaseImage } from "@/components/CaseImage";
import { useCaseCms } from "@/src/hooks/useCaseCms";

type CaseDetailTemplateProps = {
  slug: string;
};

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-9">
      <h2 className="font-serif text-3xl font-semibold text-ink">{title}</h2>
      <div className="mt-5 text-base leading-8 text-ink/66">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) {
    return <p>待补充</p>;
  }

  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-3 h-px w-6 shrink-0 bg-clay" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TagList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  if (!items.length) {
    return <p>待补充</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={
            dark
              ? "bg-ink px-3 py-1.5 text-sm text-paper"
              : "border border-line bg-rice px-3 py-1.5 text-sm text-ink/66"
          }
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function CaseDetailTemplate({ slug }: CaseDetailTemplateProps) {
  const { cases, publishedCases } = useCaseCms();
  const item = cases.find((caseItem) => caseItem.slug === slug);

  if (!item || !item.isPublished) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-sm font-medium tracking-[0.24em] text-clay">CASE NOT FOUND</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold text-ink">案例未找到</h1>
        <p className="mt-5 max-w-xl text-sm leading-6 text-ink/62">
          该案例可能尚未发布，或已在后台案例管理中删除。
        </p>
        <Link
          href="/cases"
          className="mt-8 inline-block border border-ink px-5 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
        >
          返回项目案例
        </Link>
      </section>
    );
  }

  const metaItems = [
    ["项目名称", item.projectName],
    ["项目地点", item.location],
    ["项目类型", item.projectType],
    ["项目状态", item.status]
  ];

  const sceneImages = [item.sceneImage01, item.sceneImage02, item.sceneImage03].filter(Boolean);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <Link href="/cases" className="text-sm text-ink/56 transition hover:text-ink">
          返回项目案例
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-moss">
              <span>{item.location}</span>
              <span className="h-px w-8 bg-line" />
              <span>{item.projectType}</span>
              <span className="h-px w-8 bg-line" />
              <span>{item.status}</span>
            </div>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
              {item.projectName}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-ink/66">{item.summary}</p>
          </div>

          <aside className="border border-line bg-paper p-6 shadow-sm">
            <p className="text-sm font-medium text-clay">CASE PROFILE</p>
            <div className="mt-5 grid gap-px overflow-hidden border border-line bg-line">
              {metaItems.map(([label, value]) => (
                <div key={label} className="bg-paper p-4">
                  <div className="text-xs text-ink/44">{label}</div>
                  <div className="mt-2 text-sm font-semibold leading-6 text-ink">{value || "待补充"}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <CaseImage
            src={item.heroImage}
            fallbackSrc={item.coverImage}
            className="aspect-[16/8] min-h-64"
            fallbackLabel="Project Hero Image"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {(sceneImages.length ? sceneImages.slice(0, 2) : [item.coverImage, item.coverImage]).map((src, index) => (
              <CaseImage
                key={`${src}-${index}`}
                src={src}
                fallbackSrc={item.coverImage}
                className="aspect-[16/9] min-h-40"
                fallbackLabel={`Scene Image ${String(index + 1).padStart(2, "0")}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper/72">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {metaItems.map(([label, value]) => (
            <div key={label} className="py-6 md:border-r md:border-line md:last:border-r-0">
              <div className="text-xs text-ink/44">{label}</div>
              <div className="mt-2 text-sm font-semibold leading-6 text-ink">{value || "待补充"}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
        <article className="bg-paper px-6 py-2 sm:px-10">
          <DetailBlock title="项目背景">
            <p>{item.background || "待补充"}</p>
          </DetailBlock>

          <DetailBlock title="项目痛点">
            <BulletList items={item.painPoints} />
          </DetailBlock>

          <DetailBlock title="溯观服务内容">
            <TagList items={item.services} />
          </DetailBlock>

          <DetailBlock title="核心策略">
            <BulletList items={item.strategy} />
          </DetailBlock>

          <DetailBlock title="项目成果">
            <BulletList items={item.results} />
          </DetailBlock>

          <DetailBlock title="项目价值">
            <p>{item.value || "待补充"}</p>
          </DetailBlock>

          <DetailBlock title="适合客户参考">
            <BulletList items={item.suitableClients} />
          </DetailBlock>

          <DetailBlock title="GEO关键词">
            <TagList items={item.geoKeywords} dark />
          </DetailBlock>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="border border-line bg-paper p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-clay">Case Index</div>
            <div className="mt-5 space-y-4">
              {publishedCases.map((caseItem) => (
                <Link
                  key={caseItem.slug}
                  href={`/cases/${caseItem.slug}`}
                  className={`block text-sm leading-6 transition ${
                    caseItem.slug === item.slug ? "font-semibold text-ink" : "text-ink/56 hover:text-ink"
                  }`}
                >
                  {caseItem.projectName}
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-line bg-paper p-5">
            <h3 className="text-lg font-semibold text-ink">可证明的公司能力</h3>
            <div className="mt-4">
              <BulletList items={item.capabilities} />
            </div>
          </div>

          <div className="border border-line bg-ink p-5 text-paper">
            <h3 className="font-serif text-2xl font-semibold">想参考类似项目？</h3>
            <p className="mt-4 text-sm leading-6 text-paper/66">
              可提交项目所在地、资源条件和当前阶段，获取对应案例资料与初步判断。
            </p>
            <Link
              href="/contact#project-consultation"
              className="mt-6 block border border-paper/28 px-4 py-3 text-center text-sm font-medium text-paper transition hover:bg-paper hover:text-ink"
            >
              提交项目咨询
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
