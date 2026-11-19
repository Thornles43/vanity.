import { describe, expect, it } from "vitest";
import { daysSince, getExpiryInfo } from "./expiry";

const NOW = new Date(2026, 10, 18); // 18 novembre 2026

describe("expiry", () => {
  it("conta i giorni dall'apertura", () => {
    expect(daysSince("2026-10-18", NOW)).toBe(31);
    expect(daysSince("2026-11-18", NOW)).toBe(0);
  });

  it("green: PAO 6 mesi aperto 31 giorni fa", () => {
    const info = getExpiryInfo({ openedOn: "2026-10-18", paoMonths: 6 }, NOW);
    expect(info.daysLeft).toBe(149);
    expect(info.level).toBe("green");
    expect(info.label).toBe("Ancora 4 mesi");
  });

  it("yellow: PAO 3 mesi aperto 31 giorni fa", () => {
    const info = getExpiryInfo({ openedOn: "2026-10-18", paoMonths: 3 }, NOW);
    expect(info.daysLeft).toBe(59);
    expect(info.level).toBe("yellow");
  });

  it("red e scaduto: PAO 6 mesi aperto 214 giorni fa", () => {
    const info = getExpiryInfo({ openedOn: "2026-04-18", paoMonths: 6 }, NOW);
    expect(info.daysLeft).toBe(-34);
    expect(info.level).toBe("red");
    expect(info.label).toBe("Scaduto da 34 g");
    expect(info.remainingPct).toBe(0);
  });

  it("aperto oggi: 100% di vita residua", () => {
    const info = getExpiryInfo({ openedOn: "2026-11-18", paoMonths: 12 }, NOW);
    expect(info.remainingPct).toBe(100);
  });
});
