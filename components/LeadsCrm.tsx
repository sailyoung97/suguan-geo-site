"use client";

import { FormEvent, useMemo, useState } from "react";
import type { FollowRecord, Lead } from "@/data/mock";
import { useLeads } from "@/src/hooks/useLeads";

const allLabel = "全部";
const intentLevels = [allLabel, "A", "B", "C", "D"] as const;
const projectTypes = [allLabel, "城市更新", "乡村振兴", "农文旅融合", "品牌文创", "招商运营", "亲子营地"] as const;
const sources: Lead["source"][] = ["官网表单", "AI 搜索", "朋友转介", "活动现场", "主动拜访"];
const sourceFilters = [allLabel, ...sources] as const;
const stages: Lead["stage"][] = ["新线索", "已联系", "方案沟通", "合同推进", "暂缓"];
const followStatuses: Lead["followStatus"][] = ["新线索", "待跟进", "跟进中", "已完成", "暂缓"];
const followMethods: FollowRecord["method"][] = ["电话", "微信", "会议", "邮件", "现场拜访"];

const inputClassName =
  "h-11 w-full border border-line bg-rice px-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-ink";

const stageStyles: Record<Lead["stage"], string> = {
  新线索: "border-clay/40 bg-clay/10 text-clay",
  已联系: "border-moss/30 bg-moss/10 text-moss",
  方案沟通: "border-ink/20 bg-ink/10 text-ink",
  合同推进: "border-emerald-700/20 bg-emerald-700/10 text-emerald-800",
  暂缓: "border-zinc-400/40 bg-zinc-400/10 text-zinc-600"
};

const intentStyles: Record<Lead["intentLevel"], string> = {
  A: "bg-clay text-paper",
  B: "bg-moss text-paper",
  C: "bg-rice text-ink/70",
  D: "bg-zinc-200 text-ink/52"
};

type LeadsCrmProps = {
  initialLeads: Lead[];
};

type LeadForm = {
  entryDate: string;
  name: string;
  organization: string;
  contact: string;
  source: Lead["source"];
  projectType: Lead["projectType"];
  projectLocation: string;
  stage: Lead["stage"];
  demand: string;
  sentMaterials: string;
  intentLevel: Lead["intentLevel"];
  owner: string;
  nextFollowUp: string;
  followStatus: Lead["followStatus"];
  remarks: string;
  budget: string;
  score: string;
};

type FollowForm = {
  date: string;
  method: FollowRecord["method"];
  content: string;
  customerFeedback: string;
  nextAction: string;
  owner: string;
};

const defaultLeadForm: LeadForm = {
  entryDate: "2026-06-03",
  name: "",
  organization: "",
  contact: "",
  source: "官网表单",
  projectType: "城市更新",
  projectLocation: "",
  stage: "新线索",
  demand: "",
  sentMaterials: "",
  intentLevel: "B",
  owner: "李沁",
  nextFollowUp: "2026-06-06 10:00",
  followStatus: "待跟进",
  remarks: "",
  budget: "待评估",
  score: "75"
};

const defaultFollowForm: FollowForm = {
  date: "2026-06-03 16:00",
  method: "电话",
  content: "",
  customerFeedback: "",
  nextAction: "",
  owner: "李沁"
};

function materialsToText(items: string[]) {
  return items.join("，");
}

