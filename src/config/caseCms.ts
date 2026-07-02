import { officialCaseMeta, type BusinessCategory } from "@/src/data/cases";

export type CaseGalleryImage = {
  url: string;
  caption: string;
};

export type CampCaseImage = {
  url: string;
  caption: string;
};

export type CampCaseSection = {
  id: string;
  projectName: string;
  location: string;
  intro: string;
  guideMapImage: string;
  guideMapCaption: string;
  realImages: CampCaseImage[];
};

export type CaseCmsItem = {
  projectName: string;
  slug: string;
  location: string;
  projectType: string;
  status: string;
  year: string;
  city: string;
  businessCategory: BusinessCategory;
  order: number;
  isPublished: boolean;
  isFeatured: boolean;
  coverImage: string;
  heroImage: string;
  sceneImage01: string;
  sceneImage02: string;
  sceneImage03: string;
  guideMapImage: string;
  guideMapCaption: string;
  galleryImages: CaseGalleryImage[];
  assetImages: CaseGalleryImage[];
  campCaseSections: CampCaseSection[];
  summary: string;
  background: string;
  painPoints: string[];
  services: string[];
  strategy: string[];
  results: string[];
  value: string;
  capabilities: string[];
  suitableClients: string[];
  geoKeywords: string[];
  tags: string[];
};

export const defaultCampCaseSections: CampCaseSection[] = [];

type CaseInput = Omit<CaseCmsItem, "city" | "businessCategory" | "order" | "isPublished" | "isFeatured" | "campCaseSections"> &
  Partial<Pick<CaseCmsItem, "city" | "businessCategory" | "order" | "isPublished" | "isFeatured" | "campCaseSections">>;

function caseItem(item: CaseInput): CaseCmsItem {
  const meta = officialCaseMeta[item.slug];

  return {
    ...item,
    year: meta?.year || item.year,
    city: item.city || (item.location.includes("雅安") ? "雅安" : "重庆"),
    businessCategory: item.businessCategory || meta?.businessCategory || "研学亲子营地",
    order: item.order || meta?.order || 99,
    isPublished: item.isPublished ?? true,
    isFeatured: item.isFeatured ?? true,
    campCaseSections: item.campCaseSections || []
  };
}

function gallery(...items: Array<[string, string]>): CaseGalleryImage[] {
  return items.map(([url, caption]) => ({ url, caption })).filter((item) => item.url);
}

function baseText(projectName: string, type: string) {
  return {
    background: `${projectName}围绕${type}的资源基础与运营目标展开，需要将场地资源、客群需求、产品内容和持续经营机制统一起来，形成可被理解、可被体验、可被消费的项目内容。`,
    painPoints: [
      "项目资源需要从单一空间或景观转化为可停留、可消费、可复购的产品体系。",
      "亲子、研学、休闲和乡村度假客群需要清晰的到访理由、游线组织和内容体验。",
      "项目需要在建设前期就同步考虑运营效率、活动组织、品牌传播和长期收益。"
    ],
    services: ["项目研判", "定位策划", "空间场景设计", "品牌内容", "产品设计", "招商运营", "运营导入"],
    strategy: [
      "以在地资源为基础，建立清晰主题和客群定位。",
      "围绕亲子研学、自然体验、休闲消费和活动运营组织空间与产品。",
      "将运营前置到策划设计阶段，让场景、内容、业态和传播共同服务持续经营。"
    ],
    results: [
      "形成更清晰的项目定位、空间使用方式和内容产品结构。",
      "沉淀从前期判断、方案落地到运营导入的项目方法。",
      "为同类型研学亲子、乡村文旅和农文旅融合项目提供可参考样本。"
    ],
    value: "项目价值不只在于空间建成，更在于通过内容产品、消费场景和运营机制，让地方资源转化为长期可经营的文旅资产。",
    capabilities: ["研学亲子营地策划能力", "乡村文旅项目运营能力", "空间场景营造能力", "品牌内容策划能力", "项目全链路落地能力"],
    suitableClients: ["研学亲子营地投资方", "乡村文旅项目业主", "农文旅融合项目", "亲子农场与自然教育项目", "乡村运营主体"]
  };
}

