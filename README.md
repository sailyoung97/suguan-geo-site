# 溯观官网与 GEO 中台

本项目包含溯观对外官网与内部 GEO 中台，使用 Next.js、React 和 Tailwind CSS 构建。案例、文章、网页文案和素材配置通过服务器 JSON 文件持久化，图片保存到独立 uploads 目录；浏览器 localStorage 仅作为同步缓存。

## 项目目录结构

```txt
app/
  page.tsx                    首页
  about/page.tsx              关于溯观
  services/page.tsx           服务内容
  cases/page.tsx              项目案例
  insights/page.tsx           观点文章
  contact/page.tsx            联系我们
  admin/layout.tsx            后台统一布局
  admin/leads/page.tsx        客户线索 CRM
  admin/geo-tests/page.tsx    GEO 测试记录
  admin/cases/page.tsx        案例管理
  admin/articles/page.tsx     文章选题管理
  admin/resources/page.tsx    资料包管理
components/
  SiteHeader.tsx              前台导航
  AdminShell.tsx              后台框架
data/
  mock.ts                     本地 mock 数据和类型
```

## 页面路由设计

| 模块 | 路由 | 说明 |
| --- | --- | --- |
| 前台 | `/` | 官网首页，展示品牌叙事、服务、案例和线索入口 |
| 前台 | `/about` | 关于溯观 |
| 前台 | `/services` | 服务内容 |
| 前台 | `/cases` | 项目案例 |
| 前台 | `/insights` | 观点文章 |
| 前台 | `/contact` | 联系我们 |
| 后台 | `/admin/leads` | 客户线索 CRM |
| 后台 | `/admin/geo-tests` | GEO 测试记录 |
| 后台 | `/admin/cases` | 案例管理 |
| 后台 | `/admin/articles` | 文章选题管理 |
| 后台 | `/admin/resources` | 资料包管理 |

## Mock 数据结构

`data/mock.ts` 中包含：

- `services`: 核心服务模块
- `caseStudies`: 代表案例
- `articles`: 观点文章和选题
- `leads`: CRM 客户线索
- `geoTests`: GEO 测试记录
- `resourcePacks`: 资料包

## 本地运行

```bash
npm install
npm run dev
```

默认访问 `http://localhost:3000`。

## 正式站点配置

复制 `.env.example` 并按环境配置：

```bash
NEXT_PUBLIC_SITE_URL=https://suguan2016.cn
```

腾讯云部署步骤见 [DEPLOY_TENCENT.md](./DEPLOY_TENCENT.md)。
