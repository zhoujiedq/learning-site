import { useI18n } from '../i18n';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-ink-200 mt-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-500 tracking-wide">
        <p className="font-serif italic">{t.footer}</p>
        <p>{t.footerStack}</p>
      </div>
    </footer>
  );
}
