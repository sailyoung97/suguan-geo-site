"use client";

import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { CaseImage } from "@/components/CaseImage";
import {
  businessAreas,
  contentTopicsStorageKey,
  contentTypes,
  geoIntents,
  GeoContentTopic,
  getDefaultContentTopics,
  normalizeContentTopic,
  publishChannels,
  readRemoteContentTopics,
  readStoredContentTopics,
  slugify,
  targetClients,
  topicStatuses,
  writeRemoteContentTopics
} from "@/src/lib/contentTopics";
import { legacyBlocksToMarkdown } from "@/src/lib/articleMarkdown";
import { uploadImage } from "@/src/lib/uploadImage";

const allOption = "全部";

type TopicForm = Omit<GeoContentTopic, "id" | "views" | "leads" | "aiRecognized" | "aiCited" | "publishToWebsite" | "createdAt" | "updatedAt"> & {
  views: string;
  leads: string;
  aiRecognized: "是" | "否";
  aiCited: "是" | "否";
  publishToWebsite: "是" | "否";
};

type FilterState = {
  status: string;
  geoIntent: string;
  contentType: string;
  businessArea: string;
  owner: string;
};

type ArticleTopicsManagerProps = {
  initialTopics: unknown[];
};

const statusStyles: Record<string, string> = {
  选题池: "border-zinc-400/40 bg-zinc-400/10 text-zinc-700",
  撰写中: "border-moss/30 bg-moss/10 text-moss",
  待审核: "border-clay/40 bg-clay/10 text-clay",
  已发布: "border-emerald-700/20 bg-emerald-700/10 text-emerald-800",
  待复盘: "border-ink/20 bg-ink/10 text-ink"
};

const defaultForm: TopicForm = {
  title: "",
  subtitle: "",
  slug: "",
  category: "观点文章",
  contentType: "官网文章",
  status: "选题池",
  owner: "待分配",
  plannedDate: "",
  publishChannel: "官网文章",
  publishToWebsite: "是",
  websitePath: "",
  externalUrl: "",
  platforms: "官网",
  publishUrl: "",
  relatedCases: "",
  relatedCase: "",
  targetSearchQuestion: "",
  geoIntent: "AI搜索占位",
  coreKeywords: "",
  coverImage: "",
  coverImageCaption: "",
  coverImageAlt: "",
  longTailKeywords: "",
  locationKeywords: "",
  businessKeywords: "",
  businessArea: "城市更新",
  customerQuestion: "",
  targetClient: "文旅投资方",
  summary: "",
  content: "",
  blocks: [],
  outline: "",
  references: "",
  requiredAssets: "",
  reviewNotes: "",
  views: "0",
  leads: "0",
  aiRecognized: "否",
  aiCited: "否",
  geoTestResult: "",
  nextOptimization: "",
  notes: ""
};

