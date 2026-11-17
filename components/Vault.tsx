"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Hourglass, Leaf, Package, History } from "lucide-react";
import ProductCard from "./ProductCard";
import { CATEGORIES, ROUTINE_FILTERS } from "@/lib/data";
import { getExpiryInfo } from "@/lib/expiry";
import type { Category, Product, Routine } from "@/lib/types";

interface VaultProps {
  products: Product[];
  newId: string | null;
  onScan: () => void;
}

export default function Vault({ products, newId, onScan }: VaultProps) {
  const [routine, setRoutine] = useState<Routine | "all">("all");
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
      .filter((p) => routine === "all" || p.routines.includes(routine))
      .filter((p) => category === "Tutte" || p.category === category)
      .sort((a, b) => {
        const ia = getExpiryInfo(a);
        const ib = getExpiryInfo(b);
        if (order[ia.level] !== order[ib.level]) {
          return order[ia.level] - order[ib.level];
        }
        return ia.daysLeft - ib.daysLeft;
      });
  }, [products, routine, category]);

  return (
    <div className="flex flex-col pb-6">
      <section className="flex flex-col gap-2 px-margin pb-2 pt-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
            The Magic Vault
          </span>
          <span className="inline-block h-px w-6 bg-gold/40" />
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="font-serif text-[26px] font-medium italic tracking-tight text-on-surface">
            Il Tuo Scrigno di Bellezza
          </h1>
          <span className="shrink-0 border-b border-primary-container/40 pb-0.5 text-[11px] font-medium uppercase tracking-wider text-primary">
            {products.length} Elisir
          </span>
        </div>
        <p className="text-[13px] font-light leading-relaxed text-on-surface-variant">
          La tua collezione curata e il ciclo vitale dei tuoi cosmetici
          d&apos;eccezione.
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="shadow-luxe flex flex-col justify-between rounded-xl border border-gold/30 bg-gradient-to-b from-white to-[#faf4ec] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">Aura</span>
              <Leaf className="h-4 w-4 text-gold" strokeWidth={1.8} />
            </div>
            <div className="mt-2">
              <p className="font-serif text-[22px] font-semibold leading-tight text-on-surface">{stats.green}</p>
              <p className="mt-0.5 text-[11px] font-medium leading-tight text-on-surface">Intatti &amp; Freschi</p>
              <p className="mt-0.5 text-[10px] tracking-tight text-on-surface-variant">Perfetta efficacia</p>
            </div>
          </div>
          <div className="shadow-luxe flex flex-col justify-between rounded-xl border border-primary-container/40 bg-gradient-to-b from-white to-[#fcf3ed] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-container">60 Giorni</span>
              <Hourglass className="h-4 w-4 text-primary-container" strokeWidth={1.8} />
            </div>
            <div className="mt-2">
              <p className="font-serif text-[22px] font-semibold leading-tight text-primary">{stats.yellow}</p>
              <p className="mt-0.5 text-[11px] font-medium leading-tight text-primary">In Esaurimento</p>
              <p className="mt-0.5 text-[10px] tracking-tight text-on-surface-variant">Termina a breve</p>
            </div>
          </div>
          <div className="shadow-luxe flex flex-col justify-between rounded-xl border border-error/25 bg-gradient-to-b from-white to-[#faf0f0] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-error">Attenzione</span>
              <History className="h-4 w-4 text-error" strokeWidth={1.8} />
            </div>
            <div className="mt-2">
              <p className="font-serif text-[22px] font-semibold leading-tight text-error">{stats.red}</p>
              <p className="mt-0.5 text-[11px] font-medium leading-tight text-error">Da Rinnovare</p>
              <p className="mt-0.5 text-[10px] tracking-tight text-on-surface-variant">Scaduti o quasi</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-2 flex flex-col gap-2">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-margin py-1">
          {ROUTINE_FILTERS.map((f) => {
            const active = routine === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setRoutine(f.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] font-medium tracking-wide transition-transform active:scale-95 ${
                  active
                    ? "border-primary bg-gradient-to-r from-primary to-[#a06853] text-white shadow-sm"
                    : "border-gold/25 bg-white text-on-surface-variant hover:border-gold/50"
                }`}
              >
                <span>{f.label}</span>
                <span className="text-[13px]">{f.emoji}</span>
              </button>
            );
          })}
        </div>

        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-margin py-1">
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
                    : "border border-outline-variant/70 bg-white font-normal text-on-surface-variant hover:border-gold"
                }`}
              >
                {c === "Tutte" ? `Tutti (${products.length})` : c}
              </button>
            );
          })}
        </div>
      </div>

      {stats.red > 0 && routine === "all" && category === "Tutte" && (
        <div className="mx-margin mt-3 flex items-center gap-2 rounded-xl border border-error/25 bg-error-container px-3 py-2.5 text-[12px] text-on-error-container">
          <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          {stats.red === 1
            ? "1 elisir è da rinnovare: usare prodotti scaduti può irritare la pelle."
            : `${stats.red} elisir sono da rinnovare: usare prodotti scaduti può irritare la pelle.`}
        </div>
      )}

      <div className="mt-3 px-margin">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-on-surface-variant">
          {visible.length} {visible.length === 1 ? "creazione" : "creazioni"}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 px-margin text-center">
          <span className="gilded-border flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-low">
            <Package className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </span>
          <p className="font-serif text-[20px] italic text-on-surface">Niente qui, per ora</p>
          <p className="max-w-[16rem] text-[13px] font-light text-on-surface-variant">
            Cambia filtro oppure scansiona un nuovo elisir per riempire questo
            rituale.
          </p>
          <button
            type="button"
            onClick={onScan}
            className="rose-gold-gradient rounded-xl border border-tertiary-fixed/60 px-6 py-3 font-serif text-[15px] italic tracking-wide text-white shadow-md transition-all hover:brightness-105 active:scale-[0.98]"
          >
            Scansiona un elisir ✦
          </button>
        </div>
      ) : (
        <ul className="mt-3 flex flex-col gap-3.5 px-margin">
          {visible.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} isNew={p.id === newId} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
