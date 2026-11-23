import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { environment } from "../environments/environment";
import { resolveFirebaseConfig } from "./services/firebase-config.helper";

const config = resolveFirebaseConfig((environment as any).fbPayload ?? (environment as any).firebase);
const fallback: Record<string, string> = {};
Object.defineProperty(fallback, 'apiKey', { value: 'dummy-dev-key', enumerable: true });
const app = initializeApp(config && Object.keys(config).length > 0 ? config : fallback);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
