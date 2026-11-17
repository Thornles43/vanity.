export type Routine = "morning" | "night" | "extra";

export type Category = "Skincare" | "Make-up" | "Labbra" | "Occhi" | "Capelli";

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: Category;
  routines: Routine[];
  emoji: string;
  size: string;
  /** Prezzo di acquisto in euro */
  price: number;
  /** Mesi di validità dopo l'apertura (simbolo PAO sulla confezione) */
  paoMonths: number;
  /** Da quanti giorni il prodotto è stato aperto */
  openedDaysAgo: number;
}

export type ExpiryLevel = "green" | "yellow" | "red";

export interface ExpiryInfo {
  level: ExpiryLevel;
  daysLeft: number;
  label: string;
  /** Percentuale di vita residua, da 0 a 100 */
  remainingPct: number;
}
