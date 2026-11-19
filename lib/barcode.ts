import type { Category } from "./types";

export interface ExternalProduct {
  name: string;
  brand: string | null;
  category: Category;
  imageUrl: string | null;
}

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

/** Cerca un prodotto su Open Beauty Facts. null se non trovato, lento o in errore. */
export async function fetchOpenBeautyFacts(
  ean: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 6000
): Promise<ExternalProduct | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = `https://world.openbeautyfacts.org/api/v2/product/${ean}.json?fields=product_name,brands,categories,image_front_small_url`;
    const res = await fetchImpl(url, { signal: controller.signal });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      status?: number;
      product?: {
        product_name?: string;
        brands?: string;
        categories?: string;
        image_front_small_url?: string;
      };
    };
    const p = data.product;
    if (data.status !== 1 || !p?.product_name?.trim()) return null;
    return {
      name: p.product_name.trim(),
      brand: p.brands?.split(",")[0]?.trim() || null,
      category: mapCategory(p.categories),
      imageUrl: p.image_front_small_url || null,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
