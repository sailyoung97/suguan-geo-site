"use client";

import { useState } from "react";
import Link from "next/link";
import { CaseImage } from "@/components/CaseImage";
import { useCaseCms } from "@/src/hooks/useCaseCms";

type CaseDetailTemplateProps = {
  slug: string;
};

type GalleryImage = {
  src: string;
  label: string;
};

const campMatrixCases = [
  {
    name: "花间集",
    location: "重庆 大足区 雍溪",
    type: "乡村文旅 / 花园营地 / 亲子休闲 / 生活方式营地",
    description: "花间集以田园花境、露营休闲、咖啡茶饮、亲子活动和自然生活方式为核心，打造沉浸式田园花境美好生活现场。"
  },
  {
    name: "凤鸣雅集",
    location: "四川 雅安 雨城区",
    type: "茶文化营地 / 研学亲子 / 乡村文旅",
    description: "凤鸣雅集以茶文化、自然教育和亲子研学为核心，将茶事体验、游艺活动、乡村生活和在地文化转化为可游、可学、可消费的文旅项目。"
  },
  {
    name: "小桑田",
    location: "重庆 沙坪坝 西永",
    type: "亲子农场 / 自然教育 / 研学营地",
    description: "小桑田以农耕体验、自然教育和亲子活动为核心，将田地、农房、乡土文化和课程内容结合，打造面向家庭和学校的亲子研学农场。"
  },
  {
    name: "小桃园",
    location: "重庆 北碚 静观",
    type: "亲子农场 / 田园营地 / 乡村休闲",
    description: "小桃园依托北碚静观的田园和花木资源，围绕亲子采摘、自然体验、轻露营和乡村休闲，打造面向城市家庭的近郊亲子目的地。"
  },
  {
    name: "东升村·小丰年",
    location: "重庆 北碚 东升村",
    type: "乡村文旅 / 研学营地 / 乡村运营",
    description: "东升村·小丰年依托北碚柳荫镇乡村资源，围绕自然景观、农耕体验、研学活动、星空露营和乡村生活方式，形成乡村文旅与营地运营结合的示范项目。"
  }
];

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-10">
      <h2 className="font-serif text-3xl font-semibold text-ink">{title}</h2>
      <div className="mt-5 text-base leading-8 text-ink/66">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return <p>待补充</p>;

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
  if (!items.length) return <p>待补充</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={dark ? "bg-ink px-3 py-1.5 text-sm text-paper" : "border border-line bg-rice px-3 py-1.5 text-sm text-ink/66"}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function CampMatrixSection() {
  return (
    <section className="border-t border-line py-10">
      <p className="text-sm font-medium text-clay">CAMP ASSET SYSTEM</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">自持运营与营地建设案例矩阵</h2>
      <p className="mt-5 max-w-3xl text-base leading-8 text-ink/66">
        以百草湖乡为代表，溯观持续参与并运营多个研学亲子、乡村文旅和营地类项目，形成覆盖策划、规划、设计、建设、内容产品与运营管理的完整项目链路。
      </p>
      <div className="mt-7 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
        {campMatrixCases.map((caseItem, index) => (
          <article key={caseItem.name} className="bg-paper p-5">
            <div className="font-serif text-3xl text-ink/12">{String(index + 1).padStart(2, "0")}</div>
            <h3 className="mt-5 text-xl font-semibold text-ink">{caseItem.name}</h3>
            <p className="mt-2 text-xs text-moss">{caseItem.location}</p>
            <p className="mt-3 text-sm font-medium leading-6 text-ink/74">{caseItem.type}</p>
            <p className="mt-4 text-sm leading-7 text-ink/62">{caseItem.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CaseDetailTemplate({ slug }: CaseDetailTemplateProps) {
  const { cases, publishedCases } = useCaseCms();
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const item = cases.find((caseItem) => caseItem.slug === slug);

  if (!item || !item.isPublished) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-sm font-medium tracking-[0.24em] text-clay">CASE NOT FOUND</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold text-ink">案例未找到</h1>
        <p className="mt-5 max-w-xl text-sm leading-6 text-ink/62">该案例可能尚未发布，或已在后台案例管理中删除。</p>
        <Link href="/cases" className="mt-8 inline-block border border-ink px-5 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper">
          返回项目案例
        </Link>
      </section>
    );
  }

  const metaItems = [
    ["项目名称", item.projectName],
    ["项目地点", item.location],
    ["项目类型", item.projectType],
    ["项目状态", item.status],
    ["项目年份", item.year]
  ];
  const galleryImages: GalleryImage[] = (item.galleryImages?.length ? item.galleryImages : [item.heroImage, item.sceneImage01, item.sceneImage02])
    .filter(Boolean)
    .slice(0, 8)
    .map((src, index) => ({ src, label: `项目图集 ${String(index + 1).padStart(2, "0")}` }));
  const assetImages = (item.assetImages || []).filter(Boolean);
  const metaLine = [item.location, item.projectType, item.status, item.year].filter(Boolean).join(" / ");
  const activeImage = activeGalleryIndex === null ? null : galleryImages[activeGalleryIndex];

  function showPreviousImage() {
    setActiveGalleryIndex((current) => {
      if (current === null) return current;
      return current === 0 ? galleryImages.length - 1 : current - 1;
    });
  }

  function showNextImage() {
    setActiveGalleryIndex((current) => {
      if (current === null) return current;
      return current === galleryImages.length - 1 ? 0 : current + 1;
    });
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <Link href="/cases" className="text-sm text-ink/56 transition hover:text-ink">
          返回项目案例
        </Link>

        <div className="mt-10">
          <div className="max-w-5xl text-sm leading-6 text-moss">{metaLine}</div>
          <h1 className="mt-6 max-w-5xl font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">{item.projectName}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-ink/66">{item.summary}</p>
        </div>

        <div className="mt-14">
          <CaseImage src={item.coverImage} className="h-[360px] w-full sm:h-[520px] lg:h-[640px]" fallbackLabel="项目封面图未配置" />
        </div>

        {galleryImages.length > 0 ? (
          <section className="mt-10">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium text-clay">PROJECT GALLERY</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">项目图集</h2>
              </div>
              <p className="text-sm text-ink/50">点击图片可放大浏览</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {galleryImages.map((image, index) => (
                <button key={`${image.src}-${index}`} type="button" onClick={() => setActiveGalleryIndex(index)} className="group text-left">
                  <CaseImage src={image.src} className="aspect-[4/3] w-full transition group-hover:opacity-90" fallbackLabel={image.label} />
                  <p className="mt-2 text-xs text-ink/42">{image.label}</p>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
        <article className="bg-paper px-6 py-2 sm:px-10">
          {assetImages.length > 0 ? (
            <section className="py-10">
              <p className="text-sm font-medium text-clay">ASSET IMAGES</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">产业 / 运营补充图</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {assetImages.map((src, index) => (
                  <CaseImage key={`${src}-${index}`} src={src} className="aspect-[16/10] w-full" fallbackLabel={`补充图 ${index + 1}`} />
                ))}
              </div>
            </section>
          ) : null}

          {item.slug === "baicaohuxiang" ? <CampMatrixSection /> : null}

          <DetailBlock title="项目背景">
            <p>{item.background || "待补充"}</p>
          </DetailBlock>

          <DetailBlock title="问题定义">
            <BulletList items={item.painPoints} />
          </DetailBlock>

          <DetailBlock title="策略方法">
            <BulletList items={item.strategy} />
          </DetailBlock>

          <DetailBlock title="设计 / 运营过程">
            <TagList items={item.services} />
          </DetailBlock>

          <DetailBlock title="项目结果">
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
            <p className="text-sm font-medium text-clay">CASE PROFILE</p>
            <div className="mt-5 grid gap-px overflow-hidden border border-line bg-line">
              {metaItems.map(([label, value]) => (
                <div key={label} className="bg-paper p-4">
                  <div className="text-xs text-ink/44">{label}</div>
                  <div className="mt-2 text-sm font-semibold leading-6 text-ink">{value || "待补充"}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-line bg-paper p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-clay">Case Index</div>
            <div className="mt-5 space-y-4">
              {publishedCases.map((caseItem) => (
                <Link
                  key={caseItem.slug}
                  href={`/cases/${caseItem.slug}`}
                  className={`block text-sm leading-6 transition ${caseItem.slug === item.slug ? "font-semibold text-ink" : "text-ink/56 hover:text-ink"}`}
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
            <p className="mt-4 text-sm leading-6 text-paper/66">可提交项目所在地、资源条件和当前阶段，获取对应案例资料与初步判断。</p>
            <Link href="/contact#project-consultation" className="mt-6 block border border-paper/28 px-4 py-3 text-center text-sm font-medium text-paper transition hover:bg-paper hover:text-ink">
              提交项目咨询
            </Link>
          </div>
        </aside>
      </section>

      {activeImage ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/88 px-4 py-6">
          <button type="button" className="absolute inset-0 cursor-default" onClick={() => setActiveGalleryIndex(null)} aria-label="关闭图集" />
          <div className="relative z-10 w-full max-w-6xl">
            <div className="mb-4 flex items-center justify-between gap-4 text-paper">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-paper/50">Gallery</p>
                <p className="mt-1 text-sm">{activeImage.label}</p>
              </div>
              <button type="button" onClick={() => setActiveGalleryIndex(null)} className="border border-paper/30 px-4 py-2 text-sm text-paper transition hover:bg-paper hover:text-ink">
                关闭
              </button>
            </div>
            <div className="relative border border-paper/20 bg-ink">
              <CaseImage src={activeImage.src} className="h-[72vh] w-full bg-ink" imageClassName="object-contain" fallbackLabel={activeImage.label} />
              {galleryImages.length > 1 ? (
                <>
                  <button type="button" onClick={showPreviousImage} className="absolute left-3 top-1/2 -translate-y-1/2 border border-paper/30 bg-ink/50 px-4 py-3 text-paper transition hover:bg-paper hover:text-ink">
                    上一张
                  </button>
                  <button type="button" onClick={showNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 border border-paper/30 bg-ink/50 px-4 py-3 text-paper transition hover:bg-paper hover:text-ink">
                    下一张
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