function buildMaterials(value: string) {
  return value
    .split(/[，,、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function leadToForm(lead: Lead): LeadForm {
  return {
    entryDate: lead.entryDate,
    name: lead.name,
    organization: lead.organization,
    contact: lead.contact,
    source: lead.source,
    projectType: lead.projectType,
    projectLocation: lead.projectLocation,
    stage: lead.stage,
    demand: lead.demand,
    sentMaterials: materialsToText(lead.sentMaterials),
    intentLevel: lead.intentLevel,
    owner: lead.owner,
    nextFollowUp: lead.nextFollowUp,
    followStatus: lead.followStatus,
    remarks: lead.remarks,
    budget: lead.budget,
    score: String(lead.score)
  };
}

function formToLead(form: LeadForm, base?: Lead): Lead {
  return {
    id: base?.id ?? `L-202606-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    entryDate: form.entryDate,
    name: form.name,
    organization: form.organization,
    contact: form.contact,
    source: form.source,
    projectType: form.projectType,
    projectLocation: form.projectLocation,
    city: form.projectLocation.slice(0, 2) || "待定",
    stage: form.stage,
    demand: form.demand,
    intent: form.demand,
    sentMaterials: buildMaterials(form.sentMaterials),
    intentLevel: form.intentLevel,
    owner: form.owner,
    nextFollowUp: form.nextFollowUp,
    followStatus: form.followStatus,
    lastContact: base?.lastContact ?? form.entryDate,
    remarks: form.remarks,
    budget: form.budget,
    score: Number(form.score) || 0,
    followRecords: base?.followRecords ?? []
  };
}

export function LeadsCrm({ initialLeads }: LeadsCrmProps) {
  const { leads, setLeads } = useLeads(initialLeads);
  const [intentFilter, setIntentFilter] = useState<(typeof intentLevels)[number]>(allLabel);
  const [typeFilter, setTypeFilter] = useState<(typeof projectTypes)[number]>(allLabel);
  const [sourceFilter, setSourceFilter] = useState<(typeof sourceFilters)[number]>(allLabel);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState<LeadForm>(defaultLeadForm);
  const [followForm, setFollowForm] = useState<FollowForm>(defaultFollowForm);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesIntent = intentFilter === allLabel || lead.intentLevel === intentFilter;
      const matchesType = typeFilter === allLabel || lead.projectType === typeFilter;
      const matchesSource = sourceFilter === allLabel || lead.source === sourceFilter;
      return matchesIntent && matchesType && matchesSource;
    });
  }, [intentFilter, leads, sourceFilter, typeFilter]);

  const selectedLead = selectedLeadId ? leads.find((lead) => lead.id === selectedLeadId) ?? null : null;
  const highIntentCount = leads.filter((lead) => lead.intentLevel === "A").length;
  const bIntentCount = leads.filter((lead) => lead.intentLevel === "B").length;
  const newLeadCount = leads.filter((lead) => lead.stage === "新线索").length;
  const pendingCount = leads.filter((lead) => lead.followStatus === "待跟进" || lead.followStatus === "新线索").length;

  function updateLeadForm<K extends keyof LeadForm>(key: K, value: LeadForm[K]) {
    setLeadForm((current) => ({ ...current, [key]: value }));
  }

  function updateFollowForm<K extends keyof FollowForm>(key: K, value: FollowForm[K]) {
    setFollowForm((current) => ({ ...current, [key]: value }));
  }

  function openCreateModal() {
    setLeadForm(defaultLeadForm);
    setEditingLeadId(null);
    setModalMode("create");
  }

  function openEditModal(lead: Lead) {
    setLeadForm(leadToForm(lead));
    setEditingLeadId(lead.id);
    setModalMode("edit");
  }

  function handleSubmitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (modalMode === "edit" && editingLeadId) {
      setLeads((current) =>
        current.map((lead) => (lead.id === editingLeadId ? formToLead(leadForm, lead) : lead))
      );
      setModalMode(null);
      setEditingLeadId(null);
      return;
    }

    const nextLead = formToLead(leadForm);
    setLeads((current) => [nextLead, ...current]);
    setSelectedLeadId(nextLead.id);
    setModalMode(null);
  }

  function handleCreateFollow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedLead) {
      return;
    }

    const nextRecord: FollowRecord = {
      id: `FR-${selectedLead.id}-${selectedLead.followRecords.length + 1}`,
      ...followForm
    };

    setLeads((current) =>
      current.map((lead) =>
        lead.id === selectedLead.id
          ? {
              ...lead,
              followRecords: [nextRecord, ...lead.followRecords],
              lastContact: followForm.date.slice(0, 10),
              followStatus: "跟进中"
            }
          : lead
      )
    );
    setFollowForm({ ...defaultFollowForm, owner: selectedLead.owner });
  }

  function exportCsv() {
    const headers = [
      "录入日期",
      "客户姓名",
      "公司单位",
      "联系方式",
      "来源渠道",
      "项目类型",
      "项目地点",
      "项目阶段",
      "客户需求",
      "已发送资料",
      "意向等级",
      "负责人",
      "下次跟进时间",
      "跟进状态",
      "备注"
    ];
    const rows = filteredLeads.map((lead) => [
      lead.entryDate,
      lead.name,
      lead.organization,
      lead.contact,
      lead.source,
      lead.projectType,
      lead.projectLocation,
      lead.stage,
      lead.demand,
      lead.sentMaterials.join("、"),
      lead.intentLevel,
      lead.owner,
      lead.nextFollowUp,
      lead.followStatus,
      lead.remarks
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "suguan-crm-leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-clay">CRM LEADS</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">客户线索 CRM</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/62">
            使用本地 mock 数据和前端状态管理线索、详情、编辑和跟进记录，支持 A/B/C/D 意向等级、项目类型、来源渠道筛选与 CSV 导出。
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={exportCsv}
            className="border border-ink px-5 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
          >
            导出 CSV
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-moss"
          >
            新增客户线索
          </button>
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "总线索数", value: leads.length, hint: "当前 mock 数据" },
          { label: "A 级线索", value: highIntentCount, hint: "优先安排深度沟通" },
          { label: "B 级 / 新线索", value: `${bIntentCount} / ${newLeadCount}`, hint: "官网表单默认进入 B 级新线索" },
          { label: "待跟进", value: pendingCount, hint: "需要确认下一步动作" }
        ].map((item) => (
          <div key={item.label} className="border border-line bg-paper p-5 shadow-sm">
            <div className="text-sm text-ink/56">{item.label}</div>
            <div className="mt-3 text-4xl font-semibold text-ink">{item.value}</div>
            <div className="mt-2 text-xs text-moss">{item.hint}</div>
          </div>
        ))}
      </section>

      <section className="mt-8 border border-line bg-paper">
        <div className="border-b border-line p-5">
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-ink">线索列表</h2>
            <p className="mt-1 text-xs text-ink/54">当前显示 {filteredLeads.length} 条，点击行查看详情。</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-5">
            <FilterGroup label="意向等级" options={intentLevels} value={intentFilter} onChange={(value) => setIntentFilter(value as typeof intentFilter)} />
            <FilterGroup label="项目类型" options={projectTypes} value={typeFilter} onChange={(value) => setTypeFilter(value as typeof typeFilter)} />
            <FilterGroup label="来源渠道" options={sourceFilters} value={sourceFilter} onChange={(value) => setSourceFilter(value as typeof sourceFilter)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1680px] w-full border-collapse text-left text-sm">
            <thead className="bg-rice text-xs text-ink/54">
              <tr>
                {[
                  "录入日期",
                  "客户姓名",
                  "公司单位",
                  "联系方式",
                  "来源渠道",
                  "项目类型",
                  "项目地点",
                  "项目阶段",
                  "客户需求",
                  "已发送资料",
                  "意向等级",
                  "负责人",
                  "下次跟进时间",
                  "跟进状态",
                  "备注",
                  "操作"
                ].map((head) => (
                  <th key={head} className="whitespace-nowrap px-4 py-3 font-medium">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className="cursor-pointer border-t border-line align-top transition hover:bg-rice/70"
                >
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{lead.entryDate}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-ink">{lead.name}</td>
                  <td className="min-w-48 px-4 py-4 text-ink/72">{lead.organization}</td>
                  <td className="min-w-48 px-4 py-4 text-ink/62">{lead.contact}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{lead.source}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/72">{lead.projectType}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{lead.projectLocation}</td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className={`border px-2.5 py-1 text-xs ${stageStyles[lead.stage]}`}>{lead.stage}</span>
                  </td>
                  <td className="min-w-72 px-4 py-4 leading-6 text-ink/70">{lead.demand}</td>
                  <td className="min-w-48 px-4 py-4 text-ink/62">{lead.sentMaterials.length ? lead.sentMaterials.join("、") : "未发送"}</td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium ${intentStyles[lead.intentLevel]}`}>{lead.intentLevel}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{lead.owner}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{lead.nextFollowUp}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-ink/62">{lead.followStatus}</td>
                  <td className="min-w-72 px-4 py-4 leading-6 text-ink/62">{lead.remarks}</td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedLeadId(lead.id);
                        }}
                        className="border border-line px-3 py-2 text-xs text-ink/64 transition hover:border-ink hover:text-ink"
                      >
                        查看详情
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditModal(lead);
                        }}
                        className="border border-line px-3 py-2 text-xs text-ink/64 transition hover:border-ink hover:text-ink"
                      >
                        编辑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modalMode ? (
        <LeadModal
          mode={modalMode}
          form={leadForm}
          onChange={updateLeadForm}
          onClose={() => setModalMode(null)}
          onSubmit={handleSubmitLead}
        />
      ) : null}
      {selectedLead && !modalMode ? (
        <LeadDetailModal
          lead={selectedLead}
          followForm={followForm}
          onClose={() => setSelectedLeadId(null)}
          onEdit={() => openEditModal(selectedLead)}
          onFollowFormChange={updateFollowForm}
          onCreateFollow={handleCreateFollow}
        />
      ) : null}
    </>
  );
}

