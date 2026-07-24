import { openDB, type IDBPDatabase } from "idb";
import type { Contact, AppSettings } from "@core/types/contact.types";

const DB_NAME = "contact-qr-pwa";
const DB_VERSION = 1;

interface AppDB {
  contact: Contact;
  settings: AppSettings;
}

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

/**
 * Singleton de la conexión a IndexedDB. Se abre una sola vez por sesión
 * de la pestaña; todas las funciones de contactStore.ts reutilizan esta promesa.
 */
export function getDb(): Promise<IDBPDatabase<any>> {
  if (!dbPromise) {
    dbPromise = openDB<AppDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("contact")) {
          db.createObjectStore("contact", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}
