"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { CaseImage } from "@/components/CaseImage";
import {
  createEmptyCaseCmsItem,
  defaultCampCaseSections,
  type CampCaseImage,
  type CampCaseSection,
  type CaseCmsItem
} from "@/src/config/caseCms";
import { businessCategories } from "@/src/data/cases";
import { useCaseCms } from "@/src/hooks/useCaseCms";
import { uploadImage } from "@/src/lib/uploadImage";

type TextArrayField = "painPoints" | "services" | "strategy" | "results" | "capabilities" | "suitableClients" | "geoKeywords" | "tags";
type MultiImageField = "galleryImages" | "assetImages";
type SingleImageField = "coverImage" | "heroImage" | "sceneImage01" | "sceneImage02" | "sceneImage03";

const imageFields: Array<{ key: SingleImageField; label: string; size: string }> = [
  { key: "coverImage", label: "案例封面图 / 详情页主视觉大图", size: "1920 x 1200px，列表封面与详情页主视觉" },
  { key: "heroImage", label: "详情页图集 01", size: "1600 x 1200px，4:3 或 16:10" },
  { key: "sceneImage01", label: "详情页图集 02", size: "1600 x 1200px，4:3 或 16:10" },
  { key: "sceneImage02", label: "详情页图集 03", size: "1600 x 1200px，4:3 或 16:10" },
  { key: "sceneImage03", label: "详情页补充图", size: "1920 x 1080px，可选更多现场图" }
];

const arrayFields: Array<{ key: TextArrayField; label: string; hint: string }> = [
  { key: "painPoints", label: "项目痛点", hint: "每行一条" },
  { key: "services", label: "溯观服务内容", hint: "每行一条" },
  { key: "strategy", label: "核心策略", hint: "每行一条" },
  { key: "results", label: "项目成果", hint: "每行一条" },
  { key: "capabilities", label: "可证明的公司能力", hint: "每行一条" },
  { key: "suitableClients", label: "适合客户参考", hint: "每行一条" },
  { key: "geoKeywords", label: "GEO 关键词", hint: "每行一条或逗号分隔" },
  { key: "tags", label: "案例标签", hint: "逗号分隔，例如 研学亲子营地, 乡村文旅" }
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

function createBlankCampSection(): CampCaseSection {
  return {
    id: `camp-${Date.now()}`,
    projectName: "",
    location: "",
    intro: "",
    guideMapImage: "",
    guideMapCaption: "项目导览图",
    realImages: Array.from({ length: 5 }, (_, index) => ({ url: "", caption: `营地实景图 ${index + 1}` }))
  };
}

function normalizeCampSectionForEdit(section: CampCaseSection): CampCaseSection {
  const realImages = [...section.realImages.slice(0, 5)];
  while (realImages.length < 5) {
    realImages.push({ url: "", caption: `营地实景图 ${realImages.length + 1}` });
  }
  return {
    ...section,
    guideMapCaption: section.guideMapCaption || "项目导览图",
    realImages
  };
}

function validateImagePath(path: string) {
  return new Promise<boolean>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = `${path}${path.includes("?") ? "&" : "?"}t=${Date.now()}`;
  });
}

function ImageUploadControl({
  label,
  value,
  size,
  fallbackLabel,
  isUploading,
  onChange,
  onUpload,
  onClear,
  onCheck
}: {
  label: string;
  value: string;
  size?: string;
  fallbackLabel: string;
  isUploading: boolean;
  onChange: (value: string) => void;
  onUpload: (file?: File) => void;
  onClear: () => void;
  onCheck: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border border-line bg-rice p-4">
      <label className="block">
        <span className="text-xs text-ink/44">{label}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="上传后自动写入 URL，也可手动填写"
          className="mt-2 w-full border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
        />
      </label>
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
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="border border-ink bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "上传中..." : "上传图片"}
        </button>
        <button type="button" onClick={onClear} className="border border-line px-4 py-3 text-sm font-medium text-ink/64 transition hover:border-ink hover:text-ink">
          清空图片
        </button>
        <button type="button" onClick={onCheck} className="border border-line px-4 py-3 text-sm font-medium text-ink/64 transition hover:border-ink hover:text-ink">
          检查可访问
        </button>
      </div>
      {size ? <div className="mt-2 text-xs text-ink/46">建议尺寸：{size}</div> : null}
      <CaseImage src={value} className="mt-4 aspect-[16/10]" fallbackLabel={fallbackLabel} />
    </div>
  );
}

