"use client";

import { Archive, ScanLine, Sparkles, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Tab = "vault" | "feed" | "profile";

const TABS: { id: Tab; label: string; Icon: LucideIcon; caption: string }[] = [
  { id: "vault", label: "Scrigno", Icon: Archive, caption: "Beauty Boudoir" },
  { id: "feed", label: "Magia", Icon: Sparkles, caption: "Le Club de Beauté" },
  { id: "profile", label: "Profilo", Icon: UserRound, caption: "Boudoir Privé" },
];

interface AppShellProps {
  tab: Tab;
  onTab: (tab: Tab) => void;
  onScan: () => void;
  children: React.ReactNode;
}

export default function AppShell({ tab, onTab, onScan, children }: AppShellProps) {
  const current = TABS.find((t) => t.id === tab);

  return (
    <div className="relative mx-auto min-h-[100dvh] w-full max-w-md bg-surface">
      <header className="pt-safe fixed left-1/2 top-0 z-40 w-full max-w-md -translate-x-1/2 border-b border-primary-container/25 bg-surface/90 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-margin">
          <div className="flex items-center gap-2.5">
            <span className="gilded-border flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-tertiary-fixed/40 via-surface-container-low to-primary-container/40 shadow-sm">
              <span className="font-serif text-[15px] font-bold italic text-primary">
                VD
              </span>
            </span>
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 font-serif text-[18px] font-semibold leading-none tracking-wide text-mocha">
                VanityDiary
                <span className="star-glow text-[11px] text-tertiary-container">✦</span>
              </span>
              <span className="mt-1 text-[9px] font-medium uppercase leading-none tracking-[0.25em] text-primary-container">
                {current?.caption}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Scansione rapida"
              onClick={onScan}
              className="rose-border flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-sm transition-all hover:border-tertiary-container active:scale-95"
            >
              <ScanLine className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Apri il profilo"
              onClick={() => onTab("profile")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-container to-primary text-white shadow-sm transition-opacity hover:opacity-90 active:scale-95"
            >
              <UserRound className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-[100dvh] bg-surface pb-28 pt-16">{children}</main>

      <nav className="pb-safe fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-primary-container/30 bg-surface/95 shadow-[0_-4px_20px_rgba(128,83,65,0.06)] backdrop-blur-xl">
        <div className="flex h-[72px] items-center justify-around px-margin">
          {TABS.map(({ id, label, Icon }) => {
            const active = id === tab;
            return (
              <button
                key={id}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => onTab(id)}
                className={`relative flex min-w-[72px] flex-col items-center justify-center gap-1 py-1 transition-colors ${
                  active ? "text-primary" : "text-outline hover:text-primary"
                }`}
              >
                <Icon
                  className={`h-[22px] w-[22px] ${active ? "star-glow" : ""}`}
                  strokeWidth={active ? 2 : 1.6}
                />
                <span
                  className={`text-[10px] uppercase tracking-widest ${
                    active ? "font-semibold text-mocha" : "font-medium"
                  }`}
                >
                  {label}
                </span>
                {active && (
                  <span className="mt-0.5 h-1 w-1 rounded-full bg-tertiary-container" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
