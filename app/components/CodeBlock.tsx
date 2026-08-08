/** A minimal, dependency-free code block for the docs and guide. */
export function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-ink">
      {label && (
        <div className="px-4 py-2 text-xs font-mono text-gray-400 border-b border-white/10">
          {label}
        </div>
      )}
      <pre className="code text-gray-100 p-4 overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  );
}
