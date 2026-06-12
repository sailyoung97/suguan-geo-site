import { ArticleTopicsManager } from "@/components/ArticleTopicsManager";
import { articles } from "@/data/mock";

export default function AdminArticlesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <ArticleTopicsManager initialTopics={articles} />
    </div>
  );
}
