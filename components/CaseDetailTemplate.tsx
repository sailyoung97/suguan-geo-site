"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CaseImage } from "@/components/CaseImage";
import { useCaseCms } from "@/src/hooks/useCaseCms";
import type { CaseGalleryImage } from "@/src/config/caseCms";

type CaseDetailTemplateProps = {
  slug: string;
};

type LightboxImage = {
  src: string;
  caption: string;
};

type LightboxState = {
  images: LightboxImage[];
  index: number;
} | null;

function TextWithLineBreaks({ text }: { text: string }) {
  if (!text) return <p>待补充</p>;

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      {paragraphs.map((paragraph, paragraphIndex) => (
        <p key={`${paragraph}-${paragraphIndex}`} className="leading-[2]">
          {paragraph.split(/\n/).map((line, lineIndex) => (
            <span key={`${line}-${lineIndex}`}>
              {line}
              {lineIndex < paragraph.split(/\n/).length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

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
          <div className="min-w-0">
            <TextWithLineBreaks text={item} />
          </div>
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

function normalizeGalleryImages(images: CaseGalleryImage[]) {
  return images
    .filter((image) => image.url)
    .map((image, index) => ({
      src: image.url,
      caption: image.caption || `项目实景图 ${index + 1}`
    }));
}

function normalizeLegacyImages(item: {
  heroImage?: string;
  sceneImage01?: string;
  sceneImage02?: string;
  sceneImage03?: string;
}) {
  return [
    { src: item.heroImage || "", caption: "项目主图" },
    { src: item.sceneImage01 || "", caption: "项目图集 01" },
    { src: item.sceneImage02 || "", caption: "项目图集 02" },
    { src: item.sceneImage03 || "", caption: "项目补充图" }
  ].filter((image) => image.src);
}

function dedupeImages(images: LightboxImage[]) {
  const seen = new Set<string>();
  return images.filter((image) => {
    const key = image.src.trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function CaseDetailTemplate({ slug }: CaseDetailTemplateProps) {
  const { cases, publishedCases } = useCaseCms();
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const item = cases.find((caseItem) => caseItem.slug === slug);

  useEffect(() => {
    if (!lightbox) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft") {
        setLightbox((current) => current
          ? { ...current, index: current.index === 0 ? current.images.length - 1 : current.index - 1 }
          : current);
      }
      if (event.key === "ArrowRight") {
        setLightbox((current) => current
          ? { ...current, index: current.index === current.images.length - 1 ? 0 : current.index + 1 }
          : current);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightbox]);

  if (!item || !item.isPublished) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-sm font-medium tracking-[0.24em] text-clay">CASE NOT FOUND</p>
        <h1 className="mt-4 font-serif text-[clamp(40px,9vw,56px)] font-semibold leading-tight text-ink">案例未找到</h1>
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
  const metaLine = [item.location, item.projectType, item.status, item.year].filter(Boolean).join(" / ");
  const legacyImages = normalizeLegacyImages(item);
  const galleryImages = dedupeImages([
    ...(item.heroImage ? [{ src: item.heroImage, caption: "项目主图" }] : []),
    ...normalizeGalleryImages(item.galleryImages),
    ...legacyImages,
    ...normalizeGalleryImages(item.assetImages || [])
  ]);
  const guideMapImages: LightboxImage[] = item.guideMapImage ? [{ src: item.guideMapImage, caption: item.guideMapCaption || "项目导览图" }] : [];
  const activeImage = lightbox ? lightbox.images[lightbox.index] : null;
  const relatedCases = publishedCases.filter((caseItem) => caseItem.slug !== item.slug).slice(0, 5);

  function openLightbox(images: LightboxImage[], index: number) {
    if (!images.length) return;
    setLightbox({ images, index });
  }

  function showPreviousImage() {
    setLightbox((current) => {
      if (!current) return current;
      return { ...current, index: current.index === 0 ? current.images.length - 1 : current.index - 1 };
    });
  }

  function showNextImage() {
    setLightbox((current) => {
      if (!current) return current;
      return { ...current, index: current.index === current.images.length - 1 ? 0 : current.index + 1 };
    });
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <Link href="/cases" className="text-sm text-ink/56 transition hover:text-ink">
          返回项目案例
        </Link>

        <div className="mx-auto mt-10 max-w-5xl text-center">
          <div className="text-sm leading-6 text-moss">{metaLine}</div>
          <h1 className="mx-auto mt-6 max-w-5xl break-words font-serif text-[clamp(40px,8vw,60px)] font-semibold leading-[1.14] text-ink">{item.projectName}</h1>
          <div className="mx-auto mt-7 max-w-4xl text-lg leading-8 text-ink/66">
            <TextWithLineBreaks text={item.summary} />
          </div>
        </div>

        {item.guideMapImage ? (
          <section className="mt-14">
            <button type="button" onClick={() => openLightbox(guideMapImages, 0)} className="mx-auto block w-full max-w-6xl text-left">
              <CaseImage
                src={item.guideMapImage}
                className="w-full border border-line bg-paper"
                imageClassName="h-auto object-contain"
                fallbackLabel="图片未配置或路径失效"
                alt={`${item.projectName}${item.guideMapCaption || "项目导览图"}`}
              />
              <p className="mt-3 text-center text-sm text-ink/48">{item.guideMapCaption || "项目导览图"}</p>
            </button>
          </section>
        ) : null}

        {galleryImages.length > 0 ? (
          <section className="mt-14">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium text-clay">PROJECT GALLERY</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">项目实景图</h2>
              </div>
              <p className="text-sm text-ink/50">点击图片可放大浏览</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {galleryImages.map((image, index) => (
                <button key={`${image.src}-${index}`} type="button" onClick={() => openLightbox(galleryImages, index)} className="group text-left">
                  <CaseImage
                    src={image.src}
                    className="aspect-[4/3] w-full transition group-hover:opacity-90"
                    fallbackLabel="图片未配置或路径失效"
                    alt={`${item.projectName}${image.caption}`}
                  />
                  <p className="mt-2 text-sm text-ink/48">{image.caption}</p>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
        <article className="bg-paper px-6 py-2 sm:px-10">
          <DetailBlock title="项目内容构成">
            <TextWithLineBreaks text={item.background} />
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
            <TextWithLineBreaks text={item.value} />
          </DetailBlock>

          <DetailBlock title="适合客户参考">
            <BulletList items={item.suitableClients} />
          </DetailBlock>

          <DetailBlock title="核心关键词">
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
            <div className="text-xs uppercase tracking-[0.2em] text-clay">核心关键词</div>
            <div className="mt-4">
              <TagList items={item.geoKeywords.slice(0, 8)} />
            </div>
          </div>

          <div className="border border-line bg-paper p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-clay">关联服务</div>
            <div className="mt-4">
              <TagList items={item.services.slice(0, 8)} />
            </div>
          </div>

          <div className="border border-line bg-paper p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-clay">相关案例</div>
            <div className="mt-5 space-y-4">
              {relatedCases.map((caseItem) => (
                <Link key={caseItem.slug} href={`/cases/${caseItem.slug}`} className="block text-sm leading-6 text-ink/56 transition hover:text-ink">
                  {caseItem.projectName}
                </Link>
              ))}
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

      {activeImage && lightbox ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-3 py-4 backdrop-blur-md sm:px-4 sm:py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`查看${activeImage.caption}`}
        >
          <button type="button" className="absolute inset-0 cursor-default" onClick={() => setLightbox(null)} aria-label="关闭图集" />
          <div className="relative z-10 w-full max-w-6xl">
            <div className="mb-4 flex items-center justify-between gap-4 text-paper">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-paper/50">Gallery</p>
                <p className="mt-1 text-sm">{activeImage.caption}</p>
              </div>
              <button type="button" onClick={() => setLightbox(null)} className="border border-paper/30 px-4 py-2 text-sm text-paper transition hover:bg-paper hover:text-ink">
                关闭
              </button>
            </div>
            <div className="relative border border-paper/20 bg-ink">
              <CaseImage src={activeImage.src} className="max-h-[85vh] w-full bg-ink" imageClassName="max-h-[85vh] object-contain" fallbackLabel={activeImage.caption || "项目图片"} />
              {lightbox.images.length > 1 ? (
                <>
                  <button type="button" aria-label="上一张图片" onClick={showPreviousImage} className="absolute left-2 top-1/2 min-h-11 -translate-y-1/2 border border-paper/30 bg-ink/65 px-3 py-3 text-sm text-paper transition hover:bg-paper hover:text-ink sm:left-3 sm:px-4">
                    <span className="hidden sm:inline">上一张</span><span className="sm:hidden">‹</span>
                  </button>
                  <button type="button" aria-label="下一张图片" onClick={showNextImage} className="absolute right-2 top-1/2 min-h-11 -translate-y-1/2 border border-paper/30 bg-ink/65 px-3 py-3 text-sm text-paper transition hover:bg-paper hover:text-ink sm:right-3 sm:px-4">
                    <span className="hidden sm:inline">下一张</span><span className="sm:hidden">›</span>
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