function MultiImageSection({
  title,
  description,
  images,
  isUploading,
  onUpload,
  onRemove
}: {
  title: string;
  description: string;
  images: string[];
  isUploading: boolean;
  onUpload: (files?: FileList | null) => void;
  onRemove: (index: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="border border-line bg-rice p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="mt-2 text-xs leading-5 text-ink/50">{description}</p>
        </div>
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="shrink-0 border border-ink bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "上传中..." : "上传多图"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          onUpload(event.target.files);
          event.target.value = "";
        }}
      />
      {images.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {images.map((src, index) => (
            <div key={`${src}-${index}`} className="border border-line bg-paper p-3">
              <CaseImage src={src} className="aspect-[4/3] w-full" fallbackLabel={`图片 ${index + 1}`} />
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-ink/42">#{index + 1}</span>
                <button type="button" onClick={() => onRemove(index)} className="border border-line px-3 py-2 text-xs text-ink/62 transition hover:border-ink hover:text-ink">
                  删除
                </button>
              </div>
              <p className="mt-2 break-all text-xs leading-5 text-ink/40">{src}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 border border-dashed border-line bg-paper px-4 py-8 text-center text-sm text-ink/42">暂未上传图片</div>
      )}
    </section>
  );
}

function CampSectionEditor({
  section,
  index,
  isOpen,
  uploadingKey,
  onToggle,
  onRemove,
  onChange,
  onGuideUpload,
  onRealImageUpload,
  onCheckImage
}: {
  section: CampCaseSection;
  index: number;
  isOpen: boolean;
  uploadingKey: string;
  onToggle: () => void;
  onRemove: () => void;
  onChange: (nextSection: CampCaseSection) => void;
  onGuideUpload: (file?: File) => void;
  onRealImageUpload: (imageIndex: number, file?: File) => void;
  onCheckImage: (url: string) => void;
}) {
  const configuredImageCount = (section.guideMapImage ? 1 : 0) + section.realImages.filter((image) => image.url).length;

  function updateRealImage(imageIndex: number, nextImage: CampCaseImage) {
    const nextImages = [...section.realImages];
    nextImages[imageIndex] = nextImage;
    onChange({ ...section, realImages: nextImages });
  }

  return (
    <article className="border border-line bg-paper">
      <button type="button" onClick={onToggle} className="flex w-full flex-col gap-2 p-4 text-left sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-base font-semibold text-ink">{section.projectName || `专项项目 ${index + 1}`}</h4>
          <p className="mt-1 text-xs text-ink/50">
            {section.location || "地点待补充"} ｜已配置图片 {configuredImageCount} 张
          </p>
        </div>
        <span className="text-sm text-clay">{isOpen ? "收起" : "展开"}</span>
      </button>

      {isOpen ? (
        <div className="border-t border-line p-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="text-xs text-ink/44">项目名称</span>
              <input value={section.projectName} onChange={(event) => onChange({ ...section, projectName: event.target.value })} className="mt-2 w-full border border-line bg-rice px-4 py-3 text-sm outline-none focus:border-ink" />
            </label>
            <label className="block">
              <span className="text-xs text-ink/44">项目地点</span>
              <input value={section.location} onChange={(event) => onChange({ ...section, location: event.target.value })} className="mt-2 w-full border border-line bg-rice px-4 py-3 text-sm outline-none focus:border-ink" />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="text-xs text-ink/44">项目介绍段落</span>
            <textarea value={section.intro} rows={4} onChange={(event) => onChange({ ...section, intro: event.target.value })} className="mt-2 w-full border border-line bg-rice px-4 py-3 text-sm leading-7 outline-none focus:border-ink" />
          </label>

          <div className="mt-5">
            <ImageUploadControl
              label="项目导览图"
              value={section.guideMapImage}
              size="宽 1200px - 1600px，偏竖版或接近海报比例"
              fallbackLabel="项目导览图"
              isUploading={uploadingKey === `${section.id}.guideMapImage`}
              onChange={(value) => onChange({ ...section, guideMapImage: value })}
              onUpload={onGuideUpload}
              onClear={() => onChange({ ...section, guideMapImage: "" })}
              onCheck={() => onCheckImage(section.guideMapImage)}
            />
            <label className="mt-3 block">
              <span className="text-xs text-ink/44">导览图名称</span>
              <input value={section.guideMapCaption} onChange={(event) => onChange({ ...section, guideMapCaption: event.target.value })} className="mt-2 w-full border border-line bg-rice px-4 py-3 text-sm outline-none focus:border-ink" />
            </label>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {section.realImages.slice(0, 5).map((image, imageIndex) => (
              <div key={`${section.id}-real-${imageIndex}`} className="border border-line bg-rice p-4">
                <ImageUploadControl
                  label={`项目实景图 ${imageIndex + 1}`}
                  value={image.url}
                  fallbackLabel={`项目实景图 ${imageIndex + 1}`}
                  isUploading={uploadingKey === `${section.id}.realImages.${imageIndex}`}
                  onChange={(value) => updateRealImage(imageIndex, { ...image, url: value })}
                  onUpload={(file) => onRealImageUpload(imageIndex, file)}
                  onClear={() => updateRealImage(imageIndex, { ...image, url: "" })}
                  onCheck={() => onCheckImage(image.url)}
                />
                <label className="mt-3 block">
                  <span className="text-xs text-ink/44">图片名称</span>
                  <input value={image.caption} onChange={(event) => updateRealImage(imageIndex, { ...image, caption: event.target.value })} className="mt-2 w-full border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink" />
                </label>
              </div>
            ))}
          </div>

          <button type="button" onClick={onRemove} className="mt-5 border border-line px-4 py-3 text-sm text-ink/64 transition hover:border-clay hover:text-clay">
            删除这个专项项目
          </button>
        </div>
      ) : null}
    </article>
  );
}

export function CaseCmsManager() {
  const { cases, upsertCase, deleteCase, saveCases, restoreDefaults, storageKey } = useCaseCms();
  const [editingCase, setEditingCase] = useState<CaseCmsItem | null>(null);
  const [originalSlug, setOriginalSlug] = useState("");
  const [message, setMessage] = useState("当前为案例 CMS，数据保存到浏览器 localStorage，并尝试同步到 Netlify Functions。");
  const [uploadingKey, setUploadingKey] = useState("");
  const [openCampSectionIds, setOpenCampSectionIds] = useState<Set<string>>(new Set());
  const importInputRef = useRef<HTMLInputElement>(null);

  const sortedCases = useMemo(() => [...cases].sort((a, b) => a.order - b.order), [cases]);

  function startCreate() {
    const nextOrder = sortedCases.length ? Math.max(...sortedCases.map((item) => item.order)) + 1 : 1;
    setEditingCase(createEmptyCaseCmsItem(nextOrder));
    setOriginalSlug("");
    setOpenCampSectionIds(new Set());
    setMessage("正在新增案例，请填写内容后保存。");
  }

  function startEdit(item: CaseCmsItem) {
    setEditingCase({
      ...item,
      campCaseSections: (item.campCaseSections || []).map(normalizeCampSectionForEdit)
    });
    setOriginalSlug(item.slug);
    setOpenCampSectionIds(new Set());
    setMessage(`正在编辑：${item.projectName}`);
  }

  function updateField<T extends keyof CaseCmsItem>(key: T, value: CaseCmsItem[T]) {
    setEditingCase((current) => (current ? { ...current, [key]: value } : current));
  }

  function updateTextField(key: keyof CaseCmsItem, value: string) {
    updateField(key, value as never);
    if (key === "projectName" && editingCase && !editingCase.slug) {
      updateField("slug", slugify(value));
    }
  }

  async function uploadCaseImage(file: File | undefined, fieldKey: string) {
    if (!file) return "";
    setUploadingKey(fieldKey);
    setMessage("图片正在上传...");
    try {
      const url = await uploadImage(file, {
        scope: "cases",
        caseSlug: editingCase?.slug || editingCase?.projectName || "case",
        fieldKey
      });
      setMessage("图片上传成功，已自动写入 URL。");
      return url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "图片上传失败，请稍后重试。");
      return "";
    } finally {
      setUploadingKey("");
    }
  }

  async function handleSingleImageUpload(fieldKey: SingleImageField, file?: File) {
    const url = await uploadCaseImage(file, fieldKey);
    if (url) updateField(fieldKey, url);
  }

  async function handleMultiImageUpload(fieldKey: MultiImageField, files?: FileList | null) {
    if (!files?.length) return;
    setUploadingKey(fieldKey);
    const uploadedUrls: string[] = [];
    for (const [index, file] of Array.from(files).entries()) {
      const url = await uploadCaseImage(file, `${fieldKey}-${Date.now()}-${index}`);
      if (url) uploadedUrls.push(url);
    }
    setEditingCase((current) => current ? { ...current, [fieldKey]: [...current[fieldKey], ...uploadedUrls] } : current);
    setUploadingKey("");
  }

  async function handleCampGuideUpload(sectionIndex: number, file?: File) {
    const section = editingCase?.campCaseSections[sectionIndex];
    if (!section) return;
    const key = `${section.id}.guideMapImage`;
    const url = await uploadCaseImage(file, key);
    if (!url) return;
    updateCampSection(sectionIndex, { ...section, guideMapImage: url });
  }

  async function handleCampRealImageUpload(sectionIndex: number, imageIndex: number, file?: File) {
    const section = editingCase?.campCaseSections[sectionIndex];
    if (!section) return;
    const key = `${section.id}.realImages.${imageIndex}`;
    const url = await uploadCaseImage(file, key);
    if (!url) return;
    const realImages = [...section.realImages];
    realImages[imageIndex] = { ...realImages[imageIndex], url };
    updateCampSection(sectionIndex, { ...section, realImages });
  }

  function removeMultiImage(fieldKey: MultiImageField, index: number) {
    setEditingCase((current) => current ? { ...current, [fieldKey]: current[fieldKey].filter((_, imageIndex) => imageIndex !== index) } : current);
  }

  function updateCampSection(index: number, nextSection: CampCaseSection) {
    setEditingCase((current) => {
      if (!current) return current;
      const nextSections = [...current.campCaseSections];
      nextSections[index] = normalizeCampSectionForEdit(nextSection);
      return { ...current, campCaseSections: nextSections };
    });
  }

  function addCampSection(section: CampCaseSection = createBlankCampSection()) {
    const normalizedSection = normalizeCampSectionForEdit(section);
    setEditingCase((current) => current ? { ...current, campCaseSections: [...current.campCaseSections, normalizedSection] } : current);
    setOpenCampSectionIds((current) => new Set([...current, normalizedSection.id]));
  }

  function addDefaultCampSections() {
    setEditingCase((current) => {
      if (!current) return current;
      const existingIds = new Set(current.campCaseSections.map((section) => section.id));
      const nextSections = [
        ...current.campCaseSections,
        ...defaultCampCaseSections.filter((section) => !existingIds.has(section.id)).map(normalizeCampSectionForEdit)
      ];
      return { ...current, campCaseSections: nextSections };
    });
  }

  function removeCampSection(index: number) {
    setEditingCase((current) => current ? { ...current, campCaseSections: current.campCaseSections.filter((_, sectionIndex) => sectionIndex !== index) } : current);
  }

  function toggleCampSection(id: string) {
    setOpenCampSectionIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
    const normalizedSlug = slugify(editingCase.slug);
    const duplicate = cases.some((item) => item.slug === normalizedSlug && item.slug !== originalSlug);
    if (duplicate) {
      setMessage("案例 slug 已存在，请换一个唯一 slug。");
      return;
    }

    upsertCase(
      {
        ...editingCase,
        slug: normalizedSlug,
        order: Number(editingCase.order) || sortedCases.length + 1,
        campCaseSections: editingCase.campCaseSections.map((section) => ({
          ...section,
          realImages: section.realImages.filter((image) => image.url || image.caption).slice(0, 5)
        }))
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
    if (editingCase?.slug === slug) setEditingCase(null);
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
          setMessage("导入失败：JSON 必须为案例数组。");
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
              后台新增、编辑或删除案例后，前台项目案例列表、详情页和首页代表案例区会读取同一份案例数据。营地专项模块可用于百草湖乡等案例详情页的多项目展示。
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
                  value={String(editingCase[key as keyof CaseCmsItem] || "")}
                  onChange={(event) => updateTextField(key as keyof CaseCmsItem, event.target.value)}
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
              <ImageUploadControl
                key={field.key}
                label={field.label}
                value={editingCase[field.key]}
                size={field.size}
                fallbackLabel={field.label}
                isUploading={uploadingKey === field.key}
                onChange={(value) => updateField(field.key, value)}
                onUpload={(file) => handleSingleImageUpload(field.key, file)}
                onClear={() => updateField(field.key, "")}
                onCheck={() => checkImageUrl(editingCase[field.key])}
              />
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <MultiImageSection
              title="案例图集 Gallery Images（核心展示）"
              description="用于前台案例详情页主图集展示，建议 3-8 张。支持一次选择多张，上传后可删除单张。"
              images={editingCase.galleryImages}
              isUploading={uploadingKey === "galleryImages"}
              onUpload={(files) => handleMultiImageUpload("galleryImages", files)}
              onRemove={(index) => removeMultiImage("galleryImages", index)}
            />
            <MultiImageSection
              title="产业 / 运营补充图 Asset Images"
              description="用于商业业态、产品细节、运营现场、人流活动、商铺展示等补充素材。"
              images={editingCase.assetImages}
              isUploading={uploadingKey === "assetImages"}
              onUpload={(files) => handleMultiImageUpload("assetImages", files)}
              onRemove={(index) => removeMultiImage("assetImages", index)}
            />
          </div>

          <section className="mt-8 border border-line bg-rice p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold text-ink">研学亲子营地建设专项</p>
                <p className="mt-2 max-w-3xl text-xs leading-5 text-ink/52">
                  用于在案例详情页中展示多个营地/乡村文旅项目的专项介绍，每个项目可上传导览图和实景图。
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={addDefaultCampSections} className="border border-line bg-paper px-4 py-3 text-sm text-ink transition hover:border-ink">
                  补齐默认 6 个项目
                </button>
                <button type="button" onClick={() => addCampSection()} className="border border-ink bg-ink px-4 py-3 text-sm text-paper transition hover:bg-moss">
                  添加项目板块
                </button>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {editingCase.campCaseSections.length ? (
                editingCase.campCaseSections.map((section, index) => (
                  <CampSectionEditor
                    key={section.id}
                    section={section}
                    index={index}
                    isOpen={openCampSectionIds.has(section.id)}
                    uploadingKey={uploadingKey}
                    onToggle={() => toggleCampSection(section.id)}
                    onRemove={() => removeCampSection(index)}
                    onChange={(nextSection) => updateCampSection(index, nextSection)}
                    onGuideUpload={(file) => handleCampGuideUpload(index, file)}
                    onRealImageUpload={(imageIndex, file) => handleCampRealImageUpload(index, imageIndex, file)}
                    onCheckImage={checkImageUrl}
                  />
                ))
              ) : (
                <div className="border border-dashed border-line bg-paper px-4 py-8 text-center text-sm text-ink/42">
                  暂未配置专项项目，可点击“补齐默认 6 个项目”。
                </div>
              )}
            </div>
          </section>

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
                  value={String(editingCase[key as keyof CaseCmsItem] || "")}
                  onChange={(event) => updateTextField(key as keyof CaseCmsItem, event.target.value)}
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
