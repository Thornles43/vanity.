export type Category =
  | "Skincare"
  | "Make-up"
  | "Labbra"
  | "Occhi"
  | "Capelli"
  | "Altro";

export interface CatalogProduct {
  id: string;
  barcode: string | null;
  name: string;
  brand: string | null;
  category: Category;
  imageUrl: string | null;
}

/** Un esemplare nello Scrigno dell'utente. */
export interface Product {
  id: string;
  catalogId: string;
  barcode: string | null;
  name: string;
  brand: string | null;
  category: Category;
  imageUrl: string | null;
  /** Data di apertura, formato YYYY-MM-DD */
  openedOn: string;
  /** Mesi di validità dopo l'apertura (simbolo PAO) */
  paoMonths: number;
}

export type ExpiryLevel = "green" | "yellow" | "red";

export interface ExpiryInfo {
  level: ExpiryLevel;
  daysLeft: number;
  label: string;
  /** Percentuale di vita residua, da 0 a 100 */
  remainingPct: number;
}
