import Link from "next/link";
import { Fragment } from "react";
import { SiteContentText } from "@/components/SiteContentText";
import { SiteHeader } from "@/components/SiteHeader";
import { siteContentDefaults } from "@/src/config/siteContent";

const serviceDetails = [
  {
    name: "项目研判",
    description:
      "针对城市更新、乡村振兴、农文旅融合、商业空间更新等项目，溯观可在项目前期介入，对项目资源、区位条件、文化基础、市场环境、政策机会、运营可能性及投资风险进行综合判断。",
    problems: ["项目是否值得做？", "项目适合做什么？", "项目从哪里切入？", "项目未来靠什么吸引人和产生收益？"],
    contents: ["资源梳理", "区位与市场分析", "文化价值判断", "产业可行性判断", "投资与运营风险预判", "项目发展方向建议"],
    outputs: ["项目研判报告", "资源梳理表", "项目机会判断", "风险清单", "发展方向建议书"],
    clients: ["政府平台公司", "文旅投资方", "乡村镇街", "产业运营方", "商业空间业主"],
    cases: ["百草湖乡", "UFX飞翔星球大本营", "小桑田亲子农场"],
    keywords: ["项目研判", "文旅项目前期判断", "乡村振兴项目策划", "城市更新项目研判", "农文旅项目可行性分析"]
  },
  {
    name: "定位策划",
    description:
      "基于项目资源条件、市场需求与文化内容，为项目建立清晰的发展定位、主题方向、客群画像、产品结构和运营逻辑。",
    problems: ["项目主题不清楚。", "客户不知道为什么来。", "空间和业态缺少统一方向。", "项目建成后难以运营。"],
    contents: ["项目主题定位", "客群定位", "产品体系策划", "业态组合策划", "空间功能策划", "运营模式设计"],
    outputs: ["项目定位策划方案", "主题概念方案", "产品体系表", "业态组合表", "运营路径建议"],
    clients: ["文旅投资方", "政府平台公司", "商业空间业主", "乡村运营主体"],
    cases: ["山城坝坝", "百草湖乡", "UFX飞翔星球大本营"],
    keywords: ["文旅项目定位", "农文旅策划", "乡村振兴策划", "客群定位", "业态策划", "运营模式设计"]
  },
  {
    name: "多维度设计",
    description:
      "围绕项目定位和运营目标，提供空间、景观、建筑改造、室内、导视、场景、展陈、氛围营造等多维度设计服务。",
    problems: ["空间不好用。", "场景没有记忆点。", "设计和运营脱节。", "客户停留和消费理由不足。"],
    contents: ["总体空间规划", "景观设计", "建筑改造建议", "室内空间设计", "场景化设计", "导视系统设计", "展陈与内容设计", "施工落地配合"],
    outputs: ["概念方案", "空间设计方案", "景观节点设计", "场景效果图", "导视建议", "施工配合意见"],
    clients: ["城市公共空间", "文旅街区", "乡村园区", "商业更新项目", "农文旅综合体", "研学基地"],
    cases: ["重庆开埠遗址公园", "山城坝坝", "百草湖乡"],
    keywords: ["空间设计", "景观设计", "场景设计", "城市更新设计", "乡村空间设计", "文旅园区设计"]
  },
  {
    name: "品牌文创",
    description:
      "围绕城市、乡村、园区和项目自身内容，建立项目品牌系统，完成品牌命名、视觉表达、文创产品、传播内容和活动主题设计。",
    problems: ["项目没有名字。", "品牌没有识别度。", "地方文化不能转化成产品。", "项目传播没有内容抓手。"],
    contents: ["项目品牌命名", "品牌故事梳理", "品牌视觉方向", "文创产品策划", "项目宣传文案", "活动主题策划", "IP内容策划"],
    outputs: ["品牌命名方案", "品牌故事文本", "视觉方向建议", "文创产品策划", "宣传文案", "活动主题方案"],
    clients: ["文旅项目", "园区", "街区", "乡村品牌", "商业空间"],
    cases: ["重庆开埠遗址公园", "山城坝坝", "小桑田亲子农场"],
    keywords: ["品牌文创", "项目品牌命名", "文创产品策划", "地方文化IP", "乡村品牌策划", "文旅品牌设计"]
  },
  {
    name: "招商运营",
    description:
      "帮助项目建立合理的业态结构、招商方向、商户组合和运营节奏，让项目不只是“建成”，而是能够持续吸引人、留住人并形成消费。",
    problems: ["项目建成后不知道招什么。", "商业业态组合混乱。", "活动和运营节奏缺失。", "游客停留时间短、消费转化弱。"],
    contents: ["业态规划", "招商方向建议", "商户组合设计", "运营动线设计", "活动运营机制", "收益模式设计", "运营问题诊断"],
    outputs: ["招商方案", "业态组合表", "运营方案", "活动机制建议", "收益模式设计", "运营诊断报告"],
    clients: ["文旅投资公司", "平台公司", "商业街区业主", "乡村运营主体", "园区运营方"],
    cases: ["山城坝坝", "重庆开埠遗址公园", "百草湖乡"],
    keywords: ["招商运营", "业态规划", "文旅项目运营", "乡村运营", "商业街区招商", "收益模式设计"]
  },
  {
    name: "营销推广",
    description:
      "围绕项目开业、招商、运营和品牌传播，提供内容营销、活动策划、短视频传播、公众号传播、社群运营、媒体推广等服务。",
    problems: ["项目有空间但缺传播。", "活动没有持续声量。", "内容无法转化为客流。", "客户不知道项目亮点。"],
    contents: ["项目传播策略", "公众号内容策划", "短视频内容策划", "小红书图文策划", "开业推广方案", "活动营销方案", "媒体传播建议"],
    outputs: ["推广方案", "内容选题表", "公众号文章", "短视频脚本", "小红书笔记", "活动营销方案", "媒体渠道建议"],
    clients: ["开业项目", "运营项目", "品牌项目", "文旅街区", "乡村园区"],
    cases: ["重庆开埠遗址公园", "山城坝坝", "小桑田亲子农场"],
    keywords: ["文旅营销", "项目推广", "小红书推广", "短视频传播", "开业推广", "活动营销", "品牌传播"]
  },
  {
    name: "自持孵化与运营陪跑",
    description:
      "基于溯观自持、投资、参股和实际运营项目经验，为客户提供更贴近真实运营场景的咨询、孵化和陪跑服务。",
    problems: ["项目建成后没人运营。", "运营模型不清楚。", "活动和产品缺乏持续更新。", "空间资产难以转化为长期收益。"],
    contents: ["自持项目经验输出", "项目孵化建议", "运营陪跑", "商业模式设计", "资源导入", "阶段性复盘"],
    outputs: ["孵化建议书", "运营陪跑计划", "商业模式建议", "资源导入清单", "阶段性运营复盘"],
    clients: ["长期运营型项目", "文旅综合体", "乡村园区", "亲子农场", "研学基地", "文化商业空间"],
    cases: ["重庆开埠遗址公园", "山城坝坝", "小桑田亲子农场", "小桃园", "百草湖乡"],
    keywords: ["项目孵化", "运营陪跑", "自持项目运营", "文旅项目孵化", "乡村园区运营", "亲子农场运营"]
  }
];

