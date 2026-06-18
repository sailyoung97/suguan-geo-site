import Link from "next/link";
import { FeaturedCases } from "@/components/FeaturedCases";
import { ProfessionalProof } from "@/components/ProfessionalProof";
import { SiteAssetImage } from "@/components/SiteAssetImage";
import { SiteContentText } from "@/components/SiteContentText";
import { SiteHeader } from "@/components/SiteHeader";
import { siteAssets } from "@/src/config/siteAssets";
import { siteContentDefaults } from "@/src/config/siteContent";

const serviceHighlights = [
  {
    title: "项目研判与定位策划",
    text: "从资源、客群、业态和运营路径判断项目方向。"
  },
  {
    title: "空间场景与品牌文创",
    text: "把地方文化转化为空间场景、品牌表达和传播内容。"
  },
  {
    title: "招商运营与自持孵化",
    text: "围绕业态组合、活动运营和自持经验，帮助项目持续生长。"
  }
];

const heroContactInfo = {
  phone01: "15823051516",
  phone02: "18996507779",
  companyAddress: "重庆市两江新区北滨二路保利中心B5栋1-2",
};

function HeroQrCard({ label, asset }: { label: string; asset: typeof siteAssets.contactQrCode01 }) {
  return (
    <div className="flex items-center gap-4 bg-ink/58 p-4 backdrop-blur-sm sm:flex-col sm:items-start">
      <SiteAssetImage
        asset={asset}
        className="h-[118px] w-[118px] shrink-0 border border-paper/14 bg-paper/8 sm:h-32 sm:w-32"
        fit="contain"
        fallbackLabel="二维码待上传"
        variant="qr"
      />
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-clay">QR CODE</p>
        <p className="mt-2 text-sm font-medium text-paper">{label}</p>
      </div>
    </div>
  );
}

