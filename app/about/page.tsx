import Link from "next/link";
import { AboutHeroSection } from "@/components/AboutHeroSection";
import { ProfessionalProof } from "@/components/ProfessionalProof";
import { SiteHeader } from "@/components/SiteHeader";
import { caseStudies } from "@/data/mock";
import { companyProfile } from "@/src/data/companyProfile";
import { organizationGroups } from "@/src/data/organization";

const directions = ["城市更新", "乡村振兴", "农文旅融合", "品牌文创", "自持运营"];

const methods = [
  {
    title: "文化内容前置",
    text: "在空间设计前先明确项目文化内容、主题故事和传播表达。"
  },
  {
    title: "运营前置设计",
    text: "在项目前期同步考虑业态、客群、消费路径和运营收益。"
  },
  {
    title: "空间场景化",
    text: "将空间从单一功能设计转化为可拍照、可停留、可消费、可传播的场景。"
  },
  {
    title: "乡村资源产品化",
    text: "将乡村自然资源、文化资源、产业资源转化为体验产品和消费内容。"
  },
  {
    title: "自持项目反哺服务",
    text: "通过自持和运营项目经验，反向提升第三方项目策划设计和运营判断能力。"
  }
];

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />

      <AboutHeroSection />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.4fr_0.6fr] lg:gap-12 lg:px-8">
        <div className="pt-1">
          <p className="text-sm font-medium text-clay">COMPANY</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">公司介绍</h2>
        </div>
        <div className="max-w-3xl space-y-6 text-base leading-8 text-ink/66">
          <p>
            {companyProfile.description}公司主营业务涵盖乡村振兴、农文旅融合、城市更新、品牌文创等板块，业务类型包括自持孵化类项目与第三方服务类项目。
          </p>
          <p>
            作为西南地区较早介入城市更新与乡村振兴领域的公司之一，溯观长期关注城市文化、乡村产业、空间更新与内容运营之间的复合关系，形成了从项目研判、定位策划、空间设计、内容植入、招商运营到营销推广的全案服务能力。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-clay">ORGANIZATION</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">溯观文化产业机构</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-ink/62">
            以文商文旅、文创与文教三条业务线协同，覆盖文化产业、都市文旅、乡村农文旅、非标商业、高校文创、研学与亲子场景。
          </p>
        </div>
        <div className="grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-3">
          {organizationGroups.map((item, index) => (
            <article key={item.title} className="bg-paper p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-block bg-[#e7bd54] px-3 py-1 text-xs font-medium text-ink">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-6 font-serif text-3xl font-semibold text-ink">{item.title}</h3>
                </div>
                <span className="h-px w-12 bg-clay" />
              </div>
              <div className="mt-7 border-t border-line pt-5">
                <div className="text-xs text-ink/44">主体公司</div>
                <div className="mt-2 text-lg font-semibold leading-7 text-ink">{item.company}</div>
              </div>
              <div className="mt-6">
                <div className="text-xs text-ink/44">业务方向</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.directions.map((direction) => (
                    <span key={direction} className="border border-line bg-rice px-3 py-1.5 text-xs text-ink/66">
                      {direction}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:gap-12">
          <div className="pt-1">
            <p className="text-sm font-medium text-clay">DIRECTION</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">发展方向</h2>
          </div>
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
            {directions.map((item, index) => (
              <div key={item} className="flex min-h-40 flex-col justify-between bg-paper p-6">
                <span className="font-serif text-3xl text-ink/14">0{index + 1}</span>
                <h3 className="mt-8 text-xl font-semibold text-ink">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-medium text-clay">DIFFERENCE</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">公司差异化</h2>
          </div>
          <div>
            <p className="text-2xl font-semibold leading-10">
              溯观不同于单一策划公司或设计公司，更强调“文化内容 + 空间营造 + 产业导入 + 持续运营”的综合能力。
            </p>
            <p className="mt-6 text-base leading-8 text-paper/66">
              公司既服务政府平台、文旅投资方、乡村运营主体和商业空间业主，也通过自持、投资和参股方式参与项目长期运营，让真实运营现场的判断反向进入第三方项目服务。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-clay">METHODOLOGY</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">方法论模块</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-ink/62">
            以文化内容、运营逻辑与场景产品为底层判断，让项目从“可以建设”走向“可以经营”。
          </p>
        </div>
        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 lg:grid-cols-5">
          {methods.map((item, index) => (
            <article key={item.title} className="bg-paper p-6">
              <div className="font-serif text-3xl text-ink/12">0{index + 1}</div>
              <h3 className="mt-6 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-4 text-sm leading-6 text-ink/62">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper/72 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-clay">SELECTED WORKS</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">代表项目简述</h2>
            </div>
            <Link href="/cases" className="text-sm text-ink/56 transition hover:text-ink">
              查看全部案例
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {caseStudies.map((item) => (
              <article key={item.id} className="border border-line bg-paper p-5">
                <div className="text-xs text-moss">{item.location} / {item.category}</div>
                <h3 className="mt-4 min-h-16 text-lg font-semibold leading-7 text-ink">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-ink/62">{item.brief}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProfessionalProof />
    </main>
  );
}
