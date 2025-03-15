import { setToken } from "../config";
import { SessionStore } from "./session-store";


interface Stores {
  sessionStore: SessionStore;
}

export let stores: Stores | null = null;
export async function initCoreStores() {
  try {
    stores = {
      sessionStore: new SessionStore(),
    }
    if (stores.sessionStore.session?.access_token) {
      setToken(stores.sessionStore.session?.access_token);
    }
  } catch (e) {
    console.log('errrorrrrrrraaaaa', e)
  }
}

export const useCoreStores = () => {
  return stores!;
};

