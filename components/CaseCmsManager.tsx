"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { CaseImage } from "@/components/CaseImage";
import { createEmptyCaseCmsItem, type CaseCmsItem } from "@/src/config/caseCms";
import { businessCategories } from "@/src/data/cases";
import { useCaseCms } from "@/src/hooks/useCaseCms";
import { uploadImage } from "@/src/lib/uploadImage";

type TextArrayField = "painPoints" | "services" | "strategy" | "results" | "capabilities" | "suitableClients" | "geoKeywords" | "tags";
type TextField = keyof Omit<CaseCmsItem, TextArrayField | "order" | "isPublished" | "isFeatured" | "businessCategory">;

const imageFields: Array<{ key: "coverImage" | "heroImage" | "sceneImage01" | "sceneImage02" | "sceneImage03"; label: string; size: string }> = [
  { key: "coverImage", label: "案例封面图", size: "1600 x 1000px，16:10" },
  { key: "heroImage", label: "案例详情主图", size: "1920 x 960px，详情页顶部宽图" },
  { key: "sceneImage01", label: "场景图 1", size: "1600 x 900px，16:9" },
  { key: "sceneImage02", label: "场景图 2", size: "1600 x 900px，16:9" },
  { key: "sceneImage03", label: "场景图 3，可选", size: "1600 x 900px，16:9" }
];

const arrayFields: Array<{ key: TextArrayField; label: string; hint: string }> = [
  { key: "painPoints", label: "项目痛点", hint: "每行一条" },
  { key: "services", label: "溯观服务内容", hint: "每行一条" },
  { key: "strategy", label: "核心策略", hint: "每行一条" },
  { key: "results", label: "项目成果", hint: "每行一条" },
  { key: "capabilities", label: "可证明的公司能力", hint: "每行一条" },
  { key: "suitableClients", label: "适合客户参考", hint: "每行一条" },
  { key: "geoKeywords", label: "GEO 关键词", hint: "每行一条或逗号分隔" },
  { key: "tags", label: "案例标签", hint: "逗号分隔，例如 城市更新, 历史文化空间" }
];

