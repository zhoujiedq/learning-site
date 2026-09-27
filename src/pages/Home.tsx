import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Post } from '../types';
import { PostCard } from '../components/PostCard';
import { useI18n } from '../i18n';

interface HomeProps {
  posts: Post[];
}

export function Home({ posts }: HomeProps) {
  const { t } = useI18n();
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  const sections = [
    { label: t.statsNotes, to: '/notes', count: posts.filter((p) => p.type === 'note').length },
    { label: t.statsPapers, to: '/papers', count: posts.filter((p) => p.type === 'paper').length },
    { label: t.statsProjects, to: '/projects', count: posts.filter((p) => p.type === 'project').length },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24 border-b border-ink-200">
        <p className="text-xs tracking-[0.25em] text-ink-500 uppercase mb-6">{t.heroKicker}</p>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-ink-900 leading-[1.2]">
          {t.heroTitle1}
          <br />
          {t.heroTitle2}
        </h1>
        <p className="mt-8 font-serif text-ink-600 text-lg leading-8 max-w-2xl">
          {t.heroDesc}
        </p>
        <div className="mt-10 flex items-center gap-6">
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-900 border-b border-ink-900 pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            {t.heroCta}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/import"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition-colors"
          >
            {t.heroImport}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Sections index */}
      <section className="py-10 border-b border-ink-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-ink-200">
          {sections.map((s, i) => (
            <Link
              key={s.to}
              to={s.to}
              className={`group py-6 sm:py-2 ${i > 0 ? 'sm:pl-8' : ''} ${i < 2 ? 'sm:pr-8' : ''} flex items-baseline justify-between hover:opacity-70 transition-opacity`}
            >
              <span className="font-serif text-lg text-ink-900">{s.label}</span>
              <span className="font-serif text-sm text-ink-500">{s.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-ink-900">{t.latest}</h2>
          <Link to="/notes" className="text-sm text-ink-500 hover:text-ink-900 inline-flex items-center gap-1">
            {t.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="font-serif text-ink-500 py-8 border-t border-ink-200">{t.emptyHome}</p>
        ) : (
          <div>
            {latest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
