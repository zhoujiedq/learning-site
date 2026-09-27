import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileCode2, CheckCircle2, AlertCircle } from 'lucide-react';
import { addUpload } from '../utils/uploadStore';
import type { Post } from '../types';
import { useI18n } from '../i18n';

interface ImportProps {
  onImported: () => void;
  uploads: Post[];
}

interface Result {
  ok: boolean;
  name: string;
  id?: string;
  error?: string;
}

const TEMPLATE_ZH = `---
title: 文章标题
date: 2026-09-27
lang: zh
tags:
  - 标签一
  - 标签二
summary: 一句话总结这篇笔记
# translationId: my-first-note
---

## 正文从这里开始

支持标准 Markdown：**加粗**、列表、表格、代码块等。

- 文件名以 paper 开头 → 自动归入「论文阅读」
- 文件名以 project 开头 → 自动归入「项目代码」
- 其他文件 → 「学习笔记」
- 中英文配对文章请设置相同的 translationId
`;

const TEMPLATE_EN = `---
title: Entry title
date: 2026-09-27
lang: en
tags:
  - tag-one
  - tag-two
summary: A one-sentence summary of this entry
# translationId: my-first-note
---

## Start writing here

Standard Markdown is supported: **bold**, lists, tables, code blocks, etc.

- File names starting with "paper" are sorted into Papers
- File names starting with "project" are sorted into Projects
- Everything else goes to Notes
- Paired translations should share the same translationId
`;

export function Import({ onImported, uploads }: ImportProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const out: Result[] = [];

    for (const file of Array.from(files)) {
      if (!/\\.md$/i.test(file.name)) {
        out.push({ ok: false, name: file.name, error: t.importFail });
        continue;
      }
      try {
        const text = await file.text();
        const post = addUpload(file.name, text);
        out.push({ ok: true, name: file.name, id: post.id });
      } catch (e) {
        out.push({ ok: false, name: file.name, error: String(e) });
      }
    }

    setResults(out);
    if (out.some((r) => r.ok)) onImported();
  };

  const downloadTemplate = (content: string, name: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-14">
      <p className="text-xs tracking-[0.25em] text-ink-500 uppercase mb-3">IMPORT</p>
      <h1 className="font-serif text-4xl font-bold text-ink-900">{t.importTitle}</h1>
      <p className="mt-3 font-serif text-ink-600 leading-7 max-w-2xl">{t.importDesc}</p>

      {/* 拖拽区 */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`mt-10 cursor-pointer border p-12 sm:p-16 text-center transition-colors ${
          dragging
            ? 'border-ink-900 bg-ink-100'
            : 'border-dashed border-ink-300 bg-transparent hover:border-ink-500'
        }`}
      >
        <UploadCloud className="mx-auto w-10 h-10 text-ink-400" />
        <p className="mt-5 font-serif text-ink-900">{t.dropText}</p>
        <p className="mt-2 text-sm text-ink-500">{t.dropHint}</p>
        <input
          ref={inputRef}
          type="file"
          accept=".md,text/markdown"
          multiple
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* 结果 */}
      {results.length > 0 && (
        <div className="mt-6 space-y-px">
          {results.map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-2.5 px-4 py-3 text-sm border-b border-ink-200 text-ink-700"
            >
              {r.ok ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-ink-900" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-accent" />
              )}
              <span className="font-medium">{r.name}</span>
              <span className="text-ink-400 text-xs">{r.ok ? t.importSuccess : r.error}</span>
              {r.ok && r.id && (
                <button
                  className="ml-auto text-ink-900 border-b border-ink-900 pb-0.5 text-xs hover:text-accent hover:border-accent"
                  onClick={() => navigate(`/post/${encodeURIComponent(r.id!)}`)}
                >
                  {t.viewNow} →
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 模板 */}
      <div className="mt-12 border-t border-ink-200 pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink-900 flex items-center gap-2">
          <FileCode2 className="w-5 h-5 text-ink-500" />
          {t.templateTitle}
        </h2>
        <p className="mt-2 text-sm text-ink-600 font-serif leading-7 max-w-2xl">{t.templateDesc}</p>
        <div className="mt-5 flex gap-4">
          <button
            onClick={() => downloadTemplate(TEMPLATE_ZH, 'template-zh.md')}
            className="px-4 py-2 border border-ink-300 text-sm text-ink-700 hover:border-ink-900 transition-colors"
          >
            中文模板
          </button>
          <button
            onClick={() => downloadTemplate(TEMPLATE_EN, 'template-en.md')}
            className="px-4 py-2 border border-ink-300 text-sm text-ink-700 hover:border-ink-900 transition-colors"
          >
            English template
          </button>
        </div>
      </div>

      {/* 已导入列表 */}
      {uploads.length > 0 && (
        <div className="mt-12">
          <h2 className="font-serif text-lg font-semibold text-ink-900 mb-2">
            {t.importedTitle}（{uploads.length}）
          </h2>
          <ul className="border-t border-ink-200 text-sm">
            {uploads.map((p) => (
              <li key={p.id} className="border-b border-ink-200">
                <button
                  className="w-full text-left px-2 py-3 flex items-center justify-between hover:bg-ink-100/60"
                  onClick={() => navigate(`/post/${encodeURIComponent(p.id)}`)}
                >
                  <span className="font-serif text-ink-900">{p.title}</span>
                  <span className="text-ink-400 text-xs">{p.fileName}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
