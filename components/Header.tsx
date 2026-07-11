"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import GlobalSearch from "@/components/GlobalSearch";

interface HeaderProps {
  authed?: boolean;
}

const NAV_LINKS = [
  { href: "/account", label: "Account" },
  { href: "/browse", label: "Browse" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
];

// Informational/marketing pages — only shown to signed-out visitors, since
// once a user is authed the navbar is reserved for the core app tabs above.
const PUBLIC_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function Header({ authed = false }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-navy-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href={authed ? "/account" : "/"} className="flex items-center gap-3">
          <Image
            src="/EcoVestIcon.png"
            alt="GROW icon"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-lg object-cover"
          />
          <div>
            <div className="text-lg font-semibold leading-tight">EcoVest</div>
            <div className="text-xs leading-tight text-slate-300">
              Portfolio Greenifier
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-1 lg:flex">
          {authed &&
            NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-white text-navy-900 shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

          {!authed &&
            PUBLIC_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-white text-navy-900 shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-3">
          {authed && <GlobalSearch />}
          <span className="badge hidden bg-slate-800 text-slate-200 xl:inline-flex">
            Simulated portfolio — not real money
          </span>
          {authed ? (
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-glow-slate active:translate-y-0"
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-200 transition hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-forest-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-forest-400 hover:shadow-glow-green active:translate-y-0"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
