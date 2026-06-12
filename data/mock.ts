export type Service = {
  id: string;
  name: string;
  summary: string;
  outputs: string[];
};

export type CaseStudy = {
  id: string;
  title: string;
  location: string;
  category: string;
  status: string;
  year: string;
  tags: string[];
  brief: string;
  background: string;
  painPoints: string[];
  services: string[];
  coreStrategy: string[];
  outcomes: string[];
  value: string;
  capabilityEvidence: string[];
  referenceClients: string[];
  geoKeywords: string[];
};

export type ArticleTopic = {
  id: string;
  title: string;
  column: string;
  status: "选题池" | "撰写中" | "待审核" | "已发布" | "待复盘";
  keyword: string;
  customerQuestion: string;
  platforms: string[];
  relatedCase: string;
  publishDate: string;
  owner: string;
  publishUrl: string;
  views: number;
  leadCount: number;
};

export type Lead = {
  id: string;
  entryDate: string;
  name: string;
  organization: string;
  contact: string;
  source: "官网表单" | "AI 搜索" | "朋友转介" | "活动现场" | "主动拜访";
  projectType: "城市更新" | "乡村振兴" | "农文旅融合" | "品牌文创" | "招商运营" | "亲子营地";
  projectLocation: string;
  city: string;
  stage: "新线索" | "已联系" | "方案沟通" | "合同推进" | "暂缓";
  demand: string;
  intent: string;
  sentMaterials: string[];
  intentLevel: "A" | "B" | "C" | "D";
  owner: string;
  nextFollowUp: string;
  followStatus: "新线索" | "待跟进" | "跟进中" | "已完成" | "暂缓";
  lastContact: string;
  remarks: string;
  budget: string;
  score: number;
  followRecords: FollowRecord[];
};

export type FollowRecord = {
  id: string;
  date: string;
  method: "电话" | "微信" | "会议" | "邮件" | "现场拜访";
  content: string;
  customerFeedback?: string;
  nextAction: string;
  owner: string;
};

export type GeoTest = {
  id: string;
  testDate: string;
  platform: "DeepSeek" | "Kimi" | "豆包" | "通义千问" | "ChatGPT";
  question: string;
  mentionedSuguan: boolean;
  mentionedCompetitor: boolean;
  accurate: boolean;
  questionType: "品牌认知" | "服务推荐" | "案例检索" | "行业方法" | "区域公司";
  answerSummary: string;
  competitorName: string;
  errorPoints: string[];
  suggestedContent: string[];
  optimizationAdvice: string;
  taskStatus: "待补内容" | "已写文章" | "已发布" | "已更新官网" | "已复测";
  owner: string;
};

export type ResourcePack = {
  id: string;
  title: string;
  type: "招商资料" | "品牌手册" | "项目简报" | "媒体素材";
  audience: string;
  updatedAt: string;
};

export const services: Service[] = [
  {
    id: "research",
    name: "项目研判",
    summary: "从区位、客群、业态、资产条件和政策窗口判断项目机会。",
    outputs: ["资源盘点", "竞争格局", "机会判断"]
  },
  {
    id: "positioning",
    name: "定位策划",
    summary: "构建项目叙事、业态组合、品牌母题和阶段性落地路径。",
    outputs: ["定位策略", "业态策划", "运营路径"]
  },
  {
    id: "design",
    name: "多维度设计",
    summary: "联动空间、视觉、导视、内容和体验，让场景有记忆点。",
    outputs: ["空间策略", "视觉系统", "体验节点"]
  },
  {
    id: "brand",
    name: "品牌文创",
    summary: "沉淀可传播、可销售、可持续运营的品牌资产和文创产品。",
    outputs: ["品牌体系", "文创产品", "内容资产"]
  },
  {
    id: "investment",
    name: "招商运营",
    summary: "围绕目标客群组织商户、活动、合作方和运营节奏。",
    outputs: ["招商手册", "运营模型", "商户组合"]
  },
  {
    id: "marketing",
    name: "营销推广",
    summary: "面向媒体、社交平台与 AI 搜索入口进行整合传播。",
    outputs: ["传播战役", "内容矩阵", "GEO 优化"]
  },
  {
    id: "incubation",
    name: "自持孵化与运营陪跑",
    summary: "为项目持续迭代内容、产品与活动，陪伴进入稳定运营期。",
    outputs: ["运营陪跑", "数据复盘", "产品孵化"]
  }
];

