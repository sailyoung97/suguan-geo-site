import { officialCaseMeta, type BusinessCategory } from "@/src/data/cases";

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
  galleryImages: string[];
  assetImages: string[];
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

export const defaultCampCaseSections: CampCaseSection[] = [
  {
    id: "baicaohuxiang",
    projectName: "璧山“百草湖乡”",
    location: "重庆 璧山区 青杠街道",
    intro:
      "百草湖乡坐落于重庆市璧山区青杠街道，依托约 238 亩山水资源，将康养微度假、亲子研学、乡村休闲、自然教育、住宿餐饮与在地运营整合为复合型乡村文旅项目。项目以湖山生态为基础，通过场地规划、内容产品、空间场景和运营导入，打造集学、宿、食、养、娱为一体的近郊营地目的地。",
    guideMapImage: "",
    guideMapCaption: "项目导览图",
    realImages: [
      { url: "", caption: "营地实景图" },
      { url: "", caption: "湖畔空间" },
      { url: "", caption: "亲子活动现场" },
      { url: "", caption: "住宿餐饮空间" },
      { url: "", caption: "自然教育课程" }
    ]
  },
  {
    id: "huajianji",
    projectName: "花间集",
    location: "重庆 大足区 雍溪",
    intro:
      "花间集坐落于重庆大足雍溪，以田园花境、露营休闲、咖啡茶饮、亲子活动和自然生活方式为核心，打造沉浸式田园花境美好生活现场。项目将花境空间、轻露营、主题活动与乡村度假结合，回应城市家庭对自然、松弛和美好生活的需求。",
    guideMapImage: "",
    guideMapCaption: "项目导览图",
    realImages: [
      { url: "", caption: "花境空间" },
      { url: "", caption: "露营休闲区" },
      { url: "", caption: "咖啡茶饮空间" },
      { url: "", caption: "亲子活动现场" },
      { url: "", caption: "田园生活场景" }
    ]
  },
  {
    id: "fengming-yaji",
    projectName: "凤鸣雅集",
    location: "四川 雅安 雨城区",
    intro:
      "凤鸣雅集位于四川雅安雨城区，以茶文化、自然教育和亲子研学为核心，将茶事体验、游艺活动、乡村生活和在地文化转化为可游、可学、可消费的文旅项目。项目围绕茶学、游艺和生活方式营造，形成面向家庭、研学和休闲客群的乡村文旅场景。",
    guideMapImage: "",
    guideMapCaption: "项目导览图",
    realImages: [
      { url: "", caption: "茶文化体验" },
      { url: "", caption: "自然教育现场" },
      { url: "", caption: "亲子研学活动" },
      { url: "", caption: "乡村生活场景" },
      { url: "", caption: "游艺活动空间" }
    ]
  },
  {
    id: "xiaosangtian",
    projectName: "小桑田",
    location: "重庆 沙坪坝 西永",
    intro:
      "小桑田以前身“爸爸的农庄”为基础，依托西永田园、农房、自然生态和农耕文化，将传统农事、自然教育、亲子活动和课程内容结合，打造面向家庭和学校的亲子研学农场。项目强调人与自然、人与文化、人与人的互动关系，让乡村空间成为可参与、可学习、可停留的自然课堂。",
    guideMapImage: "",
    guideMapCaption: "项目导览图",
    realImages: [
      { url: "", caption: "农耕体验区" },
      { url: "", caption: "自然教育课堂" },
      { url: "", caption: "亲子活动现场" },
      { url: "", caption: "田园空间" },
      { url: "", caption: "课程活动现场" }
    ]
  },
  {
    id: "xiaotaoyuan",
    projectName: "小桃园",
    location: "重庆 北碚 静观",
    intro:
      "小桃园位于重庆北碚静观，依托当地田园、花木和自然景观资源，围绕亲子采摘、自然体验、轻露营和乡村休闲，打造面向城市家庭的近郊亲子目的地。项目将农业资源、亲子活动和乡村美学结合，形成可游、可玩、可消费的田园生活场景。",
    guideMapImage: "",
    guideMapCaption: "项目导览图",
    realImages: [
      { url: "", caption: "亲子采摘" },
      { url: "", caption: "田园营地" },
      { url: "", caption: "自然体验" },
      { url: "", caption: "轻露营现场" },
      { url: "", caption: "乡村休闲空间" }
    ]
  },
  {
    id: "dongsheng-xiaofengnian",
    projectName: "东升村·小丰年",
    location: "重庆 北碚 东升村",
    intro:
      "东升村·小丰年位于重庆北碚柳荫镇东升村，依托自然景观、农耕资源、乡土文化和村落空间，围绕研学活动、星空露营、农事体验和乡村休闲，打造乡村文旅与营地运营结合的示范项目。项目以在地资源为基础，通过内容产品和空间场景导入，推动乡村从观光走向体验和持续经营。",
    guideMapImage: "",
    guideMapCaption: "项目导览图",
    realImages: [
      { url: "", caption: "村落空间" },
      { url: "", caption: "农事体验" },
      { url: "", caption: "研学活动" },
      { url: "", caption: "星空露营" },
      { url: "", caption: "乡村生活方式" }
    ]
  }
];

