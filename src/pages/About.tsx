import { useI18n } from '../i18n';

export function About() {
  const { lang } = useI18n();

  const content = lang === 'zh' ? {
    intro: [
      '欢迎来到我的个人学习网站。这里记录学习过程中的笔记、论文阅读心得与项目代码经验。',
      '费曼说过，「如果你不能把它讲清楚，说明你还没有真正理解它」。写作是最好的学习方式，这个网站就是我的「费曼笔记本」。',
    ],
    structure: '内容结构',
    cats: [
      { name: '学习笔记', desc: '课程知识、概念梳理、学习计划与阶段性总结' },
      { name: '论文阅读', desc: '论文核心贡献、方法拆解、个人思考与相关工作对比' },
      { name: '项目代码', desc: '项目记录、代码经验、踩坑总结与工程实践' },
    ],
    how: '如何发布新内容',
    steps: [
      '方式一：在「导入」页直接上传本地 .md 文件（保存在浏览器本地）。',
      '方式二：将 .md 文件放入项目 content/notes、content/papers 或 content/projects 目录，即成为正式内容。',
      '英文文章在 frontmatter 中写 lang: en；中英配对文章设置相同的 translationId，可在文章页互相跳转。',
      '在任何文章页都可以一键下载原始 Markdown。',
    ],
    note: '这是一个占位的关于页。准备好个人介绍、学习方向和联系方式后随时替换；也可以直接编辑 src/pages/About.tsx。',
  } : {
    intro: [
      'Welcome to my personal learning journal — a record of study notes, paper readings and coding experience.',
      'Feynman said, “If you can’t explain it simply, you don’t understand it well enough.” Writing is the best way to learn; this site is my Feynman notebook.',
    ],
    structure: 'Structure',
    cats: [
      { name: 'Notes', desc: 'Course knowledge, conceptual notes, study plans and reviews.' },
      { name: 'Papers', desc: 'Core contributions, method breakdowns, reflections and related work.' },
      { name: 'Projects', desc: 'Project logs, coding lessons and engineering practice.' },
    ],
    how: 'How to publish',
    steps: [
      'Option 1: upload a local .md file from the Import page (stored in this browser).',
      'Option 2: place the .md file in content/notes, content/papers or content/projects of the project to make it official.',
      'Use lang: en in the frontmatter for English posts; pair translations with the same translationId to link them.',
      'Every entry page lets you download the original Markdown with one click.',
    ],
    note: 'This is a placeholder about page. Replace it with your real bio, research interests and contact details — or edit src/pages/About.tsx directly.',
  };

  return (
    <div className="py-14 max-w-3xl">
      <p className="text-xs tracking-[0.25em] text-ink-500 uppercase mb-3">ABOUT</p>
      <h1 className="font-serif text-4xl font-bold text-ink-900">
        {lang === 'zh' ? '关于' : 'About'}
      </h1>

      <div className="mt-6 space-y-4 font-serif text-ink-700 leading-8">
        {content.intro.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <h2 className="font-serif text-xl font-bold text-ink-900 mt-12 mb-5">{content.structure}</h2>
      <div className="border-t border-ink-200">
        {content.cats.map((c) => (
          <div key={c.name} className="py-4 border-b border-ink-200">
            <p className="font-serif font-semibold text-ink-900">{c.name}</p>
            <p className="mt-1 text-sm font-serif text-ink-600 leading-6">{c.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-xl font-bold text-ink-900 mt-12 mb-5">{content.how}</h2>
      <ol className="list-decimal pl-6 space-y-2.5 font-serif text-ink-700 leading-7">
        {content.steps.map((s, i) => <li key={i}>{s}</li>)}
      </ol>

      <div className="mt-12 border border-ink-300 p-5 font-serif text-sm text-ink-600 leading-7">
        {content.note}
      </div>
    </div>
  );
}
