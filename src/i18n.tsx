import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Lang } from './types';

export const en = {
  siteTitle: 'Learning Journal',
  nav: {
    home: 'Home',
    notes: 'Notes',
    papers: 'Papers',
    projects: 'Projects',
    about: 'About',
    import: 'Import',
  },
  tagline: 'Record the process. Distill the knowledge.',
  heroKicker: 'PERSONAL LEARNING LOG',
  heroTitle1: 'Notes on what I learn,',
  heroTitle2: 'written as I learn it.',
  heroDesc:
    'A personal journal of study notes, paper readings and coding experience, written in Markdown — import and export anytime.',
  heroCta: 'Start reading',
  heroImport: 'Import Markdown',
  statsNotes: 'Notes',
  statsPapers: 'Papers',
  statsProjects: 'Projects',
  latest: 'Latest entries',
  viewAll: 'View all',
  emptyHome: 'No entries yet. Import your first Markdown file to begin.',
  listTitles: {
    note: 'Notes',
    paper: 'Papers',
    project: 'Projects',
  },
  listDesc: {
    note: 'Course knowledge, conceptual notes and study summaries.',
    paper: 'Close reading, method breakdowns and reflections.',
    project: 'Project logs and lessons from engineering practice.',
  },
  all: 'All',
  langAll: 'All languages',
  empty: 'No entries.',
  notFound: 'Entry not found or has been removed.',
  backHome: 'Back to home',
  backList: 'Back to list',
  noDate: 'Undated',
  download: 'Download Markdown',
  delete: 'Delete local copy',
  deleteConfirm: 'Delete this locally imported entry? This cannot be undone.',
  readTranslation: 'Read in 中文',
  importTitle: 'Import Markdown',
  importDesc:
    'Uploaded notes are stored only in this browser (localStorage). You can download the original .md file from any entry page.',
  dropText: 'Click to choose, or drop .md files here',
  dropHint: 'Multiple files supported. Files with the same name are overwritten.',
  importSuccess: 'Imported',
  importFail: 'Not a .md file',
  viewNow: 'View now',
  templateTitle: 'No file yet? Start from a template',
  templateDesc:
    'The title / date / tags / summary fields in the frontmatter are used in the list. Use lang: en for English posts.',
  downloadTemplate: 'Download template (EN)',
  importedTitle: 'Locally imported',
  aboutTitle: 'About',
  footer: 'Written in Markdown, refined over time.',
  footerStack: 'Built with Vite + React + TailwindCSS',
};

export const zh: typeof en = {
  siteTitle: '学习志',
  nav: {
    home: '首页',
    notes: '学习笔记',
    papers: '论文阅读',
    projects: '项目代码',
    about: '关于',
    import: '导入',
  },
  tagline: '记录学习过程，沉淀每一份经验。',
  heroKicker: '个人学习记录',
  heroTitle1: '记录学习过程，',
  heroTitle2: '沉淀每一份经验。',
  heroDesc:
    '这里用 Markdown 记录学习笔记、论文阅读与项目代码经验，支持随时导入与导出。',
  heroCta: '开始阅读',
  heroImport: '导入 Markdown',
  statsNotes: '学习笔记',
  statsPapers: '论文阅读',
  statsProjects: '项目代码',
  latest: '最新动态',
  viewAll: '查看全部',
  emptyHome: '还没有内容，去「导入」上传第一篇 Markdown 吧。',
  listTitles: {
    note: '学习笔记',
    paper: '论文阅读',
    project: '项目代码',
  },
  listDesc: {
    note: '课程知识、概念梳理与学习总结。',
    paper: '论文精读、方法拆解与思考。',
    project: '项目记录与代码实践经验。',
  },
  all: '全部',
  langAll: '全部语言',
  empty: '暂无内容。',
  notFound: '文章不存在或已被删除。',
  backHome: '返回首页',
  backList: '返回列表',
  noDate: '未标注日期',
  download: '下载 Markdown',
  delete: '删除本地导入',
  deleteConfirm: '确定删除这篇本地导入的文章吗？此操作不可恢复。',
  readTranslation: 'Read in English',
  importTitle: '导入 Markdown',
  importDesc:
    '上传的笔记仅保存在当前浏览器的本地存储中，可随时在文章页下载原始 .md 文件。',
  dropText: '点击选择，或拖拽 .md 文件到此处',
  dropHint: '支持一次选择多个文件，同名文件会被覆盖。',
  importSuccess: '导入成功',
  importFail: '不是 .md 文件',
  viewNow: '立即查看',
  templateTitle: '没有现成文件？从模板开始',
  templateDesc:
    'frontmatter 中的 title / date / tags / summary 会用于列表展示；英文文章请填写 lang: en。',
  downloadTemplate: '下载模板（中文）',
  importedTitle: '已本地导入',
  aboutTitle: '关于',
  footer: '用 Markdown 记录，用时间沉淀。',
  footerStack: 'Vite + React + TailwindCSS',
};

export type Dict = typeof en;

const I18nContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}>({ lang: 'zh', setLang: () => {}, t: zh });

const STORAGE_KEY = 'learning-site-lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'en' || v === 'zh' ? v : 'zh';
    } catch {
      return 'zh';
    }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: lang === 'en' ? en : zh }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
