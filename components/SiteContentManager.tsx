"use client";

import { useEffect, useMemo, useState } from "react";
import { siteContentDefaults, siteContentItems, type SiteContentKey } from "@/src/config/siteContent";
import { useSiteContent } from "@/src/hooks/useSiteContent";

type DraftState = Record<SiteContentKey, string>;

function buildDrafts() {
  return siteContentItems.reduce((drafts, item) => {
    drafts[item.key] = item.defaultValue;
    return drafts;
  }, {} as DraftState);
}

export function SiteContentManager() {
  const { content, getContent, setContent, resetContent, resetAll, storageKey } = useSiteContent();
  const [drafts, setDrafts] = useState<DraftState>(() => buildDrafts());
  const [message, setMessage] = useState("网页文案正式数据保存到服务器 JSON；浏览器仅保留同步缓存。");

  useEffect(() => {
    setDrafts(
      siteContentItems.reduce((nextDrafts, item) => {
        nextDrafts[item.key] = getContent(item.key, item.defaultValue);
        return nextDrafts;
      }, {} as DraftState)
    );
  }, [content, getContent]);

  const savedCount = useMemo(() => Object.keys(content).length, [content]);

  function updateDraft(key: SiteContentKey, value: string) {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [key]: value
    }));
  }

  async function handleSave(key: SiteContentKey) {
    const value = drafts[key]?.trim();
    if (!value) {
      setMessage("文案不能为空，请填写内容后再保存。");
      return;
    }

    try {
      await setContent(key, value);
      setMessage("文案已保存到服务器。");
    } catch (error) {
      setMessage(error instanceof Error ? `保存失败：${error.message}` : "保存失败，请检查服务器数据目录。");
    }
  }

  async function handleReset(key: SiteContentKey) {
    try {
      await resetContent(key);
      setDrafts((currentDrafts) => ({
        ...currentDrafts,
        [key]: siteContentDefaults[key]
      }));
      setMessage("该字段已恢复默认并同步到服务器。");
    } catch (error) {
      setMessage(error instanceof Error ? `恢复失败：${error.message}` : "恢复失败，请检查服务器数据目录。");
    }
  }

  async function handleResetAll() {
    try {
      await resetAll();
      setDrafts(buildDrafts());
      setMessage("全部默认文案已同步到服务器。");
    } catch (error) {
      setMessage(error instanceof Error ? `恢复失败：${error.message}` : "恢复失败，请检查服务器数据目录。");
    }
  }

  return (
    <div className="space-y-6">
      <section className="border border-line bg-paper p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium tracking-[0.24em] text-clay">SITE CONTENT</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold text-ink">网页文案管理</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-ink/62">
              第一阶段先用本地浏览器保存主要官网文案。前台页面会优先读取这里保存的内容；没有保存时，自动使用默认文案配置。
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAll}
            className="border border-ink px-5 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
          >
            一键恢复全部默认文案
          </button>
        </div>

        <div className="mt-6 grid gap-3 text-sm text-ink/62 md:grid-cols-3">
          <div className="border border-line bg-rice p-4">
            <div className="text-xs text-ink/44">存储方式</div>
            <div className="mt-2 font-semibold text-ink">服务器 JSON</div>
          </div>
          <div className="border border-line bg-rice p-4">
            <div className="text-xs text-ink/44">存储键名</div>
            <div className="mt-2 break-all font-semibold text-ink">{storageKey}</div>
          </div>
          <div className="border border-line bg-rice p-4">
            <div className="text-xs text-ink/44">已保存字段</div>
            <div className="mt-2 font-semibold text-ink">{savedCount} 项</div>
          </div>
        </div>

        <p className="mt-5 border border-line bg-rice px-4 py-3 text-sm text-ink/66">{message}</p>
      </section>

      <section className="grid gap-4">
        {siteContentItems.map((item) => {
          const currentValue = getContent(item.key, item.defaultValue);
          const hasSavedValue = Boolean(content[item.key]);

          return (
            <article key={item.key} className="border border-line bg-paper p-5 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[12rem_minmax(0,1fr)]">
                <div>
                  <div className="text-xs text-ink/44">所属页面</div>
                  <div className="mt-2 text-lg font-semibold text-ink">{item.page}</div>
                  <div className="mt-4 text-xs text-ink/44">字段名称</div>
                  <div className="mt-2 text-sm font-semibold text-moss">{item.field}</div>
                  <div className="mt-4 text-xs text-ink/44">状态</div>
                  <div className="mt-2 text-sm text-ink/62">{hasSavedValue ? "已使用自定义文案" : "使用默认文案"}</div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <div className="text-xs text-ink/44">当前内容</div>
                    <div className="mt-2 border border-line bg-rice p-4 text-sm leading-7 text-ink/72">{currentValue}</div>
                  </div>

                  <label className="block">
                    <span className="text-xs text-ink/44">编辑输入框</span>
                    {item.multiline ? (
                      <textarea
                        value={drafts[item.key] || ""}
                        onChange={(event) => updateDraft(item.key, event.target.value)}
                        rows={4}
                        className="mt-2 w-full border border-line bg-rice px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-ink"
                      />
                    ) : (
                      <input
                        value={drafts[item.key] || ""}
                        onChange={(event) => updateDraft(item.key, event.target.value)}
                        className="mt-2 w-full border border-line bg-rice px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                      />
                    )}
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleSave(item.key)}
                      className="bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-moss"
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReset(item.key)}
                      className="border border-line px-5 py-3 text-sm font-medium text-ink transition hover:border-ink"
                    >
                      恢复默认
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
