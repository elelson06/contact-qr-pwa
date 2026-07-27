import { describe, it, expect } from "vitest";
import { buildVCard, buildProfessionalVCard } from "@core/vcard/buildVCard";

describe("buildVCard (tarjeta Personal)", () => {
  it("genera un vCard 3.0 válido con nombre y teléfono", () => {
    const result = buildVCard({ name: "Ana Pérez", phone: "+34 600 111 222" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toContain("BEGIN:VCARD");
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
    if (result.ok) {
      expect(result.data).toContain("FN:Pérez\\, Ana\\; López");
    }
  });

  it("usa terminadores de línea CRLF (requerido por el spec vCard)", () => {
    const result = buildVCard({ name: "Ana", phone: "+34600111222" });
    if (result.ok) expect(result.data.includes("\r\n")).toBe(true);
  });
});

describe("buildProfessionalVCard (tarjeta Profesional)", () => {
  it("incluye los campos opcionales cuando están presentes", () => {
    const result = buildProfessionalVCard({
      name: "Ana",
      phone: "+34600111222",
      email: "ana@empresa.com",
      organization: "Acme",
      title: "Gerente",
      website: "https://acme.com",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toContain("EMAIL:ana@empresa.com");
      expect(result.data).toContain("ORG:Acme");
      expect(result.data).toContain("TITLE:Gerente");
      expect(result.data).toContain("URL:https://acme.com");
    }
  });

  it("omite los campos opcionales cuando no están presentes", () => {
    const result = buildProfessionalVCard({ name: "Ana", phone: "+34600111222" });
    if (result.ok) {
      expect(result.data).not.toContain("EMAIL");
      expect(result.data).not.toContain("ORG");
      expect(result.data).not.toContain("URL");
    }
  });

  it("rechaza un email con formato inválido", () => {
    const result = buildProfessionalVCard({ name: "Ana", phone: "+34600111222", email: "no-es-un-email" });
    expect(result.ok).toBe(false);
  });

  it("rechaza un sitio web con formato inválido", () => {
    const result = buildProfessionalVCard({ name: "Ana", phone: "+34600111222", website: "no es una url" });
    expect(result.ok).toBe(false);
  });
});
