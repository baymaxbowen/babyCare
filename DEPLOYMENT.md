# 部署指南

## 快速部署到 Vercel（推荐）

### 1. 准备工作
- 确保代码已推送到 GitHub/GitLab/Bitbucket
- 注册 [Vercel](https://vercel.com) 账号

### 2. 导入项目
1. 登录 Vercel
2. 点击 "New Project"
3. 选择你的 Git 仓库
4. 导入 `baby` 项目

### 3. 配置构建
Vercel 会自动检测配置，确认以下设置：

```
Framework Preset: Vite
Build Command: pnpm build
Output Directory: dist
Install Command: pnpm install
```

### 4. 部署
点击 "Deploy" 按钮，等待构建完成（约1-2分钟）

### 5. 自定义域名（可选）
1. 进入项目 Settings > Domains
2. 添加你的域名
3. 按照提示配置DNS记录

---

## 部署到 Netlify

### 1. 准备 netlify.toml
在项目根目录创建：

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. 部署步骤
1. 登录 [Netlify](https://netlify.com)
2. 点击 "Add new site" > "Import an existing project"
3. 连接 Git 仓库
4. 构建设置会自动读取 netlify.toml
5. 点击 "Deploy site"

---

## 部署到 Cloudflare Pages

### 1. 部署步骤
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 Pages
3. 点击 "Create a project"
4. 连接 Git 仓库

### 2. 构建配置
```
Build command: pnpm build
Build output directory: dist
Root directory: (leave empty)
Environment variables:
  NODE_VERSION: 18
```

### 3. 部署
点击 "Save and Deploy"

---

## 手动构建和部署

### 1. 本地构建
```bash
pnpm install
pnpm build
```

### 2. 测试构建产物
```bash
pnpm preview
```

### 3. 部署到静态服务器
将 `dist/` 目录内容上传到任何支持静态网站的服务器：
- Apache
- Nginx
- AWS S3 + CloudFront
- Azure Static Web Apps
- GitHub Pages

### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/baby/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # PWA 缓存头
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker 不缓存
    location /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        expires off;
    }
}
```

---

## 环境变量（如需要）

在部署平台设置环境变量：

```bash
# 应用名称
VITE_APP_NAME=宝宝胎动记录

# 其他自定义配置
# VITE_XXX=value
```

在代码中使用：
```typescript
const appName = import.meta.env.VITE_APP_NAME;
```

---

## PWA 检查清单

部署后验证：

### 1. HTTPS
- ✅ 必须使用 HTTPS（PWA要求）
- ✅ 所有推荐平台都提供免费 HTTPS

### 2. Service Worker
打开 Chrome DevTools > Application：
- ✅ Service Worker 已注册
- ✅ 缓存策略生效
- ✅ 离线模式可用

### 3. Manifest
- ✅ manifest.webmanifest 可访问
- ✅ 图标正确加载
- ✅ 主题色正确显示

### 4. 安装提示
- ✅ 浏览器显示"安装应用"提示
- ✅ 可添加到主屏幕
- ✅ 独立窗口模式运行

### 5. Lighthouse 审计
运行 Lighthouse：
```bash
pnpm build
pnpm preview
# 然后在 Chrome DevTools > Lighthouse 运行审计
```

目标分数：
- PWA: 100
- Performance: ≥90
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90

---

## 故障排查

### Service Worker 未更新
```bash
# 清除浏览器缓存
# 或在 DevTools > Application > Service Workers 点击 "Unregister"
```

### 图标未显示
检查：
1. `public/icons/` 目录是否有图标文件
2. `vite.config.ts` 中 manifest 配置是否正确
3. 图标路径是否以 `/` 开头

### 离线模式不工作
1. 确认使用 HTTPS
2. 检查 Service Worker 是否注册成功
3. 查看 Console 是否有错误

### 通知不工作
1. 确认用户已授予通知权限
2. 确认使用 HTTPS
3. iOS Safari 对通知支持有限

---

## 性能优化建议

### 1. 图片优化
使用 WebP 格式的图标：
```bash
# 转换 PNG 到 WebP
npx @squoosh/cli --webp auto public/icons/*.png
```

### 2. 代码分割
已自动配置，Vite 会智能分割代码。

### 3. 压缩
部署平台通常自动启用 Gzip/Brotli 压缩。

### 4. CDN
使用部署平台的 CDN（Vercel/Netlify/Cloudflare 都提供）。

---

## 更新部署

### 自动部署
推送到主分支会自动触发部署：
```bash
git add .
git commit -m "Update features"
git push origin main
```

### 预览部署
创建 Pull Request 会生成预览链接。

### 回滚
在部署平台可以快速回滚到之前的版本。

---

## 监控和分析

### 推荐工具
- **Vercel Analytics** - 实时访问统计
- **Google Analytics** - 深度用户分析
- **Sentry** - 错误追踪（可选）

### 添加 Google Analytics（可选）

在 `index.html` 添加：
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 常见问题

**Q: 为什么必须使用 HTTPS？**
A: PWA 和 Notification API 都要求 HTTPS，这是浏览器的安全限制。

**Q: 如何更新已安装的 PWA？**
A: Service Worker 会自动检查更新。用户刷新页面或重新打开应用时会更新。

**Q: iOS Safari 支持情况如何？**
A: iOS 16.4+ 支持 PWA 基本功能，但通知支持有限。建议使用应用内提醒作为后备。

**Q: 数据会丢失吗？**
A: 数据存储在本地 IndexedDB，不会因应用更新而丢失。建议定期导出备份。

---

需要帮助？查看 [GitHub Issues](https://github.com/your-repo/issues)
