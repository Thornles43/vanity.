"use client";

import { BadgeCheck, AlertTriangle, Hourglass, Trash2 } from "lucide-react";
import { daysSince, getExpiryInfo } from "@/lib/expiry";
import type { ExpiryLevel, Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
  onRemove: (id: string) => void;
}

const LEVEL_STYLES: Record<
  ExpiryLevel,
  { card: string; dot: string; text: string; bar: string; status: string; Icon: typeof BadgeCheck }
> = {
  green: {
    card: "border-gold/25",
    dot: "bg-gold",
    text: "text-primary",
    bar: "from-gold to-primary-container",
    status: "In piena freschezza",
    Icon: BadgeCheck,
  },
  yellow: {
    card: "border-primary-container/40",
    dot: "bg-primary-container",
    text: "text-primary",
    bar: "from-tertiary-fixed-dim to-primary-container",
    status: "In esaurimento",
    Icon: Hourglass,
  },
  red: {
    card: "border-error/30",
    dot: "bg-error",
    text: "text-error",
    bar: "from-error to-primary-container",
    status: "Da rinnovare",
    Icon: AlertTriangle,
  },
};

export default function ProductCard({ product, isNew, onRemove }: ProductCardProps) {
  const info = getExpiryInfo(product);
  const style = LEVEL_STYLES[info.level];
  const { Icon } = style;
  const opened = daysSince(product.openedOn);

  return (
    <article
      className={`shadow-luxe flex flex-col gap-3 rounded-xl border bg-surface-container-lowest p-4 ${style.card} ${
        isNew ? "animate-popin" : ""
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gold/20 bg-surface-container-low text-4xl">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt="" className="h-full w-full object-contain" />
          ) : (
            "🧴"
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              {product.brand ?? "—"}
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              <span
                role="img"
                aria-label={`Stato: ${style.status}`}
                className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
              />
              <span className={`text-[11px] font-medium tracking-wide ${style.text}`}>
                {style.status}
              </span>
            </span>
          </div>
          <h3 className="mt-0.5 line-clamp-2 font-serif text-[17px] font-semibold text-on-surface">
            {product.name}
          </h3>
          <div className="mt-1.5">
            <span className="rounded-full border border-outline-variant/60 bg-surface px-2.5 py-0.5 text-[11px] text-on-surface-variant">
              {product.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 rounded-lg border border-outline-variant/50 bg-surface-container-low/70 p-2.5">
        <div className="flex items-center justify-between text-[12px]">
          <span className={`flex items-center gap-1 font-medium ${style.text}`}>
            <Icon className="h-[15px] w-[15px]" strokeWidth={1.8} />
            {info.label}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-on-surface-variant">
            PAO {product.paoMonths}M • {info.remainingPct}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${style.bar}`}
            style={{ width: `${info.remainingPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between pt-0.5 text-[11px] text-on-surface-variant">
          <span>Aperto: {opened <= 0 ? "oggi" : `${opened} giorni fa`}</span>
          <button
            type="button"
            aria-label={`Rimuovi ${product.name}`}
            onClick={() => {
              if (window.confirm(`Rimuovere "${product.name}" dal tuo Scrigno?`)) {
                onRemove(product.id);
              }
            }}
            className="flex items-center gap-1 text-error"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Rimuovi
          </button>
        </div>
      </div>
    </article>
  );
}
