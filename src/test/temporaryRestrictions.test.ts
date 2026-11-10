import { describe, expect, it } from "vitest";
import { getTemporaryClosure, isProductTemporarilyHidden } from "@/lib/temporaryRestrictions";

describe("November temporary restrictions (Europe/Madrid)", () => {
  it("hides every wing product on November 10 and 11, restoring them on November 12", () => {
    for (const product of ["Menú Alitas", "4 alitas", "7 alitas", "12 alitas", "5 alitas y patatas", "15 alitas y patatas"]) {
      expect(isProductTemporarilyHidden(product, new Date("2026-11-10T12:35:00Z"))).toBe(true);
      expect(isProductTemporarilyHidden(product, new Date("2026-11-11T22:59:59Z"))).toBe(true);
      expect(isProductTemporarilyHidden(product, new Date("2026-11-11T23:00:00Z"))).toBe(false);
    }
    expect(isProductTemporarilyHidden("Menú Kebab", new Date("2026-11-10T12:35:00Z"))).toBe(false);
  });

  it("closes November 10 in Madrid for lack of stock, throughout the entire day", () => {
    const closure = getTemporaryClosure(new Date("2026-11-10T13:00:00Z"));
    expect(closure.closed).toBe(true);
    expect(closure.title).toBe("HOY ESTAMOS CERRADOS");
    expect(closure.detail).toContain("se nos ha agotado el género");
    expect(getTemporaryClosure(new Date("2026-11-09T22:59:59Z")).closed).toBe(false);
  });

  it("closes November 11 in Madrid and reopens on November 12", () => {
    expect(getTemporaryClosure(new Date("2026-11-09T22:59:59Z")).closed).toBe(false);
    expect(getTemporaryClosure(new Date("2026-11-11T13:00:00Z")).closed).toBe(true);
    expect(getTemporaryClosure(new Date("2026-11-11T22:59:59Z")).closed).toBe(true);
    expect(getTemporaryClosure(new Date("2026-11-11T23:00:00Z")).closed).toBe(false);
  });
});