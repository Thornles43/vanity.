import type { Category, Product, Routine } from "./types";

export const ROUTINE_FILTERS: {
  id: Routine | "all";
  label: string;
  emoji: string;
}[] = [
  { id: "all", label: "Tutti", emoji: "✦" },
  { id: "morning", label: "Rituale Mattino", emoji: "☀️" },
  { id: "night", label: "Rituale Sera", emoji: "🌙" },
  { id: "extra", label: "Elisir Speciali", emoji: "✨" },
];

export const CATEGORIES: (Category | "Tutte")[] = [
  "Tutte",
  "Skincare",
  "Make-up",
  "Labbra",
  "Occhi",
  "Capelli",
];

export const ROUTINE_EMOJI: Record<Routine, string> = {
  morning: "☀️",
  night: "🌙",
  extra: "✨",
};

export const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", brand: "CeraVe", name: "Detergente Schiumogeno", category: "Skincare", routines: ["morning", "night"], emoji: "🧴", size: "236 ml", price: 14, paoMonths: 12, openedDaysAgo: 140 },
  { id: "p2", brand: "The Ordinary", name: "Niacinamide 10% + Zinco 1%", category: "Skincare", routines: ["morning", "night"], emoji: "💧", size: "30 ml", price: 7, paoMonths: 12, openedDaysAgo: 330 },
  { id: "p3", brand: "La Roche-Posay", name: "Anthelios UVMune 400 SPF50+", category: "Skincare", routines: ["morning"], emoji: "🌞", size: "50 ml", price: 19, paoMonths: 6, openedDaysAgo: 168 },
  { id: "p4", brand: "Paula's Choice", name: "Esfoliante BHA 2%", category: "Skincare", routines: ["night", "extra"], emoji: "🫧", size: "118 ml", price: 34, paoMonths: 12, openedDaysAgo: 95 },
  { id: "p5", brand: "Rare Beauty", name: "Soft Pinch Liquid Blush", category: "Make-up", routines: ["morning", "extra"], emoji: "🌸", size: "7,5 ml", price: 24, paoMonths: 12, openedDaysAgo: 210 },
  { id: "p6", brand: "Maybelline", name: "Fit Me Fondotinta Matte", category: "Make-up", routines: ["morning"], emoji: "🎨", size: "30 ml", price: 11, paoMonths: 12, openedDaysAgo: 372 },
  { id: "p7", brand: "Fenty Beauty", name: "Pro Filt'r Correttore", category: "Make-up", routines: ["morning", "extra"], emoji: "🪄", size: "11 ml", price: 31, paoMonths: 12, openedDaysAgo: 60 },
  { id: "p8", brand: "Essence", name: "Lash Princess Mascara", category: "Occhi", routines: ["morning", "extra"], emoji: "👁️", size: "12 ml", price: 6, paoMonths: 3, openedDaysAgo: 78 },
  { id: "p9", brand: "NYX", name: "Epic Ink Eyeliner Waterproof", category: "Occhi", routines: ["extra"], emoji: "🖊️", size: "1 ml", price: 9, paoMonths: 6, openedDaysAgo: 188 },
  { id: "p10", brand: "Laneige", name: "Lip Sleeping Mask Berry", category: "Labbra", routines: ["night"], emoji: "🍓", size: "20 g", price: 24, paoMonths: 12, openedDaysAgo: 120 },
  { id: "p11", brand: "Kiko Milano", name: "Smart Lip Gloss 03", category: "Labbra", routines: ["extra"], emoji: "💋", size: "6 ml", price: 8, paoMonths: 12, openedDaysAgo: 310 },
  { id: "p12", brand: "Olaplex", name: "N°3 Hair Perfector", category: "Capelli", routines: ["extra"], emoji: "💆‍♀️", size: "100 ml", price: 30, paoMonths: 12, openedDaysAgo: 150 },
  { id: "p13", brand: "Garnier", name: "Acqua Micellare Rosa", category: "Skincare", routines: ["night"], emoji: "🌹", size: "400 ml", price: 5, paoMonths: 6, openedDaysAgo: 41 },
  { id: "p14", brand: "Rhode", name: "Peptide Lip Treatment", category: "Labbra", routines: ["morning", "night"], emoji: "🧸", size: "10 ml", price: 18, paoMonths: 12, openedDaysAgo: 25 },
];

/** Prodotti che appaiono quando l'utente "scansiona" un nuovo barcode. */
export const SCAN_QUEUE: Omit<Product, "id" | "openedDaysAgo">[] = [
  { brand: "Glow Recipe", name: "Watermelon Glow Sleeping Mask", category: "Skincare", routines: ["night"], emoji: "🍉", size: "80 ml", price: 55, paoMonths: 12 },
  { brand: "Charlotte Tilbury", name: "Pillow Talk Lipstick", category: "Labbra", routines: ["morning", "extra"], emoji: "💄", size: "3,5 g", price: 38, paoMonths: 24 },
  { brand: "Sol de Janeiro", name: "Bum Bum Cream", category: "Skincare", routines: ["extra"], emoji: "🥥", size: "75 ml", price: 29, paoMonths: 12 },
  { brand: "Urban Decay", name: "All Nighter Setting Spray", category: "Make-up", routines: ["morning", "extra"], emoji: "🌫️", size: "30 ml", price: 33, paoMonths: 24 },
];