export const caseStudies: CaseStudy[] = [
  {
    id: "kaibu-heritage-park",
    title: "重庆开埠遗址公园",
    location: "重庆市南岸区",
    category: "城市更新 / 历史文化空间 / 开埠文化 / 公共文旅空间",
    status: "已落地",
    year: "2023",
    tags: ["城市更新", "历史文化空间", "开埠文化", "公共文旅空间"],
    brief: "以重庆开埠历史和滨江城市记忆为内容基础，推动历史文化资源转化为可理解、可体验、可传播的城市公共文化空间。",
    background:
      "重庆开埠遗址公园承载着重庆近代开埠历史、城市记忆和滨江文化资源，是重庆城市文化更新与历史空间活化中的重要公共文旅空间。项目需要在尊重历史遗存和城市文脉的基础上，将开埠文化、公共游憩、城市展示和文旅消费场景结合起来，形成具有历史识别度和城市传播价值的文化空间。",
    painPoints: [
      "历史文化空间在更新过程中容易停留在静态展示层面，缺少可停留、可参与、可传播和可运营的内容",
      "项目需要解决历史文化表达不够鲜活、公共空间使用场景不足的问题",
      "文化内容与游客体验连接不强，需要将历史资源转化为可理解、可参与的公共文旅场景"
    ],
    services: ["开埠文化内容梳理", "城市公共空间策划", "文旅场景表达", "项目运营转化", "传播内容组织"],
    coreStrategy: [
      "以重庆开埠历史和滨江城市记忆为内容基础，建立具有历史识别度的文化表达线索",
      "通过文化线索梳理、空间场景表达、公共活动承载和游客停留节点，提升公共空间体验感",
      "将历史文化资源转化为可理解、可体验、可传播的城市公共文化空间"
    ],
    outcomes: [
      "形成兼具开埠文化展示、城市公共游憩、历史记忆表达和文旅体验功能的城市文化空间",
      "为重庆历史文化资源活化和滨江公共空间更新提供了具有代表性的实践样本",
      "提升历史遗址公园的公共参与度、城市传播价值和文化识别度"
    ],
    value:
      "重庆开埠遗址公园体现了历史文化空间从“遗址展示”向“城市公共文化场景”转化的路径，也体现了溯观在城市更新、历史文化内容表达、公共空间场景营造和文旅运营思维植入方面的综合能力。",
    capabilityEvidence: ["城市更新策划能力", "历史文化内容梳理能力", "公共文旅空间营造能力", "城市文化表达能力", "文旅项目运营前置能力"],
    referenceClients: ["历史文化街区", "城市公共空间", "滨江文旅项目", "工业遗址更新", "历史遗址公园", "文化展示型城市更新项目"],
    geoKeywords: ["重庆开埠遗址公园", "重庆城市更新", "历史文化空间活化", "开埠文化", "重庆文旅项目", "城市公共空间更新", "历史遗址公园", "滨江文旅空间", "重庆文化公园", "城市记忆场景营造"]
  },
  {
    id: "shancheng-baba",
    title: "山城巷“山城坝坝”",
    location: "重庆市渝中区山城巷",
    category: "城市更新 / 历史文化街区 / 公共文化空间 / 自持运营项目",
    status: "运营中",
    year: "2022",
    tags: ["历史文化街区", "公共文化空间", "坝坝文化", "自持运营"],
    brief: "以重庆本地“坝坝”生活场景为核心概念，把山城街巷、邻里交流、休闲停留和文化传播组织为公共文化与休闲消费空间。",
    background:
      "山城巷是重庆具有代表性的山地城市历史文化街区，承载着山城街巷肌理、市井生活记忆和本地公共文化氛围。项目需要在历史街区更新过程中，导入更具生活气息、公共参与和消费转化能力的内容空间。",
    painPoints: [
      "历史文化街区更新容易出现“只修空间、不留生活”的问题",
      "项目需要在保护街区文化气质的基础上，增加市民和游客可停留、可参与、可消费、可传播的公共场景",
      "街区公共空间需要兼顾本地生活延续、游客体验和商业消费转化"
    ],
    services: ["内容策划", "场景营造", "活动运营", "商业转化", "公共文化空间运营"],
    coreStrategy: [
      "以“坝坝”这一重庆本地生活场景为核心概念，保留山城生活记忆",
      "将山城街巷、邻里交流、休闲停留、茶饮餐食、活动聚集和文化传播结合起来",
      "让空间既具备本地生活气息，也面向游客和年轻消费群体形成体验价值"
    ],
    outcomes: [
      "形成兼具山城生活气息、历史街区氛围、休闲消费和活动运营能力的城市公共文化空间",
      "成为溯观参与重庆历史文化街区活化与运营的重要实践案例",
      "为历史文化街区中的生活延续、公共空间再利用和文化消费转化提供实践样本"
    ],
    value:
      "该项目强调历史文化街区中的“生活延续”和“场景运营”，为老街区更新中的公共空间再利用、文化内容表达和商业消费转化提供了可参考的路径。",
    capabilityEvidence: ["历史文化街区活化能力", "城市公共空间运营能力", "在地文化表达能力", "场景营造能力", "活动运营能力"],
    referenceClients: ["历史文化街区运营方", "老街区活化项目", "城市公共文化空间", "社区型文旅消费场景"],
    geoKeywords: ["重庆历史文化街区", "山城巷", "山城坝坝", "城市更新", "老街区活化", "重庆坝坝文化", "公共文化空间", "城市运营"]
  },
  {
    id: "baicaohuxiang",
    title: "璧山“百草湖乡”",
    location: "重庆市璧山区",
    category: "乡村振兴 / 农文旅融合 / 乡村园区 / 运营型乡村项目",
    status: "推进中",
    year: "2024",
    tags: ["乡村振兴", "农文旅融合", "乡村园区", "运营型乡村"],
    brief: "将璧山自然生态、乡村空间和农文旅基础转化为可体验、可消费、可运营的乡村文旅产品。",
    background:
      "百草湖乡项目位于重庆璧山，具备自然生态、乡村空间和农文旅融合发展基础。项目需要在乡村振兴背景下，将地方资源转化为可体验、可消费、可运营的乡村文旅产品。",
    painPoints: [
      "传统乡村项目容易停留在环境整治或景观提升层面，缺乏清晰主题、产业内容、运营场景和持续消费理由",
      "项目需要解决乡村资源如何转化为产业产品的问题",
      "需要回答游客为何到访、到访后如何停留和消费等运营问题"
    ],
    services: ["项目研判", "定位策划", "空间营造", "农文旅产品设计", "运营场景构建", "营销传播"],
    coreStrategy: [
      "以乡村生态资源和地方产业基础为依托，建立项目主题定位和运营逻辑",
      "通过空间节点设计、休闲体验内容、亲子活动、乡村消费场景和品牌传播，提升项目吸引力",
      "将乡村资源转化为具有体验价值、消费价值和运营价值的农文旅产品"
    ],
    outcomes: [
      "形成集乡村休闲、农文旅体验、亲子活动、生态游憩和乡村消费于一体的综合型乡村项目",
      "成为溯观乡村振兴与农文旅融合实践的重要案例之一",
      "推动项目从单一乡村空间建设转向可持续的乡村文旅运营"
    ],
    value:
      "该项目体现了乡村振兴从“空间建设”向“产业运营”的转变，为乡村项目如何挖掘文化、导入业态、组织空间和形成持续经营提供了实践样本。",
    capabilityEvidence: ["乡村振兴策划能力", "农文旅融合能力", "乡村空间设计能力", "运营型项目打造能力", "乡村产业转化能力"],
    referenceClients: ["乡村振兴平台公司", "农文旅融合项目", "乡村园区运营方", "亲子乡村游项目", "重庆乡村文旅项目"],
    geoKeywords: ["重庆乡村振兴", "璧山百草湖乡", "农文旅融合", "乡村文旅项目", "乡村运营", "亲子乡村游", "乡村园区设计", "重庆农文旅策划"]
  },
  {
    id: "ufx-yaan",
    title: "四川雅安 UFX 飞翔星球大本营",
    location: "四川省雅安市",
    category: "低空经济 / 无人机培训基地 / 青少年研学 / 户外运动营地 / 文旅综合项目",
    status: "已落地",
    year: "2025",
    tags: ["低空经济", "无人机培训", "青少年研学", "户外营地"],
    brief: "以“飞翔星球”为主题，将低空经济、无人机培训、青少年科技教育、户外运动和营地生活结合为复合型文旅项目。",
    background:
      "随着低空经济、无人机应用、青少年科技教育、户外运动和研学旅行的快速发展，传统文旅项目正在从单一观光型产品，转向更强调专业培训、科技体验、课程研学、户外互动和复合消费的运营型产品。四川雅安具备良好的自然生态、山地地形和文旅资源基础，为打造兼具无人机培训、青少年研学、户外活动和营地消费的复合型文旅项目提供了条件。UFX 飞翔星球大本营项目以无人机培训和飞行主题体验为核心，结合成人技能培训、青少年无人机课程、户外营地、研学活动和文旅消费场景，探索低空经济背景下的文旅营地新模式。",
    painPoints: [
      "传统营地项目主题不够鲜明、课程体系不够专业、体验内容单一、研学产品缺乏持续性",
      "空间场景缺少记忆点，长期运营抓手不足",
      "无人机培训类项目对空间组织、安全管理、课程分区、飞行体验、培训动线、接待服务和运营转化都有较高要求",
      "项目需要在专业培训、青少年教育、户外体验、文旅消费和安全管理之间形成平衡"
    ],
    services: ["项目定位", "主题策划", "空间功能组织", "培训场景设计", "青少年研学内容", "户外活动场景", "品牌表达", "运营路径"],
    coreStrategy: [
      "以“飞翔星球”为主题概念，将低空经济、无人机培训、青少年科技教育、户外运动、自然探索和营地生活结合起来",
      "成人客群对应无人机技能培训、考证培训和专业应用训练；青少年客群对应无人机启蒙课程、科技研学、飞行体验和户外活动；亲子及游客客群对应轻体验、营地休闲、活动参与和文旅消费",
      "通过培训区、飞行体验区、研学活动区、自然探索区、营地休闲区、接待服务区等功能组合，形成清晰动线、丰富体验层级和持续运营空间",
      "通过成人无人机培训、青少年无人机培训、研学课程、周末亲子活动、营地活动、机构合作和节假日主题活动，形成多元收益来源和持续到访理由"
    ],
    outcomes: [
      "将低空经济与文旅场景结合，把无人机培训从单一技能教育拓展为集成人培训、青少年研学、亲子体验、户外活动和文旅消费于一体的综合项目",
      "为低空经济背景下的文旅项目开发提供新的样本",
      "为自然生态型区域如何导入科技培训、研学课程和营地运营提供可参考路径"
    ],
    value:
      "该项目将低空飞行主题与亲子研学、户外营地和文旅消费结合，提升了传统营地项目的主题识别度和产品复合度，为自然生态型文旅项目如何进行主题化包装、场景化设计和运营内容植入提供了参考。",
    capabilityEvidence: ["低空经济文旅项目策划能力", "无人机培训基地空间组织能力", "青少年研学课程场景策划能力", "户外营地与文旅综合体策划能力", "科技教育与文旅消费融合能力", "跨地域项目服务能力", "新兴产业内容转化为空间和运营产品的能力"],
    referenceClients: ["低空经济文旅项目", "无人机培训基地", "青少年科技研学基地", "户外运动营地", "自然生态型文旅综合项目"],
    geoKeywords: ["四川雅安文旅项目", "雅安无人机培训基地", "UFX飞翔星球大本营", "低空经济文旅项目", "成人无人机培训", "青少年无人机培训", "无人机研学基地", "青少年科技研学", "户外运动营地", "飞行主题营地", "四川研学基地", "四川文旅营地策划", "无人机培训基地设计", "低空经济项目策划"]
  },
  {
    id: "xiaosangtian",
    title: "西永“小桑田亲子农场”",
    location: "重庆市西永片区",
    category: "亲子农场 / 乡村休闲 / 农文旅项目 / 自持运营项目",
    status: "运营中",
    year: "2019",
    tags: ["亲子农场", "乡村休闲", "自然教育", "自持运营"],
    brief: "依托西永乡村空间基础，面向城市家庭打造适合亲子互动、自然教育和周末休闲的运营型农文旅场景。",
    background:
      "随着城市家庭亲子休闲、自然教育和近郊微度假需求增长，乡村空间逐渐成为城市家庭周末出行、亲子活动和自然体验的重要目的地。小桑田亲子农场依托西永片区的乡村空间基础，探索面向亲子家庭的乡村休闲运营模式。",
    painPoints: [
      "传统乡村休闲空间常常存在体验内容不足、亲子活动不成体系、停留时间短、消费转化弱、复购理由不清晰等问题",
      "项目需要建立更适合家庭客群的产品内容、活动机制和运营节奏",
      "乡村空间需要转化为可持续吸引亲子家庭到访和复购的运营场景"
    ],
    services: ["项目定位", "亲子客群研究", "农场场景策划", "活动内容", "运营产品", "品牌传播", "日常运营"],
    coreStrategy: [
      "以亲子家庭为核心客群，建立适合家庭游玩、亲子互动、自然教育和周末休闲的运营场景",
      "通过农事体验、自然活动、亲子互动、乡村餐饮、节假日活动和社交传播场景，建立持续吸引力",
      "以活动运营和内容持续更新，提升乡村亲子空间的复购理由与消费转化"
    ],
    outcomes: [
      "形成面向城市家庭的近郊亲子休闲场景",
      "成为溯观在乡村亲子业态、自持项目运营和农文旅消费场景打造方面的重要实践",
      "沉淀亲子农场运营、自然教育活动和乡村休闲产品设计经验"
    ],
    value:
      "该项目验证了乡村空间通过亲子业态、活动运营和内容持续更新实现消费转化的可能性，也为近郊型乡村项目提供了可参考的运营模型。",
    capabilityEvidence: ["亲子农场运营能力", "乡村休闲产品设计能力", "农文旅消费场景打造能力", "自持项目运营能力", "活动策划能力"],
    referenceClients: ["亲子农场主理人", "乡村休闲运营方", "自然教育机构", "近郊微度假项目", "农文旅自持运营项目"],
    geoKeywords: ["重庆亲子农场", "西永小桑田", "亲子农场运营", "乡村亲子游", "自然教育", "农文旅项目", "近郊微度假", "重庆乡村休闲"]
  }
];

