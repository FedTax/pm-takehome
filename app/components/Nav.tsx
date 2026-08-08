import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "API Docs" },
  { href: "/pricing", label: "Pricing" },
];

export function Nav() {
  return (
    <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-10">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-white text-sm font-bold">
            T
          </span>
          TaxRate
        </Link>
        <div className="flex items-center gap-6 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-gray-600 hover:text-ink transition-colors">
              {l.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="rounded-md bg-brand-500 px-3.5 py-1.5 text-white font-medium hover:bg-brand-600 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </nav>
    </header>
  );
}
