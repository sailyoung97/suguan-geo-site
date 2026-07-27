"use client";

import { FormEvent, useState } from "react";
import type { Lead } from "@/data/mock";
import { submitWebsiteLead } from "@/src/lib/leadsStore";

const projectTypes = [
  "城市更新 / 商业街区",
  "乡村振兴 / 农文旅融合",
  "低空经济 / 无人机研学",
  "亲子农场 / 自然教育",
  "品牌文创 / 活动运营",
  "招商运营 / 项目提升",
  "商业空间更新"
];

const projectStages = ["前期研判", "定位策划", "设计深化", "招商运营", "营销推广", "运营提升"];

const inputClassName =
  "h-12 w-full border border-line bg-rice px-4 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-ink";

export function ProjectConsultForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const wechat = String(formData.get("wechat") || "").trim();
    const contact = String(formData.get("phone") || "").trim();
    const demand = String(formData.get("demand") || "").trim();
    const today = new Date().toISOString().slice(0, 10);

    setStatus("submitting");
    setErrorMessage("");

    try {
      const nextLead: Lead = {
        id: `L-WEB-${Date.now()}`,
        entryDate: today,
        name: String(formData.get("name") || "").trim(),
        organization: String(formData.get("organization") || "").trim(),
        contact: wechat ? `${contact} / 微信：${wechat}` : contact,
        source: "官网表单",
        projectType: mapProjectType(String(formData.get("projectType") || "")),
        projectLocation: String(formData.get("location") || "").trim(),
        city: String(formData.get("location") || "").trim().slice(0, 2) || "待定",
        stage: "新线索",
        demand,
        intent: demand,
        sentMaterials: [],
        intentLevel: "B",
        owner: "待分配",
        nextFollowUp: "",
        followStatus: "新线索",
        lastContact: today,
        remarks: wechat ? `微信号：${wechat}` : "",
        budget: "待评估",
        score: 75,
        followRecords: []
      };

      await submitWebsiteLead(nextLead, String(formData.get("website") || ""));
      setStatus("success");
      form.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "提交失败，请稍后重试或直接联系商务。");
      setStatus("error");
    }
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={handleSubmit}
    >
      {status === "success" ? (
        <div className="border border-moss/30 bg-moss/10 px-4 py-3 text-sm font-medium text-moss">
          已收到咨询，我们将尽快联系您。
        </div>
      ) : null}
      {status === "error" ? (
        <div className="border border-clay/30 bg-clay/10 px-4 py-3 text-sm font-medium text-clay">
          {errorMessage || "提交失败，请稍后重试或直接联系商务。"}
        </div>
      ) : null}

      <div className="sr-only" aria-hidden="true">
        <label>
          网站
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="姓名" required>
          <input className={inputClassName} name="name" placeholder="请输入您的姓名" required />
        </Field>
        <Field label="公司/单位">
          <input className={inputClassName} name="organization" placeholder="请输入公司或机构名称" />
        </Field>
        <Field label="联系电话" required>
          <input className={inputClassName} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="请输入手机号或座机" required />
        </Field>
        <Field label="微信号">
          <input className={inputClassName} name="wechat" placeholder="便于后续发送资料包" />
        </Field>
        <Field label="项目所在地">
          <input className={inputClassName} name="location" placeholder="如：重庆渝中、四川雅安" />
        </Field>
        <Field label="项目类型">
          <select className={inputClassName} name="projectType" defaultValue="">
            <option value="" disabled>
              请选择项目类型
            </option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="项目阶段">
          <select className={inputClassName} name="projectStage" defaultValue="">
            <option value="" disabled>
              请选择项目阶段
            </option>
            {projectStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="需求描述" required>
        <textarea
          className={`${inputClassName} min-h-32 py-4 leading-6`}
          name="demand"
          placeholder="请简要说明项目背景、所在区域、当前阶段、希望解决的问题和需要领取的资料包"
          required
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="min-h-12 bg-ink px-6 py-4 text-sm font-medium text-paper transition hover:bg-moss disabled:cursor-wait disabled:opacity-60"
      >
        {status === "submitting" ? "正在提交…" : "提交项目咨询"}
      </button>
      <p className="text-xs leading-6 text-ink/45">
        提交即表示您同意溯观仅将上述信息用于项目沟通与资料发送，我们不会公开您的联系方式。
      </p>
    </form>
  );
}

function mapProjectType(value: string): Lead["projectType"] {
  if (value.includes("乡村振兴")) return "乡村振兴";
  if (value.includes("农文旅")) return "农文旅融合";
  if (value.includes("品牌文创")) return "品牌文创";
  if (value.includes("招商运营")) return "招商运营";
  if (value.includes("亲子") || value.includes("研学") || value.includes("低空经济")) return "亲子营地";
  return "城市更新";
}

function Field({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink/64">
      <span>
        {label}
        {required ? <span className="ml-1 text-clay">*</span> : null}
      </span>
      {children}
    </label>
  );
}