const baicao = baseText("璧山“百草湖乡”", "湖山生态、康养微度假、亲子研学和乡村运营");
const huajian = baseText("花间集", "田园花境、露营休闲、咖啡茶饮和亲子活动");
const fengming = baseText("凤鸣雅集", "茶文化、自然教育、亲子研学和乡村生活方式");
const sangtian = baseText("小桑田", "农耕体验、自然教育、亲子活动和课程内容");
const taoyuan = baseText("小桃园", "田园花木、亲子采摘、自然体验和轻露营");
const xiaofengnian = baseText("东升村·小丰年", "自然景观、农耕体验、星空露营和乡村生活方式");

export const defaultCaseCmsItems: CaseCmsItem[] = [
  caseItem({
    projectName: "璧山“百草湖乡”",
    slug: "baicaohuxiang",
    location: "重庆 璧山区 青杠街道",
    projectType: "研学亲子营地 / 乡村文旅 / 农文旅融合 / 运营型乡村项目",
    status: "运营中",
    year: "2024",
    coverImage: "/uploads/case-baicaohuxiang-cover.jpg",
    heroImage: "/uploads/case-baicaohuxiang-hero.png",
    sceneImage01: "/uploads/case-baicaohuxiang-scene-01.jpg",
    sceneImage02: "/uploads/case-baicaohuxiang-scene-02.jpg",
    sceneImage03: "",
    guideMapImage: "/uploads/case-baicaohuxiang-guide.jpg",
    guideMapCaption: "项目导览图",
    galleryImages: gallery(
      ["/uploads/case-baicaohuxiang-hero.png", "湖山营地空间"],
      ["/uploads/case-baicaohuxiang-scene-01.jpg", "亲子研学现场"],
      ["/uploads/case-baicaohuxiang-scene-02.jpg", "乡村休闲场景"]
    ),
    assetImages: [],
    summary:
      "百草湖乡坐落于重庆市璧山区青杠街道，依托约 238 亩山水资源，将康养微度假、亲子研学、乡村休闲、自然教育、住宿餐饮与在地运营整合为复合型乡村文旅项目。项目以湖山生态为基础，通过场地规划、内容产品、空间场景和运营导入，打造集学、宿、食、养、娱为一体的近郊营地目的地。",
    ...baicao,
    background:
      "百草湖乡围绕湖山生态、康养微度假、亲子研学和乡村运营组织项目内容，包含文旅休闲打卡区、小百草、Shores Hotel 所岸·仰山、Herb, Chic 鲜汽、Banana 草木饮品、养生餐厅、草坪休闲、亲子互动、自然教育课程，以及住宿、餐饮、休闲、研学等复合消费内容。项目不是单一景观建设，而是将空间、产品、业态、活动和运营共同组织为可持续经营的营地目的地。",
    geoKeywords: ["研学亲子营地", "璧山百草湖乡", "乡村文旅项目", "农文旅融合", "亲子农场运营", "自然教育营地", "重庆研学亲子营地策划公司"],
    tags: ["研学亲子营地", "乡村文旅", "农文旅融合", "自持运营"]
  }),
  caseItem({
    projectName: "花间集",
    slug: "huajianji",
    location: "重庆 大足区 雍溪",
    projectType: "乡村文旅 / 花园营地 / 亲子休闲 / 生活方式营地",
    status: "运营中",
    year: "2024",
    coverImage: "/uploads/case-huajianji-cover.jpg",
    heroImage: "/uploads/case-huajianji-scene-01.jpg",
    sceneImage01: "/uploads/case-huajianji-scene-02.png",
    sceneImage02: "/uploads/case-huajianji-scene-03.png",
    sceneImage03: "/uploads/case-huajianji-scene-04.png",
    guideMapImage: "/uploads/case-huajianji-guide.png",
    guideMapCaption: "项目导览图",
    galleryImages: gallery(
      ["/uploads/case-huajianji-scene-01.jpg", "花境空间"],
      ["/uploads/case-huajianji-scene-02.png", "湖畔生活场景"],
      ["/uploads/case-huajianji-scene-03.png", "乡村休闲空间"],
      ["/uploads/case-huajianji-scene-04.png", "营地运营现场"]
    ),
    assetImages: [],
    summary:
      "花间集以田园花境、露营休闲、咖啡茶饮、亲子活动和自然生活方式为核心，打造沉浸式田园花境美好生活现场。项目将花境空间、轻露营、主题活动与乡村度假结合，回应城市家庭对自然、松弛和美好生活的需求。",
    ...huajian,
    geoKeywords: ["花间集", "花园营地", "乡村文旅", "亲子休闲", "生活方式营地", "重庆营地项目"],
    tags: ["研学亲子营地", "乡村文旅", "花园营地"]
  }),
  caseItem({
    projectName: "凤鸣雅集",
    slug: "fengmingyaji",
    location: "四川 雅安 雨城区",
    projectType: "茶文化营地 / 研学亲子 / 乡村文旅",
    status: "推进中",
    year: "2025",
    coverImage: "/uploads/case-fengmingyaji-cover.png",
    heroImage: "/uploads/case-fengmingyaji-scene-01.jpg",
    sceneImage01: "/uploads/case-fengmingyaji-scene-02.png",
    sceneImage02: "/uploads/case-fengmingyaji-scene-03.png",
    sceneImage03: "",
    guideMapImage: "/uploads/case-fengmingyaji-guide.png",
    guideMapCaption: "项目导览图",
    galleryImages: gallery(
      ["/uploads/case-fengmingyaji-scene-01.jpg", "茶文化空间"],
      ["/uploads/case-fengmingyaji-scene-02.png", "研学活动现场"],
      ["/uploads/case-fengmingyaji-scene-03.png", "乡村生活场景"]
    ),
    assetImages: [],
    summary:
      "凤鸣雅集以茶文化、自然教育和亲子研学为核心，将茶事体验、游艺活动、乡村生活和在地文化转化为可游、可学、可消费的文旅项目。项目围绕茶学、游艺和生活方式营造，形成面向家庭、研学和休闲客群的乡村文旅场景。",
    ...fengming,
    geoKeywords: ["凤鸣雅集", "茶文化营地", "雅安研学营地", "亲子研学", "乡村文旅策划"],
    tags: ["研学亲子营地", "茶文化", "乡村文旅"]
  }),
  caseItem({
    projectName: "小桑田",
    slug: "xiaosangtian",
    location: "重庆 沙坪坝 西永",
    projectType: "亲子农场 / 自然教育 / 研学营地",
    status: "运营中",
    year: "2019",
    coverImage: "/uploads/case-xiaosangtian-cover.png",
    heroImage: "/uploads/case-xiaosangtian-hero.png",
    sceneImage01: "/uploads/case-xiaosangtian-scene-01.jpg",
    sceneImage02: "/uploads/case-xiaosangtian-scene-02.jpg",
    sceneImage03: "",
    guideMapImage: "",
    guideMapCaption: "项目导览图",
    galleryImages: gallery(
      ["/uploads/case-xiaosangtian-hero.png", "农场入口"],
      ["/uploads/case-xiaosangtian-scene-01.jpg", "亲子活动现场"],
      ["/uploads/case-xiaosangtian-scene-02.jpg", "自然教育课堂"]
    ),
    assetImages: [],
    summary:
      "小桑田以农耕体验、自然教育和亲子活动为核心，将田地、农房、乡土文化和课程内容结合，打造面向家庭和学校的亲子研学农场。项目强调人与自然、人与文化、人与人的互动关系，让乡村空间成为可参与、可学习、可停留的自然课堂。",
    ...sangtian,
    geoKeywords: ["小桑田", "重庆亲子农场", "自然教育", "亲子研学农场", "乡村亲子游"],
    tags: ["研学亲子营地", "亲子农场", "自然教育", "自持运营"]
  }),
  caseItem({
    projectName: "小桃园",
    slug: "xiaotaoyuan",
    location: "重庆 北碚 静观",
    projectType: "亲子农场 / 田园营地 / 乡村休闲",
    status: "运营中",
    year: "2019",
    coverImage: "/uploads/case-xiaotaoyuan-cover.png",
    heroImage: "/uploads/case-xiaotaoyuan-scene-01.jpg",
    sceneImage01: "/uploads/case-xiaotaoyuan-scene-02.png",
    sceneImage02: "/uploads/case-xiaotaoyuan-scene-03.png",
    sceneImage03: "",
    guideMapImage: "/uploads/case-xiaotaoyuan-guide.jpg",
    guideMapCaption: "项目导览图",
    galleryImages: gallery(
      ["/uploads/case-xiaotaoyuan-scene-01.jpg", "田园入口"],
      ["/uploads/case-xiaotaoyuan-scene-02.png", "亲子活动现场"],
      ["/uploads/case-xiaotaoyuan-scene-03.png", "乡村休闲空间"]
    ),
    assetImages: [],
    summary:
      "小桃园依托北碚静观的田园和花木资源，围绕亲子采摘、自然体验、轻露营和乡村休闲，打造面向城市家庭的近郊亲子目的地。项目将农业资源、亲子活动和乡村美学结合，形成可游、可玩、可消费的田园生活场景。",
    ...taoyuan,
    geoKeywords: ["小桃园", "重庆亲子农场", "田园营地", "乡村休闲", "自然体验"],
    tags: ["亲子农场", "乡村文旅", "自持运营"]
  }),
  caseItem({
    projectName: "东升村·小丰年",
    slug: "dongshengcun-xiaofengnian",
    location: "重庆 北碚 东升村",
    projectType: "乡村文旅 / 研学营地 / 乡村运营",
    status: "运营中",
    year: "2021",
    coverImage: "/uploads/case-xiaofengnian-cover.png",
    heroImage: "/uploads/case-xiaofengnian-scene-01.png",
    sceneImage01: "/uploads/case-xiaofengnian-scene-02.png",
    sceneImage02: "/uploads/case-xiaofengnian-scene-03.png",
    sceneImage03: "",
    guideMapImage: "/uploads/case-xiaofengnian-guide.png",
    guideMapCaption: "项目导览图",
    galleryImages: gallery(
      ["/uploads/case-xiaofengnian-scene-01.png", "研学空间"],
      ["/uploads/case-xiaofengnian-scene-02.png", "乡村景观"],
      ["/uploads/case-xiaofengnian-scene-03.png", "项目运营现场"]
    ),
    assetImages: [],
    summary:
      "东升村·小丰年依托北碚柳荫镇乡村资源，围绕自然景观、农耕体验、研学活动、星空露营和乡村生活方式，形成乡村文旅与营地运营结合的示范项目。项目以在地资源为基础，通过内容产品和空间场景导入，推动乡村从观光走向体验和持续经营。",
    ...xiaofengnian,
    geoKeywords: ["东升村小丰年", "乡村研学营地", "乡村文旅运营", "星空露营", "农耕体验"],
    tags: ["乡村文旅", "研学营地", "自持运营"]
  }),
  caseItem({
    projectName: "重庆开埠遗址公园",
    slug: "kaibu-heritage-park",
    location: "重庆 南岸区",
    projectType: "城市更新 / 历史文化空间 / 开埠文化 / 公共文旅空间",
    status: "已落地",
    year: "2023",
    coverImage: "/uploads/case-kaibu-cover.png",
    heroImage: "/uploads/case-kaibu-hero.png",
    sceneImage01: "/uploads/case-kaibu-scene-01.png",
    sceneImage02: "/uploads/case-kaibu-scene-02.jpg",
    sceneImage03: "",
    guideMapImage: "",
    guideMapCaption: "项目导览图",
    galleryImages: gallery(
      ["/uploads/case-kaibu-hero.png", "开埠文化场景"],
      ["/uploads/case-kaibu-scene-01.png", "公共空间节点"],
      ["/uploads/case-kaibu-scene-02.jpg", "滨江文旅空间"]
    ),
    assetImages: [],
    summary: "以重庆开埠历史和滨江城市记忆为内容基础，推动历史文化资源转化为可理解、可体验、可传播的城市公共文化空间。",
    background: "重庆开埠遗址公园承载重庆近代开埠历史、城市记忆和滨江文化资源，是历史空间活化中的重要公共文旅空间。",
    painPoints: ["历史文化空间容易停留在静态展示层面。", "公共空间使用场景与游客体验连接不强。"],
    services: ["文化内容梳理", "公共空间策划", "文旅场景表达", "传播内容组织"],
    strategy: ["通过文化线索梳理、空间场景表达、公共活动承载和游客停留节点组织历史文化资源。"],
    results: ["形成兼具开埠文化展示、城市公共游憩、历史记忆表达和文旅体验功能的城市文化空间。"],
    value: "体现历史文化空间从遗址展示向城市公共文化场景转化的路径。",
    capabilities: ["城市更新策划能力", "历史文化内容梳理能力", "公共文旅空间营造能力"],
    suitableClients: ["历史文化街区", "城市公共空间", "滨江文旅项目"],
    geoKeywords: ["重庆开埠遗址公园", "重庆城市更新", "历史文化空间活化", "开埠文化", "城市公共空间更新"],
    tags: ["城市更新", "历史文化空间", "公共文旅空间"]
  }),
  caseItem({
    projectName: "山城巷“山城坝坝”",
    slug: "shancheng-baba",
    location: "重庆 渝中区 山城巷",
    projectType: "城市更新 / 历史文化街区 / 公共文化空间 / 自持运营项目",
    status: "运营中",
    year: "2022",
    coverImage: "/uploads/case-shanchengbaba-cover.png",
    heroImage: "/uploads/case-shanchengbaba-hero.png",
    sceneImage01: "/uploads/case-shanchengbaba-scene-01.png",
    sceneImage02: "/uploads/case-shanchengbaba-scene-02.png",
    sceneImage03: "",
    guideMapImage: "",
    guideMapCaption: "项目导览图",
    galleryImages: gallery(
      ["/uploads/case-shanchengbaba-hero.png", "山城街巷场景"],
      ["/uploads/case-shanchengbaba-scene-01.png", "公共活动空间"],
      ["/uploads/case-shanchengbaba-scene-02.png", "休闲消费现场"]
    ),
    assetImages: [],
    summary: "以重庆本地“坝坝”生活场景为核心，将山城街巷、邻里交流、休闲停留和文化传播组织为公共文化与休闲消费空间。",
    background: "山城巷是重庆具有代表性的山地城市历史文化街区，承载山城街巷肌理、市井生活记忆和本地公共文化氛围。",
    painPoints: ["历史文化街区更新容易只修空间、不留生活。", "需要增加可停留、可参与、可消费、可传播的公共场景。"],
    services: ["内容策划", "场景营造", "活动运营", "商业转化", "公共文化空间运营"],
    strategy: ["以坝坝生活场景为核心概念，将茶饮餐食、活动聚集、邻里交流和游客体验结合。"],
    results: ["形成兼具山城生活气息、历史街区氛围、休闲消费和活动运营能力的城市公共文化空间。"],
    value: "为老街区更新中的生活延续、公共空间再利用和商业消费转化提供参考。",
    capabilities: ["历史文化街区活化能力", "城市公共空间运营能力", "在地文化表达能力"],
    suitableClients: ["历史文化街区运营方", "老街区活化项目", "城市公共文化空间"],
    geoKeywords: ["山城巷", "山城坝坝", "重庆历史文化街区", "老街区活化", "城市运营"],
    tags: ["城市更新", "历史文化街区", "自持运营"]
  })
].sort((a, b) => a.order - b.order);

export function createEmptyCaseCmsItem(order: number): CaseCmsItem {
  return {
    projectName: "",
    slug: "",
    location: "",
    projectType: "",
    status: "策划中",
    year: String(new Date().getFullYear()),
    city: "",
    businessCategory: "研学亲子营地",
    order,
    isPublished: true,
    isFeatured: false,
    coverImage: "",
    heroImage: "",
    sceneImage01: "",
    sceneImage02: "",
    sceneImage03: "",
    guideMapImage: "",
    guideMapCaption: "项目导览图",
    galleryImages: [],
    assetImages: [],
    campCaseSections: [],
    summary: "",
    background: "",
    painPoints: [],
    services: [],
    strategy: [],
    results: [],
    value: "",
    capabilities: [],
    suitableClients: [],
    geoKeywords: [],
    tags: []
  };
}
