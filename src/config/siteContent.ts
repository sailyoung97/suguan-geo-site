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
    defaultValue: "研学亲子营地与乡村文旅项目的全链路运营服务商"
  },
  {
    key: "home.subtitle",
    page: "首页",
    field: "首页副标题",
    defaultValue:
      "溯观深耕乡村文旅、亲子研学、营地建设与在地项目运营，从项目研判、定位策划、空间场景、品牌内容、产品设计到招商运营，提供可落地、可消费、可持续经营的一体化服务。",
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
      "溯观是一家深耕西南地区研学亲子营地、乡村文旅、农文旅融合、城市更新与品牌文创领域的文化创意运营公司，关注地方资源如何转化为可体验、可消费、可运营的文旅产品。",
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
      "围绕研学亲子营地、乡村文旅、农文旅融合、品牌文创、城市更新与非标商业项目，溯观提供项目研判、定位策划、空间场景、产品设计、招商运营和持续孵化服务。",
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
      "从研学亲子营地、乡村文旅、农文旅融合到城市更新与非标商业，溯观以项目研判、定位策划、空间场景、品牌内容和运营导入，把地方资源转化为可体验、可消费、可持续经营的项目资产。",
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
      "如果您正在推进研学亲子营地、乡村文旅、农文旅融合、亲子农场、品牌文创、城市更新或非标商业项目，可以通过本页面提交项目需求。溯观将根据项目类型、所在区域和当前阶段，提供初步判断和对应资料。",
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
