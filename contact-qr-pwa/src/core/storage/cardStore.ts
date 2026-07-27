import { getDb } from "@core/storage/db";
import type {
  Card,
  CardType,
  PersonalCardInput,
  ProfessionalCardInput,
  InstagramCardInput,
  Result,
} from "@core/types/card.types";

type CardInputFor<T extends CardType> = T extends "personal"
  ? PersonalCardInput
  : T extends "professional"
  ? ProfessionalCardInput
  : InstagramCardInput;

type Listener = (type: CardType, card: Card | null) => void;

const listeners = new Set<Listener>();

function notify(type: CardType, card: Card | null): void {
  for (const listener of listeners) listener(type, card);
}

/** Se suscribe a cambios de cualquier tarjeta. Devuelve función para desuscribirse. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Lee una tarjeta por tipo. `null` si esa tarjeta todavía no fue configurada. */
export async function getCard(type: CardType): Promise<Result<Card | null>> {
  try {
    const db = await getDb();
    const card = (await db.get("cards", type)) ?? null;
    return { ok: true, data: card };
  } catch (err) {
    return { ok: false, error: `No se pudo leer la tarjeta: ${(err as Error).message}` };
  }
}

/** Lee las 3 tarjetas de una vez (usado por la pantalla de selección para mostrar estado). */
export async function getAllCards(): Promise<Result<Record<CardType, Card | null>>> {
  try {
    const db = await getDb();
    const [personal, professional, instagram] = await Promise.all([
      db.get("cards", "personal"),
      db.get("cards", "professional"),
      db.get("cards", "instagram"),
    ]);
    return {
      ok: true,
      data: {
        personal: personal ?? null,
        professional: professional ?? null,
        instagram: instagram ?? null,
      },
    };
  } catch (err) {
    return { ok: false, error: `No se pudieron leer las tarjetas: ${(err as Error).message}` };
  }
}

/** Crea o actualiza la tarjeta de un tipo dado. */
export async function saveCard<T extends CardType>(
  type: T,
  input: CardInputFor<T>
): Promise<Result<Card>> {
  try {
    const db = await getDb();
    const existing = await db.get("cards", type);
    const now = new Date().toISOString();

    const card = {
      type,
      ...input,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    } as Card;

    await db.put("cards", card);
    notify(type, card);
    return { ok: true, data: card };
  } catch (err) {
    return { ok: false, error: `No se pudo guardar la tarjeta: ${(err as Error).message}` };
  }
}

/** Borra una tarjeta (usado desde el formulario si el usuario quiere reiniciarla). */
export async function clearCard(type: CardType): Promise<Result<void>> {
  try {
    const db = await getDb();
    await db.delete("cards", type);
    notify(type, null);
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: `No se pudo borrar la tarjeta: ${(err as Error).message}` };
  }
}
