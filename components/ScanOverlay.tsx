"use client";

import ScanViewfinder from "./ScanViewfinder";

export default function ScanOverlay() {
  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-cocoa/90 backdrop-blur-sm">
      <div className="gilded-border rounded-3xl bg-surface-container-lowest p-5 shadow-luxe-lg">
        <ScanViewfinder active />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="font-serif text-[20px] italic text-tertiary-fixed">
          Sto leggendo l&apos;elisir…
        </p>
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary-fixed-dim">
          Scansione Elisir ✦ Codice a barre
        </p>
      </div>
    </div>
  );
}
