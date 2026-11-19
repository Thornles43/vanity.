import { lookupExternal } from "./barcode";
import { supabase } from "./supabase";
import type { CatalogProduct, Category } from "./types";

interface CatalogRow {
  id: string;
  barcode: string | null;
  name: string;
  brand: string | null;
  category: string | null;
  image_url: string | null;
}

export function toCatalogProduct(row: CatalogRow): CatalogProduct {
  return {
    id: row.id,
    barcode: row.barcode,
    name: row.name,
    brand: row.brand,
    category: (row.category as Category) ?? "Altro",
    imageUrl: row.image_url,
  };
}

async function findInCatalog(ean: string): Promise<CatalogProduct | null> {
  const { data, error } = await supabase
    .from("catalog_products")
    .select("id, barcode, name, brand, category, image_url")
    .eq("barcode", ean)
    .maybeSingle();
  if (error || !data) return null;
  return toCatalogProduct(data as CatalogRow);
}

export interface NewCatalogProduct {
  barcode: string | null;
  name: string;
  brand: string | null;
  category: Category;
  imageUrl?: string | null;
  source: "openbeautyfacts" | "user";
}

export async function saveCatalogProduct(
  input: NewCatalogProduct
): Promise<CatalogProduct> {
  const { data, error } = await supabase
    .from("catalog_products")
    .insert({
      barcode: input.barcode,
      name: input.name,
      brand: input.brand,
      category: input.category,
      image_url: input.imageUrl ?? null,
      source: input.source,
    })
    .select("id, barcode, name, brand, category, image_url")
    .single();

  if (error) {
    // Codice già inserito nel frattempo da un altro utente: usiamo quello.
    if (input.barcode && error.code === "23505") {
      const existing = await findInCatalog(input.barcode);
      if (existing) return existing;
    }
    throw new Error("Impossibile salvare il prodotto. Riprova.");
  }
  return toCatalogProduct(data as CatalogRow);
}

export interface LookupResult {
  product: CatalogProduct | null;
  /** true se nessuna banca dati esterna è stata raggiungibile (connessione assente?) */
  allFailed: boolean;
}

/** Catalogo condiviso, poi le banche dati esterne. */
export async function lookupBarcode(ean: string): Promise<LookupResult> {
  const known = await findInCatalog(ean);
  if (known) return { product: known, allFailed: false };

  const { product: external, allFailed } = await lookupExternal(ean);
  if (!external) return { product: null, allFailed };

  try {
    const saved = await saveCatalogProduct({
      barcode: ean,
      name: external.name,
      brand: external.brand,
      category: external.category,
      imageUrl: external.imageUrl,
      source: "openbeautyfacts",
    });
    return { product: saved, allFailed: false };
  } catch {
    return { product: null, allFailed: false };
  }
}
