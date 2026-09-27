import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Lang, Post, PostType } from '../types';
import { PostCard } from '../components/PostCard';
import { useI18n } from '../i18n';
import { cn } from '../utils/cn';

interface PostListProps {
  posts: Post[];
  type: PostType;
  title: string;
  description: string;
}

export function PostList({ posts, type, title, description }: PostListProps) {
  const { t } = useI18n();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<Lang | 'all'>('all');
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts
      .filter((p) => p.type === type)
      .filter((p) => !activeTag || p.tags.includes(activeTag))
      .filter((p) => activeLang === 'all' || p.lang === activeLang)
      .filter((p) => {
        if (!q) return true;
        return (
          p.title.toLowerCase().includes(q) ||
          p.tags.some((x) => x.toLowerCase().includes(q)) ||
          p.summary.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [posts, type, activeTag, activeLang, query]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.filter((p) => p.type === type).forEach((p) => p.tags.forEach((x) => set.add(x)));
    return [...set];
  }, [posts, type]);

  const chip = (active: boolean) =>
    cn(
      'px-2.5 py-1 text-xs border transition-colors',
      active
        ? 'bg-ink-900 text-ink-50 border-ink-900'
        : 'bg-transparent text-ink-500 border-ink-300 hover:border-ink-900 hover:text-ink-900',
    );

  return (
    <div className="py-14">
      <p className="text-xs tracking-[0.25em] text-ink-500 uppercase mb-3">
        {type === 'note' ? 'NOTES' : type === 'paper' ? 'PAPERS' : 'PROJECTS'}
      </p>
      <h1 className="font-serif text-4xl font-bold text-ink-900">{title}</h1>
      <p className="mt-3 font-serif text-ink-600 leading-7">{description}</p>

      {/* 搜索框 */}
      <div className="mt-8 relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 text-sm font-sans bg-transparent border border-ink-300 text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-900 transition-colors"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {/* 语言筛选 */}
        <button onClick={() => setActiveLang('all')} className={chip(activeLang === 'all')}>
          {t.langAll}
        </button>
        <button onClick={() => setActiveLang('zh')} className={chip(activeLang === 'zh')}>
          中文
        </button>
        <button onClick={() => setActiveLang('en')} className={chip(activeLang === 'en')}>
          English
        </button>

        {allTags.length > 0 && <span className="w-px h-5 bg-ink-200 mx-1" />}

        {/* 标签筛选 */}
        {allTags.map((tag) => (
          <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)} className={chip(activeTag === tag)}>
            #{tag}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="font-serif text-ink-500 mt-12 pt-8 border-t border-ink-200">{t.empty}</p>
      ) : (
        <div className="mt-8">
          {list.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