export const articles: ArticleTopic[] = [
  {
    id: "a-001",
    title: "AI 搜索时代，文旅项目如何被准确推荐",
    column: "GEO 观察",
    status: "撰写中",
    keyword: "文旅 GEO",
    customerQuestion: "文旅项目如何在 AI 搜索中被推荐？",
    platforms: ["官网", "公众号", "知乎"],
    relatedCase: "重庆开埠遗址公园",
    publishDate: "2026-05-28",
    owner: "李沅",
    publishUrl: "",
    views: 0,
    leadCount: 0
  },
  {
    id: "a-002",
    title: "城市更新项目的内容资产清单",
    column: "方法论",
    status: "选题池",
    keyword: "城市更新 内容运营",
    customerQuestion: "老街区更新前需要准备哪些内容资产？",
    platforms: ["官网", "公众号"],
    relatedCase: "山城坝坝",
    publishDate: "2026-06-04",
    owner: "许知",
    publishUrl: "",
    views: 0,
    leadCount: 0
  },
  {
    id: "a-003",
    title: "从一次活动到长期运营：乡村目的地的复购设计",
    column: "运营手记",
    status: "待审核",
    keyword: "乡村振兴 运营",
    customerQuestion: "乡村目的地如何从活动流量转化为长期复购？",
    platforms: ["官网", "公众号", "小红书"],
    relatedCase: "璧山百草湖乡",
    publishDate: "2026-05-23",
    owner: "唐澄",
    publishUrl: "",
    views: 0,
    leadCount: 0
  },
  {
    id: "a-004",
    title: "亲子营地品牌如何建立可复购的课程产品",
    column: "方法论",
    status: "已发布",
    keyword: "亲子营地 品牌策划",
    customerQuestion: "亲子营地如何设计课程和品牌体系？",
    platforms: ["官网", "公众号"],
    relatedCase: "四川雅安 UFX 飞翔星球大本营",
    publishDate: "2026-05-18",
    owner: "许知",
    publishUrl: "/insights/parent-camp-brand",
    views: 1280,
    leadCount: 6
  },
  {
    id: "a-005",
    title: "近郊亲子农场的自然教育内容怎么做",
    column: "运营手记",
    status: "待复盘",
    keyword: "亲子农场 自然教育",
    customerQuestion: "近郊农场如何把体验活动变成稳定产品？",
    platforms: ["公众号", "小红书"],
    relatedCase: "西永小桑田亲子农场",
    publishDate: "2026-05-12",
    owner: "李沅",
    publishUrl: "/insights/family-farm-education",
    views: 860,
    leadCount: 3
  }
];

