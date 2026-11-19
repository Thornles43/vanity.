import type { Category } from "./types";

export const CATEGORY_LIST: Category[] = [
  "Skincare",
  "Make-up",
  "Labbra",
  "Occhi",
  "Capelli",
  "Altro",
];

export const CATEGORIES: (Category | "Tutte")[] = ["Tutte", ...CATEGORY_LIST];

export const PAO_CHOICES = [3, 6, 9, 12, 18, 24];