function splitText(value: string) {
  return value
    .split(/[\n,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinText(items: string[]) {
  return items.join("\n");
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateImagePath(path: string) {
  return new Promise<boolean>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = `${path}${path.includes("?") ? "&" : "?"}t=${Date.now()}`;
  });
}

export function CaseCmsManager() {
  const { cases, upsertCase, deleteCase, saveCases, restoreDefaults, storageKey } = useCaseCms();
  const [editingCase, setEditingCase] = useState<CaseCmsItem | null>(null);
  const [originalSlug, setOriginalSlug] = useState("");
  const [message, setMessage] = useState("当前为本地案例 CMS，数据保存到浏览器 localStorage。");
  const importInputRef = useRef<HTMLInputElement>(null);
  const imageUploadInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploadingImageField, setUploadingImageField] = useState<string>("");

  const sortedCases = useMemo(() => [...cases].sort((a, b) => a.order - b.order), [cases]);

  function startCreate() {
    const nextOrder = sortedCases.length ? Math.max(...sortedCases.map((item) => item.order)) + 1 : 1;
    setEditingCase(createEmptyCaseCmsItem(nextOrder));
    setOriginalSlug("");
    setMessage("正在新增案例，请填写内容后保存。");
  }

  function startEdit(item: CaseCmsItem) {
    setEditingCase({ ...item });
    setOriginalSlug(item.slug);
    setMessage(`正在编辑：${item.projectName}`);
  }

  function updateField<T extends keyof CaseCmsItem>(key: T, value: CaseCmsItem[T]) {
    setEditingCase((current) => (current ? { ...current, [key]: value } : current));
  }

  function updateTextField(key: TextField, value: string) {
    updateField(key, value as CaseCmsItem[TextField]);
    if (key === "projectName" && editingCase && !editingCase.slug) {
      updateField("slug", slugify(value));
    }
  }

  async function handleImageUpload(fieldKey: (typeof imageFields)[number]["key"], file?: File) {
    if (!file) {
      return;
    }

    setUploadingImageField(fieldKey);
    setMessage("图片正在通过 Netlify Functions 上传...");

    try {
      const url = await uploadImage(file, {
        scope: "cases",
        caseSlug: editingCase?.slug || editingCase?.projectName || "case",
        fieldKey
      });
      updateField(fieldKey, url);
      setMessage("图片上传成功，已自动写入公网 URL。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "图片上传失败，请稍后重试。");
    } finally {
      setUploadingImageField("");
    }
  }

  async function checkImageUrl(url: string) {
    if (!url.trim()) {
      setMessage("当前图片 URL 为空。");
      return;
    }

    const isValid = await validateImagePath(url.trim());
    setMessage(isValid ? "图片可访问。" : "图片路径无效或图片不存在。");
  }

  function handleSave() {
    if (!editingCase) return;

    if (!editingCase.projectName.trim() || !editingCase.slug.trim()) {
      setMessage("项目名称和案例 slug 必填。");
      return;
    }

    const duplicate = cases.some((item) => item.slug === editingCase.slug && item.slug !== originalSlug);
    if (duplicate) {
      setMessage("案例 slug 已存在，请换一个唯一 slug。");
      return;
    }

    upsertCase(
      {
        ...editingCase,
        slug: slugify(editingCase.slug),
        order: Number(editingCase.order) || sortedCases.length + 1
      },
      originalSlug
    );
    setEditingCase(null);
    setOriginalSlug("");
    setMessage("案例已保存，前台案例列表和详情页会读取最新数据。");
  }

  function handleDelete(slug: string) {
    const target = cases.find((item) => item.slug === slug);
    const confirmed = window.confirm(`确认删除案例「${target?.projectName || slug}」吗？删除后前台不再显示。`);
    if (!confirmed) return;

    deleteCase(slug);
    if (editingCase?.slug === slug) {
      setEditingCase(null);
    }
    setMessage("案例已删除。");
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(sortedCases, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "suguan-cases.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("已导出案例 JSON。");
  }

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "[]"));
        if (!Array.isArray(parsed)) {
          setMessage("导入失败：JSON 须为案例数组。");
          return;
        }
        saveCases(parsed as CaseCmsItem[]);
        setMessage("案例 JSON 已导入。");
      } catch {
        setMessage("导入失败：JSON 格式不正确。");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  function handleRestoreDefaults() {
    const confirmed = window.confirm("确认恢复默认案例数据吗？当前本地编辑的案例会被清除。");
    if (!confirmed) return;
    restoreDefaults();
    setEditingCase(null);
    setMessage("已恢复默认案例数据。");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="border border-line bg-paper p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium tracking-[0.24em] text-clay">CASE CMS</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold text-ink">案例管理</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-ink/62">
              后台新增、编辑或删除案例后，前台项目案例列表、详情页和首页代表案例区会读取同一份本地案例数据。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" onClick={startCreate} className="bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-moss">
              新增案例
            </button>
            <button type="button" onClick={handleExport} className="border border-ink px-5 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper">
              导出案例 JSON
            </button>
            <button type="button" onClick={() => importInputRef.current?.click()} className="border border-line px-5 py-3 text-sm font-medium text-ink transition hover:border-ink">
              导入案例 JSON
            </button>
            <button type="button" onClick={handleRestoreDefaults} className="border border-line px-5 py-3 text-sm font-medium text-ink transition hover:border-ink">
              恢复默认案例数据
            </button>
            <input ref={importInputRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
          </div>
        </div>
        <div className="mt-6 grid gap-3 text-sm text-ink/62 md:grid-cols-3">
          <div className="border border-line bg-rice p-4">
            <div className="text-xs text-ink/44">存储键名</div>
            <div className="mt-2 break-all font-semibold text-ink">{storageKey}</div>
          </div>
          <div className="border border-line bg-rice p-4">
            <div className="text-xs text-ink/44">案例数量</div>
            <div className="mt-2 font-semibold text-ink">{cases.length} 个</div>
          </div>
          <div className="border border-line bg-rice p-4">
            <div className="text-xs text-ink/44">前台显示</div>
            <div className="mt-2 font-semibold text-ink">{cases.filter((item) => item.isPublished).length} 个</div>
          </div>
        </div>
        <p className="mt-5 border border-line bg-rice px-4 py-3 text-sm text-ink/66">{message}</p>
      </section>

      {editingCase ? (
        <section className="border border-line bg-paper p-6 sm:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-clay">{originalSlug ? "EDIT CASE" : "NEW CASE"}</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">{originalSlug ? "编辑案例" : "新增案例"}</h2>
            </div>
            <div className="flex gap-3">
              {editingCase.slug ? (
                <Link href={`/cases/${editingCase.slug}`} className="border border-line px-4 py-3 text-sm text-ink transition hover:border-ink">
                  预览案例
                </Link>
              ) : null}
              <button type="button" onClick={() => setEditingCase(null)} className="border border-line px-4 py-3 text-sm text-ink transition hover:border-ink">
                取消
              </button>
              <button type="button" onClick={handleSave} className="bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-moss">
                保存案例
              </button>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {[
              ["projectName", "项目名称 projectName"],
              ["slug", "案例 slug slug"],
              ["location", "项目地点 location"],
              ["projectType", "项目类型 projectType"],
              ["status", "项目状态 status"],
              ["year", "项目年份 year"],
              ["city", "所属城市 city"]
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-xs text-ink/44">{label}</span>
                <input
                  value={String(editingCase[key as TextField] || "")}
                  onChange={(event) => updateTextField(key as TextField, event.target.value)}
                  className="mt-2 w-full border border-line bg-rice px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                />
              </label>
            ))}
            <label className="block">
              <span className="text-xs text-ink/44">案例排序 order</span>
              <input
                type="number"
                value={editingCase.order}
                onChange={(event) => updateField("order", Number(event.target.value))}
                className="mt-2 w-full border border-line bg-rice px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
              />
            </label>
            <label className="block">
              <span className="text-xs text-ink/44">业务分类 businessCategory</span>
              <select
                value={editingCase.businessCategory}
                onChange={(event) => updateField("businessCategory", event.target.value as CaseCmsItem["businessCategory"])}
                className="mt-2 w-full border border-line bg-rice px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
              >
                {businessCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap items-center gap-5 border border-line bg-rice px-4 py-3">
              <label className="flex items-center gap-2 text-sm text-ink/72">
                <input type="checkbox" checked={editingCase.isPublished} onChange={(event) => updateField("isPublished", event.target.checked)} />
                是否前台显示
              </label>
              <label className="flex items-center gap-2 text-sm text-ink/72">
                <input type="checkbox" checked={editingCase.isFeatured} onChange={(event) => updateField("isFeatured", event.target.checked)} />
                是否首页推荐
              </label>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {imageFields.map((field) => (
              <div key={field.key} className="border border-line bg-rice p-4">
                <label className="block">
                  <span className="text-xs text-ink/44">{field.label}</span>
                  <input
                    value={editingCase[field.key]}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    placeholder="/uploads/case-example-cover.jpg"
                    className="mt-2 w-full border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                  />
                </label>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <input
                    ref={(node) => {
                      imageUploadInputRefs.current[field.key] = node;
                    }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      handleImageUpload(field.key, event.target.files?.[0]);
                      event.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploadingImageField === field.key}
                    onClick={() => imageUploadInputRefs.current[field.key]?.click()}
                    className="border border-ink bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploadingImageField === field.key ? "上传中..." : "上传图片"}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField(field.key, "")}
                    className="border border-line px-4 py-3 text-sm font-medium text-ink/64 transition hover:border-ink hover:text-ink"
                  >
                    清空图片
                  </button>
                  <button
                    type="button"
                    onClick={() => checkImageUrl(editingCase[field.key])}
                    className="border border-line px-4 py-3 text-sm font-medium text-ink/64 transition hover:border-ink hover:text-ink sm:col-span-2"
                  >
                    检查是否可访问
                  </button>
                </div>
                <p className="mt-2 text-xs leading-5 text-ink/46">
                  支持手动填写 URL，也可通过 Netlify Functions 上传图片。保存案例后前台会读取该图片地址。
                </p>
                <div className="mt-3 text-xs text-ink/46">建议尺寸：{field.size}</div>
                <CaseImage src={editingCase[field.key]} className="mt-4 aspect-[16/9]" fallbackLabel={field.label} />
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5">
            <label className="block">
              <span className="text-xs text-ink/44">项目简介 summary</span>
              <textarea
                rows={3}
                value={editingCase.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                className="mt-2 w-full border border-line bg-rice px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-ink"
              />
            </label>
            {[
              ["background", "项目背景 background"],
              ["value", "项目价值 value"]
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-xs text-ink/44">{label}</span>
                <textarea
                  rows={4}
                  value={String(editingCase[key as TextField] || "")}
                  onChange={(event) => updateTextField(key as TextField, event.target.value)}
                  className="mt-2 w-full border border-line bg-rice px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-ink"
                />
              </label>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {arrayFields.map((field) => (
              <label key={field.key} className="block">
                <span className="text-xs text-ink/44">{field.label}</span>
                <textarea
                  rows={4}
                  value={joinText(editingCase[field.key])}
                  onChange={(event) => updateField(field.key, splitText(event.target.value))}
                  className="mt-2 w-full border border-line bg-rice px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-ink"
                />
                <span className="mt-2 block text-xs text-ink/42">{field.hint}</span>
              </label>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        {sortedCases.map((item) => (
          <article key={item.slug} className="border border-line bg-paper p-5">
            <div className="flex flex-col gap-5 sm:flex-row">
              <CaseImage src={item.coverImage} className="aspect-[16/10] w-full sm:w-44" fallbackLabel="Case Cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-rice px-2 py-1 text-ink/58">排序 {item.order}</span>
                  <span className={item.isPublished ? "bg-ink px-2 py-1 text-paper" : "bg-rice px-2 py-1 text-ink/58"}>
                    {item.isPublished ? "前台显示" : "未发布"}
                  </span>
                  <span className={item.isFeatured ? "bg-clay px-2 py-1 text-paper" : "bg-rice px-2 py-1 text-ink/58"}>
                    {item.isFeatured ? "首页推荐" : "未推荐"}
                  </span>
                  <span className="bg-rice px-2 py-1 text-ink/58">{item.businessCategory}</span>
                </div>
                <div className="mt-3 text-xs text-moss">{item.projectType} · {item.year}</div>
                <h2 className="mt-2 text-xl font-semibold text-ink">{item.projectName || "未命名案例"}</h2>
                <p className="mt-2 break-all text-xs text-ink/46">/{item.slug}</p>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/62">{item.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" onClick={() => startEdit(item)} className="border border-ink px-4 py-2 text-sm text-ink transition hover:bg-ink hover:text-paper">
                    编辑
                  </button>
                  <Link href={`/cases/${item.slug}`} className="border border-line px-4 py-2 text-sm text-ink transition hover:border-ink">
                    预览
                  </Link>
                  <button type="button" onClick={() => handleDelete(item.slug)} className="border border-line px-4 py-2 text-sm text-ink transition hover:border-ink">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
