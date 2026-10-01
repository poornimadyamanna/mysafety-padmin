import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUiF-BeSNXCS7mAfZBb3tH3Wv4RvdyjO8",
  authDomain: "mysafety24x7-new.firebaseapp.com",
  projectId: "mysafety24x7-new",
  storageBucket: "mysafety24x7-new.firebasestorage.app",
  messagingSenderId: "152974593121",
  appId: "1:152974593121:web:9f2ddc4e17ff4b40f8ee20",
  measurementId: "G-6BRCLRYL3P"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };
