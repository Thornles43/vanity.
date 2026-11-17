"use client";

import { useMemo, useState } from "react";
import {
  Award,
  Bell,
  CloudUpload,
  ChevronRight,
  Gem,
  LogOut,
  Moon,
  PiggyBank,
  Share,
  Sun,
  Hourglass,
  ShieldCheck,
  Sparkles,
  Archive,
  Flower2,
} from "lucide-react";
import type { Product } from "@/lib/types";

const BADGES = [
  { Icon: Award, name: "Regina dello Scrigno", sub: "0 scadenze gettate" },
  { Icon: ShieldCheck, name: "Ispettrice PAO", sub: "30+ codici tracciati" },
  { Icon: Sun, name: "Fedele al Solare", sub: "SPF quotidiano" },
  { Icon: Archive, name: "Collezione Flaconi", sub: "12 boccette terminate" },
];

const RITUALS = [
  {
    id: "am",
    Icon: Sun,
    iconTone: "text-primary-container",
    name: "Rituale Glow del Mattino",
    meta: "4 Passaggi • Radiosità e Difesa",
    metaTone: "text-primary",
    steps: ["1. Balsamo Detergente", "2. Elisir Vitamina C", "3. Magic Cream", "4. Filtro Invisibile SPF 50"],
  },
  {
    id: "pm",
    Icon: Moon,
    iconTone: "text-secondary",
    name: "Trattamento Notturno Rigenerante",
    meta: "3 Passaggi • Rinnovamento Barriera",
    metaTone: "text-secondary",
    steps: ["1. Olio Prezioso", "2. Retinolo e Peptidi", "3. Crema Barriera Notte"],
  },
];

interface ProfileProps {
  products: Product[];
  onToast: (message: string) => void;
  onLogout: () => void;
}

export default function Profile({ products, onToast, onLogout }: ProfileProps) {
  const [pushOn, setPushOn] = useState(true);
  const [freq, setFreq] = useState<Record<string, boolean>>({
    d30: true,
    d7: true,
    d0: false,
  });

  const totalValue = useMemo(
    () => Math.round(products.reduce((sum, p) => sum + p.price, 0)),
    [products]
  );

  const toggleFreq = (key: string) =>
    setFreq((prev) => ({ ...prev, [key]: !prev[key] }));

  const FREQS: { key: string; label: string }[] = [
    { key: "d30", label: "30gg prima" },
    { key: "d7", label: "7gg prima" },
    { key: "d0", label: "Giorno X" },
  ];

  const sectionTitle = (Icon: typeof Gem, text: string) => (
    <div className="flex items-center gap-2">
      <Icon className="h-[19px] w-[19px] text-primary-container" strokeWidth={1.6} />
      <h2 className="font-serif text-[20px] font-medium text-cocoa">{text}</h2>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-6 px-margin py-5">
      {/* Ritratto */}
      <section className="relative flex flex-col items-center overflow-hidden border border-[#e8ded7] bg-surface-container-lowest p-6 text-center shadow-luxe-lg">
        <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-tertiary-fixed/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-secondary-fixed/30 blur-xl" />

        <div className="relative mb-3">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-primary-container via-[#f3e5ab] to-primary p-[3px] shadow-md">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-secondary-fixed to-primary-fixed text-5xl">
              👩‍🎤
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full border border-[#d4af37] bg-mocha px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-tertiary-fixed shadow-sm">
            ★ Lv. 4
          </span>
        </div>

        <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-low px-3.5 py-1 text-primary">
          <Sparkles className="h-3.5 w-3.5 text-tertiary-container" strokeWidth={1.8} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
            Étoile de Beauté • Livello 4 ✦
          </span>
        </div>
        <h1 className="mt-1 font-serif text-[28px] italic tracking-wide text-cocoa">Giulia Rossi</h1>
        <span className="text-[11px] uppercase tracking-wider text-primary">
          @glowgiulia • Boudoir Archivist
        </span>
        <p className="mt-2.5 max-w-xs text-[14px] font-light italic leading-relaxed text-on-surface-variant">
          Custode di texture celestiali, rituali sartoriali e formule preziose.
          Nessun elisir dimenticato ✦
        </p>

        <div className="mt-4 flex w-full items-center justify-between border border-[#e8ded7] bg-surface-container-low px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Flower2 className="h-[18px] w-[18px] text-tertiary-container" strokeWidth={1.6} />
            <span className="text-[13px] font-medium text-mocha">
              Continuità del Rituale: <strong className="font-semibold text-primary">28 giorni</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => onToast("Modifica profilo in arrivo")}
            className="border border-primary-container bg-surface-container-lowest px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-primary shadow-sm transition-all hover:bg-primary-container hover:text-white"
          >
            Modifica
          </button>
        </div>
      </section>

      {/* Statistiche */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          {sectionTitle(Gem, "Statistiche Archivio")}
          <span className="border-b border-primary-container/40 pb-0.5 text-[10px] uppercase tracking-wider text-primary">
            Aggiornato Oggi
          </span>
        </div>
        <div className="mt-1 grid grid-cols-2 gap-3">
          <div className="relative col-span-2 overflow-hidden border border-[#e2d6cf] bg-gradient-to-r from-[#fdf7f3] via-[#fbf2ec] to-[#f7ece5] p-5 shadow-sm">
            <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 translate-x-4 -translate-y-4 rounded-full bg-primary-container/10 blur-xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Valore dello Scrigno
                </span>
                <span className="mt-0.5 font-serif text-[38px] leading-none text-cocoa">
                  {totalValue}€
                </span>
                <span className="mt-1.5 flex items-center gap-1 text-[12px] font-light text-on-surface-variant">
                  <span className="h-1.5 w-1.5 rounded-full bg-tertiary-container" />
                  {products.length} creazioni di bellezza registrate
                </span>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary-container bg-white text-primary-container shadow-[0_4px_12px_rgba(201,147,126,0.2)]">
                <Archive className="h-7 w-7" strokeWidth={1.4} />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between border border-[#e8ded7] bg-surface-container-lowest p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e2d6cf] bg-surface-container-low text-primary">
                <Hourglass className="h-[17px] w-[17px]" strokeWidth={1.6} />
              </div>
              <span className="rounded-sm border border-tertiary-fixed bg-tertiary-fixed/30 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-tertiary">
                +3 m/m
              </span>
            </div>
            <div>
              <span className="font-serif text-[26px] text-cocoa">14</span>
              <p className="mt-1 text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-primary">
                Elisir Preservati dalla scadenza
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between border border-[#e8ded7] bg-surface-container-lowest p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e2d6cf] bg-surface-container-low text-primary-container">
                <PiggyBank className="h-[17px] w-[17px]" strokeWidth={1.6} />
              </div>
              <span className="rounded-sm border border-primary-fixed-dim bg-primary-fixed/40 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                Top 5%
              </span>
            </div>
            <div>
              <span className="font-serif text-[26px] text-cocoa">85€</span>
              <p className="mt-1 text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-primary">
                Risparmio Sublime Questo Mese
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Medaglie */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          {sectionTitle(Award, "Medaglie & Traguardi")}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary-container">
            4 / 8 Conquistati
          </span>
        </div>
        <div className="mt-1 grid grid-cols-2 gap-3">
          {BADGES.map(({ Icon, name, sub }) => (
            <div
              key={name}
              className="flex items-center gap-3 border border-[#e2d6cf] bg-surface-container-lowest p-3.5 shadow-sm transition-colors hover:border-primary-container"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d4af37] bg-gradient-to-b from-[#fffaf4] to-[#f5e7da] text-tertiary-container shadow-sm">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-serif text-[13px] font-medium text-cocoa">{name}</span>
                <span className="truncate text-[9px] uppercase tracking-wider text-primary">{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rituali */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          {sectionTitle(Flower2, "I Rituali del Boudoir")}
          <button
            type="button"
            onClick={() => onToast("Creazione rituale in arrivo")}
            className="border-b border-primary-container/50 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary hover:text-mocha"
          >
            + Crea Rituale
          </button>
        </div>
        {RITUALS.map(({ id, Icon, iconTone, name, meta, metaTone, steps }) => (
          <div
            key={id}
            className="group flex flex-col gap-3 border border-[#e2d6cf] bg-surface-container-lowest p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-[#fdf7f3] ${iconTone}`}>
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-[16px] text-cocoa">{name}</h3>
                  <span className={`text-[9px] uppercase tracking-wider ${metaTone}`}>{meta}</span>
                </div>
              </div>
              <ChevronRight className="h-[18px] w-[18px] text-primary transition-transform group-hover:translate-x-0.5" strokeWidth={1.6} />
            </div>
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1 text-on-surface-variant">
              {steps.map((s, i) => (
                <span
                  key={s}
                  className={`whitespace-nowrap border px-2.5 py-1 text-[12px] ${
                    id === "am" && i === 3
                      ? "border-primary-container bg-primary-fixed/40 font-medium text-mocha"
                      : "border-[#e8ded7] bg-surface-container-low"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Impostazioni */}
      <section className="flex flex-col gap-2">
        <div className="px-1">{sectionTitle(Sparkles, "Impostazioni & Concierge")}</div>
        <div className="flex flex-col gap-4 border border-[#e2d6cf] bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e2d6cf] bg-surface-container-low text-primary">
                  <Bell className="h-[17px] w-[17px]" strokeWidth={1.6} />
                </div>
                <div>
                  <span className="block text-[14px] font-medium text-cocoa">Notifiche Scadenze Elisir</span>
                  <span className="text-[12px] font-light text-on-surface-variant">Avvisi anticipati sul ciclo di freschezza</span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={pushOn}
                aria-label="Notifiche scadenze"
                onClick={() => setPushOn((v) => !v)}
                className={`flex h-6 w-11 items-center rounded-full border border-primary/30 p-0.5 shadow-inner transition-all ${
                  pushOn ? "justify-end bg-primary-container" : "justify-start bg-surface-dim"
                }`}
              >
                <span className="block h-5 w-5 rounded-full bg-white shadow-sm" />
              </button>
            </div>
            <div className={`flex items-center gap-2 pl-11 pt-1 transition-opacity ${pushOn ? "" : "opacity-40"}`}>
              {FREQS.map((f) => {
                const on = freq[f.key];
                return (
                  <button
                    key={f.key}
                    type="button"
                    disabled={!pushOn}
                    aria-pressed={on}
                    onClick={() => toggleFreq(f.key)}
                    className={`border px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider ${
                      on
                        ? "border-primary-container bg-surface-container-low text-primary"
                        : "border-[#e2d6cf] text-outline"
                    }`}
                  >
                    {on ? "✓ " : ""}
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px w-full bg-[#e8ded7]" />

          <button
            type="button"
            onClick={() => onToast("Archivio sincronizzato ✦")}
            className="group flex items-center justify-between py-1 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e2d6cf] bg-surface-container-low text-primary">
                <CloudUpload className="h-[17px] w-[17px]" strokeWidth={1.6} />
              </div>
              <div>
                <span className="block text-[14px] font-medium text-cocoa">Archivio Cloud &amp; Scansioni</span>
                <span className="text-[12px] font-light text-on-surface-variant">Ultima sincronizzazione 2 ore fa</span>
              </div>
            </div>
            <ChevronRight className="h-[18px] w-[18px] text-primary transition-transform group-hover:translate-x-0.5" strokeWidth={1.6} />
          </button>

          <div className="h-px w-full bg-[#e8ded7]" />

          <button
            type="button"
            onClick={() => onToast("Link del tuo Boudoir copiato ✦")}
            className="flex w-full items-center justify-center gap-2 border border-[#d4af37]/60 bg-mocha px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-tertiary-fixed shadow-sm transition-colors hover:bg-cocoa"
          >
            <Share className="h-[18px] w-[18px] text-[#d4af37]" strokeWidth={1.6} />
            <span>Condividi il mio Boudoir</span>
          </button>

          <div className="flex items-center justify-center pt-1">
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-error hover:underline"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
              Esci dalla sessione
            </button>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center py-2 text-center text-primary">
        <div className="mb-1 text-[12px] text-[#d4af37]">✦ ✦ ✦</div>
        <p className="text-[10px] font-medium uppercase tracking-[0.25em]">VanityDiary Boudoir Edition</p>
        <p className="mt-0.5 font-serif text-[12px] italic text-on-surface-variant">
          La bellezza custodita nel tempo con suprema grazia.
        </p>
      </div>
    </div>
  );
}
