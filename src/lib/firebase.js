import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, setLogLevel } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const providedConfig = {
  apiKey: "AIzaSyBdw_46gBLvoK5I8ue2rRQVxaLtORWHmbM",
  authDomain: "house-flippers-61ff9.firebaseapp.com",
  projectId: "house-flippers-61ff9",
  storageBucket: "house-flippers-61ff9.firebasestorage.app",
  messagingSenderId: "341068944581",
  appId: "1:341068944581:web:07d3a64444910f51e70cac"
};

const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : providedConfig;

// 2. Obtiene el App ID
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 3. Maneja la autenticación
// (Usa el token inicial si está disponible, de lo contrario, inicia sesión anónimamente)
export const initializeAuth = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is authenticated:", user.uid);
        resolve(user);
      } else if (typeof __initial_auth_token !== 'undefined') {
        try {
          console.log("Signing in with custom token...");
          const userCredential = await signInWithCustomToken(auth, __initial_auth_token);
          resolve(userCredential.user);
        } catch (error) {
          console.error("Error signing in with custom token:", error);
          reject(error);
        }
      } else {
        try {
          console.log("Signing in anonymously...");
          const userCredential = await signInAnonymously(auth);
          resolve(userCredential.user);
        } catch (error) {
          console.error("Error signing in anonymously:", error);
          reject(error);
        }
      }
      unsubscribe(); // Deja de escuchar después del primer estado
    }, (error) => {
      console.error("Auth state error:", error);
      reject(error);
    });
  });
};

// Habilita logs de debug para Firestore
