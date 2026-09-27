import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownView({ body }: { body: string }) {
  return (
    <div className="markdown-body font-serif text-ink-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-serif text-3xl font-bold text-ink-900 mt-10 mb-4 pb-2 border-b border-ink-200">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif text-2xl font-bold text-ink-900 mt-10 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-xl font-semibold text-ink-900 mt-8 mb-2">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-serif text-lg font-semibold text-ink-900 mt-6 mb-2">{children}</h4>
          ),
          p: ({ children }) => <p className="my-4 leading-8 text-[1.02rem]">{children}</p>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline decoration-ink-300 underline-offset-3 hover:decoration-accent"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="my-4 pl-6 list-disc space-y-2 marker:text-ink-400">{children}</ul>,
          ol: ({ children }) => <ol className="my-4 pl-6 list-decimal space-y-2 marker:text-ink-400">{children}</ol>,
          li: ({ children }) => <li className="leading-8">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-5 pl-4 py-1 border-l-2 border-ink-400 text-ink-600 italic">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = /language-/.test(className || '');
            if (isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="font-sans px-1.5 py-0.5 rounded bg-ink-100 text-accent text-[0.85em]"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="font-sans my-5 p-4 rounded border border-ink-200 bg-ink-100 text-ink-900 overflow-x-auto text-sm leading-6">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-ink-300 bg-ink-100 px-3 py-2 text-left font-semibold text-ink-900">{children}</th>
          ),
          td: ({ children }) => <td className="border border-ink-300 px-3 py-2 text-ink-700">{children}</td>,
          hr: () => <hr className="my-8 border-ink-200" />,
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="my-5 max-w-full border border-ink-200" />
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
