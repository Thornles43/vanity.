import { describe, expect, it, vi } from "vitest";
import { fetchOpenBeautyFacts, mapCategory, normalizeEan } from "./barcode";

function fakeFetch(body: unknown, ok = true): typeof fetch {
  return vi.fn(async () => ({ ok, json: async () => body })) as unknown as typeof fetch;
}

describe("normalizeEan", () => {
  it("accetta EAN-13 e toglie gli spazi", () => {
    expect(normalizeEan("8 001090 123456")).toBe("8001090123456");
  });
  it("rifiuta codici non numerici o di lunghezza sbagliata", () => {
    expect(normalizeEan("80 1234")).toBeNull();
    expect(normalizeEan("ABC12345678")).toBeNull();
    expect(normalizeEan("")).toBeNull();
  });
});

describe("fetchOpenBeautyFacts", () => {
  it("mappa un prodotto trovato", async () => {
    const f = fakeFetch({
      status: 1,
      product: {
        product_name: " Rossetto Rosso ",
        brands: "Kiko, Altro",
        categories: "Lipstick",
        image_front_small_url: "https://x/y.jpg",
      },
    });
    expect(await fetchOpenBeautyFacts("8001090123456", f)).toEqual({
      name: "Rossetto Rosso",
      brand: "Kiko",
      category: "Labbra",
      imageUrl: "https://x/y.jpg",
    });
  });

  it("restituisce null se non trovato", async () => {
    expect(await fetchOpenBeautyFacts("1", fakeFetch({ status: 0 }))).toBeNull();
  });

  it("restituisce null se manca il nome", async () => {
    const f = fakeFetch({ status: 1, product: { product_name: "  " } });
    expect(await fetchOpenBeautyFacts("1", f)).toBeNull();
  });

  it("restituisce null in caso di errore di rete", async () => {
    const f = vi.fn(async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    expect(await fetchOpenBeautyFacts("1", f)).toBeNull();
  });

  it("restituisce null se il server risponde con errore", async () => {
    expect(await fetchOpenBeautyFacts("1", fakeFetch({}, false))).toBeNull();
  });
});

describe("mapCategory", () => {
  it("riconosce le categorie principali", () => {
    expect(mapCategory("Face cream")).toBe("Skincare");
    expect(mapCategory("Mascara")).toBe("Occhi");
    expect(mapCategory(undefined)).toBe("Altro");
  });
});
