# 宝宝胎动记录 PWA 👶

温馨的胎动追踪与产检提醒应用，为准妈妈打造的孕期陪伴工具。

## ✨ 功能特点

### 📊 胎动计数
- **实时计数**：大号按钮，轻松记录每次胎动
- **智能计时**：自动记录完成10次胎动所需时间
- **震动反馈**：每次记录提供触觉反馈
- **庆祝动画**：完成目标时显示鼓励效果

### 📅 三种视图模式
- **计数模式**：实时记录胎动，显示计时器
- **日历视图**：月历展示，颜色标识胎动情况
  - 🟢 绿色：≥10次（正常）
  - 🟡 黄色：5-9次（偏少）
  - 🟠 橙色：<5次（较少）
  - ⚪ 灰色：无记录
- **列表视图**：详细历史记录，完整会话信息

### 🏥 产检提醒
- **双重通知保障**：
  - 浏览器系统通知（需授权）
  - 应用内Toast提醒（无需权限）
- **多时段提醒**：提前1天、3小时、30分钟
- **产检类型预设**：初查、NT检查、唐筛、大排畸等
- **备注功能**：记录地点、注意事项

### ⏰ 预产期倒计时
- **实时倒计时**：显示剩余天数
- **孕周计算**：精确到周和天
- **进度可视化**：圆形进度条显示孕期进展
- **宝宝大小对比**：每周对应的水果/物品尺寸
- **孕期里程碑**：关键产检时间节点

### 💾 数据管理
- **本地存储**：IndexedDB + LocalStorage，数据不上传
- **离线可用**：PWA支持，无网络也能使用
- **数据导出**：支持导出JSON格式备份
- **完全重置**：可清除所有数据重新开始

### 🎨 多邻国风格UI
- **明亮色彩**：活力绿主题，温馨友好
- **圆润设计**：大圆角、柔和边框
- **游戏化元素**：庆祝动画、鼓励性文案
- **大号按钮**：适合触摸操作

## 🛠️ 技术栈

- **Preact 10.28+** - 3KB轻量级框架，性能优异
- **Vite 5.0+** - 极速开发体验和构建优化
- **TypeScript 5.3+** - 类型安全，开发体验好
- **Tailwind CSS 3.4+** - 工具类CSS，快速开发
- **Dexie.js 3.2+** - IndexedDB封装，结构化数据存储
- **date-fns 3.3+** - 轻量级日期处理
- **PWA (vite-plugin-pwa)** - 渐进式Web应用支持

## 🚀 快速开始

### 安装依赖

推荐使用 pnpm（也支持 npm/yarn）：

```bash
pnpm install
```

### 开发模式

启动本地开发服务器（默认端口3000）：

```bash
pnpm dev
```

访问 http://localhost:3000

### 生产构建

```bash
pnpm build
```

构建产物在 `dist/` 目录。

### 本地预览

预览生产构建：

```bash
pnpm preview
```

## 📁 项目结构

```
baby/
├── public/
│   ├── icons/              # PWA图标
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── layout/         # AppShell, BottomNav, InstallPrompt
│   │   ├── movement/       # 胎动相关（Counter, Calendar, History）
│   │   ├── checkup/        # 产检相关（List, Form, Card）
│   │   ├── countdown/      # 倒计时相关（DueDate, WeekProgress, Onboarding）
│   │   └── shared/         # 共享组件（Button, Card, Toast, Modal）
│   │
│   ├── hooks/              # useInstallPrompt
│   ├── lib/                # 工具函数（db, storage, notifications, date-utils）
│   ├── stores/             # 状态管理（userStore, movementStore）
│   ├── types/              # TypeScript类型定义
│   ├── pages/              # 页面组件（Home, Movement, Checkups, Settings）
│   ├── styles/             # 全局样式
│   │
│   ├── App.tsx             # 根组件
│   └── main.tsx            # 入口文件
│
├── vite.config.ts          # Vite配置（含PWA）
├── tailwind.config.js      # Tailwind主题配置
├── tsconfig.json           # TypeScript配置
└── package.json
```

## 📱 PWA功能

### 安装到主屏幕
- 应用会自动检测是否可安装
- 显示安装提示横幅
- 支持添加到iOS/Android主屏幕

### 离线支持
- Service Worker缓存静态资源
- IndexedDB存储用户数据
- 无网络也能正常使用

### 图标生成
临时占位符图标已创建，生产环境建议替换：

1. 编辑 `public/icons/icon.svg`
2. 导出为 192x192 和 512x512 的 PNG
3. 替换 `icon-192x192.png` 和 `icon-512x512.png`

推荐工具：[RealFaviconGenerator](https://realfavicongenerator.net/)

## 🌐 部署

### 推荐平台
- **Vercel**（首选）- 零配置，自动部署
- **Netlify** - 易用性好，免费额度足够
- **Cloudflare Pages** - 全球CDN，速度快

### Vercel部署步骤

1. 推送代码到GitHub
2. 在Vercel导入仓库
3. 构建命令：`pnpm build`
4. 输出目录：`dist`
5. 自动部署完成

### 注意事项
- ⚠️ **必须使用HTTPS**（PWA和通知的硬性要求）
- 所有推荐平台都提供免费HTTPS
- 建议绑定自定义域名

## 📊 数据隐私

- ✅ 所有数据存储在用户本地设备
- ✅ 不上传到任何服务器
- ✅ 支持导出备份
- ✅ 可随时完全清除

## 🎯 使用建议

### 数胎动最佳实践
- 每天在宝宝活跃时段数胎动
- 正常情况下2小时内应有10次胎动
- 如果胎动明显减少，请及时就医

### 产检提醒设置
- 建议提前1天设置提醒
- 记录产检地点和注意事项
- 产检完成后及时标记

### 预产期计算
- 使用末次月经日期 + 280天
- 或直接使用医生给的预产期

## 🔧 开发说明

### 添加新功能
1. 在对应目录创建组件
2. 遵循现有代码风格
3. 使用TypeScript类型
4. 测试后再部署

### 自定义主题
编辑 `tailwind.config.js` 和 `src/styles/globals.css`

### 调试PWA
- Chrome DevTools > Application > Service Workers
- 测试离线模式
- 验证缓存策略

## 📄 License

MIT

---

**重要提示**：本应用仅供参考，不能替代专业医疗建议。如有任何疑问或不适，请及时咨询医生。

Made with ❤️ for expectant mothers
