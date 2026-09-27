import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { TYPE_LABEL } from '../types';
import { useI18n } from '../i18n';

export function PostCard({ post }: { post: Post }) {
  const { lang } = useI18n();

  return (
    <Link
      to={`/post/${encodeURIComponent(post.id)}`}
      className="group block bg-transparent border-t border-ink-200 py-5 px-1 hover:bg-ink-100/60 transition-colors"
    >
      <div className="flex items-center gap-3 text-xs text-ink-500 tracking-wider uppercase mb-2">
        <span>{TYPE_LABEL[post.type][lang]}</span>
        <span className="text-ink-300">·</span>
        <span>{post.date || '—'}</span>
        <span className="text-ink-300">·</span>
        <span>{post.lang === 'zh' ? '中' : 'EN'}</span>
      </div>

      <h3 className="font-serif text-lg font-semibold text-ink-900 group-hover:text-accent transition-colors">
        {post.title}
      </h3>
      {post.summary && (
        <p className="mt-1.5 text-sm text-ink-600 font-serif leading-6 line-clamp-2">
          {post.summary}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-x-3 text-xs text-ink-400">
          {post.tags.slice(0, 4).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
