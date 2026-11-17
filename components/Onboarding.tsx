"use client";

import { useEffect, useRef, useState } from "react";
import { ScanLine } from "lucide-react";
import ScanViewfinder from "./ScanViewfinder";

interface OnboardingProps {
  onUnlock: () => void;
}

type Phase = "idle" | "scanning" | "done";

export default function Onboarding({ onUnlock }: OnboardingProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
    };
  }, []);

  const startScan = () => {
    if (phase !== "idle") return;
    setPhase("scanning");
    timers.current.push(setTimeout(() => setPhase("done"), 1800));
    timers.current.push(setTimeout(() => onUnlock(), 2600));
  };

  const buttonLabel =
    phase === "idle"
      ? "Scansiona il tuo primo elisir"
      : phase === "scanning"
      ? "Scansione in corso…"
      : "Scrigno sbloccato ✦";

  return (
    <main className="pt-safe pb-safe relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-surface px-margin pb-10 pt-12">
      <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-tertiary-fixed/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-secondary-fixed/40 blur-3xl" />

      <header className="relative z-10 flex items-center gap-3">
        <span className="gilded-border flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-tertiary-fixed/40 via-surface-container-low to-primary-container/40 shadow-sm">
          <span className="font-serif text-lg font-bold italic text-primary">VD</span>
        </span>
        <div className="flex flex-col">
          <span className="font-serif text-[22px] font-semibold leading-none tracking-wide text-mocha">
            VanityDiary
          </span>
          <span className="mt-1 text-[9px] font-semibold uppercase leading-none tracking-[0.28em] text-gold">
            Beauty Boudoir
          </span>
        </div>
      </header>

      <section className="relative z-10 mt-12 text-center">
        <div className="text-xs tracking-[0.4em] text-tertiary-container">✦ ✧ ✦</div>
        <h1 className="mt-3 font-serif text-[38px] font-normal italic leading-[1.1] tracking-tight text-cocoa">
          Scansiona.
          <br />
          Custodisci.
          <br />
          Non sprecare più nulla.
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-[14px] font-light leading-relaxed text-on-surface-variant">
          Il tuo Scrigno di bellezza: elisir, rituali e scadenze in un unico
          posto. Prima l&apos;utilità, poi la magia del Club.
        </p>
      </section>

      <section className="relative z-10 mt-8 flex flex-1 flex-col items-center justify-center">
        {phase === "done" ? (
          <div className="gilded-border flex h-56 w-64 animate-popin flex-col items-center justify-center gap-3 rounded-2xl bg-surface-container-lowest shadow-luxe-lg">
            <span className="font-serif text-5xl text-tertiary-container star-glow">✦</span>
            <p className="text-center font-serif text-[20px] italic leading-snug text-cocoa">
              Primo elisir
              <br />
              custodito
            </p>
          </div>
        ) : (
          <ScanViewfinder active={phase === "scanning"} />
        )}
      </section>

      <footer className="relative z-10 mt-8">
        <button
          type="button"
          onClick={startScan}
          disabled={phase !== "idle"}
          className="rose-gold-gradient flex w-full items-center justify-center gap-2.5 rounded-xl border border-tertiary-fixed/60 px-6 py-4 font-serif text-[17px] italic tracking-wide text-white shadow-md transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-90"
        >
          <ScanLine className="h-5 w-5" strokeWidth={1.8} />
          <span>{buttonLabel}</span>
        </button>
        <p className="mt-4 text-center text-[12px] font-light text-on-surface-variant">
          Nessuna registrazione. Il tuo Scrigno parte da qui.
        </p>
      </footer>
    </main>
  );
}
