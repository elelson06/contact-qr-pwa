import { describe, it, expect } from "vitest";
import { buildInstagramUrl } from "@core/instagram/buildInstagramUrl";

describe("buildInstagramUrl", () => {
  it("genera la URL correcta a partir de un username simple", () => {
    const result = buildInstagramUrl({ username: "ana_perez" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toBe("https://www.instagram.com/ana_perez");
  });

  it("quita el @ inicial si el usuario lo escribió", () => {
    const result = buildInstagramUrl({ username: "@ana_perez" });
    if (result.ok) expect(result.data).toBe("https://www.instagram.com/ana_perez");
  });

  it("recorta espacios en blanco", () => {
    const result = buildInstagramUrl({ username: "  ana_perez  " });
    if (result.ok) expect(result.data).toBe("https://www.instagram.com/ana_perez");
  });

  it("rechaza un username vacío", () => {
    const result = buildInstagramUrl({ username: "   " });
    expect(result.ok).toBe(false);
  });

  it("rechaza caracteres no permitidos (ej. espacios internos o símbolos)", () => {
    const result = buildInstagramUrl({ username: "ana perez!" });
    expect(result.ok).toBe(false);
  });

  it("acepta puntos y guiones bajos, válidos en usernames de Instagram", () => {
    const result = buildInstagramUrl({ username: "ana.perez_oficial" });
    expect(result.ok).toBe(true);
  });
});
