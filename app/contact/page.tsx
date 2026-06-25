import type { Metadata } from "next";
import { ProjectConsultForm } from "@/components/ProjectConsultForm";
import { SiteAssetImage } from "@/components/SiteAssetImage";
import { SiteContentText } from "@/components/SiteContentText";
import { SiteHeader } from "@/components/SiteHeader";
import type { SiteAsset } from "@/src/config/siteAssets";
import { siteAssets } from "@/src/config/siteAssets";
import { siteContentDefaults } from "@/src/config/siteContent";

export const metadata: Metadata = {
  title: "项目咨询与资料领取｜溯观文化发展有限公司",
  description:
    "提交研学亲子营地、乡村文旅、农文旅融合、品牌文创、招商运营与项目提升需求，获取溯观项目资料与初步沟通。",
  openGraph: {
    title: "项目咨询与资料领取｜溯观文化发展有限公司",
    description: "通过官网提交项目所在地、项目类型、项目阶段和需求描述，溯观将尽快联系。",
    type: "website"
  }
};

const contactCards = [
  {
    label: "商务电话",
    value: "15823051516",
    hint: "工作日 10:00-18:00",
    href: "tel:15823051516"
  },
  {
    label: "项目咨询",
    value: "18996527779",
    hint: "项目沟通 / 资料领取",
    href: "tel:18996527779"
  },
  {
    label: "公司地址",
    value: "重庆市两江新区北滨二路保利中心B5栋1-2",
    hint: ""
  }
];

const consultDirections = [
  "城市更新 / 商业街区",
  "乡村振兴 / 农文旅融合",
  "低空经济 / 无人机研学",
  "亲子农场 / 自然教育",
  "品牌文创 / 活动运营",
  "招商运营 / 项目提升"
];

const resourcePacks = [
  "公司介绍资料包",
  "城市更新案例资料包",
  "乡村振兴与农文旅资料包",
  "低空经济与研学营地资料包",
  "亲子农场与自然教育资料包"
];

function QrPlaceholder({ title, subtitle, asset }: { title: string; subtitle: string; asset: SiteAsset }) {
  return (
    <div className="border border-line bg-rice p-4">
      <SiteAssetImage
        asset={asset}
        className="aspect-square border border-line"
        fallbackLabel="QR"
        variant="qr"
      />
      <div className="mt-4 text-sm font-semibold text-ink">{title}</div>
      <div className="mt-1 text-xs text-ink/52">{subtitle}</div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main>
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-medium tracking-[0.24em] text-clay">CONTACT SUGUAN</p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
              <SiteContentText fieldKey="contact.title" defaultText={siteContentDefaults["contact.title"]} />
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-8 text-ink/64 lg:justify-self-end">
            <SiteContentText fieldKey="contact.description" defaultText={siteContentDefaults["contact.description"]} />
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {consultDirections.map((item) => (
            <span key={item} className="border border-line bg-paper px-3 py-1.5 text-xs text-ink/64">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <aside className="space-y-6">
          <div className="border border-line bg-paper p-6">
            <p className="text-sm font-medium text-clay">BUSINESS</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">联系方式</h2>
            <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line">
              {contactCards.map((item) => (
                <div key={item.label} className="bg-paper p-5">
                  <div className="text-xs text-ink/46">{item.label}</div>
                  <div className="mt-2 break-words text-xl font-semibold text-ink">
                    {"href" in item && item.href ? (
                      <a className="transition hover:text-clay" href={item.href}>
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </div>
                  {item.hint ? <div className="mt-2 text-xs text-moss">{item.hint}</div> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="border border-line bg-paper p-6">
            <p className="text-sm font-medium text-clay">QR CONTACT</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">扫码联系</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <QrPlaceholder
                title="公众号二维码"
                subtitle="获取观点文章与案例更新"
                asset={siteAssets.qrcodes.wechatOfficial}
              />
              <QrPlaceholder
                title="企业微信二维码"
                subtitle="添加顾问领取公司资料包"
                asset={siteAssets.qrcodes.enterpriseWechat}
              />
            </div>
          </div>
        </aside>

        <section id="project-consultation" className="border border-line bg-paper p-6 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-medium text-clay">PROJECT CONSULTATION</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">项目咨询表单</h2>
            <p className="mt-4 text-sm leading-6 text-ink/60">
              当前为原型表单，先使用前端状态展示提交反馈，不接入真实后端或数据库。
            </p>
          </div>
          <ProjectConsultForm />
        </section>
      </section>

      <section id="resource-pack" className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="border border-line bg-paper p-6 sm:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-clay">RESOURCE PACK</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">资料包领取</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-ink/60">
              可在项目咨询表单中备注希望领取的资料包类型，后续可接入资料包自动发送和 CRM 线索归档。
            </p>
          </div>
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 lg:grid-cols-5">
            {resourcePacks.map((item, index) => (
              <article key={item} className="bg-paper p-5">
                <div className="font-serif text-3xl text-ink/12">0{index + 1}</div>
                <h3 className="mt-8 min-h-14 text-lg font-semibold leading-7 text-ink">{item}</h3>
                <p className="mt-4 text-sm leading-6 text-ink/58">
                  适合用于项目前期了解溯观服务边界、代表案例和可输出成果。
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