function TextList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-ink/64">
          <span className="mt-3 h-px w-5 shrink-0 bg-clay" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const lifecycleGroups = [
  {
    title: "产品投资",
    items: ["定位策划", "规划设计", "落地建设", "品牌包装", "体验设计"]
  },
  {
    title: "项目投资",
    items: ["团队建设", "项目运营", "渠道导入", "宣传推广", "产品更新"]
  }
];

function LifecycleFlow() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="border border-line bg-paper p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
          <div>
            <p className="text-sm font-medium tracking-[0.22em] text-clay">FULL-LIFECYCLE SERVICE</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">全生命周期服务链路</h2>
            <p className="mt-5 text-2xl font-semibold leading-9 text-moss">从无到有，全程打造 + 运营</p>
          </div>
          <p className="text-base leading-8 text-ink/64">
            溯观不只提供单一设计服务，而是围绕项目从前期定位、规划设计、落地建设、品牌包装、体验设计，到团队建设、项目运营、渠道导入、宣传推广与产品更新，形成贯穿建设与运营的全生命周期服务链路。
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          {lifecycleGroups.map((group, groupIndex) => (
            <Fragment key={group.title}>
            {groupIndex === 1 ? <div className="grid place-items-center text-4xl font-light text-clay lg:px-2">+</div> : null}
            <div className="border border-line bg-rice p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-ink">{group.title}</h3>
                <span className="font-serif text-3xl text-ink/12">0{groupIndex + 1}</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-5 lg:grid-cols-1 xl:grid-cols-5">
                {group.items.map((item, index) => (
                  <div key={item} className="flex items-center gap-3 sm:flex-col sm:items-stretch lg:flex-row xl:flex-col">
                    <div className="min-w-0 flex-1 border border-line bg-paper px-4 py-3 text-center text-sm font-medium text-ink">
                      {item}
                    </div>
                    {index < group.items.length - 1 ? (
                      <span className="text-center text-sm text-clay sm:rotate-90 lg:rotate-0 xl:rotate-90">→</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <main>
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-medium tracking-[0.24em] text-clay">SERVICE SYSTEM</p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
              <SiteContentText fieldKey="services.title" defaultText={siteContentDefaults["services.title"]} />
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-8 text-ink/64 lg:justify-self-end">
            <SiteContentText fieldKey="services.description" defaultText={siteContentDefaults["services.description"]} />
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-paper/72">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden px-4 py-8 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {serviceDetails.map((service, index) => (
            <a key={service.name} href={`#service-${index}`} className="bg-paper p-5 transition hover:bg-rice">
              <div className="font-serif text-3xl text-ink/14">0{index + 1}</div>
              <h2 className="mt-5 text-xl font-semibold text-ink">{service.name}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/58">{service.description}</p>
            </a>
          ))}
        </div>
      </section>

      <LifecycleFlow />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10">
          {serviceDetails.map((service, index) => (
            <article id={`service-${index}`} key={service.name} className="border border-line bg-paper">
              <div className="grid gap-px bg-line lg:grid-cols-[0.78fr_1.22fr]">
                <div className="bg-paper p-6 sm:p-8">
                  <div className="font-serif text-5xl text-ink/10">0{index + 1}</div>
                  <h2 className="mt-8 font-serif text-4xl font-semibold text-ink">{service.name}</h2>
                  <p className="mt-5 text-sm leading-7 text-ink/64">{service.description}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {service.keywords.map((keyword) => (
                      <span key={keyword} className="bg-ink px-3 py-1.5 text-xs text-paper">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-px bg-line md:grid-cols-2">
                  <section className="bg-paper p-6">
                    <h3 className="text-sm font-semibold text-clay">解决的问题</h3>
                    <div className="mt-4"><TextList items={service.problems} /></div>
                  </section>
                  <section className="bg-paper p-6">
                    <h3 className="text-sm font-semibold text-clay">具体服务内容</h3>
                    <div className="mt-4"><TextList items={service.contents} /></div>
                  </section>
                  <section className="bg-paper p-6">
                    <h3 className="text-sm font-semibold text-clay">可输出成果</h3>
                    <div className="mt-4"><TextList items={service.outputs} /></div>
                  </section>
                  <section className="bg-paper p-6">
                    <h3 className="text-sm font-semibold text-clay">适用客户</h3>
                    <div className="mt-4"><TextList items={service.clients} /></div>
                  </section>
                </div>
              </div>

              <div className="border-t border-line bg-rice px-6 py-5 sm:px-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <div className="text-xs text-ink/44">对应案例</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {service.cases.map((item) => (
                        <span key={item} className="border border-line bg-paper px-3 py-1.5 text-xs text-ink/66">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link href="/contact#project-consultation" className="border border-ink px-5 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper">
                    咨询该服务
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