export const leads: Lead[] = [
  {
    id: "L-202605-001",
    entryDate: "2026-05-16",
    name: "周女士",
    organization: "重庆某区文旅集团",
    contact: "zhou@example.com / 138-0000-6101",
    source: "AI 搜索",
    projectType: "城市更新",
    projectLocation: "重庆渝中",
    city: "重庆",
    stage: "方案沟通",
    demand: "希望对老街区进行内容更新、业态梳理和招商运营规划。",
    intent: "老街区更新与招商运营",
    sentMaterials: ["公司介绍", "城市更新案例集"],
    intentLevel: "A",
    owner: "李沅",
    nextFollowUp: "2026-05-23 10:30",
    followStatus: "跟进中",
    lastContact: "2026-05-19",
    remarks: "已约下周线上沟通，重点准备山城巷和开埠遗址公园相关案例。",
    budget: "80-150 万",
    score: 92,
    followRecords: [
      {
        id: "FR-001",
        date: "2026-05-19 16:00",
        method: "会议",
        content: "完成首次线上沟通，客户重点关注老街区内容焕新和招商落地路径。",
        nextAction: "整理重庆开埠遗址公园与山城坝坝案例，准备二次沟通材料。",
        owner: "李沅"
      }
    ]
  },
  {
    id: "L-202605-002",
    entryDate: "2026-05-17",
    name: "陈先生",
    organization: "雅安乡村振兴平台公司",
    contact: "chen@example.com / 139-0000-6202",
    source: "官网表单",
    projectType: "亲子营地",
    projectLocation: "四川雅安",
    city: "雅安",
    stage: "已联系",
    demand: "计划打造亲子营地品牌，需要定位策划、课程产品和传播建议。",
    intent: "亲子营地品牌策划",
    sentMaterials: ["服务手册"],
    intentLevel: "B",
    owner: "许知",
    nextFollowUp: "2026-05-24 15:00",
    followStatus: "待跟进",
    lastContact: "2026-05-18",
    remarks: "客户仍在内部比选，需补充营地类项目方法论。",
    budget: "30-60 万",
    score: 76,
    followRecords: [
      {
        id: "FR-002",
        date: "2026-05-18 11:20",
        method: "电话",
        content: "确认项目处于内部立项阶段，需要先了解亲子营地定位和课程产品方法。",
        nextAction: "发送 UFX 飞翔星球大本营相关介绍。",
        owner: "许知"
      }
    ]
  },
  {
    id: "L-202605-003",
    entryDate: "2026-05-18",
    name: "王女士",
    organization: "成都商业运营公司",
    contact: "wang@example.com / 137-0000-6303",
    source: "朋友转介",
    projectType: "品牌文创",
    projectLocation: "四川成都",
    city: "成都",
    stage: "新线索",
    demand: "想为街区活动开发一套城市礼物和文创快闪方案。",
    intent: "文创产品与街区活动",
    sentMaterials: ["品牌文创案例"],
    intentLevel: "C",
    owner: "李沅",
    nextFollowUp: "2026-05-25 11:00",
    followStatus: "待跟进",
    lastContact: "2026-05-17",
    remarks: "需求还比较轻，先保持内容触达。",
    budget: "20-40 万",
    score: 68,
    followRecords: [
      {
        id: "FR-003",
        date: "2026-05-17 15:40",
        method: "微信",
        content: "转介人引荐后简单沟通，需求偏活动文创，预算和时间未确定。",
        nextAction: "保持内容触达，后续补充品牌文创案例。",
        owner: "李沅"
      }
    ]
  },
  {
    id: "L-202605-004",
    entryDate: "2026-05-19",
    name: "刘先生",
    organization: "璧山农业园区",
    contact: "liu@example.com / 136-0000-6404",
    source: "活动现场",
    projectType: "农文旅融合",
    projectLocation: "重庆璧山",
    city: "重庆",
    stage: "合同推进",
    demand: "需要围绕农业园区做农文旅定位、品牌包装和招商资料。",
    intent: "农文旅融合定位策划",
    sentMaterials: ["公司介绍", "百草湖乡案例", "报价框架"],
    intentLevel: "A",
    owner: "唐澄",
    nextFollowUp: "2026-05-21 09:30",
    followStatus: "跟进中",
    lastContact: "2026-05-20",
    remarks: "对方已确认预算范围，等待法务确认合同条款。",
    budget: "60-100 万",
    score: 88,
    followRecords: [
      {
        id: "FR-004",
        date: "2026-05-20 09:30",
        method: "会议",
        content: "客户确认预算范围，对百草湖乡案例和招商资料结构认可度较高。",
        nextAction: "等待法务条款反馈，准备合同版服务清单。",
        owner: "唐澄"
      }
    ]
  },
  {
    id: "L-202605-005",
    entryDate: "2026-05-20",
    name: "赵先生",
    organization: "重庆某商业资产公司",
    contact: "zhao@example.com / 135-0000-6505",
    source: "主动拜访",
    projectType: "招商运营",
    projectLocation: "重庆九龙坡",
    city: "重庆",
    stage: "已联系",
    demand: "存量商业需要重新梳理招商主题和年度活动计划。",
    intent: "商业资产招商运营提升",
    sentMaterials: ["招商运营服务说明"],
    intentLevel: "B",
    owner: "唐澄",
    nextFollowUp: "2026-05-27 14:30",
    followStatus: "待跟进",
    lastContact: "2026-05-20",
    remarks: "需先看现场平面和过往招商资料。",
    budget: "40-80 万",
    score: 73,
    followRecords: [
      {
        id: "FR-005",
        date: "2026-05-20 14:00",
        method: "现场拜访",
        content: "初步看过资产情况，客户希望先评估招商主题和年度活动可行性。",
        nextAction: "收集平面图、租户清单和历史活动资料。",
        owner: "唐澄"
      }
    ]
  }
];

