---
title: "Project Log | Building This Personal Site"
date: 2026-09-27
lang: en
tags:
  - vite
  - react
  - tailwindcss
summary: A Markdown-driven personal site built with Vite + React + TailwindCSS, with import/export and bilingual support.
translationId: personal-site
---

## Goals

- Maintain all content in Markdown with zero friction.
- Support .md upload (stored in the browser) and one-click download.
- Bilingual UI with paired Chinese/English entries.
- Minimal academic aesthetic: serif type, monochrome palette, restrained whitespace.

## Stack

| Part | Choice | Why |
| --- | --- | --- |
| Build | Vite | Fast dev server, easy md glob imports |
| Framework | React + TypeScript | Components with type safety |
| Styling | TailwindCSS v4 | Atomic styles, theme via @theme |
| Content | Markdown + frontmatter | No backend; content is just files |

## Key implementation points

- `import.meta.glob('../../content/**/*.md', { query: '?raw' })` collects all entries at build time.
- A small custom frontmatter parser avoids Node-only dependencies in the browser bundle.
- Uploads are kept in localStorage; a version counter state triggers reloads.

## Pitfalls

- TailwindCSS v4 needs no `tailwind.config.js`; the theme lives in the CSS `@theme` block.
- Never add global resets like `* { margin: 0 }` — they break v4's built-in preflight.
- `verbatimModuleSyntax` in TypeScript is picky about type-only imports; disabling it keeps things simple.

## Next steps

- Deploy to Vercel or GitHub Pages.
- Add full-text search and a table of contents (TOC).
