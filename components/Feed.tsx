"use client";

import { useState } from "react";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  Hourglass,
  Camera,
  Check,
} from "lucide-react";

type FeedTag = "trending" | "dupes" | "shelfie" | "pao";

const FILTERS: { id: FeedTag; label: string; icon: string }[] = [
  { id: "trending", label: "Tendenze Iconiche", icon: "★" },
  { id: "dupes", label: "Segreti & Dupes", icon: "✦" },
  { id: "shelfie", label: "Vanity Mirror", icon: "✧" },
  { id: "pao", label: "Consigli PAO", icon: "⏳" },
];

const SECTIONS: { id: string; tags: FeedTag[]; text: string }[] = [
  {
    id: "spotlight",
    tags: ["trending"],
    text: "rituale pillow talk glow acido ialuronico peptidi labbra incarnato trend settimanale",
  },
  {
    id: "shelfie",
    tags: ["trending", "shelfie"],
    text: "chiaraglow boudoir routine mattina vitamina c pao shelfie glow sublime express detersione spf",
  },
  {
    id: "dupe",
    tags: ["trending", "dupes"],
    text: "dupe segreto crema riparatrice barriera ceramidi centella crème de luxe cica-ceramide silk gel inci",
  },
  {
    id: "bot",
    tags: ["pao"],
    text: "vanity concierge guida pao mascara sguardo scadenza ossidazione rinnovare",
  },
];

interface FeedProps {
  dupeAdded: boolean;
  onAddDupe: () => void;
  onGoVault: () => void;
  onToast: (message: string) => void;
}

