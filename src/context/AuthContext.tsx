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

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const GUEST_MODE_KEY = "lista-guest-mode";
const LOGIN_ERROR_KEY = "lista-login-error";

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  isAuthLoading: boolean;
  loginError: string | null;
  loginWithGoogle: () => Promise<void>;
  enterAsGuest: () => void;
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
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem(GUEST_MODE_KEY) === "true");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Captura resultado del redirect de Google (mobile)
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
          localStorage.removeItem(GUEST_MODE_KEY);
          setIsGuest(false);
          localStorage.removeItem(LOGIN_ERROR_KEY);
        }
      })
      .catch((err) => {
        console.error("getRedirectResult error:", err.code);
        const msg =
          err.code === "auth/network-request-failed"
            ? "Sin conexión. Verificá tu internet e intentá de nuevo."
            : "Error al iniciar sesión con Google. Intentá de nuevo.";
        localStorage.setItem(LOGIN_ERROR_KEY, msg);
        setLoginError(msg);
      });

    // Recuperar error de redirect previo si quedó guardado
    const savedError = localStorage.getItem(LOGIN_ERROR_KEY);
    if (savedError) {
      setLoginError(savedError);
      localStorage.removeItem(LOGIN_ERROR_KEY);
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        localStorage.removeItem(GUEST_MODE_KEY);
        localStorage.removeItem(LOGIN_ERROR_KEY);
        setIsGuest(false);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const enterAsGuest = () => {
    localStorage.setItem(GUEST_MODE_KEY, "true");
    setIsGuest(true);
  };

  const loginWithGoogle = async () => {
    setLoginError(null);
    try {
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
        // La página se recarga — el resultado se captura en getRedirectResult
        return;
      }
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      localStorage.removeItem(GUEST_MODE_KEY);
      localStorage.removeItem(LOGIN_ERROR_KEY);
      setIsGuest(false);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };

      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request"
      ) {
        // El usuario cerró el popup voluntariamente — no hacer nada
      } else {
        const msg =
          err.code === "auth/network-request-failed"
            ? "Sin conexión. Verificá tu internet e intentá de nuevo."
            : err.code === "auth/user-disabled"
            ? "Esta cuenta fue deshabilitada."
            : "Error al iniciar sesión. Intentá de nuevo.";
        setLoginError(msg);
        console.error("Login error:", err.code, err.message);
      }
    }
  };

  const logout = async () => {
    if (isGuest) {
      localStorage.removeItem(GUEST_MODE_KEY);
      setIsGuest(false);
      return;
    }
    await signOut(auth);
    setUser(null);
  };

  const updateDisplayName = async (name: string) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name });
    await auth.currentUser.reload();
    setUser(auth.currentUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, isGuest, isAuthLoading, loginError, loginWithGoogle, enterAsGuest, logout, updateDisplayName }}
    >
      {children}
    </AuthContext.Provider>
  );
}
