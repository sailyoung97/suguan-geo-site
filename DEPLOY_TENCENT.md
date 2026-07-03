# 溯观官网腾讯云正式部署

## 1. 服务器环境

- Ubuntu 22.04 LTS 或更新版本
- Node.js 20 LTS
- npm
- PM2
- Nginx
- Git

```bash
npm install -g pm2
```

## 2. 拉取代码

```bash
git clone https://github.com/sailyoung97/suguan-geo-site.git /www/wwwroot/suguan2016.cn
cd /www/wwwroot/suguan2016.cn
npm install
```

GitHub 仓库名称继续使用 `suguan-geo-site`；`/www/wwwroot/suguan2016.cn` 仅为正式服务器的网站目录名称，两者不需要保持一致。

## 3. 创建持久化目录

正式数据与代码目录分离，更新代码不会覆盖后台数据。

```bash
sudo mkdir -p /var/lib/suguan/data
sudo mkdir -p /var/lib/suguan/uploads
sudo mkdir -p /var/lib/suguan/backups
sudo cp -a public/uploads/. /var/lib/suguan/uploads/
sudo chown -R $USER:$USER /var/lib/suguan
sudo chmod -R 750 /var/lib/suguan
```

应用会使用：

```text
/var/lib/suguan/data/cases.json
/var/lib/suguan/data/articles.json
/var/lib/suguan/data/site-assets.json
/var/lib/suguan/data/site-content.json
/var/lib/suguan/uploads
/var/lib/suguan/backups
```

JSON 文件不存在时，系统会使用项目内置正式数据初始化。每次写入前自动备份旧文件，并为每类数据保留最近 20 份备份。

## 4. 环境变量

在项目根目录创建 `.env.production.local`：

```bash
NEXT_PUBLIC_SITE_URL=https://suguan2016.cn
ADMIN_USERNAME=正式后台账号
ADMIN_PASSWORD=正式后台强密码
ADMIN_SESSION_SECRET=至少32位随机字符串
SUGUAN_STORAGE_ROOT=/var/lib/suguan
```

可使用以下命令生成会话密钥：

```bash
openssl rand -hex 32
```

不要把正式账号、密码或会话密钥提交到 Git。

## 5. 构建与启动

```bash
npm run build
pm2 start npm --name suguan-site -- start
pm2 save
pm2 startup
```

应用默认监听 `127.0.0.1:3000`。

## 6. Nginx 配置

创建 `/etc/nginx/sites-available/suguan2016.cn`：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name suguan2016.cn www.suguan2016.cn;

    client_max_body_size 10m;

    location /uploads/ {
        alias /var/lib/suguan/uploads/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/suguan2016.cn /etc/nginx/sites-enabled/suguan2016.cn
sudo nginx -t
sudo systemctl reload nginx
```

## 7. 域名与 SSL

将以下域名的 A 记录指向腾讯云服务器公网 IP：

- `suguan2016.cn`
- `www.suguan2016.cn`

使用腾讯云 SSL 证书或 Certbot：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d suguan2016.cn -d www.suguan2016.cn
sudo certbot renew --dry-run
```

## 8. 本地开发

未设置 `SUGUAN_STORAGE_ROOT` 时，系统自动使用项目根目录下的：

```text
.data/data
.data/uploads
.data/backups
```

`.data` 已加入 `.gitignore`。本地上传图片可通过 `/uploads/文件名` 访问。

## 9. Netlify 临时预览

Netlify 文件系统不可作为持久化存储。系统检测到 Netlify 后：

- GET 接口继续返回内置默认数据，前台可正常展示。
- 案例、文章、素材、文案与图片写入接口返回只读错误。
- 后台不会把 localStorage 缓存误报为“服务器保存成功”。

正式后台维护应在腾讯云域名上进行。

## 10. 现有数据迁移

1. 在旧后台导出案例 JSON、文章 JSON 和演示数据备份。
2. 登录腾讯云正式后台。
3. 分别在案例管理和文章管理中导入 JSON。
4. 素材路径与网页文案应核对后在正式后台重新保存。
5. Netlify Blobs 中的图片需要下载后重新上传到正式后台，或复制到 `/var/lib/suguan/uploads`。
6. 确认所有图片地址均为 `/uploads/文件名`。

## 11. 备份与恢复

自动备份目录：

```text
/var/lib/suguan/backups
```

备份名称示例：

```text
cases-20260703-153000.json
articles-20260703-153000.json
```

恢复时先停止后台写入，然后将选定备份复制回 `/var/lib/suguan/data` 对应文件，并重启应用：

```bash
pm2 restart suguan-site
```

建议额外使用腾讯云定时快照或每天将 `/var/lib/suguan` 打包到独立备份盘。

## 12. 后续更新

```bash
cd /www/wwwroot/suguan2016.cn
git pull origin main
npm install
npm run build
rsync -a --ignore-existing public/uploads/ /var/lib/suguan/uploads/
pm2 restart suguan-site
```

代码更新不会覆盖 `/var/lib/suguan` 中的正式数据与图片。

## 13. 上线检查

- 首页、关于、服务、案例、文章、联系页面正常。
- 后台新增案例或文章后，换浏览器仍可读取。
- 图片上传后 `/uploads/文件名` 可公开访问。
- `/admin` 未登录时跳转登录页。
- 写入 API 未登录返回 401。
- `robots.txt` 禁止抓取 `/admin`。
- `sitemap.xml` 包含已发布案例和文章。
- `/var/lib/suguan/backups` 正常生成并只保留最近 20 份同类备份。
