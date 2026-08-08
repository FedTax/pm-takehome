import React from "react";

/**
 * A minimal, dependency-free code block with just enough syntax highlighting
 * for the two languages this demo shows: shell/curl commands and JSON. Pass
 * `lang` to pick the highlighter ("bash" | "json" | "http" | "text").
 *
 * We keep our own tiny tokenizer instead of pulling in a highlighting library —
 * the snippets are small and fixed, and it keeps the scaffold zero-dependency.
 */

export type Lang = "bash" | "json" | "http" | "text";

interface Token {
  type: keyof typeof COLORS;
  value: string;
}

const COLORS = {
  plain: "",
  key: "text-sky-300",
  string: "text-emerald-300",
  number: "text-amber-300",
  keyword: "text-purple-300",
  punct: "text-gray-500",
  command: "text-sky-300",
  flag: "text-amber-300",
  url: "text-sky-300",
  comment: "text-gray-500 italic",
  header: "text-sky-300",
} as const;

/** Scan `code` with `re`, emitting matched tokens and the plain text between. */
function scan(code: string, re: RegExp, map: (m: RegExpExecArray) => Token | Token[]): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  re.lastIndex = 0;
  while ((m = re.exec(code))) {
    if (m.index > last) tokens.push({ type: "plain", value: code.slice(last, m.index) });
    const mapped = map(m);
    if (Array.isArray(mapped)) tokens.push(...mapped);
    else tokens.push(mapped);
    last = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex++; // guard against zero-width matches
  }
  if (last < code.length) tokens.push({ type: "plain", value: code.slice(last) });
  return tokens;
}

function tokenizeJson(code: string): Token[] {
  // key (string before a colon), string, number, keyword, punctuation
  const re =
    /("(?:\\.|[^"\\])*")(?=\s*:)|("(?:\\.|[^"\\])*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],:])/g;
  return scan(code, re, (m) => {
    if (m[1] !== undefined) return { type: "key", value: m[1] };
    if (m[2] !== undefined) return { type: "string", value: m[2] };
    if (m[3] !== undefined) return { type: "number", value: m[3] };
    if (m[4] !== undefined) return { type: "keyword", value: m[4] };
    return { type: "punct", value: m[5] };
  });
}

function tokenizeBash(code: string): Token[] {
  // comment, quoted string, url, flag (-X / --long), the curl command
  const re =
    /(#[^\n]*)|('(?:\\.|[^'])*'|"(?:\\.|[^"])*")|(https?:\/\/[^\s"']+)|(?<=^|\s)(-{1,2}[A-Za-z][\w-]*)|\b(curl)\b/gm;
  return scan(code, re, (m) => {
    if (m[1] !== undefined) return { type: "comment", value: m[1] };
    if (m[2] !== undefined) return { type: "string", value: m[2] };
    if (m[3] !== undefined) return { type: "url", value: m[3] };
    if (m[4] !== undefined) return { type: "flag", value: m[4] };
    return { type: "command", value: m[5] };
  });
}

function tokenizeHttp(code: string): Token[] {
  // "Header-Name: value" per line
  const re = /^([A-Za-z][\w-]*)(:\s*)(.*)$/gm;
  return scan(code, re, (m) => [
    { type: "header", value: m[1] },
    { type: "punct", value: m[2] },
    { type: "string", value: m[3] },
  ]);
}

function highlight(code: string, lang: Lang): React.ReactNode {
  let tokens: Token[];
  if (lang === "json") tokens = tokenizeJson(code);
  else if (lang === "bash") tokens = tokenizeBash(code);
  else if (lang === "http") tokens = tokenizeHttp(code);
  else return code;

  return tokens.map((t, i) =>
    COLORS[t.type] ? (
      <span key={i} className={COLORS[t.type]}>
        {t.value}
      </span>
    ) : (
      <React.Fragment key={i}>{t.value}</React.Fragment>
    ),
  );
}

export function CodeBlock({
  children,
  label,
  lang = "text",
}: {
  children: string;
  label?: string;
  lang?: Lang;
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-ink">
      {label && (
        <div className="px-4 py-2 text-xs font-mono text-gray-400 border-b border-white/10">
          {label}
        </div>
      )}
      <pre className="code text-gray-100 p-4 overflow-x-auto">
        <code>{highlight(children, lang)}</code>
      </pre>
    </div>
  );
}
