export const contentTopicsStorageKey = "suguan.contentTopics.v1";

export const contentTypes = ["官网文章", "案例解读", "服务说明", "公众号长文", "小红书短文", "知乎问答", "视频号", "资料包", "FAQ"] as const;
export const publishChannels = ["官网文章", "官网案例详情", "官网服务页", "FAQ", "公众号", "小红书", "知乎", "视频号", "资料包"] as const;
export const topicStatuses = ["选题池", "撰写中", "待审核", "已发布", "待复盘"] as const;
export const geoIntents = ["品牌认知", "业务解释", "案例证明", "客户转化", "行业背书", "AI搜索占位"] as const;
export const businessAreas = ["城市更新", "乡村振兴", "农文旅融合", "品牌文创", "非标商业", "自持运营", "高校文创"] as const;
export const targetClients = ["政府平台", "文旅投资方", "乡村运营主体", "商业空间业主", "品牌方", "学校/机构"] as const;

export type ContentType = (typeof contentTypes)[number];
export type PublishChannel = (typeof publishChannels)[number];
export type TopicStatus = (typeof topicStatuses)[number];
export type GeoIntent = (typeof geoIntents)[number];
export type BusinessArea = (typeof businessAreas)[number];
export type TargetClient = (typeof targetClients)[number];

