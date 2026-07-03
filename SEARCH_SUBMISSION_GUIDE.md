# 溯观官网搜索引擎提交指南

本指南适用于备案完成、`https://suguan2016.cn` 正式上线之后。以下平台均可免费使用，提交站点地图不等于保证收录，页面质量和持续更新仍然是收录基础。

## 上线前检查

1. 在生产环境设置：

   ```bash
   NEXT_PUBLIC_SITE_URL=https://suguan2016.cn
   ```

2. 完成构建和部署后，确认以下地址可公开访问：

   - `https://suguan2016.cn/`
   - `https://suguan2016.cn/robots.txt`
   - `https://suguan2016.cn/sitemap.xml`

3. 检查 `sitemap.xml` 中的链接均以 `https://suguan2016.cn` 开头。
4. 检查 `robots.txt` 允许抓取前台页面，并包含 `Disallow: /admin`。
5. 确认 `www.suguan2016.cn` 与主域名之间设置统一的 301 跳转，避免重复收录。

## 百度搜索资源平台

官方入口：[百度搜索资源平台](https://ziyuan.baidu.com/)

1. 使用百度账号登录，进入站点管理并添加 `suguan2016.cn`。
2. 按平台提示完成站点所有权验证。优先使用 DNS 验证，迁移服务器后通常无需重新放置验证文件。
3. 在资源提交或普通收录工具中提交站点地图：

   ```text
   https://suguan2016.cn/sitemap.xml
   ```

4. 对首页、项目案例页和近期重点文章，可在平台提供的链接提交入口中补充提交。
5. 定期查看抓取异常、索引量和搜索展现数据。百度提供提交渠道，但不保证提交链接一定收录。

参考：[百度 Sitemap 提交工具说明](https://ziyuan.baidu.com/wiki/640)

## Bing Webmaster Tools

官方入口：[Bing Webmaster Tools](https://www.bing.com/webmasters/)

1. 登录后添加 `https://suguan2016.cn`，按提示完成所有权验证。
2. 如果已经配置 Google Search Console，也可以使用 Bing 提供的导入功能。
3. 在 Sitemaps 页面提交：

   ```text
   https://suguan2016.cn/sitemap.xml
   ```

4. 对刚发布的重要案例或文章，可使用 URL Submission 工具提交单个链接。
5. 在 Site Explorer 中检查抓取状态、索引情况和 robots 阻挡问题。

参考：[Bing Webmaster Tools 帮助中心](https://www.bing.com/webmasters/help/) 与 [URL Submission 说明](https://www.bing.com/webmasters/help/URL-Submission-62f2860b)

## Google Search Console

官方入口：[Google Search Console](https://search.google.com/search-console/about)

1. 新增网域资源 `suguan2016.cn`，在域名 DNS 中添加 Google 提供的 TXT 记录完成验证。
2. 进入 Sitemaps，提交：

   ```text
   sitemap.xml
   ```

3. 使用网址检查工具检查首页、重点案例和重点文章，并在必要时请求编入索引。
4. 查看网页索引、体验和搜索成效报告，及时处理 404、重复网页或抓取失败。

参考：[Google 构建和提交 Sitemap 官方文档](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) 与 [Search Console 入门](https://developers.google.com/search/docs/monitor-debug/search-console-start)

## 内容更新后的操作

1. 发布案例或文章后，先确认新地址已经自动进入 `sitemap.xml`。
2. 检查页面标题、摘要、正文、图片替代文本和内部链接。
3. 重点内容可在百度、Bing 和 Google 的站长平台中提交或请求重新抓取。
4. 每月检查一次抓取错误、索引状态、展示量和搜索词变化。
5. 不要反复提交同一地址；提交只是发现信号，不会直接提高排名。

## Netlify 临时环境

未配置 `NEXT_PUBLIC_SITE_URL` 时，项目会优先使用 Netlify 提供的 `URL` 环境变量生成绝对地址；本地或其他未提供部署地址的环境会回退到 `https://suguan2016.cn`。这不会影响当前页面构建和访问。正式域名启用后，应显式设置 `NEXT_PUBLIC_SITE_URL`。
