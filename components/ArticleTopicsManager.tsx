"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ArticleTopic } from "@/data/mock";

const statuses = ["全部", "选题池", "撰写中", "待审核", "已发布", "待复盘"] as const;
const platformOptions = ["官网", "公众号", "知乎", "小红书", "视频号"] as const;

type ArticleTopicsManagerProps = {
  initialTopics: ArticleTopic[];
};

type TopicForm = {
  title: string;
  customerQuestion: string;
  platforms: string;
  relatedCase: string;
  status: ArticleTopic["status"];
  publishDate: string;
  owner: string;
  publishUrl: string;
  views: string;
  leadCount: string;
  column: string;
  keyword: string;
};

const defaultForm: TopicForm = {
  title: "",
  customerQuestion: "",
  platforms: "官网,公众号",
  relatedCase: "",
  status: "选题池",
  publishDate: "2026-06-10",
  owner: "李沅",
  publishUrl: "",
  views: "0",
  leadCount: "0",
  column: "GEO 观察",
  keyword: ""
};

const statusStyles: Record<ArticleTopic["status"], string> = {
  选题池: "border-zinc-400/40 bg-zinc-400/10 text-zinc-700",
  撰写中: "border-moss/30 bg-moss/10 text-moss",
  待审核: "border-clay/40 bg-clay/10 text-clay",
  已发布: "border-emerald-700/20 bg-emerald-700/10 text-emerald-800",
  待复盘: "border-ink/20 bg-ink/10 text-ink"
};

export function ArticleTopicsManager({ initialTopics }: ArticleTopicsManagerProps) {
  const [topics, setTopics] = useState(initialTopics);
  const [statusFilter, setStatusFilter] = useState<(typeof statuses)[number]>("全部");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<TopicForm>(defaultForm);

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => statusFilter === "全部" || topic.status === statusFilter);
  }, [statusFilter, topics]);

  function updateForm<K extends keyof TopicForm>(key: K, value: TopicForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleCreateTopic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTopic: ArticleTopic = {
      id: `a-${String(topics.length + 1).padStart(3, "0")}`,
      title: form.title,
      column: form.column,
      status: form.status,
      keyword: form.keyword,
      customerQuestion: form.customerQuestion,
      platforms: form.platforms
        .split(/[，,]/)
        .map((item) => item.trim())
        .filter(Boolean),
      relatedCase: form.relatedCase,
      publishDate: form.publishDate,
      owner: form.owner,
      publishUrl: form.publishUrl,
      views: Number(form.views) || 0,
      leadCount: Number(form.leadCount) || 0
    };

    setTopics((current) => [nextTopic, ...current]);
    setForm(defaultForm);
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-clay">CONTENT TOPICS</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">文章选题管理</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/62">
            围绕客户真实问题、案例资产和 GEO 优化需求管理内容选题，暂使用 mock 数据和前端状态。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-moss"
        >
          新增选题
        </button>
      </div>

      <section className="mt-8 border border-line bg-paper">
        <div className="grid gap-4 border-b border-line p-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-lg font-semibold text-ink">选题表格</h2>
            <p className="mt-1 text-xs text-ink/54">当前显示 {filteredTopics.length} 条选题。</p>
          </div>
          <FilterGroup value={statusFilter} onChange={(value) => setStatusFilter(value as typeof statusFilter)} />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1480px] w-full border-collapse text-left text-sm">
            <thead className="bg-rice text-xs text-ink/54">
              <tr>
                {[
                  "选题标题",
                  "对应客户问题",
                  "适合平台",
                  "对应案例",
                  "内容状态",
                  "计划发布时间",
                  "负责人",
                  "发布链接",
                  "阅读量",
                  "带来线索数"
                ].map((head) => (
                  <th key={head} className="whitespace-nowrap px-4 py-3 font-medium">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((topic) => (
                <tr key={topic.id} className="border-t border-line align-top">
                  <td className="min-w-72 px-4 py-4 font-semibold leading-6 text-ink">{topic.title}</td>
                  <td className="min-w-80 px-4 py-4 leading-6 text-ink/68">{topic.customerQuestion}</td>
                  <td className="min-w-40 px-4 py-4 text-ink/62">{topic.platforms.join("、")}</td>
                  <td className="min-w-56 px-4 py-4 text-ink/62">{topic.relatedCase}</td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className={`border px-2.5 py-1 text-xs ${statusStyles[topic.status]}`}>
                      {topic.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{topic.publishDate}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{topic.owner}</td>
                  <td className="min-w-48 px-4 py-4 text-ink/62">{topic.publishUrl || "未发布"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{topic.views}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{topic.leadCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen ? (
        <TopicCreateModal
          form={form}
          onChange={updateForm}
          onSubmit={handleCreateTopic}
          onClose={() => setIsModalOpen(false)}
        />
      ) : null}
    </>
  );
}

function FilterGroup({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="text-xs text-ink/56">内容状态</div>
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            className={`border px-3 py-2 text-xs transition ${
              status === value ? "border-ink bg-ink text-paper" : "border-line bg-rice text-ink/62 hover:border-ink hover:text-ink"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}

function TopicCreateModal({
  form,
  onChange,
  onSubmit,
  onClose
}: {
  form: TopicForm;
  onChange: <K extends keyof TopicForm>(key: K, value: TopicForm[K]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/44 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-line bg-paper shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-ink">新增文章选题</h2>
            <p className="mt-2 text-sm text-ink/56">保存后只写入当前页面状态，刷新后恢复 mock 数据。</p>
          </div>
          <button type="button" onClick={onClose} className="border border-line px-3 py-2 text-sm text-ink/64 hover:border-ink hover:text-ink">
            关闭
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-5 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="选题标题">
              <input required value={form.title} onChange={(event) => onChange("title", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="对应客户问题">
              <input required value={form.customerQuestion} onChange={(event) => onChange("customerQuestion", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="适合平台">
              <input required value={form.platforms} onChange={(event) => onChange("platforms", event.target.value)} placeholder={platformOptions.join(",")} className={inputClassName} />
            </Field>
            <Field label="对应案例">
              <input required value={form.relatedCase} onChange={(event) => onChange("relatedCase", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="内容状态">
              <select value={form.status} onChange={(event) => onChange("status", event.target.value as ArticleTopic["status"])} className={inputClassName}>
                {statuses.filter((status) => status !== "全部").map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="计划发布时间">
              <input required type="date" value={form.publishDate} onChange={(event) => onChange("publishDate", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="负责人">
              <input required value={form.owner} onChange={(event) => onChange("owner", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="发布链接">
              <input value={form.publishUrl} onChange={(event) => onChange("publishUrl", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="阅读量">
              <input type="number" min="0" value={form.views} onChange={(event) => onChange("views", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="带来线索数">
              <input type="number" min="0" value={form.leadCount} onChange={(event) => onChange("leadCount", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="栏目">
              <input value={form.column} onChange={(event) => onChange("column", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="关键词">
              <input value={form.keyword} onChange={(event) => onChange("keyword", event.target.value)} className={inputClassName} />
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="border border-line px-5 py-3 text-sm font-medium text-ink/64 hover:border-ink hover:text-ink">
              取消
            </button>
            <button type="submit" className="bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-moss">
              保存选题
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClassName =
  "h-11 w-full border border-line bg-rice px-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-ink";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-xs font-medium text-ink/58">
      {label}
      {children}
    </label>
  );
}
