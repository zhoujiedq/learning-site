import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useI18n } from '../i18n';

export function Footer() {
  const { t } = useI18n();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <footer className="border-t border-ink-200 mt-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-500 tracking-wide">
          <p className="font-serif italic">{t.footer}</p>
          <p>{t.footerStack}</p>
        </div>
      </footer>

      {/* 回到顶部 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="back to top"
        className={`fixed bottom-6 right-6 z-30 p-2.5 border border-ink-300 bg-ink-50/90 backdrop-blur text-ink-600 hover:text-ink-900 hover:border-ink-900 transition-all duration-300 ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </>
  );
}
