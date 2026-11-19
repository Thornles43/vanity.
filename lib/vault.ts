import { supabase } from "./supabase";
import type { Category, Product } from "./types";

interface VaultRow {
  id: string;
  opened_on: string;
  pao_months: number;
  catalog_products: {
    id: string;
    barcode: string | null;
    name: string;
    brand: string | null;
    category: string | null;
    image_url: string | null;
  };
}

export async function listVault(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("vault_items")
    .select(
      "id, opened_on, pao_months, catalog_products(id, barcode, name, brand, category, image_url)"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error("Impossibile caricare il tuo Scrigno.");

  return (data as unknown as VaultRow[]).map((r) => ({
    id: r.id,
    catalogId: r.catalog_products.id,
    barcode: r.catalog_products.barcode,
    name: r.catalog_products.name,
    brand: r.catalog_products.brand,
    category: (r.catalog_products.category as Category) ?? "Altro",
    imageUrl: r.catalog_products.image_url,
    openedOn: r.opened_on,
    paoMonths: r.pao_months,
  }));
}

export async function addToVault(input: {
  catalogId: string;
  openedOn: string;
  paoMonths: number;
}): Promise<string> {
  const { data, error } = await supabase
    .from("vault_items")
    .insert({
      catalog_id: input.catalogId,
      opened_on: input.openedOn,
      pao_months: input.paoMonths,
    })
    .select("id")
    .single();
  if (error) throw new Error("Impossibile aggiungere il prodotto allo Scrigno.");
  return (data as { id: string }).id;
}

export async function removeFromVault(id: string): Promise<void> {
  const { error } = await supabase.from("vault_items").delete().eq("id", id);
  if (error) throw new Error("Impossibile rimuovere il prodotto.");
}

export function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
