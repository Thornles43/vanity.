"use client";

import { useState } from "react";
import { X } from "lucide-react";
import BarcodeScanner from "./BarcodeScanner";
import { normalizeEan } from "@/lib/barcode";
import { lookupBarcode, saveCatalogProduct } from "@/lib/catalog";
import { CATEGORY_LIST, PAO_CHOICES } from "@/lib/constants";
import { addToVault, todayIso } from "@/lib/vault";
import type { CatalogProduct, Category } from "@/lib/types";

interface ScanFlowProps {
  onClose: () => void;
  onAdded: (name: string, id: string) => void;
}

type Stage =
  | { kind: "scan" }
  | { kind: "looking"; ean: string }
  | {
      kind: "form";
      ean: string | null;
      found: CatalogProduct | null;
      offline?: boolean;
    };

export default function ScanFlow({ onClose, onAdded }: ScanFlowProps) {
  const [stage, setStage] = useState<Stage>({ kind: "scan" });
  const [cameraProblem, setCameraProblem] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  // campi del form
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<Category>("Skincare");
  const [openedOn, setOpenedOn] = useState(todayIso());
  const [pao, setPao] = useState(12);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleCode = async (ean: string) => {
    setStage({ kind: "looking", ean });
    const { product, allFailed } = await lookupBarcode(ean);
    setStage({ kind: "form", ean, found: product, offline: allFailed });
  };

  const submitManualCode = () => {
    const ean = normalizeEan(manualCode);
    if (!ean) {
      setCodeError("Codice non valido: servono 8, 12, 13 o 14 cifre.");
      return;
    }
    setCodeError(null);
    void handleCode(ean);
  };

  const save = async () => {
    if (stage.kind !== "form") return;
    setSaving(true);
    setSaveError(null);
    try {
      const product =
        stage.found ??
        (await saveCatalogProduct({
          barcode: stage.ean,
          name: name.trim(),
          brand: brand.trim() || null,
          category,
          source: "user",
        }));
      const id = await addToVault({
        catalogId: product.id,
        openedOn,
        paoMonths: pao,
      });
      onAdded(product.name, id);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Errore. Riprova.");
      setSaving(false);
    }
  };

  const canSave =
    !saving &&
    pao >= 1 &&
    pao <= 60 &&
    openedOn !== "" &&
    (stage.kind === "form" && (stage.found !== null || name.trim().length > 0));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-surface">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col gap-4 px-margin pb-10 pt-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-[22px] italic text-on-surface">
            {stage.kind === "form" ? "Nuovo elisir" : "Scansiona"}
          </h2>
          <button
            type="button"
            aria-label="Chiudi"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {stage.kind === "scan" && (
          <>
            {cameraProblem ? (
              <p className="rounded-xl border border-error/30 bg-error-container p-3 text-[13px] text-on-error-container">
                {cameraProblem}
              </p>
            ) : (
              <BarcodeScanner
                onDetect={handleCode}
                onError={(r) =>
                  setCameraProblem(
                    r === "denied"
                      ? "Non ho il permesso di usare la fotocamera. Consentilo nelle impostazioni del browser oppure inserisci il codice a mano."
                      : "Questo browser non può leggere i codici a barre. Inserisci il codice a mano."
                  )
                }
              />
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-on-surface-variant" htmlFor="manual-code">
                Oppure scrivi il codice a barre
              </label>
              <div className="flex gap-2">
                <input
                  id="manual-code"
                  inputMode="numeric"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="es. 8001090123456"
                  className="min-w-0 flex-1 rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-[15px] outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={submitManualCode}
                  className="rounded-xl bg-primary px-4 text-[14px] text-white"
                >
                  Cerca
                </button>
              </div>
              {codeError && <p className="text-[12px] text-error">{codeError}</p>}
            </div>

            <button
              type="button"
              onClick={() => setStage({ kind: "form", ean: null, found: null })}
              className="text-[13px] text-primary underline-offset-4 hover:underline"
            >
              Il prodotto non ha il codice? Aggiungilo a mano
            </button>
          </>
        )}

        {stage.kind === "looking" && (
          <p className="mt-10 text-center text-[14px] text-on-surface-variant">
            Cerco il prodotto {stage.ean}…
          </p>
        )}

        {stage.kind === "form" && (
          <div className="flex flex-col gap-4">
            {stage.found ? (
              <div className="flex items-center gap-3 rounded-xl border border-gold/30 bg-white p-3">
                {stage.found.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={stage.found.imageUrl}
                    alt=""
                    className="h-16 w-16 rounded-lg object-contain"
                  />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-container-low text-3xl">
                    🧴
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-primary">
                    {stage.found.brand ?? "—"}
                  </p>
                  <p className="font-serif text-[17px] text-on-surface">{stage.found.name}</p>
                  <p className="text-[11px] text-on-surface-variant">{stage.found.category}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {stage.ean && (
                  <p className="rounded-xl bg-surface-container-low p-3 text-[13px] text-on-surface-variant">
                    {stage.offline
                      ? `Non riesco a contattare le banche dati (connessione assente o bloccata). Il codice letto è ${stage.ean}: puoi inserire i dati a mano.`
                      : `Il codice ${stage.ean} non è in nessuna banca dati che consulto. Inserisci i dati una volta sola: dalla prossima scansione lo ritroverò da solo.`}
                  </p>
                )}
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome del prodotto *"
                  className="rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-[15px] outline-none focus:border-primary"
                />
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Marca"
                  className="rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-[15px] outline-none focus:border-primary"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-[15px]"
                >
                  {CATEGORY_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="opened-on" className="text-[12px] text-on-surface-variant">
                Data di apertura
              </label>
              <input
                id="opened-on"
                type="date"
                max={todayIso()}
                value={openedOn}
                onChange={(e) => setOpenedOn(e.target.value)}
                className="rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-[15px]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] text-on-surface-variant">
                PAO: mesi di validità dopo l&apos;apertura (il simbolo del barattolo aperto)
              </span>
              <div className="flex flex-wrap gap-2">
                {PAO_CHOICES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={pao === m}
                    onClick={() => setPao(m)}
                    className={`rounded-full border px-3.5 py-1.5 text-[13px] ${
                      pao === m
                        ? "border-primary bg-primary text-white"
                        : "border-outline-variant bg-white text-on-surface-variant"
                    }`}
                  >
                    {m}M
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1}
                max={60}
                value={pao}
                onChange={(e) => setPao(Number(e.target.value))}
                className="w-28 rounded-xl border border-outline-variant bg-white px-3 py-2 text-[15px]"
                aria-label="Mesi PAO personalizzati"
              />
            </div>

            {saveError && <p role="alert" className="text-[13px] text-error">{saveError}</p>}

            <button
              type="button"
              disabled={!canSave}
              onClick={save}
              className="rose-gold-gradient rounded-xl px-6 py-3 font-serif text-[16px] italic text-white shadow-md disabled:opacity-50"
            >
              {saving ? "Salvo…" : "Aggiungi allo Scrigno"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
