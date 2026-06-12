import { resourcePacks } from "@/data/mock";

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-medium text-clay">RESOURCE PACKS</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold">资料包管理</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {resourcePacks.map((item) => (
          <article key={item.id} className="border border-line bg-paper p-5">
            <div className="text-xs text-moss">{item.type} · {item.updatedAt}</div>
            <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
            <p className="mt-3 text-sm text-ink/60">适用对象：{item.audience}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
