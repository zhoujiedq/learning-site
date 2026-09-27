export type PostType = 'note' | 'paper' | 'project';

export type Lang = 'zh' | 'en';

export interface PostMeta {
  /** 唯一标识，例如 notes/my-note 或 upload/xxx */
  id: string;
  type: PostType;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  /** 论文专用 */
  authors?: string;
  venue?: string;
  source: 'repo' | 'upload';
  fileName: string;
  /** 文章语言，默认 zh */
  lang: Lang;
  /** 中英配对文章共享同一个 id；无则不显示互链 */
  translationId?: string;
}

export interface Post extends PostMeta {
  /** 去掉 frontmatter 的正文 */
  body: string;
  /** 原始 markdown（含 frontmatter），用于下载 */
  raw: string;
}

export const TYPE_LABEL: Record<PostType, Record<Lang, string>> = {
  note: { zh: '学习笔记', en: 'Notes' },
  paper: { zh: '论文阅读', en: 'Papers' },
  project: { zh: '项目代码', en: 'Projects' },
};