export default function Feed({ dupeAdded, onAddDupe, onGoVault, onToast }: FeedProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FeedTag | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dupeLiked, setDupeLiked] = useState(false);

  const q = query.trim().toLowerCase();
  const show = (id: string): boolean => {
    const section = SECTIONS.find((s) => s.id === id);
    if (!section) return false;
    const tagOk = filter === null || section.tags.includes(filter);
    const textOk = q === "" || section.text.includes(q);
    return tagOk && textOk;
  };
  const anyVisible = SECTIONS.some((s) => show(s.id));
  const showBanner = filter === null && q === "";

  return (
    <div className="flex w-full flex-col gap-5 px-margin pb-6">
      {/* Titolo, ricerca e filtri */}
      <section className="flex flex-col gap-3 pt-3">
        <div className="relative py-2 text-center">
          <div className="text-xs text-tertiary-container">✦ ✧ ✦</div>
          <h1 className="mt-0.5 font-serif text-[26px] font-normal italic tracking-tight text-cocoa">
            Beauty Club &amp; Segreti Condivisi
          </h1>
          <p className="text-[12px] font-light tracking-wide text-on-surface-variant">
            I rituali iconici, i dupes perfetti e l&apos;arte del glow senza tempo.
          </p>
        </div>

        <div className="relative w-full">
          <Search
            className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-outline"
            strokeWidth={1.8}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca rituali, dupes iconici, ingredienti elisir..."
            className="rose-border h-11 w-full rounded-full bg-surface-container-lowest pl-10 pr-11 text-[13px] font-light text-on-surface shadow-[0_2px_8px_rgba(128,83,65,0.04)] transition-all placeholder:text-outline-variant focus:border-tertiary-container focus:outline-none focus:ring-1 focus:ring-tertiary-container/30"
          />
          <button
            type="button"
            aria-label="Filtra feed"
            onClick={() => onToast("Filtri avanzati in arrivo")}
            className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-primary transition-colors hover:text-mocha"
          >
            <SlidersHorizontal className="h-[17px] w-[17px]" strokeWidth={1.8} />
          </button>
        </div>

        <div className="no-scrollbar -mx-margin flex gap-2 overflow-x-auto px-margin pb-1 pt-0.5">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(active ? null : f.id)}
                className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                  active
                    ? "gilded-border bg-gradient-to-r from-tertiary-fixed/25 to-surface-container-low text-mocha shadow-sm"
                    : "rose-border bg-surface-container-lowest text-on-surface-variant hover:border-tertiary-container"
                }`}
              >
                <span className={active ? "text-tertiary-container" : "text-primary"}>
                  {f.icon}
                </span>
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {!anyVisible && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <span className="font-serif text-3xl text-tertiary-container">✦</span>
          <p className="font-serif text-[18px] italic text-on-surface">Nessun segreto trovato</p>
          <p className="max-w-[16rem] text-[12px] font-light text-on-surface-variant">
            Prova con un&apos;altra parola chiave o rimuovi il filtro.
          </p>
        </div>
      )}

      {/* Spotlight */}
      {show("spotlight") && (
        <section className="gilded-gradient gilded-border relative w-full overflow-hidden rounded-xl p-4 shadow-[0_4px_16px_rgba(201,147,126,0.12)]">
          <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-tertiary-fixed/20 blur-xl" />
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 rounded-full border border-tertiary-container/40 bg-surface-container-lowest/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-tertiary">
              <span className="text-tertiary-container">✦</span>
              <span>Rituale Icona Settimanale</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-primary">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" strokeWidth={1.5} />
              <span>2.4k nel boudoir</span>
            </div>
          </div>
          <div className="mt-1 flex items-center gap-3.5">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-[19px] font-semibold italic leading-snug text-cocoa">
                Rituale Pillow Talk &amp; Glow ✧
              </h2>
              <p className="mt-1 line-clamp-3 text-[12px] font-light leading-relaxed text-on-surface-variant">
                Il segreto per labbra e incarnato da passerella: infusione di
                acido ialuronico, peptidi rimpolpanti e riflessi soft-focus.
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="rose-border rounded bg-surface-container-lowest/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  4 Step Sublimi
                </span>
                <span className="rounded bg-secondary-fixed/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-on-secondary-fixed-variant">
                  +94% Effetto Seta
                </span>
              </div>
            </div>
            <div className="gilded-border flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-secondary-fixed via-primary-fixed to-tertiary-fixed/60 text-4xl shadow-sm">
              💄
            </div>
          </div>
        </section>
      )}

      {/* Post 1: shelfie PAO */}
      {show("shelfie") && (
        <article className="rose-border flex w-full flex-col rounded-xl bg-surface-container-lowest p-4 shadow-[0_2px_12px_rgba(128,83,65,0.06)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="gilded-border relative flex h-10 w-10 items-center justify-center rounded-full bg-surface p-0.5 text-xl">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-secondary-fixed to-primary-fixed">
                  👩
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-tertiary-container text-[9px] text-white shadow-sm">
                  ✦
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-[14px] font-semibold text-cocoa">Chiaraglow Boudoir</span>
                  <span className="text-[13px] text-tertiary-container" title="Verificato dal Club">★</span>
                </div>
                <p className="text-[11px] uppercase tracking-wider text-outline">
                  Membro Élite • Scrigno D&apos;Oro
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Altre opzioni post"
              onClick={() => onToast("Opzioni in arrivo")}
              className="p-1 text-outline hover:text-cocoa"
            >
              <MoreHorizontal className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </button>
          </div>

          <p className="mb-3 text-[13px] font-light leading-relaxed text-on-surface">
            «Come prolungare la magia del tuo elisir prima del PAO: conservo la
            Vitamina C lontano dalla luce diretta per mantenere intatta la
            freschezza attiva. Mancano 18 giorni al completamento del flacone:
            ogni goccia merita di brillare!»
          </p>

          <div className="rose-border relative flex h-52 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary-fixed via-surface-container-low to-secondary-fixed">
            <span className="text-7xl opacity-90">🧴</span>
            <div className="gilded-border absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-mocha shadow-sm backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tertiary-container" />
              <span>PAO: 18 Giorni di Splendore</span>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-cocoa/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-secondary-fixed backdrop-blur-md">
              <span className="text-[10px] text-tertiary-fixed">✦</span>
              <span>3 Elisir Custoditi nello Scrigno</span>
            </div>
          </div>

          <div className="rose-border mt-3 flex items-center justify-between rounded-lg bg-surface-container-low p-2.5">
            <div className="flex items-center gap-2.5">
              <span className="gilded-border flex h-8 w-8 items-center justify-center rounded bg-surface-container-lowest font-serif text-xs font-bold italic text-primary">
                AM
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-[13px] font-semibold text-cocoa">Glow Sublime Express</span>
                <span className="text-[11px] font-light text-outline">
                  Detersione Vellutata + Vit C + SPF Radioso
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onGoVault}
              className="shrink-0 rounded-full bg-gradient-to-r from-primary-container to-primary px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white shadow-sm transition-opacity hover:opacity-95"
            >
              Replica
            </button>
          </div>

          <div className="mt-3.5 flex items-center justify-between border-t border-primary/10 pt-2.5">
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-pressed={liked}
                onClick={() => setLiked((v) => !v)}
                className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${
                  liked ? "text-primary" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <Heart className="h-[19px] w-[19px]" strokeWidth={1.8} fill={liked ? "currentColor" : "none"} />
                <span>{liked ? 343 : 342}</span>
              </button>
              <button
                type="button"
                onClick={() => onToast("Commenti in arrivo")}
                className="flex items-center gap-1.5 text-[12px] font-medium text-on-surface-variant transition-colors hover:text-primary"
              >
                <MessageCircle className="h-[19px] w-[19px]" strokeWidth={1.8} />
                <span>48</span>
              </button>
              <button
                type="button"
                onClick={() => onToast("Link copiato")}
                className="flex items-center gap-1.5 text-[12px] font-medium text-on-surface-variant transition-colors hover:text-primary"
              >
                <Share2 className="h-[19px] w-[19px]" strokeWidth={1.8} />
                <span>19</span>
              </button>
            </div>
            <button
              type="button"
              aria-label="Custodisci post"
              aria-pressed={saved}
              onClick={() => {
                setSaved((v) => !v);
                onToast(saved ? "Rimosso dai salvati" : "Post custodito ✦");
              }}
              className={`transition-colors ${saved ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}
            >
              <Bookmark className="h-5 w-5" strokeWidth={1.8} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
        </article>
      )}

      {/* Post 2: dupe */}
      {show("dupe") && (
        <article className="rose-border flex w-full flex-col rounded-xl bg-surface-container-lowest p-4 shadow-[0_2px_12px_rgba(128,83,65,0.06)]">
          <div className="mb-2.5 flex items-center justify-between border-b border-primary-container/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="gilded-border rounded-full bg-tertiary-fixed/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-tertiary">
                ✦ Il Segreto Dupe
              </span>
              <span className="text-[11px] font-light text-outline">Certificato dal Club</span>
            </div>
            <span className="rounded bg-secondary-fixed/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-on-secondary-fixed-variant">
              Risparmio 78%
            </span>
          </div>

          <h3 className="mb-1 font-serif text-[17px] font-semibold leading-snug text-cocoa">
            Pelle di Seta: Crema Riparatrice &amp; Barriera d&apos;Oro
          </h3>
          <p className="mb-3 text-[12px] font-light leading-relaxed text-on-surface-variant">
            Analisi comparata delle formule: concentrazione di ceramidi
            biomimetiche 1-3-6 ed estratto puro di centella asiatica identiche
            al test di laboratorio.
          </p>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div className="rose-border flex flex-col rounded-lg bg-surface-container-low p-2.5">
              <div className="rose-border mb-2 flex h-24 items-center justify-center rounded bg-surface text-5xl">🏺</div>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-outline">Icona Haute Beauté</span>
              <span className="truncate font-serif text-[13px] font-semibold text-cocoa">Crème de Luxe Royale</span>
              <span className="mt-0.5 font-serif text-[15px] font-bold italic text-primary">€89,00</span>
            </div>
            <div className="gilded-border relative flex flex-col rounded-lg bg-surface p-2.5">
              <span className="absolute right-1.5 top-1.5 rounded-full bg-tertiary-container px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white">
                Eletto Dupe
              </span>
              <div className="rose-border mb-2 flex h-24 items-center justify-center rounded bg-surface text-5xl">🌿</div>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-tertiary">Alternativa Sublime</span>
              <span className="truncate font-serif text-[13px] font-semibold text-cocoa">Cica-Ceramide Silk Gel</span>
              <span className="mt-0.5 font-serif text-[15px] font-bold italic text-tertiary-container">€19,50</span>
            </div>
          </div>

          <div className="rose-border mb-3 flex items-center justify-between rounded-lg bg-surface-container-high/60 p-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-[17px] w-[17px] text-tertiary-container" strokeWidth={1.8} />
              <span className="text-[11px] font-medium text-cocoa">98% bio-compatibilità molecolare verificata</span>
            </div>
            <button
              type="button"
              onClick={() => onToast("Confronto INCI in arrivo")}
              className="font-serif text-[11px] italic text-primary underline underline-offset-2 hover:text-cocoa"
            >
              INCI Match ✦
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-pressed={dupeLiked}
                onClick={() => setDupeLiked((v) => !v)}
                className={`flex items-center gap-1 text-[12px] font-medium transition-colors ${
                  dupeLiked ? "text-primary" : "text-outline hover:text-primary"
                }`}
              >
                <Heart className="h-[18px] w-[18px]" strokeWidth={1.8} fill={dupeLiked ? "currentColor" : "none"} />
                <span>{dupeLiked ? 892 : 891}</span>
              </button>
              <button
                type="button"
                onClick={() => onToast("Commenti in arrivo")}
                className="flex items-center gap-1 text-[12px] font-medium text-outline transition-colors hover:text-primary"
              >
                <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.8} />
                <span>112</span>
              </button>
            </div>
            <button
              type="button"
              onClick={onAddDupe}
              disabled={dupeAdded}
              className="gilded-border flex items-center gap-1.5 rounded-full bg-gradient-to-r from-tertiary-fixed/40 via-surface-container-low to-primary-container/30 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-mocha transition-colors hover:bg-tertiary-fixed/50 disabled:opacity-80"
            >
              {dupeAdded ? (
                <>
                  <Check className="h-3.5 w-3.5 text-tertiary-container" strokeWidth={2} />
                  <span>Nello Scrigno</span>
                </>
              ) : (
                <>
                  <span className="text-[12px] text-tertiary-container">✦</span>
                  <span>Aggiungi Dupe allo Scrigno</span>
                </>
              )}
            </button>
          </div>
        </article>
      )}

      {/* Post 3: Concierge PAO */}
      {show("bot") && (
        <article className="gilded-gradient gilded-border flex w-full flex-col rounded-xl p-4 shadow-[0_2px_12px_rgba(128,83,65,0.05)]">
          <div className="mb-2.5 flex items-center gap-2.5 border-b border-primary-container/25 pb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cocoa text-tertiary-fixed">
              <Hourglass className="h-[17px] w-[17px]" strokeWidth={1.8} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-[13px] font-semibold text-cocoa">Vanity Concierge</span>
                <span className="rounded border border-primary/20 bg-surface-container-lowest/80 px-1.5 text-[8px] font-semibold uppercase tracking-wider text-primary">
                  Guida PAO
                </span>
              </div>
              <p className="text-[10px] font-light text-outline">La salute dello sguardo &amp; longevità delle formule</p>
            </div>
          </div>
          <h4 className="mb-1.5 font-serif text-[16px] font-semibold italic text-cocoa">
            Il fascino dello sguardo: quando rinnovare il mascara? ✦
          </h4>
          <p className="mb-3 text-[12px] font-light leading-relaxed text-on-surface-variant">
            Il periodo dopo l&apos;apertura (PAO) per i cosmetici perioculari non
            ammette compromessi. I 3 segnali per rinnovare la magia in sicurezza:
          </p>
          <div className="mb-3 flex flex-col gap-2">
            {[
              ["I", "Variazione olfattiva o consistenza alterata: segnale inequivocabile di ossidazione formulistica."],
              ["II", "Texture sfibrata sullo scovolino couture che rilascia polvere sulle ciglia."],
              ["III", "Lieve sensibilità al momento della stesura: preserva sempre la barriera lacrimale."],
            ].map(([n, t]) => (
              <div key={n} className="rose-border flex items-start gap-2.5 rounded-lg bg-surface-container-lowest/90 p-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed/50 text-[9px] font-bold text-tertiary">
                  {n}
                </span>
                <span className="text-[11px] font-light leading-snug text-on-surface">{t}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] italic text-outline">1 mascara in scadenza nel tuo Scrigno</span>
            <button
              type="button"
              onClick={onGoVault}
              className="rose-border rounded-full bg-surface-container-lowest px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-primary transition-colors hover:border-tertiary-container"
            >
              Verifica Scrigno ✦
            </button>
          </div>
        </article>
      )}

      {/* Banner shelfie */}
      {showBanner && (
        <section className="relative flex w-full flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-cocoa via-mocha to-primary p-4 text-white shadow-[0_4px_20px_rgba(49,19,6,0.18)]">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-tertiary-container/20 blur-2xl" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-serif text-[17px] italic text-tertiary-fixed">
                Condividi il tuo Vanity Shelfie ✦
              </span>
              <span className="mt-0.5 text-[11px] font-light text-surface-container-low/80">
                Ispira le amiche del Club e ricevi la Spilla &apos;Icona di Stile&apos;.
              </span>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tertiary-fixed/40 bg-tertiary-fixed/20 text-base text-tertiary-fixed">
              ✦
            </div>
          </div>
          <div className="mt-1 flex gap-2.5">
            <button
              type="button"
              onClick={() => onToast("Creazione pronta per Le Club de Beauté!")}
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-tertiary-fixed to-tertiary-fixed-dim text-[11px] font-semibold uppercase tracking-widest text-cocoa shadow-sm transition-opacity hover:opacity-95"
            >
              <Camera className="h-4 w-4" strokeWidth={1.8} />
              <span>Pubblica nello Scrigno</span>
            </button>
            <button
              type="button"
              aria-label="Invita al Club"
              onClick={() => onToast("Invito inviato al Club ✦")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-tertiary-fixed transition-colors hover:bg-white/15"
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
