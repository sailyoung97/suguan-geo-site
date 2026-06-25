"use client";

import { FormEvent, useMemo, useState } from "react";
import type { GeoTest } from "@/data/mock";

const allLabel = "全部";
const platforms = [allLabel, "DeepSeek", "Kimi", "豆包", "通义千问", "ChatGPT"] as const;
const platformOptions = platforms.filter((item) => item !== allLabel) as GeoTest["platform"][];
const mentionFilters = [allLabel, "已提到", "未提到"] as const;
const questionTypes = [allLabel, "品牌认知", "服务推荐", "案例检索", "行业方法", "区域公司"] as const;
const questionTypeOptions = questionTypes.filter((item) => item !== allLabel) as GeoTest["questionType"][];
const taskStatuses: GeoTest["taskStatus"][] = ["待补内容", "已写文章", "已发布", "已更新官网", "已复测"];
const statusFilters = [allLabel, ...taskStatuses] as const;

const trendData = [
  { week: "W1", rate: 34 },
  { week: "W2", rate: 42 },
  { week: "W3", rate: 48 },
  { week: "W4", rate: 57 },
  { week: "W5", rate: 61 }
];

type GeoTestsTableProps = {
  initialTests: GeoTest[];
};

type GeoForm = {
  testDate: string;
  platform: GeoTest["platform"];
  question: string;
  mentionedSuguan: boolean;
  mentionedCompetitor: boolean;
  accurate: boolean;
  questionType: GeoTest["questionType"];
  answerSummary: string;
  competitorName: string;
  errorPoints: string;
  suggestedContent: string;
  optimizationAdvice: string;
  taskStatus: GeoTest["taskStatus"];
  owner: string;
};

const defaultGeoForm: GeoForm = {
  testDate: "2026-06-04",
  platform: "DeepSeek",
  question: "",
  mentionedSuguan: false,
  mentionedCompetitor: false,
  accurate: false,
  questionType: "服务推荐",
  answerSummary: "",
  competitorName: "",
  errorPoints: "",
  suggestedContent: "",
  optimizationAdvice: "",
  taskStatus: "待补内容",
  owner: "李沁"
};

const booleanStyles = {
  yes: "bg-moss text-paper",
  no: "bg-rice text-ink/62"
};

const statusStyles: Record<GeoTest["taskStatus"], string> = {
  待补内容: "border-clay/40 bg-clay/10 text-clay",
  已写文章: "border-moss/30 bg-moss/10 text-moss",
  已发布: "border-ink/20 bg-ink/10 text-ink",
  已更新官网: "border-emerald-700/20 bg-emerald-700/10 text-emerald-800",
  已复测: "border-zinc-500/30 bg-zinc-500/10 text-zinc-700"
};

const inputClassName =
  "h-11 w-full border border-line bg-rice px-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-ink";

