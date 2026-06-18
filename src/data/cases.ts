export const businessCategories = [
  "研学亲子营地",
  "乡村文旅",
  "农文旅融合",
  "自持运营",
  "品牌文创",
  "城市更新",
  "非标商业"
] as const;

export type BusinessCategory = (typeof businessCategories)[number];

export const caseDisplayPriority = [
  "baicaohuxiang",
  "huajianji",
  "fengmingyaji",
  "xiaosangtian",
  "xiaotaoyuan",
  "dongshengcun-xiaofengnian",
  "kaibu-heritage-park",
  "shancheng-baba"
];

export const legacyCaseSlugMap: Record<string, string> = {
  "fengming-yaji": "fengmingyaji",
  "dongsheng-xiaofengnian": "dongshengcun-xiaofengnian"
};

export const hiddenCaseNames = ["研学亲子营地建设专项"];

export const officialCaseMeta: Record<string, { year: string; businessCategory: BusinessCategory; order: number }> = {
  baicaohuxiang: { year: "2024", businessCategory: "研学亲子营地", order: 1 },
  huajianji: { year: "2024", businessCategory: "研学亲子营地", order: 2 },
  fengmingyaji: { year: "2025", businessCategory: "研学亲子营地", order: 3 },
  xiaosangtian: { year: "2019", businessCategory: "研学亲子营地", order: 4 },
  xiaotaoyuan: { year: "2019", businessCategory: "乡村文旅", order: 5 },
  "dongshengcun-xiaofengnian": { year: "2021", businessCategory: "乡村文旅", order: 6 },
  "kaibu-heritage-park": { year: "2023", businessCategory: "城市更新", order: 7 },
  "shancheng-baba": { year: "2022", businessCategory: "城市更新", order: 8 }
};

export const businessCaseSections = [
  {
    category: "研学亲子营地",
    items: ["璧山百草湖乡", "花间集", "凤鸣雅集", "小桑田", "小桃园", "东升村·小丰年"]
  },
  {
    category: "乡村文旅",
    items: ["百草湖乡", "花间集", "凤鸣雅集", "小桑田", "小桃园", "东升村·小丰年"]
  },
  {
    category: "农文旅融合",
    items: ["璧山百草湖乡", "小桑田", "小桃园", "东升村·小丰年"]
  },
  {
    category: "自持运营",
    items: ["百草湖乡", "小桑田", "小桃园", "花间集", "山城坝坝"]
  },
  {
    category: "品牌文创",
    items: ["大雅造物", "铜拾社", "非也造物", "中华手工平台", "高校文创合作项目"]
  },
  {
    category: "城市更新",
    items: ["重庆开埠遗址公园", "山城坝坝", "重庆工业文化博览园", "北仓", "金山意库", "九龙意库"]
  },
  {
    category: "非标商业",
    items: ["饭江湖", "湖广会馆 / 八省会", "书曰·明清客栈", "星临书局", "Banana 草木咖啡"]
  }
] as const;

export const brandTimeline = [
  { name: "小桑田", time: "2019年4月" },
  { name: "小桃园", time: "2019年9月" },
  { name: "东升村", time: "2021年5月" },
  { name: "小丰年", time: "2021年9月" },
  { name: "花间集", time: "2024年2月" },
  { name: "大雅造物", time: "2024年7月" },
  { name: "百草湖乡", time: "2024年11月" },
  { name: "UFX 飞翔星球雅安站", time: "2026年3月建设中" }
];
