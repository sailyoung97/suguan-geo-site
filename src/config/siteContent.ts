export type SiteContentKey =
  | "home.eyebrow"
  | "home.title"
  | "home.subtitle"
  | "home.primaryCta"
  | "home.consultCta"
  | "home.resourceCta"
  | "about.title"
  | "about.intro"
  | "services.title"
  | "services.description"
  | "cases.title"
  | "cases.description"
  | "contact.title"
  | "contact.description";

export type SiteContentItem = {
  key: SiteContentKey;
  page: string;
  field: string;
  defaultValue: string;
  multiline?: boolean;
};

export const siteContentItems: SiteContentItem[] = [
  {
    key: "home.eyebrow",
    page: "首页",
    field: "首页英文标签",
    defaultValue: "SUGUAN DESIGN"
  },
  {
    key: "home.title",
    page: "首页",
    field: "首页主标题",
    defaultValue: "致力于打造具有持续生命力与社会价值的文化项目"
  },
  {
    key: "home.subtitle",
    page: "首页",
    field: "首页副标题",
    defaultValue:
      "溯观深耕西南地区城市更新、乡村振兴、农文旅融合与品牌文创领域，提供项目研判、定位策划、空间场景、品牌内容、招商运营与持续孵化服务。",
    multiline: true
  },
  {
    key: "home.primaryCta",
    page: "首页",
    field: "首页按钮一",
    defaultValue: "查看项目案例"
  },
  {
    key: "home.consultCta",
    page: "首页",
    field: "首页按钮二",
    defaultValue: "提交项目咨询"
  },
  {
    key: "home.resourceCta",
    page: "首页",
    field: "首页按钮三",
    defaultValue: "获取公司资料包"
  },
  {
    key: "about.title",
    page: "关于溯观",
    field: "页面标题",
    defaultValue: "关于溯观"
  },
  {
    key: "about.intro",
    page: "关于溯观",
    field: "页面介绍",
    defaultValue:
      "从城市更新到乡村振兴，从文化内容到项目运营，溯观关注的不只是空间被建成，更关注项目如何被理解、被使用、被持续经营。",
    multiline: true
  },
  {
    key: "services.title",
    page: "服务内容",
    field: "页面标题",
    defaultValue: "服务内容"
  },
  {
    key: "services.description",
    page: "服务内容",
    field: "页面说明",
    defaultValue:
      "从项目研判、定位策划到空间场景、品牌文创、招商运营、营销推广和运营陪跑，溯观围绕地方项目长期经营建立全案型服务体系。",
    multiline: true
  },
  {
    key: "cases.title",
    page: "项目案例",
    field: "页面标题",
    defaultValue: "项目案例"
  },
  {
    key: "cases.description",
    page: "项目案例",
    field: "页面说明",
    defaultValue:
      "从城市更新、社区文旅到亲子营地与乡村目的地，溯观以项目研判、定位策划、品牌文创和运营陪跑，把地方资源转化为可传播、可招商、可持续运营的内容资产。",
    multiline: true
  },
  {
    key: "contact.title",
    page: "联系我们",
    field: "页面标题",
    defaultValue: "项目咨询与资料领取"
  },
  {
    key: "contact.description",
    page: "联系我们",
    field: "页面说明",
    defaultValue:
      "如果您正在推进城市更新、乡村振兴、农文旅融合、低空经济、亲子农场、品牌文创或商业空间更新项目，可以通过本页面提交项目需求。溯观将根据项目类型、所在区域和当前阶段，提供初步判断和对应资料。",
    multiline: true
  }
];

export const siteContentDefaults = siteContentItems.reduce(
  (defaults, item) => {
    defaults[item.key] = item.defaultValue;
    return defaults;
  },
  {} as Record<SiteContentKey, string>
);
