# NB 优选服务

<div align="center">

![NB 优选服务](https://img.shields.io/badge/CDN-IP%20优选-blue?style=for-the-badge)
![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?style=for-the-badge&logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)

提供 CloudFlare、EdgeOne、Vercel、Netlify 等全球主流云服务商的 CDN IP 优选、节点状态监测服务

[在线演示](https://www.byoip.top) · [使用文档](./docs/docs.md) · [配置教程](./docs/config.md)

</div>

## 特性

- 基于 Nuxt + Vue 3 + TypeScript
- JSON 配置驱动内容（服务/合作伙伴/赞助商/CDN 源）
- 内置性能优化与监控（预加载、缓存策略、资源计时等）
- 响应式布局，适配桌面端与移动端

## 快速开始

### 环境要求

- Node.js 18+
- pnpm（推荐）

### 安装

```bash
git clone https://github.com/FrecklyComb1728/byoip-pages
cd byoip-pages
pnpm install
pnpm dev
```

访问 `http://localhost:3000`。

### 构建与预览

```bash
pnpm build
pnpm preview
```

### 生成静态站点

```bash
pnpm generate
pnpm preview
```

## 目录结构

```
byoip-pages/
├── app/
│   ├── assets/
│   │   ├── config/
│   │   │   ├── schemas/
│   │   │   ├── butterpop.json
│   │   │   ├── cdn.json
│   │   │   ├── partners.json
│   │   │   ├── services.json
│   │   │   └── sponsors.json
│   │   ├── css/
│   │   └── icons/
│   ├── components/
│   ├── composables/
│   ├── pages/
│   ├── plugins/
│   ├── types/
│   ├── utils/
│   ├── app.vue
│   ├── app.config.ts
│   └── error.vue
├── public/
│   ├── images/
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── docs/
├── nuxt.config.ts
└── package.json
```

## 配置

站点内容与 CDN 源由 `app/assets/config/` 下的 JSON 文件控制：

| 配置文件 | 说明 |
|---|---|
| `app/assets/config/services.json` | 服务列表与展示信息 |
| `app/assets/config/partners.json` | 合作伙伴信息 |
| `app/assets/config/sponsors.json` | 赞助商信息 |
| `app/assets/config/cdn.json` | CDN 源/镜像源配置（用于一键切换） |
| `app/assets/config/butterpop.json` | 通知弹窗配置 |

## 许可证

[Unlicense](LICENSE)

## 赞助

- https://afdian.com/a/iambees

## 联系

- 邮箱：me@imbee.top
- QQ：3979158171
