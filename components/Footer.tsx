"use client";

import Link from "next/link";

const LINK_COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/about", label: "About Us" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { href: "/signup", label: "Sign Up" },
      { href: "/login", label: "Log In" },
    ],
  },
];

/**
 * Shared footer for public pages (landing, Features, About, FAQ) — keeps
 * navigation between the marketing/informational pages consistent instead
 * of relying solely on the Header, which is nav-focused for signed-in use.
 */
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-500 text-sm font-bold text-white">
                E
              </div>
              <div className="text-base font-semibold text-white">EcoVest</div>
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-400">
              A simulated portfolio greenifier — no real money, bank linking, or
              order routing, ever.
            </p>
          </div>

          {LINK_COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {col.title}
              </div>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-300 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
          All figures shown throughout EcoVest are illustrative and simulated
          for demonstration purposes. This is not investment advice.
        </div>
      </div>
    </footer>
  );
}
