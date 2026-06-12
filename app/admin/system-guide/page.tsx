import { DemoDataBackup } from "@/components/DemoDataBackup";

const systemSections = [
  {
    index: "01",
    title: "前台官网",
    subtitle: "品牌展示与客户转化入口",
    description:
      "前台官网负责让外部客户快速理解溯观是谁、做过什么、能解决什么问题，并通过项目案例、服务内容、专业背书和联系我们页面承接项目咨询。",
    points: ["展示公司定位与服务能力", "沉淀案例详情和 GEO 关键词", "承接资料包领取与项目咨询"]
  },
  {
    index: "02",
    title: "客户线索 CRM",
    subtitle: "记录、筛选和跟进潜在客户",
    description:
      "CRM 模块用于记录客户姓名、公司单位、来源渠道、项目类型、项目阶段、意向等级和跟进状态，方便内部统一管理商务线索。",
    points: ["新增和编辑客户线索", "按意向等级、项目类型、来源渠道筛选", "记录跟进过程和下次跟进时间"]
  },
  {
    index: "03",
    title: "GEO 测试记录",
    subtitle: "监测 AI 是否提到溯观",
    description:
      "GEO 测试记录用于在 DeepSeek、Kimi、豆包、通义千问、ChatGPT 等 AI 平台中测试客户常问问题，判断回答是否提到溯观、是否准确以及是否存在优化空间。",
    points: ["记录测试平台、测试问题和问题类型", "追踪是否提到溯观与竞品", "形成内容补充、官网更新和复测闭环"]
  },
  {
    index: "04",
    title: "文章选题管理",
    subtitle: "把客户问题转化成内容资产",
    description:
      "文章选题管理把客户真实问题、AI 搜索问题和案例经验整理为选题池，推动内容从选题、撰写、审核、发布到复盘。",
    points: ["沉淀客户高频问题", "匹配适合平台和对应案例", "追踪发布链接、阅读量和带来线索数"]
  },
  {
    index: "05",
    title: "资料包管理",
    subtitle: "沉淀不同客户类型的资料",
    description:
      "资料包管理用于整理公司介绍、城市更新案例、乡村振兴与农文旅、低空经济与研学营地、亲子农场与自然教育等不同资料内容。",
    points: ["按客户类型组织资料包", "支持商务沟通和咨询转化", "后续可接入自动发送和领取记录"]
  }
];

const upgradeItems = [
  "接入真实数据库，保存客户线索、GEO 测试记录、文章选题和资料包数据",
  "部署正式官网，承接 SEO / GEO 内容曝光与客户咨询",
  "接入企业微信，实现线索提醒、资料发送和跟进协同",
  "接入表单后端，把官网咨询自动进入 CRM",
  "建立 GEO 复测机制，持续优化官网内容和观点文章"
];

export default function SystemGuidePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <section className="border border-line bg-paper p-6 sm:p-8 lg:p-10">
        <p className="text-sm font-medium text-clay">SYSTEM GUIDE</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">系统说明 / 操作说明</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-ink/66">
              溯观 GEO 中台是一个面向内部演示和 V1.0 试用的品牌内容与线索管理原型，
              用于把前台官网、客户线索、AI 搜索测试、文章选题和资料包管理串联起来，
              帮助团队更清楚地看到“品牌展示、内容曝光、客户转化、跟进管理”的完整路径。
            </p>
          </div>
          <div className="grid gap-3 border border-line bg-rice p-5">
            <div className="text-sm font-semibold text-ink">当前版本边界</div>
            <p className="text-sm leading-7 text-ink/62">
              当前版本为 mock 原型，暂不接真实数据库，不做正式部署，不接自动发布、自动评论或自动私信功能。
              页面数据主要用于内部演示、流程确认和后续需求评审。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["1 套", "官网 + 后台中台原型"],
          ["5 类", "核心管理模块"],
          ["Mock", "本地数据与前端状态"]
        ].map(([value, label]) => (
          <div key={label} className="border border-line bg-paper p-5">
            <div className="font-serif text-4xl font-semibold text-ink">{value}</div>
            <div className="mt-2 text-sm text-ink/58">{label}</div>
          </div>
        ))}
      </section>

      <DemoDataBackup />

      <section className="mt-8 grid gap-5">
        {systemSections.map((item) => (
          <article key={item.title} className="grid gap-5 border border-line bg-paper p-5 lg:grid-cols-[8rem_1fr_22rem]">
            <div>
              <div className="font-serif text-4xl font-semibold text-clay">{item.index}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-moss">{item.subtitle}</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-ink/64">{item.description}</p>
            </div>
            <ul className="grid gap-2 text-sm text-ink/62">
              {item.points.map((point) => (
                <li key={point} className="border border-line bg-rice px-3 py-2">
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 border border-line bg-ink p-6 text-paper sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-medium text-paper/54">NEXT VERSION</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold">后续可升级方向</h2>
          <p className="mt-4 text-sm leading-7 text-paper/62">
            在当前 mock 原型确认业务流程后，可以逐步接入真实数据、正式官网部署和企业微信协同，
            让 GEO 中台从演示原型升级为可长期使用的业务系统。
          </p>
        </div>
        <div className="grid gap-3">
          {upgradeItems.map((item) => (
            <div key={item} className="border border-paper/12 bg-paper/6 px-4 py-3 text-sm text-paper/72">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
