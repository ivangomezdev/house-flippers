import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdw_46gBLvoK5I8ue2rRQVxaLtORWHmbM",
  authDomain: "house-flippers-61ff9.firebaseapp.com",
  projectId: "house-flippers-61ff9",
  storageBucket: "house-flippers-61ff9.appspot.com", // Corrected storage bucket
  messagingSenderId: "341068944581",
  appId: "1:341068944581:web:07d3a64444910f51e70cac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appId = firebaseConfig.appId;

// Export the necessary Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- This is the Firestore instance you need
export const storage = getStorage(app);
export { appId };

// Handles authentication
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
      unsubscribe();
    }, (error) => {
      console.error("Auth state error:", error);
      reject(error);
    });
  });
};