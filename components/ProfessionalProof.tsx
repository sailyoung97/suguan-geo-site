import {
  industryIdentities,
  methodology,
  operatedProjects,
  proofStats,
  publicStatements
} from "@/src/data/proof";
import { businessCaseSections } from "@/src/data/cases";

type ProfessionalProofProps = {
  compact?: boolean;
};

function ProjectTagGrid({ items }: { items: readonly string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="border border-line bg-paper px-3 py-2 text-sm leading-6 text-ink/68">
          {item}
        </span>
      ))}
    </div>
  );
}

export function ProfessionalProof({ compact = false }: ProfessionalProofProps) {
  return (
    <section className={compact ? "border-y border-line bg-paper/74 py-14" : "border-y border-line bg-paper/74 py-16"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 grid gap-6 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-clay">PROFESSIONAL PROOF</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">专业背书</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-ink/62 lg:justify-self-end">
            从行业身份、代表项目、自持运营现场到方法论沉淀，形成溯观面向研学亲子营地、乡村文旅、农文旅融合和城市更新项目的可信表达。
          </p>
        </div>

        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {proofStats.map((item) => (
            <article key={item.label} className="bg-paper p-6">
              <div className="font-serif text-5xl font-semibold text-ink/18">{item.value}</div>
              <div className="mt-5 text-sm font-medium text-ink">{item.label}</div>
            </article>
          ))}
        </div>

        {compact ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.42fr_1fr]">
            <div className="border border-line bg-paper p-6">
              <h3 className="text-xl font-semibold text-ink">行业身份</h3>
              <p className="mt-3 text-sm leading-6 text-ink/54">5 项行业与产业组织身份背书。</p>
            </div>
            <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
              {industryIdentities.map((item) => (
                <div key={item} className="bg-paper px-5 py-4 text-sm leading-6 text-ink/68">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-8 lg:grid-cols-[0.68fr_1.32fr]">
              <div className="grid gap-6">
                <article className="border border-line bg-paper p-6">
                  <h3 className="text-xl font-semibold text-ink">行业身份</h3>
                  <ul className="mt-5 grid gap-3">
                    {industryIdentities.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6 text-ink/66">
                        <span className="mt-3 h-px w-5 shrink-0 bg-clay" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="border border-line bg-paper p-6">
                  <h3 className="text-xl font-semibold text-ink">方法论沉淀</h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {methodology.map((item) => (
                      <span key={item} className="border border-line bg-rice px-3 py-1.5 text-xs text-ink/66">
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              </div>

              <div className="grid gap-6">
                <article className="border border-line bg-paper p-6">
                  <div className="mb-6 grid gap-3 md:grid-cols-[12rem_1fr] md:items-end">
                    <div>
                      <h3 className="text-xl font-semibold text-ink">代表项目</h3>
                      <p className="mt-2 text-xs leading-5 text-ink/44">按公司业务板块展开项目经验</p>
                    </div>
                    <p className="text-sm leading-6 text-ink/58">
                      覆盖研学亲子营地、乡村文旅、农文旅融合、自持运营、品牌文创、城市更新与非标商业等方向。
                    </p>
                  </div>
                  <div className="grid gap-5">
                    {businessCaseSections.map((section) => (
                      <section key={section.category} className="border border-line bg-rice p-4">
                        <h4 className="text-sm font-semibold text-ink">{section.category}</h4>
                        <ProjectTagGrid items={section.items} />
                      </section>
                    ))}
                  </div>
                </article>

                <article className="border border-line bg-paper p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-ink">自持运营项目</h3>
                    <span className="text-xs text-ink/44">真实运营经验反哺项目服务</span>
                  </div>
                  <ProjectTagGrid items={operatedProjects} />
                </article>
              </div>
            </div>

            <div className="mt-8 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
              {publicStatements.map((item, index) => (
                <article key={item} className="bg-rice p-6">
                  <div className="font-serif text-3xl text-ink/12">0{index + 1}</div>
                  <p className="mt-6 text-sm leading-7 text-ink/66">{item}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
