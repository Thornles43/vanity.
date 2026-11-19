import type { Category } from "./types";

export interface ExternalProduct {
  name: string;
  brand: string | null;
  category: Category;
  imageUrl: string | null;
}

/** "none" = la fonte risponde ma non conosce il codice; "error" = fonte irraggiungibile. */
export type SourceResult = ExternalProduct | "none" | "error";

/** Restituisce il codice solo se è un EAN/UPC plausibile (8, 12, 13 o 14 cifre). */
export function normalizeEan(raw: string): string | null {
  const digits = raw.replace(/\s+/g, "");
  if (!/^\d+$/.test(digits)) return null;
  return [8, 12, 13, 14].includes(digits.length) ? digits : null;
}

export function mapCategory(text: string | undefined | null): Category {
  const t = (text ?? "").toLowerCase();
  if (/lip|labbr|rossetto/.test(t)) return "Labbra";
  if (/eye|occhi|mascara|eyeliner|ombretto/.test(t)) return "Occhi";
  if (/hair|capell|shampoo/.test(t)) return "Capelli";
  if (/make-?up|foundation|fondotinta|blush|cipria|powder|concealer/.test(t))
    return "Make-up";
  if (/skin|face|viso|crema|cream|serum|siero|cleans|detergente|moistur/.test(t))
    return "Skincare";
  return "Altro";
}

async function getJson(
  url: string,
  fetchImpl: typeof fetch,
  timeoutMs: number
): Promise<{ ok: boolean; json: unknown } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { signal: controller.signal });
    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      /* corpo non JSON */
    }
    return { ok: res.ok, json };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Open Beauty / Products / Food Facts: stessa API, host diverso. */
export async function fetchOpenFacts(
  host: string,
  ean: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 6000
): Promise<SourceResult> {
  const url = `https://${host}/api/v2/product/${ean}.json?fields=product_name,brands,categories,image_front_small_url`;
  const res = await getJson(url, fetchImpl, timeoutMs);
  if (!res) return "error";
  const data = res.json as {
    status?: number;
    product?: {
      product_name?: string;
      brands?: string;
      categories?: string;
      image_front_small_url?: string;
    };
  } | null;
  // 404 con status 0 è la risposta normale per "codice sconosciuto"
  if (!res.ok && res.json === null) return "error";
  const p = data?.product;
  if (data?.status !== 1 || !p?.product_name?.trim()) return "none";
  return {
    name: p.product_name.trim(),
    brand: p.brands?.split(",")[0]?.trim() || null,
    category: mapCategory(p.categories),
    imageUrl: p.image_front_small_url || null,
  };
}

/** UPCitemdb, endpoint di prova gratuito (circa 100 ricerche al giorno). */
export async function fetchUpcItemDb(
  ean: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 6000
): Promise<SourceResult> {
  const res = await getJson(
    `https://api.upcitemdb.com/prod/trial/lookup?upc=${ean}`,
    fetchImpl,
    timeoutMs
  );
  if (!res) return "error";
  const data = res.json as {
    code?: string;
    items?: { title?: string; brand?: string; category?: string; images?: string[] }[];
  } | null;
  if (!res.ok && !data?.items) {
    // 404 NOT_FOUND = sconosciuto; altri errori (429 limite giornaliero) = fonte non disponibile
    return data?.code === "NOT_FOUND" ? "none" : "error";
  }
  const item = data?.items?.[0];
  if (!item?.title?.trim()) return "none";
  return {
    name: item.title.trim(),
    brand: item.brand?.trim() || null,
    category: mapCategory(`${item.category ?? ""} ${item.title}`),
    imageUrl: item.images?.[0] || null,
  };
}

const SOURCES: ((ean: string, f: typeof fetch) => Promise<SourceResult>)[] = [
  (ean, f) => fetchOpenFacts("world.openbeautyfacts.org", ean, f),
  (ean, f) => fetchOpenFacts("world.openproductsfacts.org", ean, f),
  (ean, f) => fetchUpcItemDb(ean, f),
  (ean, f) => fetchOpenFacts("world.openfoodfacts.org", ean, f),
];

/** Interroga tutte le fonti insieme; vince la prima, in ordine di priorità, che conosce il codice. */
export async function lookupExternal(
  ean: string,
  fetchImpl: typeof fetch = fetch
): Promise<{ product: ExternalProduct | null; allFailed: boolean }> {
  const results = await Promise.all(SOURCES.map((s) => s(ean, fetchImpl)));
  const hit = results.find(
    (r): r is ExternalProduct => r !== "none" && r !== "error"
  );
  return {
    product: hit ?? null,
    allFailed: !hit && results.every((r) => r === "error"),
  };
}