export type GeoContentTopic = {
  id: string;
  title: string;
  slug: string;
  category: string;
  contentType: ContentType;
  status: TopicStatus;
  owner: string;
  plannedDate: string;
  publishChannel: PublishChannel;
  publishToWebsite: boolean;
  websitePath: string;
  externalUrl: string;
  platforms: string;
  publishUrl: string;
  relatedCases: string;
  relatedCase: string;
  targetSearchQuestion: string;
  geoIntent: GeoIntent;
  coreKeywords: string;
  longTailKeywords: string;
  locationKeywords: string;
  businessKeywords: string;
  businessArea: BusinessArea;
  customerQuestion: string;
  targetClient: TargetClient;
  summary: string;
  content: string;
  outline: string;
  references: string;
  requiredAssets: string;
  reviewNotes: string;
  views: number;
  leads: number;
  aiRecognized: boolean;
  aiCited: boolean;
  geoTestResult: string;
  nextOptimization: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export function slugify(value: string) {
  const fallback = `article-${Date.now()}`;
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

export function normalizeContentTopic(item: unknown, index = 0): GeoContentTopic {
  const record = isRecord(item) ? item : {};
  const now = new Date().toISOString();
  const title = readString(record, "title") || "未命名文章";
  const slug = readString(record, "slug") || slugify(title) || `article-${index + 1}`;
  const legacyQuestion = readString(record, "targetSearchQuestion") || readString(record, "customerQuestion") || readString(record, "question");
  const relatedCases = readString(record, "relatedCases") || readString(record, "relatedCase") || readString(record, "caseName");
  const externalUrl = readString(record, "externalUrl") || readString(record, "publishUrl");
  const websitePath = readString(record, "websitePath") || (externalUrl.startsWith("/") ? externalUrl : `/articles/${slug}`);
  const publishChannel = pickOption(readString(record, "publishChannel"), publishChannels, inferPublishChannel(readString(record, "contentType") || readString(record, "platforms")));
  const status = pickOption(readString(record, "status"), topicStatuses, "选题池");

  return {
    id: readString(record, "id") || `topic-${index + 1}`,
    title,
    slug,
    category: readString(record, "category") || readString(record, "column") || "观点文章",
    contentType: pickOption(readString(record, "contentType"), contentTypes, "官网文章"),
    status,
    owner: readString(record, "owner") || "待分配",
    plannedDate: readString(record, "plannedDate") || readString(record, "publishDate"),
    publishChannel,
    publishToWebsite: readBoolean(record, "publishToWebsite") || publishChannel.startsWith("官网") || Boolean(websitePath),
    websitePath,
    externalUrl: externalUrl.startsWith("/") ? "" : externalUrl,
    platforms: readString(record, "platforms") || readStringArray(record, "platforms").join(",") || publishChannel,
    publishUrl: readString(record, "publishUrl") || websitePath || externalUrl,
    relatedCases,
    relatedCase: readString(record, "relatedCase") || relatedCases,
    targetSearchQuestion: legacyQuestion || "客户会如何在 AI 搜索中提问？",
    geoIntent: pickOption(readString(record, "geoIntent"), geoIntents, inferGeoIntent(status)),
    coreKeywords: readString(record, "coreKeywords") || readString(record, "keyword"),
    longTailKeywords: readString(record, "longTailKeywords"),
    locationKeywords: readString(record, "locationKeywords"),
    businessKeywords: readString(record, "businessKeywords"),
    businessArea: pickOption(readString(record, "businessArea"), businessAreas, inferBusinessArea(readString(record, "keyword") || title)),
    customerQuestion: readString(record, "customerQuestion") || legacyQuestion,
    targetClient: pickOption(readString(record, "targetClient"), targetClients, "文旅投资方"),
    summary: readString(record, "summary") || readString(record, "outline"),
    content: readString(record, "content"),
    outline: readString(record, "outline"),
    references: readString(record, "references"),
    requiredAssets: readString(record, "requiredAssets"),
    reviewNotes: readString(record, "reviewNotes"),
    views: readNumber(record, "views"),
    leads: readNumber(record, "leads") || readNumber(record, "leadCount"),
    aiRecognized: readBoolean(record, "aiRecognized"),
    aiCited: readBoolean(record, "aiCited"),
    geoTestResult: readString(record, "geoTestResult"),
    nextOptimization: readString(record, "nextOptimization"),
    notes: readString(record, "notes") || readString(record, "reviewNotes"),
    createdAt: readString(record, "createdAt") || now,
    updatedAt: readString(record, "updatedAt") || now
  };
}

export function getDefaultContentTopics() {
  return defaultContentTopics.map((item, index) => normalizeContentTopic(item, index));
}

export function readStoredContentTopics() {
  if (typeof window === "undefined") {
    return getDefaultContentTopics();
  }

  const raw = window.localStorage.getItem(contentTopicsStorageKey);
  if (!raw) {
    return getDefaultContentTopics();
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((item, index) => normalizeContentTopic(item, index)) : getDefaultContentTopics();
  } catch {
    return getDefaultContentTopics();
  }
}

export function getPublishedContentTopics(topics: GeoContentTopic[]) {
  const published = topics.filter((topic) => topic.status === "已发布" && topic.publishToWebsite);
  return (published.length > 0 ? published : topics.filter((topic) => topic.publishToWebsite)).sort((a, b) => {
    if (a.status === b.status) {
      return (b.plannedDate || "").localeCompare(a.plannedDate || "");
    }
    return a.status === "已发布" ? -1 : 1;
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function readStringArray(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function readNumber(record: Record<string, unknown>, key: string) {
  const value = record[key];
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function readBoolean(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return value === true || value === "是" || value === "true";
}

function pickOption<T extends readonly string[]>(value: string, options: T, fallback: T[number]): T[number] {
  return options.includes(value) ? (value as T[number]) : fallback;
}

function inferPublishChannel(text: string): PublishChannel {
  if (text.includes("小红书")) return "小红书";
  if (text.includes("知乎")) return "知乎";
  if (text.includes("公众号")) return "公众号";
  if (text.includes("视频")) return "视频号";
  if (text.includes("案例")) return "官网案例详情";
  if (text.includes("FAQ")) return "FAQ";
  return "官网文章";
}

function inferGeoIntent(status: TopicStatus): GeoIntent {
  return status === "已发布" || status === "待复盘" ? "AI搜索占位" : "客户转化";
}

function inferBusinessArea(text: string): BusinessArea {
  if (text.includes("乡村") || text.includes("农文旅")) return "农文旅融合";
  if (text.includes("品牌") || text.includes("文创")) return "品牌文创";
  if (text.includes("高校")) return "高校文创";
  if (text.includes("运营") || text.includes("自持")) return "自持运营";
  if (text.includes("商业")) return "非标商业";
  return "城市更新";
}

const defaultContentTopics = [
  {
    id: "a-001",
    title: "AI 搜索时代，文旅项目如何被准确推荐",
    slug: "ai-search-cultural-tourism-recommendation",
    category: "GEO 观察",
    status: "已发布",
    publishChannel: "官网文章",
    publishToWebsite: true,
    websitePath: "/articles/ai-search-cultural-tourism-recommendation",
    contentType: "官网文章",
    plannedDate: "2026-05-28",
    owner: "李沫",
    coreKeywords: "文旅 GEO,AI 搜索推荐,文旅项目曝光",
    targetSearchQuestion: "文旅项目如何在 AI 搜索中被准确推荐？",
    geoIntent: "AI搜索占位",
    businessArea: "城市更新",
    relatedCases: "重庆开埠遗址公园,山城坝坝",
    summary: "AI 搜索正在改变客户发现服务商的方式。文旅项目不仅需要被人看到，也需要被 AI 理解、归类和准确引用。",
    content:
      "AI 搜索时代，官网内容不再只是品牌展示页面，也会成为 AI 理解一家公司的主要信息源。\n\n对于文旅项目、城市更新项目和乡村农文旅项目来说，内容需要清楚回答三个问题：项目做什么、由谁来做、为什么可信。\n\n溯观的 GEO 内容建设重点，是把项目案例、服务方法和客户真实问题整理成稳定、结构化、可引用的信息。这样，当用户搜索“重庆城市更新策划公司”“农文旅项目运营团队”“文旅项目如何做定位策划”时，AI 更容易识别溯观的业务边界和代表案例。\n\n一篇有效的 GEO 文章不应只是宣传稿，而应包含明确问题、业务解释、案例证明、关键词和行动入口。"
  },
  {
    id: "a-002",
    title: "城市更新项目的内容资产清单",
    slug: "urban-renewal-content-assets",
    category: "方法论",
    status: "已发布",
    publishChannel: "官网文章",
    publishToWebsite: true,
    websitePath: "/articles/urban-renewal-content-assets",
    contentType: "官网文章",
    plannedDate: "2026-06-04",
    owner: "许知",
    coreKeywords: "城市更新,内容资产,历史文化空间",
    targetSearchQuestion: "老街区更新前需要准备哪些内容资产？",
    geoIntent: "业务解释",
    businessArea: "城市更新",
    relatedCases: "重庆开埠遗址公园,山城坝坝",
    summary: "城市更新项目不仅要整理空间资产，也要整理文化线索、项目故事、传播素材和运营内容。",
    content:
      "城市更新项目的前期工作，常常从空间、建筑和商业条件开始。但真正决定项目辨识度的，往往是内容资产。\n\n内容资产包括城市记忆、历史线索、街区人物、地方语言、消费场景、可传播视觉符号和未来活动主题。这些内容会影响定位策划、空间场景、品牌命名、招商方向和营销传播。\n\n如果前期没有形成清晰的内容清单，项目很容易变成“空间做完了，但不知道讲什么”。溯观在城市更新项目中，会先梳理文化内容，再将内容转化为空间体验、品牌表达和运营抓手。"
  },
  {
    id: "a-003",
    title: "从一次活动到长期运营：乡村目的地的复购设计",
    slug: "rural-destination-repeat-operation",
    category: "运营手记",
    status: "已发布",
    publishChannel: "官网文章",
    publishToWebsite: true,
    websitePath: "/articles/rural-destination-repeat-operation",
    contentType: "官网文章",
    plannedDate: "2026-05-23",
    owner: "唐澄",
    coreKeywords: "乡村振兴,农文旅运营,复购设计",
    targetSearchQuestion: "乡村目的地如何从活动流量转化为长期复购？",
    geoIntent: "业务解释",
    businessArea: "农文旅融合",
    relatedCases: "璧山百草湖乡,西永小桑田亲子农场",
    summary: "乡村项目不能只依靠单次活动拉动流量，而要形成持续更新的产品、活动和消费理由。",
    content:
      "很多乡村目的地在开业或节假日能够获得阶段性流量，但活动结束后，客流很快回落。问题不在于活动本身，而在于缺少复购设计。\n\n复购来自持续更新的理由。亲子家庭可能因为自然教育课程再次到访，城市游客可能因为季节性活动再次到访，机构客户可能因为研学课程形成长期合作。\n\n溯观在乡村农文旅项目中，会把空间节点、活动机制、产品结构和传播内容一起设计，让项目从“有一次热闹”转向“有长期运营节奏”。"
  },
  {
    id: "a-004",
    title: "亲子营地品牌如何建立可复购的课程产品",
    slug: "family-camp-repeatable-course-product",
    category: "方法论",
    status: "已发布",
    publishChannel: "官网文章",
    publishToWebsite: true,
    websitePath: "/articles/family-camp-repeatable-course-product",
    contentType: "官网文章",
    plannedDate: "2026-05-18",
    owner: "许知",
    coreKeywords: "亲子营地,课程产品,研学基地",
    targetSearchQuestion: "亲子营地如何设计课程和品牌体系？",
    geoIntent: "案例证明",
    businessArea: "农文旅融合",
    relatedCases: "四川雅安 UFX 飞翔星球大本营",
    summary: "亲子营地要想持续运营，需要从单次体验转向可复购、可分龄、可传播的课程产品。",
    content:
      "亲子营地常见的问题，是场地有了，活动也能做，但课程体系不清楚，复购理由不足。\n\n可复购课程通常需要同时解决三件事：孩子为什么想来，家长为什么愿意付费，机构为什么愿意合作。课程主题、难度层级、活动安全、成果展示和传播素材都需要前置设计。\n\n以 UFX 飞翔星球大本营为例，低空经济、无人机培训、青少年研学和户外营地可以形成复合内容。项目不只是飞一次无人机，而是建立面向成人培训、青少年课程和亲子体验的多层产品体系。"
  },
  {
    id: "a-005",
    title: "近郊亲子农场的自然教育内容怎么做",
    slug: "suburban-family-farm-nature-education",
    category: "运营手记",
    status: "已发布",
    publishChannel: "官网文章",
    publishToWebsite: true,
    websitePath: "/articles/suburban-family-farm-nature-education",
    contentType: "官网文章",
    plannedDate: "2026-05-12",
    owner: "李沫",
    coreKeywords: "亲子农场,自然教育,近郊微度假",
    targetSearchQuestion: "近郊农场如何把体验活动变成稳定产品？",
    geoIntent: "案例证明",
    businessArea: "农文旅融合",
    relatedCases: "西永小桑田亲子农场",
    summary: "近郊亲子农场的内容设计，要围绕家庭客群的停留、互动、消费和复购展开。",
    content:
      "近郊亲子农场的核心客群通常是城市家庭。相比单纯观光，他们更关注孩子是否有参与感、家长是否能放松、活动是否安全、体验是否值得再次到访。\n\n自然教育内容可以从农事体验、季节观察、亲子手作、乡村餐饮和节假日活动展开。关键不是把项目做得很复杂，而是形成稳定的活动机制和产品节奏。\n\n小桑田亲子农场的运营经验说明，乡村空间可以通过亲子业态和内容持续更新，形成可消费、可传播、可复购的周末休闲场景。"
  }
] satisfies Partial<GeoContentTopic>[];
