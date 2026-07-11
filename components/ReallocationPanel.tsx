"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Holding, ReallocationMove } from "@/lib/types";
import IconChip from "./IconChip";
import StockSparkline from "./StockSparkline";
import { ArrowsShuffleIcon } from "./Icons";
import { generatePriceSeries, seriesChangePercent } from "@/lib/priceHistory";

interface ReallocationPanelProps {
  moves: ReallocationMove[];
  dataset: Holding[];
  onApply?: () => void;
  applying?: boolean;
  applyDisabled?: boolean;
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

type SortKey = "holding" | "trend" | "sector" | "score" | "before" | "after" | "change";
type SortDirection = "asc" | "desc";

export default function ReallocationPanel({
  moves,
  dataset,
  onApply,
  applying,
  applyDisabled,
}: ReallocationPanelProps) {
  const map = new Map(dataset.map((h) => [h.ticker, h]));
  const trendMap = useMemo(
    () =>
      new Map(
        dataset.map((h) => {
          const series = generatePriceSeries(h.ticker, h.avgReturn, h.volatility, h.price, 24);
          return [h.ticker, seriesChangePercent(series)];
        })
      ),
    [dataset]
  );
  const [sortConfig, setSortConfig] = useState<
    { key: SortKey; direction: SortDirection } | null
  >(null);

  function handleSort(key: SortKey) {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: key === "trend" ? "desc" : "asc" };
    });
  }

  function sortGlyph(key: SortKey): string {
    if (sortConfig?.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortConfig?.key !== key) return "none";
    return sortConfig.direction === "asc" ? "ascending" : "descending";
  }

  const sorted = useMemo(() => {
    const rows = [...moves];

    if (!sortConfig) {
      return rows.sort((a, b) => b.delta - a.delta);
    }

    rows.sort((a, b) => {
      const left = map.get(a.ticker);
      const right = map.get(b.ticker);
      let cmp = 0;

      switch (sortConfig.key) {
        case "holding":
          cmp = a.ticker.localeCompare(b.ticker);
          break;
        case "trend":
          cmp = (trendMap.get(a.ticker) ?? 0) - (trendMap.get(b.ticker) ?? 0);
          break;
        case "sector":
          cmp = (left?.sector ?? "").localeCompare(right?.sector ?? "");
          break;
        case "score":
          cmp = (left?.esgScore ?? 0) - (right?.esgScore ?? 0);
          break;
        case "before":
          cmp = a.fromWeight - b.fromWeight;
          break;
        case "after":
          cmp = a.toWeight - b.toWeight;
          break;
        case "change":
          cmp = a.delta - b.delta;
          break;
      }

      return sortConfig.direction === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [map, moves, sortConfig, trendMap]);

  return (
    <div className="card-hover">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <IconChip icon={<ArrowsShuffleIcon className="h-4 w-4" />} color="amber" size="sm" />
          <h3 className="text-sm font-semibold text-navy-900">
            Suggested Reallocation — Before vs. After
          </h3>
        </div>
        {onApply && (
          <button
            onClick={onApply}
            disabled={applying || applyDisabled}
            className="btn-primary text-sm"
          >
            {applying ? "Applying trades…" : "Apply Reallocation"}
          </button>
        )}
      </div>
      <p className="mb-3 text-xs text-slate-500">
        Weight shifted from bottom-quartile clean-energy scorers into top-scoring
        equities and green bond proxies. Illustrative only.
        {onApply &&
          " \"Apply Reallocation\" executes the trades below against your simulated account."}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-1" aria-sort={ariaSortFor("holding")}>
                <button
                  type="button"
                  onClick={() => handleSort("holding")}
                  className="inline-flex items-center gap-1 transition hover:text-slate-700"
                >
                  Holding
                  <span aria-hidden="true" className="text-[10px]">{sortGlyph("holding")}</span>
                </button>
              </th>
              <th className="py-2 pr-3" aria-sort={ariaSortFor("trend")}>
                <button
                  type="button"
                  onClick={() => handleSort("trend")}
                  className="inline-flex items-center gap-1 transition hover:text-slate-700"
                >
                  Trend
                  <span aria-hidden="true" className="text-[10px]">{sortGlyph("trend")}</span>
                </button>
              </th>
              <th className="py-2 pr-3" aria-sort={ariaSortFor("sector")}>
                <button
                  type="button"
                  onClick={() => handleSort("sector")}
                  className="inline-flex items-center gap-1 transition hover:text-slate-700"
                >
                  Sector
                  <span aria-hidden="true" className="text-[10px]">{sortGlyph("sector")}</span>
                </button>
              </th>
              <th className="py-2 pr-3" aria-sort={ariaSortFor("score")}>
                <button
                  type="button"
                  onClick={() => handleSort("score")}
                  className="inline-flex items-center gap-1 transition hover:text-slate-700"
                >
                  Clean-Energy Score
                  <span aria-hidden="true" className="text-[10px]">{sortGlyph("score")}</span>
                </button>
              </th>
              <th className="py-2 pr-3" aria-sort={ariaSortFor("before")}>
                <button
                  type="button"
                  onClick={() => handleSort("before")}
                  className="inline-flex items-center gap-1 transition hover:text-slate-700"
                >
                  Before
                  <span aria-hidden="true" className="text-[10px]">{sortGlyph("before")}</span>
                </button>
              </th>
              <th className="py-2 pr-3" aria-sort={ariaSortFor("after")}>
                <button
                  type="button"
                  onClick={() => handleSort("after")}
                  className="inline-flex items-center gap-1 transition hover:text-slate-700"
                >
                  After
                  <span aria-hidden="true" className="text-[10px]">{sortGlyph("after")}</span>
                </button>
              </th>
              <th className="py-2 pr-3" aria-sort={ariaSortFor("change")}>
                <button
                  type="button"
                  onClick={() => handleSort("change")}
                  className="inline-flex items-center gap-1 transition hover:text-slate-700"
                >
                  Change
                  <span aria-hidden="true" className="text-[10px]">{sortGlyph("change")}</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => {
              const h = map.get(m.ticker);
              const isIncrease = m.delta > 0.0001;
              const isDecrease = m.delta < -0.0001;
              return (
                <tr key={m.ticker} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-1 font-medium text-navy-900">
                    <Link href={`/stock/${m.ticker}`} className="hover:text-forest-600 hover:underline">
                      {m.ticker}
                    </Link>
                    <div className="text-xs font-normal text-slate-500">{m.name}</div>
                  </td>
                  <td className="py-2 pr-3">
                    {h && (
                      <StockSparkline
                        ticker={h.ticker}
                        avgReturn={h.avgReturn}
                        volatility={h.volatility}
                        price={h.price}
                      />
                    )}
                  </td>
                  <td className="py-2 pr-3 text-slate-600">{h?.sector ?? "—"}</td>
                  <td className="py-2 pr-3">
                    <span
                      className={`badge ${
                        (h?.esgScore ?? 0) >= 7.5
                          ? "bg-forest-500/10 text-forest-600"
                          : (h?.esgScore ?? 0) >= 5
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {h?.esgScore ?? "—"}/10
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-slate-600">{pct(m.fromWeight)}</td>
                  <td className="py-2 pr-3 font-medium text-navy-900">{pct(m.toWeight)}</td>
                  <td className="py-2 pr-3">
                    <span
                      className={
                        isIncrease
                          ? "font-medium text-forest-600"
                          : isDecrease
                          ? "font-medium text-red-600"
                          : "text-slate-400"
                      }
                    >
                      {isIncrease ? "▲ +" : isDecrease ? "▼ " : ""}
                      {pct(Math.abs(m.delta))}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