export function ArticleTopicsManager({ initialTopics }: ArticleTopicsManagerProps) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [topics, setTopics] = useState<GeoContentTopic[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    status: allOption,
    geoIntent: allOption,
    contentType: allOption,
    businessArea: allOption,
    owner: allOption
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [form, setForm] = useState<TopicForm>(defaultForm);
  const [message, setMessage] = useState("文章正式数据保存到服务器 JSON；浏览器仅保留同步缓存。");
  const [generatedQuestions, setGeneratedQuestions] = useState<string[] | null>(null);

  useEffect(() => {
    const stored = readStoredContentTopics();
    setTopics(stored.length > 0 ? stored : initialTopics.map((item, index) => normalizeContentTopic(item, index)));
    readRemoteContentTopics()
      .then((remoteTopics) => {
        setTopics(remoteTopics);
        window.localStorage.setItem(contentTopicsStorageKey, JSON.stringify(remoteTopics));
      })
      .catch(() => undefined);
  }, [initialTopics]);

  const owners = useMemo(() => {
    const values = Array.from(new Set(topics.map((topic) => topic.owner).filter(Boolean)));
    return values.length > 0 ? values : ["待分配"];
  }, [topics]);

  const filteredTopics = useMemo(() => {
    return topics
      .filter((topic) => filters.status === allOption || topic.status === filters.status)
      .filter((topic) => filters.geoIntent === allOption || topic.geoIntent === filters.geoIntent)
      .filter((topic) => filters.contentType === allOption || topic.contentType === filters.contentType)
      .filter((topic) => filters.businessArea === allOption || topic.businessArea === filters.businessArea)
      .filter((topic) => filters.owner === allOption || topic.owner === filters.owner);
  }, [filters, topics]);

  async function persist(nextTopics: GeoContentTopic[], nextMessage?: string) {
    await writeRemoteContentTopics(nextTopics);
    setTopics(nextTopics);
    window.localStorage.setItem(contentTopicsStorageKey, JSON.stringify(nextTopics));
    if (nextMessage) setMessage(nextMessage);
  }

  function openCreateModal() {
    setEditingTopicId(null);
    setForm({ ...defaultForm });
    setIsModalOpen(true);
  }

  function openEditModal(topic: GeoContentTopic) {
    setEditingTopicId(topic.id);
    setForm(toForm(topic));
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTopicId(null);
    setForm({ ...defaultForm });
  }

  function updateForm<K extends keyof TopicForm>(key: K, value: TopicForm[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "title" && !current.slug) {
        next.slug = slugify(String(value));
        next.websitePath = `/articles/${next.slug}`;
      }
      if (key === "slug") {
        next.slug = slugify(String(value));
        if (!current.websitePath || current.websitePath.startsWith("/articles/")) {
          next.websitePath = `/articles/${next.slug}`;
        }
      }
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = new Date().toISOString();
    const normalizedSlug = slugify(form.slug || form.title);
    const nextForm = {
      ...form,
      slug: normalizedSlug,
      websitePath: form.websitePath || `/articles/${normalizedSlug}`,
      publishUrl: form.publishUrl || form.websitePath || form.externalUrl || `/articles/${normalizedSlug}`
    };
    const nextTopic = fromForm(nextForm, editingTopicId ?? `topic-${Date.now()}`, now, topics.find((topic) => topic.id === editingTopicId)?.createdAt);
    const duplicate = topics.some((topic) => topic.slug === nextTopic.slug && topic.id !== editingTopicId);
    if (duplicate) {
      setMessage("保存失败：文章 slug 已存在，请换一个。");
      return;
    }
    const nextTopics = editingTopicId ? topics.map((topic) => (topic.id === editingTopicId ? nextTopic : topic)) : [nextTopic, ...topics];
    try {
      await persist(nextTopics, editingTopicId ? "内容记录已更新并保存到服务器。" : "新内容选题已保存到服务器。");
      closeModal();
    } catch (error) {
      setMessage(error instanceof Error ? `保存失败：${error.message}` : "保存失败，请检查服务器数据目录。");
    }
  }

  async function handleDelete(topicId: string) {
    const target = topics.find((topic) => topic.id === topicId);
    if (!target || !window.confirm(`确认删除内容记录「${target.title}」吗？`)) return;
    try {
      await persist(topics.filter((topic) => topic.id !== topicId), "内容记录已从服务器删除。");
    } catch (error) {
      setMessage(error instanceof Error ? `删除失败：${error.message}` : "删除失败，请检查服务器数据目录。");
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(topics, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "suguan-content-topics.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage("已导出 GEO 内容选题与发布记录 JSON。");
  }

  async function importJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed)) {
        setMessage("导入失败：JSON 须为内容记录数组。");
        return;
      }
      await persist(parsed.map((item, index) => normalizeContentTopic(item, index)), "导入成功，已保存到服务器。");
    } catch {
      setMessage("导入失败：请确认文件是有效 JSON。");
    }
  }

  async function resetToDefault() {
    try {
      await persist(getDefaultContentTopics(), "默认内容选题数据已保存到服务器。");
    } catch (error) {
      setMessage(error instanceof Error ? `恢复失败：${error.message}` : "恢复失败，请检查服务器数据目录。");
    }
  }

  function generateGeoQuestions(topic: GeoContentTopic) {
    const keywords = topic.coreKeywords || topic.businessKeywords || topic.longTailKeywords || "溯观";
    const cases = topic.relatedCases || topic.relatedCase || topic.businessArea;
    setGeneratedQuestions([
      topic.targetSearchQuestion || `${topic.businessArea}项目应该如何做内容优化？`,
      `${topic.businessArea}项目如何选择策划运营公司？`,
      `溯观在${topic.businessArea}领域有哪些代表案例？`,
      `${keywords}相关的文旅策划公司有哪些？`,
      `${cases}可以证明溯观哪些服务能力？`
    ]);
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-clay">GEO CONTENT & PUBLISHING</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">GEO 内容选题与发布记录</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/62">
            本模块用于管理溯观围绕客户问题、项目案例和 GEO 关键词形成的内容选题。内容可发布于官网，也可发布于公众号、小红书、知乎等外部平台。系统负责记录内容从选题、生产、发布到 AI 搜索测试和线索复盘的完整过程。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={exportJson} className="border border-ink px-4 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper">
            导出 JSON
          </button>
          <button type="button" onClick={() => importInputRef.current?.click()} className="border border-line px-4 py-3 text-sm font-medium text-ink/70 transition hover:border-ink hover:text-ink">
            导入 JSON
          </button>
          <button type="button" onClick={openCreateModal} className="bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-moss">
            新增内容记录
          </button>
          <input ref={importInputRef} type="file" accept="application/json,.json" className="hidden" onChange={importJson} />
        </div>
      </div>

      <section className="mt-8 border border-line bg-paper">
        <div className="border-b border-line p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div>
              <h2 className="text-lg font-semibold text-ink">内容发布链路</h2>
              <p className="mt-1 text-xs leading-5 text-ink/54">
                当前显示 {filteredTopics.length} / {topics.length} 条内容记录，统一追踪客户问题、发布渠道、官网同步、AI 引用和线索效果。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <SelectFilter label="内容状态" value={filters.status} options={[allOption, ...topicStatuses]} onChange={(value) => setFilters((current) => ({ ...current, status: value }))} />
              <SelectFilter label="GEO 意图" value={filters.geoIntent} options={[allOption, ...geoIntents]} onChange={(value) => setFilters((current) => ({ ...current, geoIntent: value }))} />
              <SelectFilter label="内容类型" value={filters.contentType} options={[allOption, ...contentTypes]} onChange={(value) => setFilters((current) => ({ ...current, contentType: value }))} />
              <SelectFilter label="业务板块" value={filters.businessArea} options={[allOption, ...businessAreas]} onChange={(value) => setFilters((current) => ({ ...current, businessArea: value }))} />
              <SelectFilter label="负责人" value={filters.owner} options={[allOption, ...owners]} onChange={(value) => setFilters((current) => ({ ...current, owner: value }))} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1900px] border-collapse text-left text-sm">
            <thead className="bg-rice text-xs text-ink/54">
              <tr>
                {["内容标题", "slug", "目标搜索问题", "发布渠道", "同步官网", "关联项目", "GEO 意图", "核心关键词", "内容状态", "负责人", "AI 识别", "AI 引用", "线索数", "操作"].map((head) => (
                  <th key={head} className="whitespace-nowrap px-4 py-3 font-medium">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((topic) => (
                <tr key={topic.id} className="border-t border-line align-top">
                  <td className="min-w-72 px-4 py-4">
                    <div className="font-semibold leading-6 text-ink">{topic.title}</div>
                    <div className="mt-2 text-xs leading-5 text-ink/48">{topic.summary || topic.notes || "暂无摘要"}</div>
                  </td>
                  <td className="min-w-56 px-4 py-4 font-mono text-xs text-ink/54">/articles/{topic.slug}</td>
                  <td className="min-w-80 px-4 py-4 leading-6 text-ink/68">{topic.targetSearchQuestion}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{topic.publishChannel}</td>
                  <td className="min-w-44 px-4 py-4 text-ink/62">
                    <div>{topic.publishToWebsite ? "是" : "否"}</div>
                    {topic.websitePath ? <div className="mt-1 text-xs text-ink/42">{topic.websitePath}</div> : null}
                  </td>
                  <td className="min-w-64 px-4 py-4 text-ink/62">{topic.relatedCases || topic.relatedCase || "未关联"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{topic.geoIntent}</td>
                  <td className="min-w-56 px-4 py-4 text-ink/62">{topic.coreKeywords || "未填写"}</td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className={`border px-2.5 py-1 text-xs ${statusStyles[topic.status]}`}>{topic.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{topic.owner}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{topic.aiRecognized ? "是" : "否"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{topic.aiCited ? "是" : "否"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{topic.leads}</td>
                  <td className="min-w-64 px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => openEditModal(topic)} className="border border-line px-3 py-2 text-xs text-ink/70 transition hover:border-ink hover:text-ink">
                        编辑
                      </button>
                      <button type="button" onClick={() => generateGeoQuestions(topic)} className="border border-moss/40 px-3 py-2 text-xs text-moss transition hover:bg-moss hover:text-paper">
                        生成 GEO 测试问题
                      </button>
                      <button type="button" onClick={() => handleDelete(topic.id)} className="border border-clay/30 px-3 py-2 text-xs text-clay transition hover:bg-clay hover:text-paper">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-line p-4 text-sm text-ink/58 sm:flex-row sm:items-center sm:justify-between">
          <span>{message}</span>
          <button type="button" onClick={resetToDefault} className="w-fit border border-line px-3 py-2 text-xs text-ink/62 transition hover:border-ink hover:text-ink">
            恢复默认内容记录
          </button>
        </div>
      </section>

      {isModalOpen ? <TopicModal form={form} isEditing={Boolean(editingTopicId)} onChange={updateForm} onSubmit={handleSubmit} onClose={closeModal} /> : null}
      {generatedQuestions ? <GeoQuestionsModal questions={generatedQuestions} onClose={() => setGeneratedQuestions(null)} /> : null}
    </>
  );
}

function TopicModal({
  form,
  isEditing,
  onChange,
  onSubmit,
  onClose
}: {
  form: TopicForm;
  isEditing: boolean;
  onChange: <K extends keyof TopicForm>(key: K, value: TopicForm[K]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  const [uploadingKey, setUploadingKey] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
  const latestContentRef = useRef(form.content);
  const articleSlug = form.slug || slugify(form.title || "article");

  useEffect(() => {
    latestContentRef.current = form.content;
  }, [form.content]);

  async function handleArticleImageUpload(file: File | undefined, fieldKey: string, onUrl: (url: string) => void) {
    if (!file) return;
    setUploadingKey(fieldKey);
    setUploadMessage("图片正在上传...");
    try {
      const url = await uploadImage(file, {
        scope: "articles",
        articleSlug,
        fieldKey
      });
      onUrl(url);
      setUploadMessage("图片上传成功，已自动写入 URL。");
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "图片上传失败，请稍后重试。");
    } finally {
      setUploadingKey("");
    }
  }

  function insertMarkdown(prefix: string, suffix = "", placeholder = "文字内容") {
    const textarea = contentRef.current;
    const currentContent = latestContentRef.current;
    const start = textarea?.selectionStart ?? currentContent.length;
    const end = textarea?.selectionEnd ?? start;
    const selected = currentContent.slice(start, end) || placeholder;
    const replacement = `${prefix}${selected}${suffix}`;
    const nextContent = `${currentContent.slice(0, start)}${replacement}${currentContent.slice(end)}`;
    latestContentRef.current = nextContent;
    onChange("content", nextContent);

    requestAnimationFrame(() => {
      if (!textarea) return;
      textarea.focus();
      const selectionStart = start + prefix.length;
      textarea.setSelectionRange(selectionStart, selectionStart + selected.length);
    });
  }

  function insertStandaloneMarkdown(value: string) {
    const textarea = contentRef.current;
    const currentContent = latestContentRef.current;
    const start = textarea?.selectionStart ?? currentContent.length;
    const before = currentContent.slice(0, start);
    const after = currentContent.slice(textarea?.selectionEnd ?? start);
    const leadingBreak = before && !before.endsWith("\n\n") ? "\n\n" : "";
    const trailingBreak = after && !after.startsWith("\n\n") ? "\n\n" : "";
    const nextContent = `${before}${leadingBreak}${value}${trailingBreak}${after}`;
    latestContentRef.current = nextContent;
    onChange("content", nextContent);
    requestAnimationFrame(() => {
      if (!textarea) return;
      const cursor = before.length + leadingBreak.length + value.length;
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  async function uploadContentImage(file?: File) {
    await handleArticleImageUpload(file, "content-image", (url) => {
      insertStandaloneMarkdown(`![图片说明](${url})`);
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/44 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto border border-line bg-paper shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-ink">{isEditing ? "编辑内容发布记录" : "新增内容发布记录"}</h2>
            <p className="mt-2 text-sm text-ink/56">新增时可手动填写 slug；如果留空，系统会根据标题生成稳定路径。</p>
          </div>
          <button type="button" onClick={onClose} className="border border-line px-3 py-2 text-sm text-ink/64 hover:border-ink hover:text-ink">
            关闭
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-7 p-5">
          <FormSection title="基础信息">
            <Field label="内容标题">
              <input required value={form.title} onChange={(event) => onChange("title", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="文章副标题 subtitle">
              <input value={form.subtitle} onChange={(event) => onChange("subtitle", event.target.value)} placeholder="用于前台标题下方的导语式副标题" className={inputClassName} />
            </Field>
            <Field label="文章 slug">
              <input value={form.slug} onChange={(event) => onChange("slug", event.target.value)} placeholder="ai-search-cultural-tourism-recommendation" className={inputClassName} />
            </Field>
            <Field label="栏目 / 分类">
              <input value={form.category} onChange={(event) => onChange("category", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="内容类型">
              <SelectInput value={form.contentType} options={contentTypes} onChange={(value) => onChange("contentType", value as TopicForm["contentType"])} />
            </Field>
            <Field label="内容状态">
              <SelectInput value={form.status} options={topicStatuses} onChange={(value) => onChange("status", value as TopicForm["status"])} />
            </Field>
            <Field label="负责人">
              <input required value={form.owner} onChange={(event) => onChange("owner", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="计划发布时间">
              <input type="date" value={form.plannedDate} onChange={(event) => onChange("plannedDate", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="发布渠道">
              <SelectInput value={form.publishChannel} options={publishChannels} onChange={(value) => onChange("publishChannel", value as TopicForm["publishChannel"])} />
            </Field>
          </FormSection>

          <FormSection title="发布记录">
            <Field label="是否同步官网">
              <SelectInput value={form.publishToWebsite} options={["是", "否"] as const} onChange={(value) => onChange("publishToWebsite", value as "是" | "否")} />
            </Field>
            <Field label="官网文章路径">
              <input value={form.websitePath} onChange={(event) => onChange("websitePath", event.target.value)} placeholder="/articles/xxx" className={inputClassName} />
            </Field>
            <Field label="外部平台链接">
              <input value={form.externalUrl} onChange={(event) => onChange("externalUrl", event.target.value)} placeholder="公众号、小红书、知乎、视频号链接" className={inputClassName} />
            </Field>
            <Field label="发布平台补充">
              <input value={form.platforms} onChange={(event) => onChange("platforms", event.target.value)} placeholder="官网,公众号,小红书" className={inputClassName} />
            </Field>
            <Field label="发布链接兼容字段">
              <input value={form.publishUrl} onChange={(event) => onChange("publishUrl", event.target.value)} className={inputClassName} />
            </Field>
          </FormSection>

          <FormSection title="GEO 信息">
            <Field label="目标搜索问题">
              <input required value={form.targetSearchQuestion} onChange={(event) => onChange("targetSearchQuestion", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="GEO 意图">
              <SelectInput value={form.geoIntent} options={geoIntents} onChange={(value) => onChange("geoIntent", value as TopicForm["geoIntent"])} />
            </Field>
            <Field label="核心关键词">
              <input value={form.coreKeywords} onChange={(event) => onChange("coreKeywords", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="长尾关键词">
              <input value={form.longTailKeywords} onChange={(event) => onChange("longTailKeywords", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="地域关键词">
              <input value={form.locationKeywords} onChange={(event) => onChange("locationKeywords", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="业务关键词">
              <input value={form.businessKeywords} onChange={(event) => onChange("businessKeywords", event.target.value)} className={inputClassName} />
            </Field>
          </FormSection>

          <FormSection title="业务关联">
            <Field label="对应业务板块">
              <SelectInput value={form.businessArea} options={businessAreas} onChange={(value) => onChange("businessArea", value as TopicForm["businessArea"])} />
            </Field>
            <Field label="客户真实问题">
              <input value={form.customerQuestion} onChange={(event) => onChange("customerQuestion", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="关联项目（可多个，逗号分隔）">
              <input value={form.relatedCases} onChange={(event) => onChange("relatedCases", event.target.value)} placeholder="重庆开埠遗址公园,山城坝坝" className={inputClassName} />
            </Field>
            <Field label="对应案例兼容字段">
              <input value={form.relatedCase} onChange={(event) => onChange("relatedCase", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="目标客户类型">
              <SelectInput value={form.targetClient} options={targetClients} onChange={(value) => onChange("targetClient", value as TopicForm["targetClient"])} />
            </Field>
          </FormSection>

          <FormSection title="文章主图" columns="md:grid-cols-1">
            <ArticleImageField
              title="文章列表主图 / 详情页主图"
              image={form.coverImage}
              caption={form.coverImageCaption}
              alt={form.coverImageAlt}
              uploading={uploadingKey === "coverImage"}
              onImageChange={(value) => onChange("coverImage", value)}
              onCaptionChange={(value) => onChange("coverImageCaption", value)}
              onAltChange={(value) => onChange("coverImageAlt", value)}
              onUpload={(file) => handleArticleImageUpload(file, "coverImage", (url) => onChange("coverImage", url))}
            />
            {uploadMessage ? <p className="text-sm text-moss">{uploadMessage}</p> : null}
          </FormSection>

          <FormSection title="内容生产" columns="md:grid-cols-2">
            <Field label="内容摘要">
              <textarea value={form.summary} onChange={(event) => onChange("summary", event.target.value)} className={textareaClassName} />
            </Field>
            <Field label="文章正文 content（Markdown）" className="md:col-span-2">
              <div className="overflow-hidden border border-line bg-rice">
                <div className="flex flex-wrap gap-2 border-b border-line bg-paper p-3">
                  <MarkdownToolButton label="H1" title="插入一级标题" onClick={() => insertMarkdown("# ", "", "一级标题")} />
                  <MarkdownToolButton label="H2" title="插入二级标题" onClick={() => insertMarkdown("## ", "", "二级标题")} />
                  <MarkdownToolButton label="H3" title="插入三级标题" onClick={() => insertMarkdown("### ", "", "三级标题")} />
                  <MarkdownToolButton label="正文" title="插入普通段落" onClick={() => insertStandaloneMarkdown("普通段落")} />
                  <MarkdownToolButton label="B" title="加粗选中文字" onClick={() => insertMarkdown("**", "**", "加粗文字")} />
                  <MarkdownToolButton label="引用" title="插入引用段落" onClick={() => insertMarkdown("> ", "", "引用内容")} />
                  <MarkdownToolButton label="重点" title="插入重点提示" onClick={() => insertMarkdown("重点：", "", "重点内容")} />
                  <MarkdownToolButton label="陶土色" title="插入陶土色重点文字" onClick={() => insertMarkdown("{{clay:", "}}", "重点文字")} />
                  <MarkdownToolButton label="墨绿色" title="插入墨绿色重点文字" onClick={() => insertMarkdown("{{moss:", "}}", "重点文字")} />
                  <MarkdownToolButton label="分隔线" title="插入分隔线" onClick={() => insertStandaloneMarkdown("---")} />
                  <MarkdownToolButton
                    label={uploadingKey === "content-image" ? "上传中..." : "插入图片"}
                    title="上传图片并插入到当前光标位置"
                    disabled={uploadingKey === "content-image"}
                    onClick={() => contentImageInputRef.current?.click()}
                  />
                  <input
                    ref={contentImageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      void uploadContentImage(event.target.files?.[0]);
                      event.target.value = "";
                    }}
                  />
                </div>
                <textarea
                  ref={contentRef}
                  value={form.content}
                  onChange={(event) => {
                    latestContentRef.current = event.target.value;
                    onChange("content", event.target.value);
                  }}
                  className="min-h-[600px] w-full resize-y bg-rice px-4 py-4 font-mono text-sm leading-7 text-ink outline-none"
                  placeholder={"## 二级标题\n\n正文段落，支持 **加粗**、> 引用、重点提示和图片。\n\n![图片说明](/uploads/article-image.jpg)"}
                />
              </div>
              <span className="text-xs font-normal leading-6 text-ink/48">
                正文统一保存为 Markdown 文本。图片上传后只写入公网 URL，不保存 base64；可直接编辑图片语法中的说明文字。
              </span>
            </Field>
            <Field label="文章大纲">
              <textarea value={form.outline} onChange={(event) => onChange("outline", event.target.value)} className={textareaClassName} />
            </Field>
            <Field label="参考资料">
              <textarea value={form.references} onChange={(event) => onChange("references", event.target.value)} className={textareaClassName} />
            </Field>
            <Field label="需补充素材">
              <textarea value={form.requiredAssets} onChange={(event) => onChange("requiredAssets", event.target.value)} className={textareaClassName} />
            </Field>
            <Field label="审核意见">
              <textarea value={form.reviewNotes} onChange={(event) => onChange("reviewNotes", event.target.value)} className={textareaClassName} />
            </Field>
          </FormSection>

          <FormSection title="发布复盘">
            <Field label="阅读量 / 平台数据">
              <input type="number" min="0" value={form.views} onChange={(event) => onChange("views", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="带来线索数">
              <input type="number" min="0" value={form.leads} onChange={(event) => onChange("leads", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="AI 是否识别溯观">
              <SelectInput value={form.aiRecognized} options={["是", "否"] as const} onChange={(value) => onChange("aiRecognized", value as "是" | "否")} />
            </Field>
            <Field label="AI 是否引用本内容">
              <SelectInput value={form.aiCited} options={["是", "否"] as const} onChange={(value) => onChange("aiCited", value as "是" | "否")} />
            </Field>
            <Field label="GEO 测试结果">
              <input value={form.geoTestResult} onChange={(event) => onChange("geoTestResult", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="下一步优化建议">
              <input value={form.nextOptimization} onChange={(event) => onChange("nextOptimization", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="发布后复盘" className="md:col-span-3">
              <textarea value={form.notes} onChange={(event) => onChange("notes", event.target.value)} className={textareaClassName} />
            </Field>
          </FormSection>

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="border border-line px-5 py-3 text-sm font-medium text-ink/64 hover:border-ink hover:text-ink">
              取消
            </button>
            <button type="submit" className="bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-moss">
              保存内容记录
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GeoQuestionsModal({ questions, onClose }: { questions: string[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/44 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl border border-line bg-paper p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-clay">GEO TEST QUESTIONS</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">待测试问题</h2>
          </div>
          <button type="button" onClick={onClose} className="border border-line px-3 py-2 text-sm text-ink/64 hover:border-ink hover:text-ink">
            关闭
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          {questions.map((question, index) => (
            <div key={`${question}-${index}`} className="border border-line bg-rice p-4 text-sm leading-6 text-ink/72">
              <span className="mr-3 font-mono text-xs text-clay">{String(index + 1).padStart(2, "0")}</span>
              {question}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArticleImageField({
  title,
  image,
  caption,
  alt,
  uploading,
  onImageChange,
  onCaptionChange,
  onAltChange,
  onUpload
}: {
  title: string;
  image: string;
  caption: string;
  alt: string;
  uploading: boolean;
  onImageChange: (value: string) => void;
  onCaptionChange: (value: string) => void;
  onAltChange: (value: string) => void;
  onUpload: (file?: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid gap-4 border border-line bg-rice p-4 lg:grid-cols-[18rem_1fr]">
      <CaseImage src={image} className="aspect-[16/10] border border-line bg-paper" fallbackLabel="文章主图" />
      <div className="grid content-start gap-3">
        <div className="text-sm font-semibold text-ink">{title}</div>
        <input value={image} onChange={(event) => onImageChange(event.target.value)} placeholder="/uploads/article-cover.jpg 或上传后自动写入 URL" className={inputClassName} />
        <input value={caption} onChange={(event) => onCaptionChange(event.target.value)} placeholder="图片名称 / 图片说明" className={inputClassName} />
        <input value={alt} onChange={(event) => onAltChange(event.target.value)} placeholder="图片 alt，留空时使用图片名称或文章标题" className={inputClassName} />
        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              onUpload(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} className="bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-moss disabled:opacity-60">
            {uploading ? "上传中..." : "上传图片"}
          </button>
          <button type="button" onClick={() => onImageChange("")} className="border border-line px-4 py-3 text-sm text-ink/62 transition hover:border-ink hover:text-ink">
            清空图片
          </button>
        </div>
      </div>
    </div>
  );
}

function MarkdownToolButton({
  label,
  title,
  onClick,
  disabled = false
}: {
  label: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className="h-9 border border-line bg-rice px-3 text-xs font-medium text-ink/68 transition hover:border-ink hover:text-ink disabled:cursor-wait disabled:opacity-50"
    >
      {label}
    </button>
  );
}

function SelectFilter({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid min-w-36 gap-1 text-xs font-medium text-ink/54">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 border border-line bg-rice px-3 text-xs text-ink outline-none focus:border-ink">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function FormSection({ title, columns = "md:grid-cols-3", children }: { title: string; columns?: string; children: ReactNode }) {
  return (
    <section className="grid gap-4">
      <h3 className="border-b border-line pb-2 text-sm font-semibold text-ink">{title}</h3>
      <div className={`grid gap-4 ${columns}`}>{children}</div>
    </section>
  );
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`grid gap-2 text-xs font-medium text-ink/58 ${className}`}>
      {label}
      {children}
    </label>
  );
}

function SelectInput({ value, options, onChange }: { value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClassName}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function toForm(topic: GeoContentTopic): TopicForm {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, views, leads, aiRecognized, aiCited, publishToWebsite, ...rest } = topic;
  return {
    ...rest,
    content: topic.content?.trim() || legacyBlocksToMarkdown(topic.blocks),
    views: String(views),
    leads: String(leads),
    aiRecognized: aiRecognized ? "是" : "否",
    aiCited: aiCited ? "是" : "否",
    publishToWebsite: publishToWebsite ? "是" : "否"
  };
}

function fromForm(form: TopicForm, id: string, updatedAt: string, createdAt?: string): GeoContentTopic {
  return {
    ...form,
    id,
    views: Number(form.views) || 0,
    leads: Number(form.leads) || 0,
    aiRecognized: form.aiRecognized === "是",
    aiCited: form.aiCited === "是",
    publishToWebsite: form.publishToWebsite === "是",
    createdAt: createdAt || updatedAt,
    updatedAt
  };
}

const inputClassName = "h-11 w-full border border-line bg-rice px-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-ink";
const textareaClassName = "min-h-32 w-full border border-line bg-rice px-3 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-ink/35 focus:border-ink";
