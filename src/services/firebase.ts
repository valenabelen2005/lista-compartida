import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAa3bpwiGO0Uuf15r_VGKifK25gGz4MTNI",
  authDomain: "life-os-c0a62.firebaseapp.com",
  projectId: "life-os-c0a62",
  storageBucket: "life-os-c0a62.firebasestorage.app",
  messagingSenderId: "397994721008",
  appId: "1:397994721008:web:bb1ad0e2c2b52a89b64c35",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();