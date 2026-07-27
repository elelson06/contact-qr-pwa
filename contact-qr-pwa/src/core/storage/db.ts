import { openDB, type IDBPDatabase } from "idb";
import type { Card, AppSettings } from "@core/types/card.types";

const DB_NAME = "contact-qr-pwa";
const DB_VERSION = 2;

interface AppDB {
  cards: Card;
  settings: AppSettings;
}

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

/**
 * Singleton de la conexión a IndexedDB.
 *
 * v1 → v2: la v1 guardaba un único contacto en el store "contact" (key
 * fija "current"). La v2 introduce el store "cards" (key = tipo de
 * tarjeta: "personal" | "professional" | "instagram"). Para no perder
 * los datos de quien ya tenía la v1 instalada, migramos ese registro
 * viejo a una tarjeta de tipo "personal" automáticamente.
 */
export function getDb(): Promise<IDBPDatabase<any>> {
  if (!dbPromise) {
    dbPromise = openDB<AppDB>(DB_NAME, DB_VERSION, {
      async upgrade(db, oldVersion, _newVersion, transaction) {
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains("contact")) {
            db.createObjectStore("contact", { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains("settings")) {
            db.createObjectStore("settings", { keyPath: "id" });
          }
        }

        if (oldVersion < 2) {
          const cardsStore = db.objectStoreNames.contains("cards")
            ? transaction.objectStore("cards")
            : db.createObjectStore("cards", { keyPath: "type" });

          if (db.objectStoreNames.contains("contact")) {
            const legacyStore = transaction.objectStore("contact");
            const legacy = await legacyStore.get("current");
            if (legacy) {
              await cardsStore.put({
                type: "personal",
                name: legacy.name,
                phone: legacy.phone,
                createdAt: legacy.createdAt,
                updatedAt: legacy.updatedAt,
              });
            }
            // El store viejo se deja vacío de uso pero no se borra en esta
            // versión: eliminarlo requeriría deleteObjectStore, innecesario
            // por ahora y sin costo real de mantenerlo.
          }
        }
      },
    });
  }
  return dbPromise;
}
