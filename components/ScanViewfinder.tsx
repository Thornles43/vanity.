"use client";

interface ScanViewfinderProps {
  /** Se true, il raggio di scansione si muove */
  active: boolean;
  /** Dimensione in classi Tailwind (es. "h-56 w-56") */
  sizeClass?: string;
}

export default function ScanViewfinder({
  active,
  sizeClass = "h-56 w-64",
}: ScanViewfinderProps) {
  const corner = "absolute h-7 w-7 border-2 border-tertiary-fixed-dim/90";
  return (
    <div
      className={`velvet-depth shadow-glow relative ${sizeClass} mx-auto overflow-hidden rounded-2xl border border-primary/30`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(128,83,65,0.28),transparent_60%,rgba(0,0,0,0.6))]" />
      <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-tertiary-fixed/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-primary/25 blur-2xl" />

      <span className="pointer-events-none absolute left-5 top-4 text-xs text-tertiary-fixed-dim/30">✦</span>
      <span className="pointer-events-none absolute bottom-5 left-7 text-xs text-tertiary-fixed-dim/20">✧</span>
      <span className="pointer-events-none absolute right-7 top-4 text-sm text-tertiary-fixed-dim/40">✦</span>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15">
        <span
          className={`font-serif text-[96px] leading-none text-tertiary-fixed ${
            active ? "" : "animate-floaty"
          }`}
        >
          ✦
        </span>
      </div>

      <div className="absolute inset-5">
        <span className={`${corner} left-0 top-0 rounded-tl-sm border-b-0 border-r-0`} />
        <span className={`${corner} right-0 top-0 rounded-tr-sm border-b-0 border-l-0`} />
        <span className={`${corner} bottom-0 left-0 rounded-bl-sm border-r-0 border-t-0`} />
        <span className={`${corner} bottom-0 right-0 rounded-br-sm border-l-0 border-t-0`} />

        {active ? (
          <span className="absolute left-1 right-1 h-[1.5px] animate-scanline bg-gradient-to-r from-transparent via-primary-fixed-dim to-transparent shadow-[0_0_12px_#c9937e]" />
        ) : (
          <span className="absolute left-1 right-1 top-1/2 h-[1.5px] animate-pulse bg-gradient-to-r from-transparent via-primary-fixed-dim to-transparent shadow-[0_0_12px_#c9937e]" />
        )}
      </div>

      <span className="absolute inset-x-0 bottom-2 text-center font-serif text-[11px] italic tracking-wide text-surface-variant/80">
        ✦ Lente di Bellezza HD ✦
      </span>
    </div>
  );
}
