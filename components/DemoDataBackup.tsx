"use client";

import { ChangeEvent, useRef, useState } from "react";

const backupFileName = "suguan-demo-data-backup.json";

const backupKeys = [
  "suguan.leads.v1",
  "suguan.geoTests.v1",
  "suguan.cases.v1",
  "suguan.siteAssets.v1",
  "suguan.siteContent.v1",
  "suguan.resources.v1",
  "suguan.contentTopics.v1",
  "suguan.articles.v1"
] as const;

type BackupPayload = {
  app: "suguan-geo-demo";
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
};

const serverEndpoints: Partial<Record<(typeof backupKeys)[number], string>> = {
  "suguan.leads.v1": "/api/leads",
  "suguan.cases.v1": "/api/cases",
  "suguan.siteAssets.v1": "/api/site-assets",
  "suguan.siteContent.v1": "/api/site-content",
  "suguan.contentTopics.v1": "/api/articles"
};

function readStorageValue(key: string) {
  const rawValue = window.localStorage.getItem(key);
  if (rawValue === null) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return rawValue;
  }
}

function writeStorageValue(key: string, value: unknown) {
  if (value === null || typeof value === "undefined") {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
}

export function DemoDataBackup() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("客户线索、案例、文章、素材和网页文案从服务器导出；其他演示模块继续导出浏览器缓存。");

  const exportData = async () => {
    const data: Record<string, unknown> = {};
    await Promise.all(
      backupKeys.map(async (key) => {
        const endpoint = serverEndpoints[key];
        if (endpoint) {
          const response = await fetch(endpoint, { cache: "no-store" });
          data[key] = response.ok ? await response.json() : readStorageValue(key);
        } else {
          data[key] = readStorageValue(key);
        }
      })
    );

    const payload: BackupPayload = {
      app: "suguan-geo-demo",
      version: 1,
      exportedAt: new Date().toISOString(),
      data
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = backupFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage(`已导出演示数据：${backupFileName}`);
  };

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<BackupPayload>;

      if (!parsed.data || typeof parsed.data !== "object") {
        setMessage("导入失败：JSON 文件格式不正确。");
        return;
      }

      for (const key of backupKeys) {
        if (Object.prototype.hasOwnProperty.call(parsed.data, key)) {
          const value = parsed.data?.[key];
          const endpoint = serverEndpoints[key];
          if (endpoint && value !== null && typeof value !== "undefined") {
            const body =
              key === "suguan.leads.v1"
                ? { leads: value }
                : key === "suguan.cases.v1"
                ? { cases: value }
                : key === "suguan.siteAssets.v1"
                  ? { assets: value }
                  : key === "suguan.siteContent.v1"
                    ? { content: value }
                    : { articles: value };
            const response = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });
            if (!response.ok) {
              const error = await response.json().catch(() => ({}));
              throw new Error(error?.error || `服务器导入失败：${key}`);
            }
          }
          writeStorageValue(key, value);
        }
      }

      setMessage("导入成功，正式内容已写入服务器。请刷新页面查看。");
    } catch (error) {
      setMessage(error instanceof Error ? `导入失败：${error.message}` : "导入失败：请确认文件有效。");
    }
  };

  return (
    <section className="mt-8 border border-line bg-paper p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-sm font-medium text-clay">DATA BACKUP</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">数据备份与恢复</h2>
          <p className="mt-4 text-sm leading-7 text-ink/62">
            客户线索、案例、文章、素材和网页文案使用服务器 JSON 持久化；GEO 测试等演示模块仍保存在浏览器缓存。
            本工具可同时导出两类数据，方便备份与后续迁移。
          </p>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {backupKeys.map((key) => (
              <div key={key} className="bg-rice px-4 py-3 font-mono text-xs text-ink/64">
                {key}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={exportData} className="bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-moss">
              一键导出演示数据
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="border border-ink px-5 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
            >
              导入演示数据 JSON
            </button>
            <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={importData} />
          </div>

          <div className="border border-line bg-rice px-4 py-3 text-sm leading-6 text-ink/62">{message}</div>
        </div>
      </div>
    </section>
  );
}
