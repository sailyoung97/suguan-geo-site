# 溯观 GEO 中台当前进度

更新时间：2026-06-11

## 当前状态

本地官网与后台原型已进入 V1.0 可试用阶段，当前开发服务地址：

- 前台首页：http://localhost:3022/
- 关于溯观：http://localhost:3022/about
- 项目案例：http://localhost:3022/cases
- 联系我们：http://localhost:3022/contact
- 后台案例 CMS：http://localhost:3022/admin/cases
- 后台客户线索 CRM：http://localhost:3022/admin/leads
- 网站素材管理：http://localhost:3022/admin/site-assets
- 网页文案管理：http://localhost:3022/admin/site-content

## 已完成

- 官网首页、关于溯观、服务内容、项目案例、联系我们页面基础内容。
- 首页已调整为对外官网表达，不再展示 CRM、GEO 测试、文章选题管理等内部系统内容。
- 首页右侧主视觉图改为 `object-contain`，图片完整显示。
- 专业背书模块已按业务板块分类展示代表项目。
- 公司基础口径已校准为 2016 年创立。
- 重点案例年份已校准：
  - 重庆开埠遗址公园：2023
  - 山城坝坝：2022
  - 璧山百草湖乡：2024
  - 四川雅安 UFX 飞翔星球大本营：2025
  - 西永小桑田亲子农场：2019
- 关于页已增加「溯观文化产业机构」模块。
- 项目案例详情页已改为统一动态路由 `/cases/[slug]`，使用同一个 `CaseDetailTemplate`。
- 后台案例 CMS 已支持新增、编辑、删除、预览、发布、首页推荐、导入/导出 JSON。
- 后台客户线索 CRM 已接入 `localStorage`，key 为 `suguan.leads.v1`。
- 前台联系我们表单提交后会写入 CRM 线索库。
- 网站素材管理支持填写 `/uploads/...` 图片路径。
- 网页文案管理支持编辑前台主要文案，key 为 `suguan.siteContent.v1`。

## 主要本地数据 key

- 案例 CMS：`suguan.cases.v1`
- 客户线索 CRM：`suguan.leads.v1`
- 网站素材：`suguan.siteAssets.v1`
- 网页文案：`suguan.siteContent.v1`

## 已建立的数据配置

- `src/data/companyProfile.ts`
- `src/data/cases.ts`
- `src/data/proof.ts`
- `src/data/organization.ts`
- `src/config/siteAssets.ts`
- `src/config/siteContent.ts`
- `src/config/caseCms.ts`

## 明天建议继续深化

1. 对首页、关于页、服务页、案例页逐页做文案精修。
2. 完善后台案例 CMS 的字段体验，例如批量导入、分类筛选、排序拖拽。
3. 优化 CRM 的详情弹窗和跟进记录展示。
4. 继续补充真实项目图片到 `public/uploads` 并在素材管理中填写路径。
5. 巡检移动端：首页首屏、案例卡片、联系表单、后台表格。
6. 后续再考虑接入真实数据库，不急于上线部署。

## 最近一次构建

最近一次已执行：

```bash
npm run build
```

构建通过。
