import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy } from 'lucide-react';

/** 从代码块文本提取语言标签（"language-ts" -> "ts"） */
function langOf(className?: string): string | undefined {
  const m = /language-([\w+-]+)/.exec(className || '');
  return m ? m[1] : undefined;
}

function CodeBlock({ className, children }: { className?: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const lang = langOf(className);
  const text = String(children ?? '');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard may be unavailable (e.g. non-secure context) */
    }
  };

  return (
    <div className="relative group my-5">
      <div className="flex items-center justify-between px-4 py-1.5 text-xs font-sans text-ink-500 bg-ink-200/70 border border-b-0 border-ink-300 rounded-t">
        <span className="tracking-wider uppercase">{lang || 'code'}</span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 text-ink-500 hover:text-ink-900 transition-colors"
          aria-label="copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="font-sans m-0 p-4 rounded-b border border-ink-300 bg-ink-100 text-ink-900 overflow-x-auto text-sm leading-6">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

/** 从 hast node 递归提取纯文本（code 取原始值，link 取其文本） */
function nodeText(node: any): string {
  if (!node) return '';
  if (node.type === 'text') return node.value ?? '';
  if (node.type === 'element') {
    const tag = node.tagName;
    if (tag === 'code') return node.children?.map((c: any) => c.value ?? '').join('') ?? '';
    return node.children?.map(nodeText).join('') ?? '';
  }
  return '';
}

/** 生成与 extractToc 一致的锚点 id */
function headingId(level: number, node: any): string {
  const raw = nodeText(node)
    .replace(/[*_~]/g, '')
    .trim();
  const slug = raw
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${level}-${slug}`;
}

const headingClass: Record<number, string> = {
  1: 'font-serif text-3xl font-bold text-ink-900 mt-10 mb-4 pb-2 border-b border-ink-200',
  2: 'font-serif text-2xl font-bold text-ink-900 mt-10 mb-3',
  3: 'font-serif text-xl font-semibold text-ink-900 mt-8 mb-2',
  4: 'font-serif text-lg font-semibold text-ink-900 mt-6 mb-2',
};

export function MarkdownView({ body }: { body: string }) {
  return (
    <div className="markdown-body font-serif text-ink-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children, node }) => (
            <h1 id={headingId(1, node)} className={`${headingClass[1]} scroll-mt-24`}>{children}</h1>
          ),
          h2: ({ children, node }) => (
            <h2 id={headingId(2, node)} className={`${headingClass[2]} scroll-mt-24`}>{children}</h2>
          ),
          h3: ({ children, node }) => (
            <h3 id={headingId(3, node)} className={`${headingClass[3]} scroll-mt-24`}>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className={headingClass[4]}>{children}</h4>
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
          pre: ({ children }) => {
            // children 是 <code>，从其中提取 className
            const codeEl = (children as React.ReactElement)?.props as
              | { className?: string; children?: React.ReactNode }
              | undefined;
            return <CodeBlock className={codeEl?.className} children={codeEl?.children} />;
          },
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
            <img src={src} alt={alt} loading="lazy" className="my-5 max-w-full border border-ink-200" />
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
