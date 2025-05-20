import { getPersistedStore } from "mobx-persist-store";
import { setToken } from "../config";
import { SessionStore } from "./session-store";

interface Stores {
  sessionStore: SessionStore;
}

export let stores: Stores | null = null;

export async function initCoreStores() {
  try {
    const sessionStore = new SessionStore();
    
    // Đợi makePersistable và getPersistedStore hoàn tất
    await new Promise<void>((resolve) => {
      const checkInitialized = () => {
        if (sessionStore.isInitialized) {
          resolve();
        } else {
          setTimeout(checkInitialized, 100);
        }
      };
      checkInitialized();
    });

    stores = {
      sessionStore,
    };

    // Khôi phục session từ localStorage
    const persistedData = await getPersistedStore(sessionStore);
    if (persistedData && persistedData.session?.access_token) {
      setToken(persistedData.session.access_token);
    }

  } catch (e) {
    console.error("Error initializing core stores:", e);
  }
}

export const useCoreStores = () => {
  return stores!;
};

