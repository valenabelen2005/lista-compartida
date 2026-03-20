import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  updateProfile,

  type User,
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    // Solo actualiza si hay un usuario real, o si definitivamente no hay sesión
    if (firebaseUser) {
      setUser(firebaseUser);
      setIsAuthLoading(false);
    } else {
      // Espera un momento antes de declarar que no hay usuario
      // evita race condition con el popup
      setTimeout(() => {
        setUser((current) => {
          if (!current) setIsAuthLoading(false);
          return current;
        });
      }, 1000);
    }
  });
  return () => unsubscribe();
}, []);
const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user); // ← fuerza el estado inmediatamente
    setIsAuthLoading(false);
  } catch (error: any) {
    if (error.code === "auth/popup-blocked") {
      await signInWithRedirect(auth, googleProvider);
    } else {
      console.error("Error login:", error.code, error.message);
    }
  }
};
  const logout = async () => {
    await signOut(auth);
  };

  const updateDisplayName = async (name: string) => {
    if (!user) return;
    await updateProfile(user, { displayName: name });
    setUser({ ...user, displayName: name });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthLoading, loginWithGoogle, logout, updateDisplayName }}>
      {children}
    </AuthContext.Provider>
  );
}