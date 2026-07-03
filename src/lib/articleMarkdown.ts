import type { ArticleBlock } from "@/src/lib/contentTopics";

export type ArticleMarkdownImage = {
  src: string;
  caption: string;
};

export function legacyBlocksToMarkdown(blocks?: ArticleBlock[] | null) {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      if (!block) return "";
      if (block.type === "heading2") return `## ${block.content || ""}`;
      if (block.type === "heading3") return `### ${block.content || ""}`;
      if (block.type === "emphasis") return `重点：${block.content || ""}`;
      if (block.type === "quote") return `> ${block.content || ""}`;
      if (block.type === "divider") return "---";
      if (block.type === "image" && block.image) {
        return `![${block.caption || block.alt || "文章图片"}](${block.image})`;
      }
      return block.content || "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export function getArticleMarkdown(content?: string | null, blocks?: ArticleBlock[] | null) {
  const normalizedContent = typeof content === "string" ? content.trim() : "";
  return normalizedContent || legacyBlocksToMarkdown(blocks);
}

export function extractMarkdownImages(content?: string | null): ArticleMarkdownImage[] {
  if (typeof content !== "string" || !content.trim()) return [];

  const images: ArticleMarkdownImage[] = [];
  const imagePattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  let match: RegExpExecArray | null;

  while ((match = imagePattern.exec(content)) !== null) {
    const src = match[2].trim();
    if (!isSafeImageUrl(src)) continue;
    images.push({ src, caption: match[1].trim() || "文章图片" });
  }

  return images;
}

export function isSafeImageUrl(value: string) {
  return value.startsWith("/uploads/") || /^https?:\/\//i.test(value);
}
