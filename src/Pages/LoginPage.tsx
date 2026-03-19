// src/Pages/LoginPage.tsx
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold mb-2">Lista compartida</h1>
        <p className="text-gray-500 mb-8">Inicia sesión para continuar</p>

        <button
          type="button"  // ← esto es clave en móvil
          onClick={loginWithGoogle}
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 transition rounded-xl px-4 py-3 font-medium flex items-center justify-center gap-3"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Continuar con Google
        </button>
      </div>
    </main>
  );
}