import { describe, expect, it, vi } from "vitest";
import {
  fetchOpenFacts,
  fetchUpcItemDb,
  lookupExternal,
  mapCategory,
  normalizeEan,
} from "./barcode";

function fakeFetch(body: unknown, ok = true): typeof fetch {
  return vi.fn(async () => ({ ok, json: async () => body })) as unknown as typeof fetch;
}

const offline = vi.fn(async () => {
  throw new Error("offline");
}) as unknown as typeof fetch;

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

describe("fetchOpenFacts", () => {
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
    expect(await fetchOpenFacts("h", "8001090123456", f)).toEqual({
      name: "Rossetto Rosso",
      brand: "Kiko",
      category: "Labbra",
      imageUrl: "https://x/y.jpg",
    });
  });

  it("'none' se il codice è sconosciuto (anche con HTTP 404)", async () => {
    expect(await fetchOpenFacts("h", "1", fakeFetch({ status: 0 }))).toBe("none");
    expect(await fetchOpenFacts("h", "1", fakeFetch({ status: 0 }, false))).toBe("none");
  });

  it("'none' se manca il nome", async () => {
    const f = fakeFetch({ status: 1, product: { product_name: "  " } });
    expect(await fetchOpenFacts("h", "1", f)).toBe("none");
  });

  it("'error' se la rete è assente", async () => {
    expect(await fetchOpenFacts("h", "1", offline)).toBe("error");
  });

  it("'error' se la risposta non è JSON valido e HTTP fallisce", async () => {
    const f = vi.fn(async () => ({
      ok: false,
      json: async () => {
        throw new Error("x");
      },
    })) as unknown as typeof fetch;
    expect(await fetchOpenFacts("h", "1", f)).toBe("error");
  });
});

describe("fetchUpcItemDb", () => {
  it("mappa un prodotto", async () => {
    const f = fakeFetch({
      code: "OK",
      items: [
        { title: "Mascara Volume", brand: "Maybelline", category: "Cosmetics", images: ["https://i/1.jpg"] },
      ],
    });
    expect(await fetchUpcItemDb("1", f)).toEqual({
      name: "Mascara Volume",
      brand: "Maybelline",
      category: "Occhi",
      imageUrl: "https://i/1.jpg",
    });
  });

  it("'none' per NOT_FOUND e 'error' per limite giornaliero", async () => {
    expect(await fetchUpcItemDb("1", fakeFetch({ code: "NOT_FOUND" }, false))).toBe("none");
    expect(await fetchUpcItemDb("1", fakeFetch({ code: "EXCEED_LIMIT" }, false))).toBe("error");
  });
});

describe("lookupExternal", () => {
  it("usa la prima fonte che conosce il codice, anche se le altre falliscono", async () => {
    const f = vi.fn(async (url: string) => {
      if (url.includes("openproductsfacts"))
        return { ok: true, json: async () => ({ status: 1, product: { product_name: "Crema X" } }) };
      throw new Error("down");
    }) as unknown as typeof fetch;
    const r = await lookupExternal("8001090123456", f);
    expect(r.product?.name).toBe("Crema X");
    expect(r.allFailed).toBe(false);
  });

  it("allFailed è true solo se tutte le fonti sono irraggiungibili", async () => {
    const r = await lookupExternal("1", offline);
    expect(r).toEqual({ product: null, allFailed: true });
  });

  it("sconosciuto ovunque: product null e allFailed false", async () => {
    const r = await lookupExternal("1", fakeFetch({ status: 0, code: "NOT_FOUND" }, false));
    expect(r).toEqual({ product: null, allFailed: false });
  });
});

describe("mapCategory", () => {
  it("riconosce le categorie principali", () => {
    expect(mapCategory("Face cream")).toBe("Skincare");
    expect(mapCategory("Mascara")).toBe("Occhi");
    expect(mapCategory(undefined)).toBe("Altro");
  });
});
