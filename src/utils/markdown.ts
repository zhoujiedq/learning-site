export interface TocItem {
  level: 1 | 2 | 3;
  text: string;
  id: string;
}

/** 从 markdown 正文提取 h1/h2/h3 作为目录项 */
export function extractToc(body: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = body.split('\n');
  for (const line of lines) {
    const m = /^(#{1,3})\s+(.+?)\s*$/.exec(line.trim());
    if (!m) continue;
    const level = m[1].length as 1 | 2 | 3;
    const raw = m[2]
      // 去掉行内代码
      .replace(/`([^`]*)`/g, '$1')
      // 去掉链接语法 [text](url)
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // 去掉加粗/斜体
      .replace(/[*_~]/g, '')
      .trim();
    if (!raw) continue;
    const id = raw
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    items.push({ level, text: raw, id: `${level}-${id}` });
  }
  return items;
}

/** 估算阅读时长（中文 ~400 字/分钟，英文 ~200 词/分钟） */
export function readingMinutes(body: string, lang: 'zh' | 'en' = 'zh'): number {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~\-\[\]()!]/g, ' ')
    .trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const minutes = lang === 'zh' ? cjk / 350 + words / 200 : words / 220;
  return Math.max(1, Math.round(minutes));
}
