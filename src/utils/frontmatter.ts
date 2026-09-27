/** 轻量 frontmatter 解析，避免 gray-matter 在浏览器环境的 Node 依赖问题 */

export interface ParsedFile {
  data: Record<string, unknown>;
  body: string;
}

function parseValue(value: string): unknown {
  const v = value.trim();
  if (v === '') return '';
  // 内联数组 [a, b, c]
  if (v.startsWith('[') && v.endsWith(']')) {
    return v
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }
  // 去引号
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }
  return v;
}

export function parseFrontmatter(raw: string): ParsedFile {
  // 必须以 --- 开头
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    return { data: {}, body: raw };
  }

  const data: Record<string, unknown> = {};
  const lines = match[1].split(/\r?\n/);
  let currentKey: string | null = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    // YAML 列表项： - xxx
    const listItem = /^\s+-\s+(.*)$/.exec(line);
    if (listItem && currentKey) {
      const prev = data[currentKey];
      const item = parseValue(listItem[1]) as string;
      data[currentKey] = Array.isArray(prev) ? [...prev, item] : [item];
      continue;
    }

    const kv = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (kv) {
      currentKey = kv[1];
      const value = kv[2].trim();
      data[currentKey] = value === '' ? [] : parseValue(value);
    }
  }

  return { data, body: match[2] ?? '' };
}

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}
