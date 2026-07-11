"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { TransactionRecord } from "@/lib/types";

type SortKey = "createdAt" | "ticker" | "side" | "shares" | "price" | "cashAfter";

interface SortConfig {
  key: SortKey;
  direction: "asc" | "desc";
}

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionRecord[] | null>(null);
  const [sideFilter, setSideFilter] = useState<"ALL" | "BUY" | "SELL" | "BONUS">("ALL");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "createdAt",
    direction: "desc",
  });

  const filteredTransactions = useMemo(() => {
    if (!transactions) return null;
    if (sideFilter === "ALL") return transactions;
    return transactions.filter((t) => t.side === sideFilter);
  }, [transactions, sideFilter]);

  const sortedTransactions = useMemo(() => {
    if (!filteredTransactions) return null;

    const rows = [...filteredTransactions];
    rows.sort((a, b) => {
      let cmp = 0;
      switch (sortConfig.key) {
        case "createdAt":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "ticker":
          cmp = a.ticker.localeCompare(b.ticker);
          break;
        case "side":
          {
            const sideOrder: Record<TransactionRecord["side"], number> = {
              BUY: 0,
              SELL: 1,
              BONUS: 2,
            };
            cmp = sideOrder[a.side] - sideOrder[b.side];
          }
          break;
        case "shares":
          cmp = a.shares - b.shares;
          break;
        case "price":
          cmp = a.price - b.price;
          break;
        case "cashAfter":
          cmp = a.cashAfter - b.cashAfter;
          break;
      }

      return sortConfig.direction === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [filteredTransactions, sortConfig]);

  function handleSort(key: SortKey) {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  }

  function sortGlyph(key: SortKey): string {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  }

  function ariaSortFor(key: SortKey): "none" | "ascending" | "descending" {
    if (sortConfig.key !== key) return "none";
    return sortConfig.direction === "asc" ? "ascending" : "descending";
  }

  useEffect(() => {
    (async () => {
      const accountRes = await fetch("/api/account");
      if (accountRes.status === 401) {
        router.push("/login");
        return;
      }
      const accountJson = await accountRes.json();
      if (accountRes.ok && !accountJson.profileComplete) {
        router.push("/profile");
        return;
      }

      const res = await fetch("/api/transactions");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (res.ok) setTransactions(json.transactions);
    })();
  }, [router]);

  return (
    <>
      <Header authed />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="animate-fade-in-up mb-1 text-2xl font-bold text-navy-900">
          Transaction History
        </h1>
        <p className="animate-fade-in-up mb-6 text-sm text-slate-500" style={{ animationDelay: "40ms" }}>
          Every simulated trade you&apos;ve made, most recent first.
        </p>

        <div className="animate-fade-in-up mb-4 flex flex-wrap items-center gap-3" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-1">
            {([
              { key: "ALL", label: "All" },
              { key: "BUY", label: "Buy" },
              { key: "SELL", label: "Sell" },
              { key: "BONUS", label: "Bonus" },
            ] as const).map((option) => {
              const active = sideFilter === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSideFilter(option.key)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-navy-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-navy-900"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {sortedTransactions && (
            <span className="text-sm text-slate-500">
              {sortedTransactions.length} row{sortedTransactions.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        <div className="animate-fade-in-up card overflow-x-auto" style={{ animationDelay: "80ms" }}>
          {!sortedTransactions ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-9 rounded-lg" />
              ))}
            </div>
          ) : sortedTransactions.length === 0 ? (
            transactions && transactions.length > 0 ? (
              <p className="text-sm text-slate-500">No matching rows for this filter yet.</p>
            ) : (
              <p className="text-sm text-slate-500">
                No trades yet. Buy something from Browse or try the sample portfolio.
              </p>
            )
          ) : (
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3" aria-sort={ariaSortFor("createdAt")}>
                    <button
                      type="button"
                      onClick={() => handleSort("createdAt")}
                      className="inline-flex items-center gap-1 transition hover:text-slate-700"
                    >
                      Date
                      <span aria-hidden="true" className="text-[10px]">{sortGlyph("createdAt")}</span>
                    </button>
                  </th>
                  <th className="py-2 pr-3" aria-sort={ariaSortFor("ticker")}>
                    <button
                      type="button"
                      onClick={() => handleSort("ticker")}
                      className="inline-flex items-center gap-1 transition hover:text-slate-700"
                    >
                      Ticker
                      <span aria-hidden="true" className="text-[10px]">{sortGlyph("ticker")}</span>
                    </button>
                  </th>
                  <th className="py-2 pr-3" aria-sort={ariaSortFor("side")}>
                    <button
                      type="button"
                      onClick={() => handleSort("side")}
                      className="inline-flex items-center gap-1 transition hover:text-slate-700"
                    >
                      Side
                      <span aria-hidden="true" className="text-[10px]">{sortGlyph("side")}</span>
                    </button>
                  </th>
                  <th className="py-2 pr-3" aria-sort={ariaSortFor("shares")}>
                    <button
                      type="button"
                      onClick={() => handleSort("shares")}
                      className="inline-flex items-center gap-1 transition hover:text-slate-700"
                    >
                      Shares
                      <span aria-hidden="true" className="text-[10px]">{sortGlyph("shares")}</span>
                    </button>
                  </th>
                  <th className="py-2 pr-3" aria-sort={ariaSortFor("price")}>
                    <button
                      type="button"
                      onClick={() => handleSort("price")}
                      className="inline-flex items-center gap-1 transition hover:text-slate-700"
                    >
                      Price
                      <span aria-hidden="true" className="text-[10px]">{sortGlyph("price")}</span>
                    </button>
                  </th>
                  <th className="py-2 pr-3" aria-sort={ariaSortFor("cashAfter")}>
                    <button
                      type="button"
                      onClick={() => handleSort("cashAfter")}
                      className="inline-flex items-center gap-1 transition hover:text-slate-700"
                    >
                      Cash After
                      <span aria-hidden="true" className="text-[10px]">{sortGlyph("cashAfter")}</span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((t, i) => (
                  <tr
                    key={t.id}
                    className="animate-fade-in-up border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50"
                    style={{ animationDelay: `${100 + Math.min(i, 20) * 20}ms` }}
                  >
                    <td className="py-2 pr-3 text-slate-600">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 font-medium text-navy-900">{t.ticker}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`badge ${
                          t.side === "BUY"
                            ? "bg-forest-500/10 text-forest-600"
                            : t.side === "BONUS"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {t.side === "BONUS" ? "🌱 Bonus" : t.side}
                      </span>
                    </td>
                    <td className="py-2 pr-3">{t.side === "BONUS" ? "—" : t.shares}</td>
                    <td className="py-2 pr-3">
                      {t.side === "BONUS" ? (
                        <span className="font-medium text-forest-600">+${t.price.toFixed(2)}</span>
                      ) : (
                        `$${t.price.toFixed(2)}`
                      )}
                    </td>
                    <td className="py-2 pr-3">${t.cashAfter.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
