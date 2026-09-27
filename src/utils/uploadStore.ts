import type { Lang, Post, PostType } from '../types';
import { parseFrontmatter, asStringArray } from './frontmatter';

const STORAGE_KEY = 'learning-site-uploads-v1';

export interface StoredUpload {
  id: string;
  type: PostType;
  fileName: string;
  raw: string;
  uploadedAt: string;
}

function detectType(fileName: string): PostType {
  const name = fileName.toLowerCase();
  if (name.startsWith('paper') || name.includes('论文')) return 'paper';
  if (name.startsWith('project') || name.includes('项目')) return 'project';
  return 'note';
}

function readLang(value: unknown): Lang {
  return value === 'en' ? 'en' : 'zh';
}

export function readUploads(): StoredUpload[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(list: StoredUpload[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function uploadToPost(item: StoredUpload): Post {
  const { data, body } = parseFrontmatter(item.raw);
  return {
    id: item.id,
    type: item.type,
    title: String(data.title ?? item.fileName.replace(/\.md$/i, '')),
    date: String(data.date ?? item.uploadedAt.slice(0, 10)),
    tags: asStringArray(data.tags),
    summary: String(data.summary ?? ''),
    authors: data.authors ? String(data.authors) : undefined,
    venue: data.venue ? String(data.venue) : undefined,
    source: 'upload',
    fileName: item.fileName,
    lang: readLang(data.lang),
    translationId: data.translationId ? String(data.translationId) : undefined,
    body,
    raw: item.raw,
  };
}

export function loadUploadPosts(): Post[] {
  return readUploads().map(uploadToPost);
}

/** 新增一个上传文件，返回新文章；同名文件会覆盖 */
export function addUpload(fileName: string, raw: string): Post {
  const list = readUploads();
  const slug = fileName.replace(/\.md$/i, '');
  const id = `upload/${Date.now()}-${slug}`;
  const item: StoredUpload = {
    id,
    type: detectType(fileName),
    fileName,
    raw,
    uploadedAt: new Date().toISOString(),
  };

  const filtered = list.filter((x) => x.fileName !== fileName);
  filtered.push(item);
  save(filtered);
  return uploadToPost(item);
}

export function removeUpload(id: string) {
  save(readUploads().filter((x) => x.id !== id));
}

/** 触发浏览器下载 */
export function downloadMarkdown(fileName: string, raw: string) {
  const blob = new Blob([raw], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
