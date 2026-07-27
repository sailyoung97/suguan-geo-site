import type { Metadata } from "next";
import { CasesList } from "@/components/CasesList";
import { SiteContentText } from "@/components/SiteContentText";
import { SiteHeader } from "@/components/SiteHeader";
import { siteContentDefaults } from "@/src/config/siteContent";
import { brandTimeline, businessCaseSections } from "@/src/data/cases";

const casesDescription =
  "从研学亲子营地、乡村文旅、农文旅融合到城市更新与非标商业，溯观以项目研判、定位策划、空间场景、品牌内容和运营导入为核心，把地方资源转化为可体验、可消费、可持续经营的项目资产。重点案例涵盖百草湖乡、小桑田、重庆开埠遗址公园、山城坝坝等不同类型的在地项目实践。";

export const metadata: Metadata = {
  title: "项目案例",
  description: casesDescription,
  alternates: { canonical: "/cases" },
  openGraph: {
    title: "项目案例｜溯观文化发展有限公司",
    description: casesDescription,
    type: "website"
  }
};

export default function CasesPage() {
  return (
    <main>
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-medium tracking-[0.24em] text-clay">SELECTED CASES</p>
            <h1 className="mt-5 font-serif text-[clamp(42px,8vw,60px)] font-semibold leading-[1.12] text-ink">
              <SiteContentText fieldKey="cases.title" defaultText={siteContentDefaults["cases.title"]} />
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-8 text-ink/64 lg:justify-self-end">
            <SiteContentText fieldKey="cases.description" defaultText={casesDescription} />
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-paper/68">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-px overflow-hidden px-4 sm:px-6 lg:px-8">
          {["研学亲子营地", "乡村文旅运营", "城市更新实践"].map((item) => (
            <div key={item} className="min-w-0 border-r border-line py-5 text-center last:border-r-0 sm:py-6">
              <span className="text-xs font-medium leading-5 text-ink/72 sm:text-sm">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <CasesList />
      </section>

      <section className="border-y border-line bg-paper/72 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-clay">BUSINESS SECTIONS</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">业务板块案例</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-ink/62">
              从研学亲子营地、乡村文旅、农文旅融合、自持运营到品牌文创、城市更新与非标商业，展示溯观不同业务线的项目经验和合作场景。
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {businessCaseSections.map((section) => (
              <article key={section.category} className="border border-line bg-paper p-6">
                <h3 className="font-serif text-3xl font-semibold text-ink">{section.category}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {section.items.map((item) => (
                    <span key={item} className="border border-line bg-rice px-3 py-1.5 text-xs text-ink/66">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-clay">BRAND GROWTH</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">品牌成长历程</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-ink/62">
            该时间线用于呈现溯观自持、参股与运营项目的品牌成长节奏，不与项目案例年份混淆。
          </p>
        </div>
        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {brandTimeline.map((item, index) => (
            <article key={`${item.name}-${item.time}`} className="bg-paper p-5">
              <div className="font-serif text-3xl text-ink/12">{String(index + 1).padStart(2, "0")}</div>
              <h3 className="mt-6 text-xl font-semibold text-ink">{item.name}</h3>
              <p className="mt-3 text-sm text-moss">{item.time}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
