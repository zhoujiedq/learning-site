import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Download, Trash2, Languages, List } from 'lucide-react';
import type { Post } from '../types';
import { MarkdownView } from '../components/MarkdownView';
import { downloadMarkdown, removeUpload } from '../utils/uploadStore';
import { extractToc, readingMinutes } from '../utils/markdown';
import { useI18n } from '../i18n';
import { cn } from '../utils/cn';

interface PostDetailProps {
  posts: Post[];
  onChange: () => void;
}

export function PostDetail({ posts, onChange }: PostDetailProps) {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const post = posts.find((p) => p.id === decodeURIComponent(id ?? ''));

  const listPath = (p: Post) =>
    p.type === 'note' ? '/notes' : p.type === 'paper' ? '/papers' : '/projects';

  const toc = useMemo(() => (post ? extractToc(post.body) : []), [post]);
  const minutes = useMemo(() => (post ? readingMinutes(post.body, post.lang) : 0), [post]);

  // 上一篇 / 下一篇（同分类按日期排序）
  const siblings = useMemo(() => {
    if (!post) return { prev: undefined, next: undefined };
    const sameType = posts
      .filter((p) => p.type === post.type)
      .sort((a, b) => b.date.localeCompare(a.date));
    const idx = sameType.findIndex((p) => p.id === post.id);
    return { prev: sameType[idx + 1], next: sameType[idx - 1] };
  }, [posts, post]);

  const [tocOpen, setTocOpen] = useState(false);

  if (!post) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-ink-500 mb-4">{t.notFound}</p>
        <Link to="/" className="text-sm text-accent hover:underline">← {t.backHome}</Link>
      </div>
    );
  }

  // 中英配对文章
  const counterpart = post.translationId
    ? posts.find(
        (p) =>
          p.translationId === post.translationId &&
          p.lang !== post.lang &&
          p.type === post.type,
      )
    : undefined;

  const handleDelete = () => {
    if (confirm(t.deleteConfirm)) {
      removeUpload(post.id);
      onChange();
      window.history.back();
    }
  };

  return (
    <article className="py-10">
      <Link
        to={listPath(post)}
        className="inline-flex items-center gap-1.5 text-xs text-ink-500 tracking-wider uppercase hover:text-ink-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.backList}
      </Link>

      {/* 元信息 */}
      <header className="mb-8 pb-8 border-b border-ink-200">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900 leading-tight">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500 font-serif">
          <span>{post.date || t.noDate}</span>
          {post.authors && <span className="italic">{post.authors}</span>}
          {post.venue && <span>{post.venue}</span>}
          <span className="tracking-wider uppercase text-xs">{post.lang === 'zh' ? '中文' : 'English'}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {minutes} min
          </span>
        </div>
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 text-sm text-ink-500">
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </header>

      {/* 操作栏 */}
      <div className="flex flex-wrap items-center gap-5 mb-4">
        <button
          onClick={() => downloadMarkdown(post.fileName, post.raw)}
          className="inline-flex items-center gap-2 text-sm text-ink-900 border-b border-ink-900 pb-0.5 hover:text-accent hover:border-accent transition-colors"
        >
          <Download className="w-4 h-4" />
          {t.download}
        </button>

        {counterpart && (
          <Link
            to={`/post/${encodeURIComponent(counterpart.id)}`}
            className="inline-flex items-center gap-2 text-sm text-ink-500 border-b border-ink-300 pb-0.5 hover:text-ink-900 hover:border-ink-900 transition-colors"
          >
            <Languages className="w-4 h-4" />
            {counterpart.lang === 'en' ? 'Read in English' : '阅读中文版'}
          </Link>
        )}

        {post.source === 'upload' && (
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-accent transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            {t.delete}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_200px] gap-10">
        {/* 正文 */}
        <div className="min-w-0">
          <MarkdownView body={post.body} />
        </div>

        {/* 目录（桌面端固定，移动端折叠） */}
        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <nav className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto text-sm">
              <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-3">Contents</p>
              <ul className="space-y-1.5 border-l border-ink-200">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={cn(
                        'block text-ink-500 hover:text-ink-900 transition-colors leading-6',
                        item.level === 2 && 'pl-3',
                        item.level === 3 && 'pl-6',
                        item.level === 1 && 'font-medium text-ink-700',
                      )}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </div>

      {/* 移动端目录折叠 */}
      {toc.length > 0 && (
        <div className="lg:hidden mt-10 border border-ink-200">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-ink-700 hover:text-ink-900 transition-colors"
          >
            <span className="inline-flex items-center gap-2 font-medium">
              <List className="w-4 h-4" />
              Contents
            </span>
            <span className="text-ink-400">{tocOpen ? '−' : '+'}</span>
          </button>
          {tocOpen && (
            <ul className="px-4 pb-4 space-y-1.5 border-t border-ink-200 pt-3">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setTocOpen(false)}
                    className={cn(
                      'block text-sm text-ink-500 hover:text-ink-900 leading-6',
                      item.level === 2 && 'pl-3',
                      item.level === 3 && 'pl-6',
                    )}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 上一篇 / 下一篇 */}
      <nav className="mt-14 pt-8 border-t border-ink-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {siblings.prev ? (
          <Link
            to={`/post/${encodeURIComponent(siblings.prev.id)}`}
            className="group flex flex-col gap-1.5"
          >
            <span className="text-xs text-ink-400 tracking-wider uppercase inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> {t.prevEntry ?? 'Older'}
            </span>
            <span className="font-serif text-ink-900 group-hover:text-accent transition-colors line-clamp-2">
              {siblings.prev.title}
            </span>
          </Link>
        ) : <span />}
        {siblings.next && (
          <Link
            to={`/post/${encodeURIComponent(siblings.next.id)}`}
            className="group flex flex-col gap-1.5 sm:text-right"
          >
            <span className="text-xs text-ink-400 tracking-wider uppercase inline-flex items-center gap-1 sm:justify-end">
              {t.nextEntry ?? 'Newer'} <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <span className="font-serif text-ink-900 group-hover:text-accent transition-colors line-clamp-2">
              {siblings.next.title}
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
