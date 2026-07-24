import { getDb } from "@core/storage/db";
import type { Contact, ContactInput, Result } from "@core/types/contact.types";

type Listener = (contact: Contact | null) => void;

const listeners = new Set<Listener>();

/** Notifica a todos los suscriptores (la UI) que el contacto cambió. */
function notify(contact: Contact | null): void {
  for (const listener of listeners) listener(contact);
}

/**
 * Se suscribe a cambios del contacto. Devuelve una función para desuscribirse.
 * Patrón observer mínimo: reemplaza la necesidad de una librería de estado
 * para un solo valor que cambia raramente.
 */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Lee el contacto guardado. `null` si todavía no se configuró (primera apertura). */
export async function getContact(): Promise<Result<Contact | null>> {
  try {
    const db = await getDb();
    const contact = (await db.get("contact", "current")) ?? null;
    return { ok: true, data: contact };
  } catch (err) {
    return { ok: false, error: `No se pudo leer el contacto: ${(err as Error).message}` };
  }
}

/** Crea o actualiza el contacto único del dispositivo. */
export async function saveContact(input: ContactInput): Promise<Result<Contact>> {
  try {
    const db = await getDb();
    const existing = await db.get("contact", "current");
    const now = new Date().toISOString();

    const contact: Contact = {
      id: "current",
      ...input,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await db.put("contact", contact);
    notify(contact);
    return { ok: true, data: contact };
  } catch (err) {
    return { ok: false, error: `No se pudo guardar el contacto: ${(err as Error).message}` };
  }
}

/** Borra el contacto (usado solo desde ajustes, si el usuario quiere reiniciar). */
export async function clearContact(): Promise<Result<void>> {
  try {
    const db = await getDb();
    await db.delete("contact", "current");
    notify(null);
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: `No se pudo borrar el contacto: ${(err as Error).message}` };
  }
}
