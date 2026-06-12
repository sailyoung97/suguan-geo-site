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
  "suguan.articles.v1"
] as const;

type BackupPayload = {
  app: "suguan-geo-demo";
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
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
  const [message, setMessage] = useState("可将当前浏览器中的演示数据导出为 JSON 文件，再在外网展示环境导入恢复。");

  const exportData = () => {
    const payload: BackupPayload = {
      app: "suguan-geo-demo",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: backupKeys.reduce<Record<string, unknown>>((nextData, key) => {
        nextData[key] = readStorageValue(key);
        return nextData;
      }, {})
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

      backupKeys.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(parsed.data, key)) {
          writeStorageValue(key, parsed.data?.[key]);
        }
      });

      setMessage("导入成功。请刷新页面后查看恢复后的演示数据。");
    } catch {
      setMessage("导入失败：请确认选择的是有效 JSON 文件。");
    }
  };

  return (
    <section className="mt-8 border border-line bg-paper p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-sm font-medium text-clay">DATA BACKUP</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">数据备份与恢复</h2>
          <p className="mt-4 text-sm leading-7 text-ink/62">
            当前中台使用浏览器 localStorage 保存演示数据。部署到外网后，不同电脑不会自动共享数据，
            可通过导出 / 导入 JSON 的方式迁移演示内容。
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