function HeroContactPanel() {
  return (
    <div className="mt-12 grid gap-px overflow-hidden border border-paper/14 bg-paper/14 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
      <HeroQrCard label="公众号二维码" asset={siteAssets.contactQrCode01} />
      <HeroQrCard label="项目咨询二维码" asset={siteAssets.contactQrCode02} />
      <div className="bg-ink/58 p-4 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-clay">PHONE</p>
        <div className="mt-4 space-y-3 text-sm leading-6 text-paper/78">
          <p>
            <span className="block text-paper/42">商务电话</span>
            <a className="font-medium text-paper transition hover:text-clay" href={`tel:${heroContactInfo.phone01}`}>
              {heroContactInfo.phone01}
            </a>
          </p>
          <p>
            <span className="block text-paper/42">项目咨询</span>
            <a className="font-medium text-paper transition hover:text-clay" href={`tel:${heroContactInfo.phone02}`}>
              {heroContactInfo.phone02}
            </a>
          </p>
        </div>
      </div>
      <div className="bg-ink/58 p-4 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-clay">CONTACT</p>
        <div className="mt-4 space-y-3 text-sm leading-6 text-paper/78">
          <p>
            <span className="block text-paper/42">公司地址</span>
            <span>{heroContactInfo.companyAddress}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-screen overflow-hidden border-b border-paper/10 bg-ink text-paper">
        <SiteHeader variant="dark" />
        <div className="pointer-events-none absolute inset-x-0 top-[104px] select-none overflow-hidden whitespace-nowrap text-center font-sans text-[clamp(72px,21vw,112px)] font-semibold uppercase leading-none tracking-[-0.04em] text-paper/[0.08] sm:top-[10vh] sm:text-[22vw] sm:text-paper/[0.1] lg:text-[16vw] xl:text-[15vw]">
          SUGUAN
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(154,94,55,0.18),transparent_32%),linear-gradient(180deg,rgba(31,36,33,0)_0%,rgba(31,36,33,0.46)_100%)]" />

        <div className="relative mx-auto grid min-h-[calc(100svh-68px)] max-w-7xl content-center px-6 pb-12 pt-8 sm:min-h-[calc(100vh-74px)] sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
          <div className="max-w-[760px] pt-[132px] sm:pt-[20vh] lg:pt-[22vh]">
            <p className="text-sm font-medium uppercase tracking-[0.32em] text-clay">SUGUAN DESIGN</p>
            <h1 className="mt-6 font-serif text-[40px] font-semibold leading-[1.12] text-paper sm:text-5xl lg:text-6xl">
              致力于打造具有持续生命力与社会价值的文化项目
            </h1>
            <p className="mt-7 text-base leading-8 text-paper/70 sm:text-lg">
              溯观深耕西南地区城市更新、乡村振兴、农文旅融合与品牌文创领域，提供项目研判、定位策划、空间场景、品牌内容、招商运营与持续孵化服务。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cases"
                className="border border-paper bg-paper px-6 py-3 text-center text-sm font-medium text-ink transition hover:border-clay hover:bg-clay"
              >
                <SiteContentText fieldKey="home.primaryCta" defaultText={siteContentDefaults["home.primaryCta"]} />
              </Link>
              <Link
                href="/contact#project-consultation"
                className="border border-paper/35 px-6 py-3 text-center text-sm font-medium text-paper transition hover:border-paper hover:bg-paper/10"
              >
                <SiteContentText fieldKey="home.consultCta" defaultText={siteContentDefaults["home.consultCta"]} />
              </Link>
            </div>
          </div>
          <HeroContactPanel />
        </div>
      </section>

      <section className="border-b border-line bg-rice py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid gap-5 lg:grid-cols-[0.55fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-medium tracking-[0.22em] text-clay">BRAND ASSETS</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">品牌与项目资产</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-ink/62 lg:justify-self-end">
              从城市更新、乡村农文旅、非标商业、文创品牌到研学亲子项目，溯观持续将地方资源转译为可识别、可传播、可运营的品牌资产。
            </p>
          </div>
        </div>
        <div className="relative left-1/2 right-1/2 -ml-[50vw] mt-10 w-screen border-y border-line bg-ink p-3 shadow-soft sm:p-6">
          <SiteAssetImage
            asset={siteAssets.brandAssetsImage}
            className="mx-auto aspect-[16/10] w-full bg-ink"
            imageClassName="p-2 sm:p-4"
            fit="contain"
            fallbackLabel="品牌资产矩阵图待上传"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium tracking-[0.22em] text-clay">SERVICE SYSTEM</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">溯观服务内容</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-ink/62">
            从项目判断到空间落地，再到品牌表达、招商运营和持续孵化，溯观提供贯穿项目前期、中期和后期的综合服务。
          </p>
        </div>
        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {serviceHighlights.map((service, index) => (
            <article key={service.title} className="bg-paper p-6 sm:p-7">
              <div className="font-serif text-5xl text-ink/12">0{index + 1}</div>
              <h3 className="mt-10 text-xl font-semibold text-ink">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-ink/64">{service.text}</p>
              <Link href="/services" className="mt-8 inline-flex text-sm font-medium text-clay transition hover:text-ink">
                查看服务详情
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-paper sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium tracking-[0.22em] text-clay">SELECTED WORKS</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">代表案例</h2>
            </div>
            <Link href="/cases" className="text-sm text-paper/70 transition hover:text-paper">
              查看完整案例
            </Link>
          </div>
          <FeaturedCases />
        </div>
      </section>

      <ProfessionalProof compact />

      <section className="border-t border-line bg-paper/78">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-medium tracking-[0.24em] text-clay">CONTACT SUGUAN</p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              有项目正在推进，可以先从一次项目咨询开始。
            </h2>
            <div className="mt-6 grid gap-3 text-sm leading-6 text-ink/64 sm:grid-cols-3">
              <p>
                商务电话：
                <a className="transition hover:text-ink" href="tel:15823051516">
                  15823051516
                </a>
              </p>
              <p>
                项目咨询：
                <a className="transition hover:text-ink" href="tel:18996507779">
                  18996507779
                </a>
              </p>
              <p>地址：重庆市两江新区北滨二路保利中心B5栋1-2</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/contact#project-consultation"
              className="bg-ink px-6 py-4 text-center text-sm font-medium text-paper transition hover:bg-moss"
            >
              提交项目咨询
            </Link>
            <Link
              href="/contact#resource-pack"
              className="border border-ink px-6 py-4 text-center text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
            >
              获取公司资料包
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