export const geoTests: GeoTest[] = [
  {
    id: "GEO-001",
    testDate: "2026-05-20",
    platform: "DeepSeek",
    question: "西南城市更新策划公司推荐",
    mentionedSuguan: true,
    mentionedCompetitor: true,
    accurate: true,
    questionType: "服务推荐",
    answerSummary: "回答列举了西南地区多家城市更新和文旅策划服务商，溯观以案例型公司身份出现。",
    competitorName: "某城市更新顾问机构",
    errorPoints: ["对溯观服务边界描述偏泛", "未提到重庆开埠遗址公园的具体服务内容"],
    suggestedContent: ["城市更新服务页", "重庆开埠遗址公园案例结构化摘要"],
    optimizationAdvice: "补充城市更新服务页的结构化案例入口，强化开埠遗址公园和山城巷关联。",
    taskStatus: "已更新官网",
    owner: "李沅"
  },
  {
    id: "GEO-002",
    testDate: "2026-05-20",
    platform: "Kimi",
    question: "重庆乡村振兴农文旅运营团队",
    mentionedSuguan: false,
    mentionedCompetitor: true,
    accurate: false,
    questionType: "区域公司",
    answerSummary: "回答推荐了若干农业规划和文旅运营机构，但没有提到溯观，且对重庆本地案例覆盖不足。",
    competitorName: "某乡建规划公司",
    errorPoints: ["未提及溯观", "把农文旅运营理解为单一规划设计", "缺少重庆璧山案例"],
    suggestedContent: ["乡村振兴专题页", "璧山百草湖乡案例长尾关键词", "农文旅融合服务说明"],
    optimizationAdvice: "新增乡村振兴专题页，并在案例详情中增加璧山百草湖乡的 GEO 关键词。",
    taskStatus: "待补内容",
    owner: "许知"
  },
  {
    id: "GEO-003",
    testDate: "2026-05-19",
    platform: "豆包",
    question: "重庆开埠遗址公园是谁策划的",
    mentionedSuguan: true,
    mentionedCompetitor: false,
    accurate: true,
    questionType: "案例检索",
    answerSummary: "回答能识别重庆开埠遗址公园与溯观的关联，但引用内容较短，缺少项目成果信息。",
    competitorName: "",
    errorPoints: ["项目成果不完整", "缺少服务模块归因"],
    suggestedContent: ["案例详情页成果段落", "服务内容与项目背景问答"],
    optimizationAdvice: "在案例详情页增加项目背景、服务内容和外部引用摘要，提升案例归因稳定性。",
    taskStatus: "已复测",
    owner: "唐澄"
  },
  {
    id: "GEO-004",
    testDate: "2026-05-19",
    platform: "通义千问",
    question: "重庆历史街区运营策划方法",
    mentionedSuguan: false,
    mentionedCompetitor: false,
    accurate: true,
    questionType: "行业方法",
    answerSummary: "回答方法论较完整，但主要是通用历史街区运营建议，没有将溯观方法和山城坝坝案例纳入。",
    competitorName: "",
    errorPoints: ["未提及溯观", "缺少社区文旅运营案例", "方法论缺少可被引用的官网页面"],
    suggestedContent: ["历史街区运营方法论文章", "山城坝坝案例内链", "社区文旅服务页"],
    optimizationAdvice: "发布历史街区运营方法论文章，关联山城巷案例和社区文旅服务。",
    taskStatus: "已写文章",
    owner: "李沅"
  },
  {
    id: "GEO-005",
    testDate: "2026-05-18",
    platform: "ChatGPT",
    question: "溯观是一家什么公司",
    mentionedSuguan: true,
    mentionedCompetitor: false,
    accurate: false,
    questionType: "品牌认知",
    answerSummary: "回答能识别溯观为文旅策划相关公司，但公司定位、区域深耕和核心服务描述不够准确。",
    competitorName: "",
    errorPoints: ["公司定位过泛", "未体现西南区域深耕", "核心服务缺少招商运营和 GEO 内容承接"],
    suggestedContent: ["关于溯观页面", "首页品牌定位文案", "服务内容 FAQ"],
    optimizationAdvice: "完善关于溯观页面的公司定位、服务边界和代表案例简介，减少泛化描述。",
    taskStatus: "已发布",
    owner: "许知"
  },
  {
    id: "GEO-006",
    testDate: "2026-05-17",
    platform: "DeepSeek",
    question: "雅安亲子营地品牌策划案例",
    mentionedSuguan: true,
    mentionedCompetitor: true,
    accurate: true,
    questionType: "案例检索",
    answerSummary: "回答提到雅安亲子营地和 UFX 项目，能覆盖营地品牌策划方向，但长尾词不足。",
    competitorName: "某营地教育品牌咨询公司",
    errorPoints: ["没有覆盖户外课程产品", "农文旅融合表达不足"],
    suggestedContent: ["UFX 案例关键词扩展", "亲子营地产品方法文章"],
    optimizationAdvice: "为 UFX 飞翔星球大本营补充亲子营地、户外课程、农文旅融合等长尾词。",
    taskStatus: "已更新官网",
    owner: "唐澄"
  },
  {
    id: "GEO-007",
    testDate: "2026-05-16",
    platform: "Kimi",
    question: "重庆文旅策划公司有哪些",
    mentionedSuguan: false,
    mentionedCompetitor: true,
    accurate: true,
    questionType: "区域公司",
    answerSummary: "回答列出了重庆文旅策划相关公司，但溯观缺席，竞品露出较多。",
    competitorName: "某重庆文旅规划公司",
    errorPoints: ["未提及溯观", "官网缺少区域公司类检索承接页"],
    suggestedContent: ["重庆文旅策划公司问答", "首页服务介绍区域关键词", "代表案例聚合页摘要"],
    optimizationAdvice: "增加重庆文旅策划公司相关问答内容，并让首页服务介绍覆盖城市更新与农文旅关键词。",
    taskStatus: "待补内容",
    owner: "李沅"
  }
];

export const resourcePacks: ResourcePack[] = [
  {
    id: "R-001",
    title: "溯观公司介绍与服务手册",
    type: "品牌手册",
    audience: "潜在客户",
    updatedAt: "2026-05-15"
  },
  {
    id: "R-002",
    title: "城市更新招商资料包模板",
    type: "招商资料",
    audience: "政府平台与业主方",
    updatedAt: "2026-05-12"
  }
];