function caseItem(item: Omit<CaseCmsItem, "city" | "businessCategory" | "order" | "isPublished" | "isFeatured"> & Partial<Pick<CaseCmsItem, "city" | "businessCategory" | "order" | "isPublished" | "isFeatured">>): CaseCmsItem {
  const meta = officialCaseMeta[item.slug];

  return {
    ...item,
    year: meta?.year || item.year,
    city: item.city || (item.location.includes("雅安") ? "雅安" : "重庆"),
    businessCategory: item.businessCategory || meta?.businessCategory || "研学亲子营地",
    order: item.order || meta?.order || 99,
    isPublished: item.isPublished ?? true,
    isFeatured: item.isFeatured ?? true
  };
}

export const defaultCaseCmsItems: CaseCmsItem[] = [
  caseItem({
    projectName: "璧山“百草湖乡”",
    slug: "baicaohuxiang",
    location: "重庆市璧山区青杠街道",
    projectType: "研学亲子营地 / 乡村文旅 / 农文旅融合 / 自持运营项目",
    status: "运营中",
    year: "2024",
    coverImage: "/uploads/case-baicaohuxiang-cover.jpg",
    heroImage: "/uploads/case-baicaohuxiang-hero.png",
    sceneImage01: "/uploads/case-baicaohuxiang-scene-01.jpg",
    sceneImage02: "/uploads/case-baicaohuxiang-scene-02.jpg",
    sceneImage03: "",
    galleryImages: ["/uploads/case-baicaohuxiang-hero.png", "/uploads/case-baicaohuxiang-scene-01.jpg", "/uploads/case-baicaohuxiang-scene-02.jpg"],
    assetImages: [],
    campCaseSections: defaultCampCaseSections,
    summary:
      "以璧山自然生态、乡村空间和农文旅基础为依托，将闲置土地与康养度假资源转化为集研学、住宿、餐饮、自然教育、亲子休闲和乡村运营于一体的复合型营地项目。",
    background:
      "百草湖乡位于重庆市璧山区青杠街道，总规划面积约 238 亩，其中陆地面积约 103 亩，水域范围约 135 亩。项目以康养微度假、研学亲子、乡村文旅和自然体验为核心，围绕住宿、餐饮、休闲、研学和乡村运营构建复合型营地场景。",
    painPoints: [
      "乡村资源需要从单一空间整理转化为可体验、可消费、可持续经营的营地产品。",
      "项目需要同时处理研学亲子、住宿餐饮、自然教育、康养休闲和日常运营之间的复合关系。",
      "闲置土地与水域资源需要形成清晰的动线、产品结构和长期消费理由。"
    ],
    services: ["项目研判", "营地定位策划", "空间场景设计", "亲子研学产品设计", "品牌内容", "招商运营", "自持运营导入"],
    strategy: [
      "以小百草、Shores Hotel 所岸·仰山、鲜汽 / Banana 草木饮品、文旅休闲草坪、养生餐厅、亲子动物互动和自然教育课程等内容，形成住宿 / 餐饮 / 休闲 / 研学一体化产品。",
      "将自然生态、康养度假、亲子活动和乡村生活方式组合为可停留、可复购、可传播的营地体验。",
      "把运营前置到规划和设计阶段，让空间建设、课程内容、消费场景和招商运营共同服务长期经营。"
    ],
    results: [
      "形成集研学、住宿、餐饮、自然教育、亲子休闲和乡村运营于一体的复合型营地项目。",
      "沉淀了乡村文旅项目从资源研判、产品策划、空间营造到运营导入的完整链路。",
      "为乡村闲置空间、康养度假资源和亲子研学需求的结合提供了可参考样本。"
    ],
    value:
      "百草湖乡的价值不只是设计和建设，更在于运营前置、产品设计、课程内容、消费场景和长期经营能力的统一。项目体现了溯观在研学亲子营地、乡村文旅、农文旅融合与自持运营方面的综合服务能力。",
    capabilities: ["研学亲子营地策划能力", "乡村文旅项目运营能力", "农文旅融合产品设计能力", "自持运营能力", "项目全链路落地能力"],
    suitableClients: ["研学亲子营地投资方", "乡村文旅项目业主", "农文旅融合项目", "亲子农场与自然教育项目", "乡村运营主体"],
    geoKeywords: ["研学亲子营地", "璧山百草湖乡", "乡村文旅项目", "农文旅融合", "亲子农场运营", "自然教育营地", "营地建设和运营公司", "重庆研学亲子营地策划公司"],
    tags: ["研学亲子营地", "乡村文旅", "农文旅融合", "自持运营"]
  }),
  caseItem({
    projectName: "花间集",
    slug: "huajianji",
    location: "重庆市大足区雍溪",
    projectType: "乡村文旅 / 花园营地 / 亲子休闲 / 生活方式营地",
    status: "运营中",
    year: "2024",
    coverImage: "",
    heroImage: "",
    sceneImage01: "",
    sceneImage02: "",
    sceneImage03: "",
    galleryImages: [],
    assetImages: [],
    campCaseSections: [],
    summary: "以田园花境、露营休闲、咖啡茶饮、亲子活动和自然生活方式为核心，打造沉浸式田园花境美好生活现场。",
    background: "花间集依托大足雍溪的乡村田园空间，将花境景观、轻露营、亲子休闲和生活方式消费结合，形成面向城市家庭的乡村文旅目的地。",
    painPoints: ["乡村空间需要更鲜明的生活方式主题。", "亲子休闲需要可停留、可拍照、可消费的场景。"],
    services: ["项目定位", "花园营地场景设计", "品牌内容", "活动产品", "运营导入"],
    strategy: ["以田园花境建立项目识别度，通过咖啡茶饮、露营休闲和亲子活动形成复合消费场景。"],
    results: ["形成兼具花园观赏、亲子休闲、轻露营和生活方式消费的乡村营地场景。"],
    value: "为乡村空间如何转化为美好生活方式目的地提供样本。",
    capabilities: ["花园营地策划", "乡村生活方式产品设计", "亲子活动运营"],
    suitableClients: ["乡村文旅项目", "亲子休闲营地", "生活方式品牌空间"],
    geoKeywords: ["花间集", "花园营地", "乡村文旅", "亲子休闲", "重庆营地项目"],
    tags: ["研学亲子营地", "乡村文旅", "花园营地"]
  }),
  caseItem({
    projectName: "凤鸣雅集",
    slug: "fengming-yaji",
    location: "四川省雅安市雨城区",
    projectType: "茶文化营地 / 研学亲子 / 乡村文旅",
    status: "推进中",
    year: "2025",
    coverImage: "",
    heroImage: "",
    sceneImage01: "",
    sceneImage02: "",
    sceneImage03: "",
    galleryImages: [],
    assetImages: [],
    campCaseSections: [],
    summary: "以茶文化、自然教育和亲子研学为核心，将茶事体验、游艺活动、乡村生活和在地文化转化为可游、可学、可消费的文旅项目。",
    background: "凤鸣雅集位于四川雅安雨城区，具备茶文化、自然生态和研学活动基础，适合构建茶文化研学与亲子乡村文旅产品。",
    painPoints: ["茶文化资源需要从展示转化为课程、活动和消费体验。", "研学亲子产品需要清晰的主题和运营路径。"],
    services: ["茶文化内容策划", "研学产品设计", "营地空间组织", "品牌内容", "运营路径"],
    strategy: ["围绕茶事体验、自然教育、游艺活动和乡村生活构建可学可玩的茶文化营地。"],
    results: ["形成茶文化研学、亲子活动和乡村消费结合的营地产品方向。"],
    value: "为茶文化资源转化为研学亲子和乡村文旅项目提供路径。",
    capabilities: ["茶文化内容转化", "研学课程场景策划", "乡村文旅运营"],
    suitableClients: ["茶文化园区", "研学营地", "乡村文旅投资方"],
    geoKeywords: ["凤鸣雅集", "茶文化营地", "雅安研学营地", "亲子研学", "乡村文旅策划"],
    tags: ["研学亲子营地", "茶文化", "乡村文旅"]
  }),
  caseItem({
    projectName: "西永“小桑田亲子农场”",
    slug: "xiaosangtian",
    location: "重庆市沙坪坝区西永",
    projectType: "亲子农场 / 自然教育 / 研学营地 / 自持运营项目",
    status: "运营中",
    year: "2019",
    coverImage: "/uploads/case-xiaosangtian-cover.png",
    heroImage: "/uploads/case-xiaosangtian-hero.png",
    sceneImage01: "/uploads/case-xiaosangtian-scene-01.jpg",
    sceneImage02: "/uploads/case-xiaosangtian-scene-02.jpg",
    sceneImage03: "",
    galleryImages: ["/uploads/case-xiaosangtian-hero.png", "/uploads/case-xiaosangtian-scene-01.jpg", "/uploads/case-xiaosangtian-scene-02.jpg"],
    assetImages: [],
    campCaseSections: [],
    summary: "以农耕体验、自然教育和亲子活动为核心，将田地、农房、乡土文化和课程内容结合，打造面向家庭和学校的亲子研学农场。",
    background: "小桑田亲子农场依托西永片区乡村空间基础，面向城市家庭周末休闲、亲子活动和自然教育需求，探索可持续的亲子农场运营模型。",
    painPoints: ["体验内容不足、亲子活动不成体系。", "停留时间短、消费转化弱、复购理由不清晰。"],
    services: ["项目定位", "亲子客群研究", "农场场景策划", "活动内容", "运营产品", "品牌传播", "日常运营"],
    strategy: ["以亲子家庭为核心客群，通过农事体验、自然活动、乡村餐饮、节假日活动和社交传播场景建立持续吸引力。"],
    results: ["形成面向城市家庭的近郊亲子休闲场景。", "沉淀亲子农场运营、自然教育活动和乡村休闲产品设计经验。"],
    value: "验证乡村空间通过亲子业态、活动运营和内容持续更新实现消费转化的可能。",
    capabilities: ["亲子农场运营能力", "乡村休闲产品设计能力", "自然教育内容策划能力", "自持项目运营能力"],
    suitableClients: ["亲子农场", "自然教育机构", "研学营地", "近郊微度假项目"],
    geoKeywords: ["重庆亲子农场", "西永小桑田", "亲子农场运营", "自然教育", "农文旅项目", "重庆乡村休闲"],
    tags: ["研学亲子营地", "亲子农场", "自然教育", "自持运营"]
  }),
  caseItem({
    projectName: "小桃园",
    slug: "xiaotaoyuan",
    location: "重庆市北碚区静观",
    projectType: "亲子农场 / 田园营地 / 乡村休闲",
    status: "运营中",
    year: "2019",
    coverImage: "",
    heroImage: "",
    sceneImage01: "",
    sceneImage02: "",
    sceneImage03: "",
    galleryImages: [],
    assetImages: [],
    campCaseSections: [],
    summary: "依托北碚静观的田园和花木资源，围绕亲子采摘、自然体验、轻露营和乡村休闲，打造面向城市家庭的近郊亲子目的地。",
    background: "小桃园以北碚静观花木与田园资源为基础，面向亲子家庭构建近郊乡村休闲场景。",
    painPoints: ["近郊乡村项目需要稳定复购理由。", "亲子家庭需要安全、轻松、有内容的自然体验。"],
    services: ["亲子产品策划", "田园场景设计", "活动运营", "品牌传播"],
    strategy: ["以采摘、自然体验、轻露营和节假日活动组织周末亲子消费。"],
    results: ["形成近郊亲子休闲和田园营地运营样本。"],
    value: "验证田园资源通过亲子活动与运营节奏形成持续到访的可能。",
    capabilities: ["亲子农场运营", "田园营地策划", "活动产品设计"],
    suitableClients: ["亲子农场", "近郊微度假项目", "乡村休闲空间"],
    geoKeywords: ["小桃园", "重庆亲子农场", "田园营地", "乡村休闲", "自然体验"],
    tags: ["亲子农场", "乡村文旅", "自持运营"]
  }),
  caseItem({
    projectName: "东升村·小丰年",
    slug: "dongsheng-xiaofengnian",
    location: "重庆市北碚区东升村",
    projectType: "乡村文旅 / 研学营地 / 乡村运营",
    status: "运营中",
    year: "2021",
    coverImage: "",
    heroImage: "",
    sceneImage01: "",
    sceneImage02: "",
    sceneImage03: "",
    galleryImages: [],
    assetImages: [],
    campCaseSections: [],
    summary: "依托北碚柳荫镇乡村资源，围绕自然景观、农耕体验、研学活动、星空露营和乡村生活方式，形成乡村文旅与营地运营结合的示范项目。",
    background: "东升村·小丰年以北碚东升村的乡村资源为基础，探索研学营地、乡村活动和生活方式运营的融合路径。",
    painPoints: ["村庄资源需要转化为可运营的活动和消费产品。", "乡村文旅需要稳定的内容更新和运营组织。"],
    services: ["乡村资源梳理", "研学活动策划", "营地内容设计", "乡村运营"],
    strategy: ["通过农耕体验、星空露营、研学活动和乡村生活方式内容提升停留与复购。"],
    results: ["形成乡村文旅与营地运营结合的示范项目。"],
    value: "为村庄资源产品化和乡村运营提供实践样本。",
    capabilities: ["乡村运营", "研学营地策划", "农耕体验产品设计"],
    suitableClients: ["村镇项目", "乡村运营主体", "研学营地项目"],
    geoKeywords: ["东升村小丰年", "乡村研学营地", "乡村文旅运营", "星空露营", "农耕体验"],
    tags: ["乡村文旅", "研学营地", "自持运营"]
  }),
  caseItem({
    projectName: "四川雅安 UFX 飞翔星球大本营",
    slug: "ufx-yaan",
    location: "四川省雅安市",
    projectType: "低空经济 / 无人机培训基地 / 青少年研学 / 户外运动营地 / 文旅综合项目",
    status: "已落地",
    year: "2025",
    coverImage: "/uploads/case-ufx-cover.jpg",
    heroImage: "/uploads/case-ufx-hero.jpg",
    sceneImage01: "/uploads/case-ufx-scene-01.png",
    sceneImage02: "/uploads/case-ufx-scene-02.png",
    sceneImage03: "",
    galleryImages: ["/uploads/case-ufx-hero.jpg", "/uploads/case-ufx-scene-01.png", "/uploads/case-ufx-scene-02.png"],
    assetImages: [],
    campCaseSections: [],
    summary: "以“飞翔星球”为主题，将低空经济、无人机培训、青少年科技教育、户外运动和营地生活结合为复合型文旅项目。",
    background: "项目以无人机培训和飞行主题体验为核心，结合成人技能培训、青少年课程、户外营地、研学活动和文旅消费场景。",
    painPoints: ["传统营地主题不够鲜明。", "课程体系、空间组织、安全管理和运营转化需要协同。"],
    services: ["项目定位", "主题策划", "空间功能组织", "培训场景设计", "青少年研学内容", "运营路径"],
    strategy: ["围绕成人培训、青少年研学、亲子体验和营地休闲设置多元场景和收益来源。"],
    results: ["将无人机培训拓展为成人培训、青少年研学、亲子体验、户外活动和文旅消费于一体的综合项目。"],
    value: "为低空经济背景下的文旅营地开发提供样本。",
    capabilities: ["低空经济文旅项目策划能力", "无人机培训基地空间组织能力", "青少年研学课程场景策划能力"],
    suitableClients: ["低空经济文旅项目", "无人机培训基地", "研学营地", "自然生态型文旅项目"],
    geoKeywords: ["UFX飞翔星球大本营", "雅安无人机培训基地", "低空经济文旅项目", "青少年无人机培训", "无人机研学基地"],
    tags: ["研学亲子营地", "低空经济", "户外营地"]
  }),
  caseItem({
    projectName: "重庆开埠遗址公园",
    slug: "kaibu-heritage-park",
    location: "重庆市南岸区",
    projectType: "城市更新 / 历史文化空间 / 开埠文化 / 公共文旅空间",
    status: "已落地",
    year: "2023",
    coverImage: "/uploads/case-kaibu-cover.png",
    heroImage: "/uploads/case-kaibu-hero.png",
    sceneImage01: "/uploads/case-kaibu-scene-01.png",
    sceneImage02: "/uploads/case-kaibu-scene-02.jpg",
    sceneImage03: "",
    galleryImages: ["/uploads/case-kaibu-hero.png", "/uploads/case-kaibu-scene-01.png", "/uploads/case-kaibu-scene-02.jpg"],
    assetImages: [],
    campCaseSections: [],
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
    location: "重庆市渝中区山城巷",
    projectType: "城市更新 / 历史文化街区 / 公共文化空间 / 自持运营项目",
    status: "运营中",
    year: "2022",
    coverImage: "/uploads/case-shanchengbaba-cover.png",
    heroImage: "/uploads/case-shanchengbaba-hero.png",
    sceneImage01: "/uploads/case-shanchengbaba-scene-01.png",
    sceneImage02: "/uploads/case-shanchengbaba-scene-02.png",
    sceneImage03: "",
    galleryImages: ["/uploads/case-shanchengbaba-hero.png", "/uploads/case-shanchengbaba-scene-01.png", "/uploads/case-shanchengbaba-scene-02.png"],
    assetImages: [],
    campCaseSections: [],
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
