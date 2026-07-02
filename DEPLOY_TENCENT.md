# 腾讯云正式部署说明

## 1. 服务器环境

- Ubuntu 22.04 LTS 或更新版本
- Node.js 20 LTS
- npm
- PM2
- Nginx
- Git

建议先安装 Node.js 20，再执行：

```bash
npm install -g pm2
```

## 2. 拉取代码

```bash
git clone https://github.com/sailyoung97/suguan-geo-site.git
cd suguan-geo-site
```

## 3. 配置环境变量

在项目根目录创建 `.env.production.local`：

```bash
NEXT_PUBLIC_SITE_URL=https://suguan2016.cn
NEXT_PUBLIC_ADMIN_USERNAME=正式后台账号
NEXT_PUBLIC_ADMIN_PASSWORD=正式后台强密码
```

不要将正式账号、密码或其他密钥提交到 Git。

## 4. 安装与构建

```bash
npm install
npm run build
```

## 5. 使用 PM2 启动

```bash
pm2 start npm --name suguan-site -- start
pm2 save
pm2 startup
```

应用默认监听 `127.0.0.1:3000`。

## 6. 配置 Nginx

创建 `/etc/nginx/sites-available/suguan2016.cn`：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name suguan2016.cn www.suguan2016.cn;

    client_max_body_size 10m;

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

启用站点并检查配置：

```bash
sudo ln -s /etc/nginx/sites-available/suguan2016.cn /etc/nginx/sites-enabled/suguan2016.cn
sudo nginx -t
sudo systemctl reload nginx
```

## 7. 配置域名

在腾讯云 DNS 中添加：

- `suguan2016.cn` 的 A 记录指向服务器公网 IP
- `www.suguan2016.cn` 的 A 记录指向服务器公网 IP

确保备案接入信息与实际服务器一致。

## 8. 配置 SSL

可使用腾讯云 SSL 证书，也可使用 Certbot：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d suguan2016.cn -d www.suguan2016.cn
```

完成后检查 HTTPS 自动续期：

```bash
sudo certbot renew --dry-run
```

## 9. 后续更新

```bash
cd suguan-geo-site
git pull origin main
npm install
npm run build
pm2 restart suguan-site
```

## 10. 上线检查

- 首页、关于、服务、案例、文章、联系页面可访问
- 案例与文章详情页图片正常
- `https://suguan2016.cn/sitemap.xml` 可访问
- `https://suguan2016.cn/robots.txt` 禁止抓取 `/admin`
- `/admin` 未登录时跳转 `/login`
- `public/uploads` 中正式素材随 Git 同步到服务器

## 11. 数据说明

官网正式默认案例、文章、文案和公共素材路径随代码发布。后台当前仍可使用浏览器存储进行临时编辑；需要多设备共享与长期维护时，应把案例、文章、素材配置和 CRM 迁移到正式数据库及对象存储。
