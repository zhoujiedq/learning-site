---
title: 项目记录｜个人学习网站搭建
date: 2026-09-27
lang: zh
tags:
  - Vite
  - React
  - TailwindCSS
summary: 用 Vite + React + TailwindCSS 搭建 Markdown 驱动的个人网站，支持导入、下载与中英双语。
translationId: personal-site
---

## 目标

- 内容用 Markdown 维护，写笔记零门槛。
- 支持 .md 文件上传（本地浏览器保存）与一键下载。
- 界面中英双语，文章支持中英配对。
- 视觉走极简学术风：衬线、黑白灰、克制留白。

## 技术选型

| 部分 | 选择 | 理由 |
| --- | --- | --- |
| 构建 | Vite | 启动快、glob 导入 md 方便 |
| 框架 | React + TypeScript | 组件化、类型安全 |
| 样式 | TailwindCSS v4 | 原子化，主题用 @theme 定义 |
| 内容 | Markdown + frontmatter | 无后端，内容即文件 |

## 关键实现

- `import.meta.glob('../../content/**/*.md', { query: '?raw' })` 在构建时收集全部文章。
- 自写轻量 frontmatter 解析，避免 Node 专用依赖进入浏览器包。
- 上传内容存 localStorage，通过版本号 state 触发重新加载。

## 踩坑

- TailwindCSS v4 不需要 `tailwind.config.js`，主题写在 CSS 的 `@theme` 里。
- 全局样式里不能加 `* { margin: 0 }` 一类 reset，会破坏 v4 自带的 preflight。
- TypeScript 的 `verbatimModuleSyntax` 对类型导入很敏感，统一关闭更省心。

## 下一步

- 部署到 Vercel / GitHub Pages。
- 增加全文搜索与文章目录（TOC）。
