import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useI18n } from '../i18n';
import type { Lang } from '../types';
import { cn } from '../utils/cn';

export function Header() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);

  const NAV = [
    { to: '/', label: t.nav.home },
    { to: '/notes', label: t.nav.notes },
    { to: '/papers', label: t.nav.papers },
    { to: '/projects', label: t.nav.projects },
    { to: '/about', label: t.nav.about },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'px-1 py-1 text-sm tracking-wide transition-colors border-b',
      isActive
        ? 'text-ink-900 border-ink-900'
        : 'text-ink-500 border-transparent hover:text-ink-900 hover:border-ink-400',
    );

  const LangToggle = ({ className }: { className?: string }) => (
    <div className={cn('flex items-center text-sm', className)}>
      {(['zh', 'en'] as Lang[]).map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="text-ink-300 mx-1">/</span>}
          <button
            onClick={() => setLang(l)}
            className={cn(
              'transition-colors',
              lang === l ? 'text-ink-900 font-semibold' : 'text-ink-400 hover:text-ink-900',
            )}
          >
            {l === 'zh' ? '中' : 'EN'}
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-20 bg-ink-50/90 backdrop-blur border-b border-ink-200">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <Link to="/" className="font-serif font-bold text-lg text-ink-900 tracking-wide">
          {t.siteTitle}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/import" className={linkClass}>
            {t.nav.import}
          </NavLink>
          <span className="w-px h-4 bg-ink-200" />
          <LangToggle />
        </nav>

        <button
          className="md:hidden p-1 text-ink-700"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-200 px-5 py-4 bg-ink-50">
          <nav className="flex flex-col gap-3">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/import" className={linkClass} onClick={() => setOpen(false)}>
              {t.nav.import}
            </NavLink>
          </nav>
          <LangToggle className="mt-4 pt-4 border-t border-ink-200" />
        </div>
      )}
    </header>
  );
}
