import type { Lang, Post, PostType } from '../types';
import { parseFrontmatter, asStringArray } from './frontmatter';

const modules = import.meta.glob('../../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function dirToType(dir: string): PostType | null {
  if (dir === 'notes') return 'note';
  if (dir === 'papers') return 'paper';
  if (dir === 'projects') return 'project';
  return null;
}

function readLang(value: unknown): Lang {
  return value === 'en' ? 'en' : 'zh';
}

/** 加载 content 目录下的所有文章 */
export function loadRepoPosts(): Post[] {
  const posts: Post[] = [];

  for (const [path, raw] of Object.entries(modules)) {
    // 形如 ../../content/notes/hello.md
    const m = /content\/(notes|papers|projects)\/(.+)\.md$/.exec(path);
    if (!m) continue;
    const type = dirToType(m[1]);
    if (!type) continue;

    const slug = m[2];
    const { data, body } = parseFrontmatter(raw);

    posts.push({
      id: `${m[1]}/${slug}`,
      type,
      title: String(data.title ?? slug),
      date: String(data.date ?? ''),
      tags: asStringArray(data.tags),
      summary: String(data.summary ?? ''),
      authors: data.authors ? String(data.authors) : undefined,
      venue: data.venue ? String(data.venue) : undefined,
      source: 'repo',
      fileName: `${slug}.md`,
      lang: readLang(data.lang),
      translationId: data.translationId ? String(data.translationId) : undefined,
      body,
      raw,
    });
  }

  return posts;
}
