import { describe, it, expect } from "vitest";
import { buildVCard } from "@core/vcard/buildVCard";

describe("buildVCard", () => {
  it("genera un vCard 3.0 válido con nombre y teléfono", () => {
    const result = buildVCard({ name: "Ana Pérez", phone: "+34 600 111 222" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toContain("BEGIN:VCARD");
      expect(result.data).toContain("VERSION:3.0");
      expect(result.data).toContain("FN:Ana Pérez");
      expect(result.data).toContain("TEL;TYPE=CELL:+34 600 111 222");
      expect(result.data).toContain("END:VCARD");
    }
  });

  it("rechaza nombre vacío", () => {
    const result = buildVCard({ name: "  ", phone: "+34600111222" });
    expect(result.ok).toBe(false);
  });

  it("rechaza teléfono con formato inválido", () => {
    const result = buildVCard({ name: "Ana", phone: "abc" });
    expect(result.ok).toBe(false);
  });

  it("escapa comas y punto y coma en el nombre", () => {
    const result = buildVCard({ name: "Pérez, Ana; López", phone: "+34600111222" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toContain("FN:Pérez\\, Ana\\; López");
    }
  });

  it("incluye campos opcionales solo si están presentes", () => {
    const withEmail = buildVCard({ name: "Ana", phone: "+34600111222", email: "ana@test.com" });
    const withoutEmail = buildVCard({ name: "Ana", phone: "+34600111222" });

    expect(withEmail.ok && withEmail.data.includes("EMAIL:ana@test.com")).toBe(true);
    expect(withoutEmail.ok && withoutEmail.data.includes("EMAIL")).toBe(false);
  });

  it("usa terminadores de línea CRLF (requerido por el spec vCard)", () => {
    const result = buildVCard({ name: "Ana", phone: "+34600111222" });
    if (result.ok) {
      expect(result.data.includes("\r\n")).toBe(true);
    }
  });
});
