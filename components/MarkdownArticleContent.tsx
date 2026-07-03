import { Fragment, type ReactNode } from "react";
import { CaseImage } from "@/components/CaseImage";
import { extractMarkdownImages, isSafeImageUrl } from "@/src/lib/articleMarkdown";

type LightboxImage = {
  src: string;
  caption: string;
};

type MarkdownArticleContentProps = {
  content?: string | null;
  articleTitle?: string;
  onOpenImage?: (images: LightboxImage[], index: number) => void;
};

const imageLinePattern = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)$/;

export function MarkdownArticleContent({
  content,
  articleTitle = "观点文章",
  onOpenImage
}: MarkdownArticleContentProps) {
  const safeContent = typeof content === "string" ? content.trim() : "";
  if (!safeContent) {
    return <div className="border border-line bg-rice p-8 text-sm text-ink/62">暂无正文内容</div>;
  }

  const images = extractMarkdownImages(safeContent);
  const blocks = safeContent
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="break-words text-[17px] leading-[2] text-ink/76">
      {blocks.map((block, index) => {
        const key = `${index}-${block.slice(0, 24)}`;
        const imageMatch = block.match(imageLinePattern);

        if (imageMatch && isSafeImageUrl(imageMatch[2])) {
          const caption = imageMatch[1].trim() || "文章图片";
          const src = imageMatch[2].trim();
          const imageIndex = Math.max(0, images.findIndex((image) => image.src === src));
          return (
            <figure key={key} className="my-10">
              <button
                type="button"
                onClick={() => onOpenImage?.(images, imageIndex)}
                className="block w-full cursor-zoom-in text-left"
              >
                <CaseImage
                  src={src}
                  className="w-full overflow-hidden border border-line bg-rice"
                  imageClassName="h-auto max-h-[760px] object-contain"
                  fallbackLabel={caption}
                  alt={caption || articleTitle}
                />
              </button>
              <figcaption className="mt-3 text-center text-sm leading-6 text-ink/46">{caption}</figcaption>
            </figure>
          );
        }

        if (/^###\s+/.test(block)) {
          return (
            <h3 key={key} className="mb-5 mt-10 text-xl font-semibold leading-snug text-ink">
              {renderInline(block.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        if (/^##\s+/.test(block)) {
          return (
            <h2 key={key} className="mb-6 mt-12 font-serif text-3xl font-semibold leading-snug text-ink">
              {renderInline(block.replace(/^##\s+/, ""))}
            </h2>
          );
        }

        if (/^#\s+/.test(block)) {
          return (
            <h2 key={key} className="mb-6 mt-12 font-serif text-4xl font-semibold leading-tight text-ink">
              {renderInline(block.replace(/^#\s+/, ""))}
            </h2>
          );
        }

        if (/^[一二三四五六七八九十]+、/.test(block)) {
          return (
            <h2 key={key} className="mb-6 mt-12 font-serif text-3xl font-semibold leading-snug text-ink">
              {renderInline(block)}
            </h2>
          );
        }

        if (block === "---" || block === "***") {
          return <hr key={key} className="my-12 border-line" />;
        }

        if (block.startsWith("> ")) {
          return (
            <blockquote key={key} className="my-8 border-l-2 border-ink/30 bg-rice px-5 py-5 text-lg leading-8 text-ink/72">
              {renderMultiline(block.replace(/^>\s?/gm, ""))}
            </blockquote>
          );
        }

        if (block.startsWith("数据参考：") || block.startsWith("数据：")) {
          return (
            <aside key={key} className="my-8 border border-line bg-paper p-5">
              <p className="text-xs font-medium text-clay">数据参考</p>
              <div className="mt-3 text-base leading-8 text-ink/70">
                {renderMultiline(block.replace(/^数据参考：|^数据：/, ""))}
              </div>
            </aside>
          );
        }

        if (block.startsWith("重点：")) {
          return (
            <aside key={key} className="my-8 border-l-2 border-clay bg-rice px-5 py-5 text-lg font-medium leading-8 text-ink/78">
              {renderMultiline(block.replace(/^重点：/, ""))}
            </aside>
          );
        }

        return (
          <p key={key} className="mb-7 whitespace-pre-wrap text-[17px] leading-[2] text-ink/76">
            {renderMultiline(block)}
          </p>
        );
      })}
    </div>
  );
}

function renderMultiline(value: string) {
  return value.split("\n").map((line, index) => (
    <Fragment key={`${index}-${line.slice(0, 16)}`}>
      {index > 0 ? <br /> : null}
      {renderInline(line)}
    </Fragment>
  ));
}

function renderInline(value: string): ReactNode[] {
  const tokens = value.split(/(\*\*[^*]+\*\*|\{\{(?:clay|moss|muted):[^}]+\}\})/g).filter(Boolean);

  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={`${token}-${index}`} className="font-semibold text-ink">{token.slice(2, -2)}</strong>;
    }

    const colorMatch = token.match(/^\{\{(clay|moss|muted):(.+)\}\}$/);
    if (colorMatch) {
      const colorClassName = colorMatch[1] === "clay"
        ? "text-clay"
        : colorMatch[1] === "moss"
          ? "text-moss"
          : "text-ink/52";
      return <span key={`${token}-${index}`} className={colorClassName}>{colorMatch[2]}</span>;
    }

    return <Fragment key={`${token}-${index}`}>{token}</Fragment>;
  });
}
