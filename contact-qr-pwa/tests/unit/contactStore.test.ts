import { describe, it, expect, vi } from "vitest";
import {
  getContact,
  saveContact,
  clearContact,
  subscribe,
} from "@core/storage/contactStore";

describe("contactStore", () => {
  it("devuelve null cuando no hay contacto guardado (primera apertura)", async () => {
    const result = await getContact();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toBeNull();
  });

  it("guarda y luego lee el mismo contacto", async () => {
    const saved = await saveContact({ name: "Ana Pérez", phone: "+34600111222" });
    expect(saved.ok).toBe(true);

    const read = await getContact();
    expect(read.ok).toBe(true);
    if (read.ok) {
      expect(read.data?.name).toBe("Ana Pérez");
      expect(read.data?.phone).toBe("+34600111222");
    }
  });

  it("preserva createdAt original al actualizar, pero cambia updatedAt", async () => {
    const first = await saveContact({ name: "Ana", phone: "+34600111222" });
    if (!first.ok) throw new Error("setup failed");

    await new Promise((r) => setTimeout(r, 5));

    const second = await saveContact({ name: "Ana Actualizada", phone: "+34600111222" });
    expect(second.ok).toBe(true);
    if (second.ok) {
      expect(second.data.createdAt).toBe(first.data.createdAt);
      expect(second.data.updatedAt).not.toBe(first.data.createdAt);
      expect(second.data.name).toBe("Ana Actualizada");
    }
  });

  it("borra el contacto y vuelve a null", async () => {
    await saveContact({ name: "Ana", phone: "+34600111222" });
    const cleared = await clearContact();
    expect(cleared.ok).toBe(true);

    const read = await getContact();
    if (read.ok) expect(read.data).toBeNull();
  });

  it("notifica a los suscriptores cuando se guarda un contacto", async () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    await saveContact({ name: "Carlos", phone: "+34611222333" });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0]?.name).toBe("Carlos");

    unsubscribe();
  });
});