function LeadDetailModal({
  lead,
  followForm,
  onClose,
  onEdit,
  onFollowFormChange,
  onCreateFollow
}: {
  lead: Lead;
  followForm: FollowForm;
  onClose: () => void;
  onEdit: () => void;
  onFollowFormChange: <K extends keyof FollowForm>(key: K, value: FollowForm[K]) => void;
  onCreateFollow: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/44 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-7xl border border-line bg-rice p-5 shadow-soft sm:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-clay">LEAD DETAIL</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">{lead.organization}</h1>
          <p className="mt-3 text-sm leading-6 text-ink/62">{lead.name} / {lead.contact}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`w-fit px-3 py-1.5 text-sm font-medium ${intentStyles[lead.intentLevel]}`}>
            {lead.intentLevel} 级意向
          </span>
          <button type="button" onClick={onEdit} className="border border-ink px-4 py-2 text-sm text-ink transition hover:bg-ink hover:text-paper">
            编辑线索
          </button>
          <button type="button" onClick={onClose} className="border border-line px-4 py-2 text-sm text-ink/64 transition hover:border-ink hover:text-ink">
            关闭
          </button>
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <InfoPanel title="基础信息">
            <InfoGrid
              items={[
                ["录入日期", lead.entryDate],
                ["来源渠道", lead.source],
                ["项目类型", lead.projectType],
                ["项目地点", lead.projectLocation],
                ["项目阶段", lead.stage],
                ["负责人", lead.owner],
                ["预算", lead.budget],
                ["评分", String(lead.score)],
                ["客户需求", lead.demand]
              ]}
            />
          </InfoPanel>

          <InfoPanel title="跟进记录">
            <div className="space-y-4">
              {lead.followRecords.length ? (
                lead.followRecords.map((record) => (
                  <article key={record.id} className="border border-line bg-rice p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-moss">
                      <span>{record.date}</span>
                      <span className="h-px w-8 bg-line" />
                      <span>{record.method}</span>
                      <span className="h-px w-8 bg-line" />
                      <span>{record.owner}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-ink/72">{record.content}</p>
                    {record.customerFeedback ? (
                      <p className="mt-2 text-xs leading-5 text-ink/54">客户反馈：{record.customerFeedback}</p>
                    ) : null}
                    <p className="mt-2 text-xs leading-5 text-ink/54">下一步：{record.nextAction}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-ink/54">暂无跟进记录</p>
              )}
            </div>
          </InfoPanel>
        </div>

        <aside className="space-y-6">
          <InfoPanel title="已发送资料">
            <div className="flex flex-wrap gap-2">
              {lead.sentMaterials.length ? (
                lead.sentMaterials.map((item) => (
                  <span key={item} className="border border-line bg-rice px-3 py-1.5 text-xs text-ink/66">
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-sm text-ink/54">暂未发送资料</p>
              )}
            </div>
          </InfoPanel>

          <InfoPanel title="下次跟进时间">
            <p className="text-2xl font-semibold text-ink">{lead.nextFollowUp}</p>
            <p className="mt-2 text-sm text-moss">{lead.followStatus}</p>
          </InfoPanel>

          <InfoPanel title="内部备注">
            <p className="text-sm leading-6 text-ink/66">{lead.remarks || "暂无备注"}</p>
          </InfoPanel>

          <InfoPanel title="新增跟进记录">
            <form onSubmit={onCreateFollow} className="grid gap-4">
              <Field label="跟进时间">
                <input required value={followForm.date} onChange={(event) => onFollowFormChange("date", event.target.value)} className={inputClassName} />
              </Field>
              <Field label="跟进方式">
                <Select value={followForm.method} onChange={(value) => onFollowFormChange("method", value as FollowRecord["method"])} options={followMethods} />
              </Field>
              <Field label="负责人">
                <input required value={followForm.owner} onChange={(event) => onFollowFormChange("owner", event.target.value)} className={inputClassName} />
              </Field>
              <Field label="跟进内容">
                <textarea required value={followForm.content} onChange={(event) => onFollowFormChange("content", event.target.value)} className={`${inputClassName} min-h-24 py-3`} />
              </Field>
              <Field label="客户反馈">
                <textarea value={followForm.customerFeedback} onChange={(event) => onFollowFormChange("customerFeedback", event.target.value)} className={`${inputClassName} min-h-20 py-3`} />
              </Field>
              <Field label="下一步动作">
                <textarea required value={followForm.nextAction} onChange={(event) => onFollowFormChange("nextAction", event.target.value)} className={`${inputClassName} min-h-20 py-3`} />
              </Field>
              <button type="submit" className="bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-moss">
                保存跟进记录
              </button>
            </form>
          </InfoPanel>
        </aside>
      </section>
      </div>
    </div>
  );
}

function LeadModal({
  mode,
  form,
  onChange,
  onClose,
  onSubmit
}: {
  mode: "create" | "edit";
  form: LeadForm;
  onChange: <K extends keyof LeadForm>(key: K, value: LeadForm[K]) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/44 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-line bg-paper shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-ink">{mode === "create" ? "新增客户线索" : "编辑客户线索"}</h2>
            <p className="mt-2 text-sm text-ink/56">
              {mode === "create" ? "完整填写 CRM 字段，保存后写入本地线索库。" : "仅维护意向等级、跟进状态、负责人、下次跟进时间和备注。"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="border border-line px-3 py-2 text-sm text-ink/64 hover:border-ink hover:text-ink">
            关闭
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-5 p-5">
          {mode === "edit" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="意向等级">
                <Select value={form.intentLevel} onChange={(value) => onChange("intentLevel", value as Lead["intentLevel"])} options={intentLevels.filter((item) => item !== allLabel)} />
              </Field>
              <Field label="跟进状态">
                <Select value={form.followStatus} onChange={(value) => onChange("followStatus", value as Lead["followStatus"])} options={followStatuses} />
              </Field>
              <Field label="负责人">
                <input required value={form.owner} onChange={(event) => onChange("owner", event.target.value)} className={inputClassName} />
              </Field>
              <Field label="下次跟进时间">
                <input value={form.nextFollowUp} onChange={(event) => onChange("nextFollowUp", event.target.value)} className={inputClassName} />
              </Field>
              <Field label="备注">
                <textarea value={form.remarks} onChange={(event) => onChange("remarks", event.target.value)} className={`${inputClassName} min-h-28 py-3`} />
              </Field>
            </div>
          ) : (
          <>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="录入日期">
              <input required type="date" value={form.entryDate} onChange={(event) => onChange("entryDate", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="客户姓名">
              <input required value={form.name} onChange={(event) => onChange("name", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="公司单位">
              <input required value={form.organization} onChange={(event) => onChange("organization", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="联系方式">
              <input required value={form.contact} onChange={(event) => onChange("contact", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="来源渠道">
              <Select value={form.source} onChange={(value) => onChange("source", value as Lead["source"])} options={sources} />
            </Field>
            <Field label="项目类型">
              <Select value={form.projectType} onChange={(value) => onChange("projectType", value as Lead["projectType"])} options={projectTypes.filter((item) => item !== allLabel)} />
            </Field>
            <Field label="项目所在地">
              <input required value={form.projectLocation} onChange={(event) => onChange("projectLocation", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="项目阶段">
              <Select value={form.stage} onChange={(value) => onChange("stage", value as Lead["stage"])} options={stages} />
            </Field>
            <Field label="意向等级">
              <Select value={form.intentLevel} onChange={(value) => onChange("intentLevel", value as Lead["intentLevel"])} options={intentLevels.filter((item) => item !== allLabel)} />
            </Field>
            <Field label="负责人">
              <input required value={form.owner} onChange={(event) => onChange("owner", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="下次跟进时间">
              <input required value={form.nextFollowUp} onChange={(event) => onChange("nextFollowUp", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="跟进状态">
              <Select value={form.followStatus} onChange={(value) => onChange("followStatus", value as Lead["followStatus"])} options={followStatuses} />
            </Field>
            <Field label="预算">
              <input value={form.budget} onChange={(event) => onChange("budget", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="评分">
              <input type="number" min="0" max="100" value={form.score} onChange={(event) => onChange("score", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="已发送资料">
              <input value={form.sentMaterials} onChange={(event) => onChange("sentMaterials", event.target.value)} placeholder="多个资料用逗号分隔" className={inputClassName} />
            </Field>
          </div>

          <Field label="客户需求">
            <textarea required value={form.demand} onChange={(event) => onChange("demand", event.target.value)} className={`${inputClassName} min-h-24 py-3`} />
          </Field>
          <Field label="内部备注">
            <textarea value={form.remarks} onChange={(event) => onChange("remarks", event.target.value)} className={`${inputClassName} min-h-20 py-3`} />
          </Field>
          </>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="border border-line px-5 py-3 text-sm font-medium text-ink/64 hover:border-ink hover:text-ink">
              取消
            </button>
            <button type="submit" className="bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-moss">
              保存线索
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-paper p-5">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function InfoGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="bg-paper p-4">
          <div className="text-xs text-ink/44">{label}</div>
          <div className="mt-2 text-sm leading-6 text-ink/72">{value}</div>
        </div>
      ))}
    </div>
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
      <div className="flex flex-wrap gap-2">
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
