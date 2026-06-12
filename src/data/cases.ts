export const businessCategories = [
  "文化产业",
  "都市文旅",
  "乡村农文旅",
  "非标商业",
  "高校文创",
  "品牌成长历程"
] as const;

export type BusinessCategory = (typeof businessCategories)[number];

export const officialCaseMeta: Record<string, { year: string; businessCategory: BusinessCategory }> = {
  "kaibu-heritage-park": { year: "2023", businessCategory: "都市文旅" },
  "shancheng-baba": { year: "2022", businessCategory: "都市文旅" },
  baicaohuxiang: { year: "2024", businessCategory: "乡村农文旅" },
  "ufx-yaan": { year: "2025", businessCategory: "乡村农文旅" },
  xiaosangtian: { year: "2019", businessCategory: "乡村农文旅" }
};

export const businessCaseSections = [
  {
    category: "文化产业",
    items: ["《撷域》杂志刊物", "《中华手工》杂志刊物", "大雅造物", "铜拾社", "非也造物", "中华手工平台"]
  },
  {
    category: "都市文旅",
    items: ["重庆开埠遗址公园", "重庆工业文化博览园", "山城坝坝", "北仓", "金山意库", "九龙意库", "东西市集", "山城巷", "重逢1980街区"]
  },
  {
    category: "乡村农文旅",
    items: ["小桑田", "小桃园", "小丰年", "花间集", "大雅造物", "百草湖乡", "UFX 飞翔星球大本营", "东升村"]
  },
  {
    category: "非标商业",
    items: ["饭江湖", "湖广会馆 / 八省会", "山城坝坝", "东西坝坝", "书曰·明清客栈", "星临书局", "爱情足浴马莎鸡", "Banana草木咖啡"]
  },
  {
    category: "高校文创",
    items: [
      "重庆大学",
      "重庆理工大学",
      "四川外国语大学",
      "重庆医科大学",
      "重庆交通大学",
      "贵州医科大学",
      "山西医科大学",
      "贵州师范大学",
      "重庆工商大学",
      "重庆师范大学",
      "重庆第二师范学院",
      "重庆南开中学",
      "重庆广益中学",
      "重庆十一中",
      "重庆璧山中学",
      "瑞思国际英语连锁机构"
    ]
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
