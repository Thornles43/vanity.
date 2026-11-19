"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Hourglass, Leaf, History, ScanLine } from "lucide-react";
import ProductCard from "./ProductCard";
import { CATEGORIES } from "@/lib/constants";
import { getExpiryInfo } from "@/lib/expiry";
import type { Category, Product } from "@/lib/types";

interface VaultProps {
  products: Product[];
  loading: boolean;
  loadError: string | null;
  newId: string | null;
  onScan: () => void;
  onRemove: (id: string) => void;
  onRetry: () => void;
}

export default function Vault({
  products,
  loading,
  loadError,
  newId,
  onScan,
  onRemove,
  onRetry,
}: VaultProps) {
  const [category, setCategory] = useState<Category | "Tutte">("Tutte");

  const stats = useMemo(() => {
    let red = 0;
    let yellow = 0;
    let green = 0;
    for (const p of products) {
      const level = getExpiryInfo(p).level;
      if (level === "red") red += 1;
      else if (level === "yellow") yellow += 1;
      else green += 1;
    }
    return { red, yellow, green };
  }, [products]);

  const visible = useMemo(() => {
    const order = { red: 0, yellow: 1, green: 2 } as const;
    return products
      .filter((p) => category === "Tutte" || p.category === category)
      .sort((a, b) => {
        const ia = getExpiryInfo(a);
        const ib = getExpiryInfo(b);
        if (order[ia.level] !== order[ib.level]) {
          return order[ia.level] - order[ib.level];
        }
        return ia.daysLeft - ib.daysLeft;
      });
  }, [products, category]);

  return (
    <div className="flex flex-col pb-6">
      <section className="flex flex-col gap-2 px-margin pb-2 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="font-serif text-[26px] font-medium italic tracking-tight text-on-surface">
            Il Tuo Scrigno
          </h1>
          <span className="shrink-0 border-b border-primary-container/40 pb-0.5 text-[11px] font-medium uppercase tracking-wider text-primary">
            {products.length} Elisir
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="shadow-luxe rounded-xl border border-gold/30 bg-white p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">Freschi</span>
              <Leaf className="h-4 w-4 text-gold" strokeWidth={1.8} />
            </div>
            <p className="mt-2 font-serif text-[22px] font-semibold text-on-surface">{stats.green}</p>
          </div>
          <div className="shadow-luxe rounded-xl border border-primary-container/40 bg-white p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-container">60 giorni</span>
              <Hourglass className="h-4 w-4 text-primary-container" strokeWidth={1.8} />
            </div>
            <p className="mt-2 font-serif text-[22px] font-semibold text-primary">{stats.yellow}</p>
          </div>
          <div className="shadow-luxe rounded-xl border border-error/25 bg-white p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-error">Da rinnovare</span>
              <History className="h-4 w-4 text-error" strokeWidth={1.8} />
            </div>
            <p className="mt-2 font-serif text-[22px] font-semibold text-error">{stats.red}</p>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <div className="no-scrollbar mt-2 flex items-center gap-2 overflow-x-auto px-margin py-1">
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] transition-colors ${
                  active
                    ? "bg-on-surface font-medium text-surface shadow-sm"
                    : "border border-outline-variant/70 bg-white font-normal text-on-surface-variant"
                }`}
              >
                {c === "Tutte" ? `Tutti (${products.length})` : c}
              </button>
            );
          })}
        </div>
      )}

      {stats.red > 0 && category === "Tutte" && (
        <div className="mx-margin mt-3 flex items-center gap-2 rounded-xl border border-error/25 bg-error-container px-3 py-2.5 text-[12px] text-on-error-container">
          <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          {stats.red === 1
            ? "1 elisir è da rinnovare: usare prodotti scaduti può irritare la pelle."
            : `${stats.red} elisir sono da rinnovare: usare prodotti scaduti può irritare la pelle.`}
        </div>
      )}

      {loading ? (
        <p className="mt-10 text-center text-[14px] text-on-surface-variant">Carico il tuo Scrigno…</p>
      ) : loadError ? (
        <div className="mt-10 flex flex-col items-center gap-3 px-margin text-center">
          <p className="text-[14px] text-error">{loadError}</p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl border border-outline-variant bg-white px-5 py-2 text-[14px]"
          >
            Riprova
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 px-margin text-center">
          <span className="gilded-border flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-low">
            <ScanLine className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </span>
          <p className="font-serif text-[20px] italic text-on-surface">Il tuo Scrigno è vuoto</p>
          <p className="max-w-[18rem] text-[13px] font-light text-on-surface-variant">
            Scansiona il codice a barre di un prodotto e indica da quando l&apos;hai aperto:
            ti avviserò prima che scada.
          </p>
          <button
            type="button"
            onClick={onScan}
            className="rose-gold-gradient rounded-xl px-6 py-3 font-serif text-[15px] italic tracking-wide text-white shadow-md active:scale-[0.98]"
          >
            Scansiona il primo elisir ✦
          </button>
        </div>
      ) : (
        <ul className="mt-3 flex flex-col gap-3.5 px-margin">
          {visible.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} isNew={p.id === newId} onRemove={onRemove} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