function splitText(value: string) {
  return value
    .split(/[，,、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formToGeoTest(form: GeoForm, count: number): GeoTest {
  return {
    id: `GEO-${String(count + 1).padStart(3, "0")}`,
    testDate: form.testDate,
    platform: form.platform,
    question: form.question,
    mentionedSuguan: form.mentionedSuguan,
    mentionedCompetitor: form.mentionedCompetitor,
    accurate: form.accurate,
    questionType: form.questionType,
    answerSummary: form.answerSummary,
    competitorName: form.competitorName,
    errorPoints: splitText(form.errorPoints),
    suggestedContent: splitText(form.suggestedContent),
    optimizationAdvice: form.optimizationAdvice,
    taskStatus: form.taskStatus,
    owner: form.owner
  };
}

export function GeoTestsTable({ initialTests }: GeoTestsTableProps) {
  const [tests, setTests] = useState(initialTests);
  const [platformFilter, setPlatformFilter] = useState<(typeof platforms)[number]>(allLabel);
  const [mentionFilter, setMentionFilter] = useState<(typeof mentionFilters)[number]>(allLabel);
  const [typeFilter, setTypeFilter] = useState<(typeof questionTypes)[number]>(allLabel);
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>(allLabel);
  const [selectedTest, setSelectedTest] = useState<GeoTest | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState<GeoForm>(defaultGeoForm);

  const filteredTests = useMemo(() => {
    return tests.filter((item) => {
      const matchesPlatform = platformFilter === allLabel || item.platform === platformFilter;
      const matchesMention =
        mentionFilter === allLabel ||
        (mentionFilter === "已提到" && item.mentionedSuguan) ||
        (mentionFilter === "未提到" && !item.mentionedSuguan);
      const matchesType = typeFilter === allLabel || item.questionType === typeFilter;
      const matchesStatus = statusFilter === allLabel || item.taskStatus === statusFilter;

      return matchesPlatform && matchesMention && matchesType && matchesStatus;
    });
  }, [mentionFilter, platformFilter, statusFilter, tests, typeFilter]);

  const weeklyTests = tests.filter((item) => item.testDate >= "2026-05-29");
  const weeklyMentioned = weeklyTests.filter((item) => item.mentionedSuguan).length;
  const mentionRate = weeklyTests.length ? Math.round((weeklyMentioned / weeklyTests.length) * 100) : 0;
  const needsOptimization = tests.filter((item) => !item.mentionedSuguan || !item.accurate || item.taskStatus === "待补内容").length;

  function updateForm<K extends keyof GeoForm>(key: K, value: GeoForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTest = formToGeoTest(form, tests.length);
    setTests((current) => [nextTest, ...current]);
    setForm(defaultGeoForm);
    setIsCreateOpen(false);
    setSelectedTest(nextTest);
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-clay">GEO TESTS</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">GEO 测试记录</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/62">
            记录不同 AI 平台对品牌、服务、案例和区域问题的回答表现，把测试结果转化为内容补充、官网更新与复测任务。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-moss"
        >
          新增测试记录
        </button>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "本周测试次数", value: weeklyTests.length, hint: "最近 7 天测试记录" },
          { label: "提及溯观次数", value: weeklyMentioned, hint: "回答中出现溯观" },
          { label: "提及率", value: `${mentionRate}%`, hint: "提及次数 / 本周测试" },
          { label: "待优化问题数", value: needsOptimization, hint: "未提及、不准确或待补内容" }
        ].map((item) => (
          <div key={item.label} className="border border-line bg-paper p-5 shadow-sm">
            <div className="text-sm text-ink/56">{item.label}</div>
            <div className="mt-3 text-4xl font-semibold text-ink">{item.value}</div>
            <div className="mt-2 text-xs text-moss">{item.hint}</div>
          </div>
        ))}
      </section>

      <section className="mt-8 border border-line bg-paper p-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-lg font-semibold text-ink">提及率趋势</h2>
            <p className="mt-1 text-xs text-ink/54">静态 mock 数据占位，后续可接入每周测试统计。</p>
          </div>
          <div className="text-sm font-semibold text-clay">{trendData.at(-1)?.rate}%</div>
        </div>
        <div className="mt-6 flex h-44 items-end gap-3 border-l border-b border-line px-4 pb-4">
          {trendData.map((item) => (
            <div key={item.week} className="flex flex-1 flex-col items-center gap-3">
              <div className="w-full bg-moss/18">
                <div className="bg-moss" style={{ height: `${item.rate * 1.8}px` }} />
              </div>
              <div className="text-xs text-ink/50">{item.week}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 border border-line bg-paper">
        <div className="border-b border-line p-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">测试明细</h2>
            <p className="mt-1 text-xs text-ink/54">当前显示 {filteredTests.length} 条测试记录，点击行查看详情。</p>
          </div>
          <div className="mt-5 grid gap-4 rounded-sm border border-line bg-rice p-4 lg:grid-cols-4">
            <FilterGroup label="测试平台" options={platforms} value={platformFilter} onChange={(value) => setPlatformFilter(value as typeof platformFilter)} />
            <FilterGroup label="提及状态" options={mentionFilters} value={mentionFilter} onChange={(value) => setMentionFilter(value as typeof mentionFilter)} />
            <FilterGroup label="问题类型" options={questionTypes} value={typeFilter} onChange={(value) => setTypeFilter(value as typeof typeFilter)} />
            <FilterGroup label="优化状态" options={statusFilters} value={statusFilter} onChange={(value) => setStatusFilter(value as typeof statusFilter)} />
          </div>
        </div>

        <div className="grid gap-4 p-4 lg:hidden">
          {filteredTests.map((item) => (
            <GeoTestMobileCard key={item.id} item={item} onOpen={() => setSelectedTest(item)} />
          ))}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-[1720px] w-full border-collapse text-left text-sm">
            <thead className="bg-rice text-xs text-ink/54">
              <tr>
                {[
                  "测试日期",
                  "测试平台",
                  "测试问题",
                  "问题类型",
                  "是否提到溯观",
                  "是否提到竞品",
                  "竞品名称",
                  "回答是否准确",
                  "AI回答摘要",
                  "对应优化内容 / 关联文章 / 关联案例",
                  "优化状态",
                  "负责人",
                  "操作"
                ].map((head) => (
                  <th key={head} className="whitespace-nowrap px-4 py-3 font-medium">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedTest(item)}
                  className="cursor-pointer border-t border-line align-top transition hover:bg-rice/70"
                >
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{item.testDate}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-ink">{item.platform}</td>
                  <td className="min-w-72 px-4 py-4 leading-6 text-ink/72">{item.question}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{item.questionType}</td>
                  <td className="whitespace-nowrap px-4 py-4"><BooleanBadge value={item.mentionedSuguan} /></td>
                  <td className="whitespace-nowrap px-4 py-4"><BooleanBadge value={item.mentionedCompetitor} /></td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{item.competitorName || "无"}</td>
                  <td className="whitespace-nowrap px-4 py-4"><BooleanBadge value={item.accurate} yesText="准确" noText="待校准" /></td>
                  <td className="min-w-80 px-4 py-4 leading-6 text-ink/62">{item.answerSummary}</td>
                  <td className="min-w-80 px-4 py-4 leading-6 text-ink/62">
                    {item.suggestedContent.join("、") || item.optimizationAdvice || "待补充"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className={`border px-2.5 py-1 text-xs ${statusStyles[item.taskStatus]}`}>{item.taskStatus}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{item.owner}</td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedTest(item);
                      }}
                      className="border border-line px-3 py-2 text-xs font-medium text-ink/64 transition hover:border-ink hover:text-ink"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedTest ? <GeoTestDetailModal item={selectedTest} onClose={() => setSelectedTest(null)} /> : null}
      {isCreateOpen ? (
        <GeoCreateModal
          form={form}
          onChange={updateForm}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
        />
      ) : null}
    </>
  );
}

function GeoCreateModal({
  form,
  onChange,
  onClose,
  onSubmit
}: {
  form: GeoForm;
  onChange: <K extends keyof GeoForm>(key: K, value: GeoForm[K]) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/44 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-line bg-paper shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-ink">新增测试记录</h2>
            <p className="mt-2 text-sm text-ink/56">保存后进入当前前端状态，用于 V1.0 试用，不接真实数据库。</p>
          </div>
          <button type="button" onClick={onClose} className="border border-line px-3 py-2 text-sm text-ink/64 hover:border-ink hover:text-ink">
            关闭
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-5 p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="测试日期">
              <input required type="date" value={form.testDate} onChange={(event) => onChange("testDate", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="测试平台">
              <Select value={form.platform} onChange={(value) => onChange("platform", value as GeoTest["platform"])} options={platformOptions} />
            </Field>
            <Field label="问题类型">
              <Select value={form.questionType} onChange={(value) => onChange("questionType", value as GeoTest["questionType"])} options={questionTypeOptions} />
            </Field>
            <Field label="是否提到溯观">
              <BooleanSelect value={form.mentionedSuguan} onChange={(value) => onChange("mentionedSuguan", value)} />
            </Field>
            <Field label="是否提到竞品">
              <BooleanSelect value={form.mentionedCompetitor} onChange={(value) => onChange("mentionedCompetitor", value)} />
            </Field>
            <Field label="回答是否准确">
              <BooleanSelect value={form.accurate} onChange={(value) => onChange("accurate", value)} />
            </Field>
            <Field label="竞品名称">
              <input value={form.competitorName} onChange={(event) => onChange("competitorName", event.target.value)} className={inputClassName} placeholder="未提到可留空" />
            </Field>
            <Field label="优化状态">
              <Select value={form.taskStatus} onChange={(value) => onChange("taskStatus", value as GeoTest["taskStatus"])} options={taskStatuses} />
            </Field>
            <Field label="负责人">
              <input required value={form.owner} onChange={(event) => onChange("owner", event.target.value)} className={inputClassName} />
            </Field>
          </div>

          <Field label="测试问题">
            <textarea required value={form.question} onChange={(event) => onChange("question", event.target.value)} className={`${inputClassName} min-h-20 py-3`} />
          </Field>
          <Field label="AI回答摘要">
            <textarea required value={form.answerSummary} onChange={(event) => onChange("answerSummary", event.target.value)} className={`${inputClassName} min-h-24 py-3`} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="错误点">
              <textarea value={form.errorPoints} onChange={(event) => onChange("errorPoints", event.target.value)} className={`${inputClassName} min-h-24 py-3`} placeholder="多个内容可用逗号或换行分隔" />
            </Field>
            <Field label="建议补充内容">
              <textarea value={form.suggestedContent} onChange={(event) => onChange("suggestedContent", event.target.value)} className={`${inputClassName} min-h-24 py-3`} placeholder="多个内容可用逗号或换行分隔" />
            </Field>
          </div>
          <Field label="优化建议">
            <textarea required value={form.optimizationAdvice} onChange={(event) => onChange("optimizationAdvice", event.target.value)} className={`${inputClassName} min-h-24 py-3`} />
          </Field>

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="border border-line px-5 py-3 text-sm font-medium text-ink/64 hover:border-ink hover:text-ink">
              取消
            </button>
            <button type="submit" className="bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-moss">
              保存测试记录
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GeoTestDetailModal({ item, onClose }: { item: GeoTest; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/44 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-line bg-paper shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <p className="text-sm font-medium text-clay">测试详情</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">{item.question}</h2>
            <p className="mt-2 text-sm text-ink/56">{item.testDate} / {item.platform} / {item.questionType}</p>
          </div>
          <button type="button" onClick={onClose} className="border border-line px-3 py-2 text-sm text-ink/64 hover:border-ink hover:text-ink">
            关闭
          </button>
        </div>
        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-5">
            <DetailBlock title="AI回答摘要">{item.answerSummary}</DetailBlock>
            <DetailBlock title="错误点">
              <BulletList items={item.errorPoints} emptyText="暂无错误点" />
            </DetailBlock>
            <DetailBlock title="建议补充内容">
              <BulletList items={item.suggestedContent} emptyText="暂无建议补充内容" />
            </DetailBlock>
            <DetailBlock title="优化建议">{item.optimizationAdvice}</DetailBlock>
          </div>
          <aside className="space-y-4">
            <InfoItem label="测试日期" value={item.testDate} />
            <InfoItem label="测试平台" value={item.platform} />
            <InfoItem label="问题类型" value={item.questionType} />
            <InfoItem label="是否提到溯观" value={item.mentionedSuguan ? "是" : "否"} />
            <InfoItem label="是否提到竞品" value={item.mentionedCompetitor ? "是" : "否"} />
            <InfoItem label="竞品名称" value={item.competitorName || "无"} />
            <InfoItem label="回答是否准确" value={item.accurate ? "准确" : "待校准"} />
            <InfoItem label="优化状态" value={item.taskStatus} />
            <InfoItem label="负责人" value={item.owner} />
          </aside>
        </div>
      </div>
    </div>
  );
}

function GeoTestMobileCard({ item, onOpen }: { item: GeoTest; onOpen: () => void }) {
  return (
    <article className="border border-line bg-paper p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-ink/50">
          {item.testDate} / {item.platform}
        </div>
        <span className={`border px-2.5 py-1 text-xs ${statusStyles[item.taskStatus]}`}>{item.taskStatus}</span>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-7 text-ink">{item.question}</h3>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="border border-line bg-rice p-3">
          <div className="text-ink/42">是否提到溯观</div>
          <div className="mt-2"><BooleanBadge value={item.mentionedSuguan} /></div>
        </div>
        <div className="border border-line bg-rice p-3">
          <div className="text-ink/42">是否提到竞品</div>
          <div className="mt-2"><BooleanBadge value={item.mentionedCompetitor} /></div>
        </div>
        <div className="border border-line bg-rice p-3">
          <div className="text-ink/42">回答准确性</div>
          <div className="mt-2"><BooleanBadge value={item.accurate} yesText="准确" noText="待校准" /></div>
        </div>
        <div className="border border-line bg-rice p-3">
          <div className="text-ink/42">问题类型</div>
          <div className="mt-2 font-medium text-ink">{item.questionType}</div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-ink/62">{item.answerSummary}</p>
      <button type="button" onClick={onOpen} className="mt-4 w-full border border-line px-4 py-3 text-sm font-medium text-ink transition hover:border-ink">
        查看详情
      </button>
    </article>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-rice p-4">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="mt-3 text-sm leading-6 text-ink/66">{children}</div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-rice p-4">
      <div className="text-xs text-ink/44">{label}</div>
      <div className="mt-2 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

function BulletList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (!items.length) {
    return <p>{emptyText}</p>;
  }

  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-3 h-px w-5 shrink-0 bg-clay" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="text-xs text-ink/56">{label}</div>
      <div className="flex max-w-full flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={`${label}-${option}`}
            type="button"
            onClick={() => onChange(option)}
            className={`border px-3 py-2 text-xs transition ${
              option === value ? "border-ink bg-ink text-paper" : "border-line bg-rice text-ink/62 hover:border-ink hover:text-ink"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function BooleanBadge({
  value,
  yesText = "是",
  noText = "否"
}: {
  value: boolean;
  yesText?: string;
  noText?: string;
}) {
  return (
    <span className={`px-2.5 py-1 text-xs font-medium ${value ? booleanStyles.yes : booleanStyles.no}`}>
      {value ? yesText : noText}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-xs font-medium text-ink/58">
      {label}
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
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

function BooleanSelect({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  return (
    <select value={value ? "true" : "false"} onChange={(event) => onChange(event.target.value === "true")} className={inputClassName}>
      <option value="true">是</option>
      <option value="false">否</option>
    </select>
  );
}
