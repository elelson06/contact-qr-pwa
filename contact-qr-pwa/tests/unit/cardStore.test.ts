import { describe, it, expect, vi } from "vitest";
import { getCard, saveCard, clearCard, getAllCards, subscribe } from "@core/storage/cardStore";

describe("cardStore", () => {
  it("devuelve null cuando una tarjeta no está configurada", async () => {
    const result = await getCard("personal");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toBeNull();
  });

  it("guarda y lee una tarjeta personal", async () => {
    const saved = await saveCard("personal", { name: "Ana Pérez", phone: "+34600111222" });
    expect(saved.ok).toBe(true);

    const read = await getCard("personal");
    if (read.ok && read.data?.type === "personal") {
      expect(read.data.name).toBe("Ana Pérez");
    }
  });

  it("guarda una tarjeta profesional con campos opcionales", async () => {
    const saved = await saveCard("professional", {
      name: "Carlos Ruiz",
      phone: "+34600222333",
      email: "carlos@empresa.com",
      organization: "Acme",
    });
    expect(saved.ok).toBe(true);
    if (saved.ok && saved.data.type === "professional") {
      expect(saved.data.email).toBe("carlos@empresa.com");
      expect(saved.data.organization).toBe("Acme");
    }
  });

  it("guarda una tarjeta de instagram", async () => {
    const saved = await saveCard("instagram", { username: "ana_perez" });
    expect(saved.ok).toBe(true);
    if (saved.ok && saved.data.type === "instagram") {
      expect(saved.data.username).toBe("ana_perez");
    }
  });

  it("las 3 tarjetas son independientes entre sí", async () => {
    await saveCard("personal", { name: "Ana", phone: "+34600111222" });
    await saveCard("professional", { name: "Ana Corp", phone: "+34600333444" });
    await saveCard("instagram", { username: "ana" });

    const all = await getAllCards();
    expect(all.ok).toBe(true);
    if (all.ok) {
      expect(all.data.personal?.type).toBe("personal");
      expect(all.data.professional?.type).toBe("professional");
      expect(all.data.instagram?.type).toBe("instagram");
    }
  });

  it("preserva createdAt al actualizar una tarjeta existente", async () => {
    const first = await saveCard("personal", { name: "Ana", phone: "+34600111222" });
    if (!first.ok) throw new Error("setup failed");

    await new Promise((r) => setTimeout(r, 5));

    const second = await saveCard("personal", { name: "Ana Actualizada", phone: "+34600111222" });
    expect(second.ok).toBe(true);
    if (second.ok) {
      expect(second.data.createdAt).toBe(first.data.createdAt);
      expect(second.data.updatedAt).not.toBe(first.data.createdAt);
    }
  });

  it("borra una tarjeta específica sin afectar a las demás", async () => {
    await saveCard("personal", { name: "Ana", phone: "+34600111222" });
    await saveCard("instagram", { username: "ana" });

    await clearCard("personal");

    const personal = await getCard("personal");
    const instagram = await getCard("instagram");
    if (personal.ok) expect(personal.data).toBeNull();
    if (instagram.ok) expect(instagram.data).not.toBeNull();
  });

  it("notifica a los suscriptores con el tipo y la tarjeta afectada", async () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    await saveCard("instagram", { username: "carlos" });
    expect(listener).toHaveBeenCalledWith("instagram", expect.objectContaining({ username: "carlos" }));

    unsubscribe();
  });
});
