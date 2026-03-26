import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { loginWithGoogle, enterAsGuest, loginError } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try { await loginWithGoogle(); } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        .login-root {
          min-height: 100vh;
          background: #0b0f19;
          background-image: radial-gradient(ellipse 120% 60% at 50% -5%, rgba(59,130,246,0.15), transparent);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .google-btn {
          width: 100%; min-height: 52px; padding: 0 20px;
          border-radius: 14px; font-size: 16px; font-weight: 600;
          cursor: pointer; background: #f9fafb; color: #0b0f19; border: none;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: transform 150ms ease, background 150ms ease;
          -webkit-tap-highlight-color: transparent;
        }
        .google-btn:active { transform: scale(0.97); background: #e5e7eb; }
        .google-btn:disabled { opacity: 0.6; cursor: default; }
        .guest-btn {
          width: 100%; min-height: 48px; padding: 0 20px;
          border-radius: 14px; font-size: 15px; font-weight: 500;
          cursor: pointer; background: transparent; color: #d1d5db;
          border: 1px solid #1f2937;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: transform 150ms ease, background 150ms ease;
          -webkit-tap-highlight-color: transparent;
        }
        .guest-btn:active { transform: scale(0.97); background: #111827; }
      `}</style>

      <main className="login-root">
        <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "12px",
                background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
              }}>🛒</div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#3b82f6", letterSpacing: "0.5px" }}>
                Lista Compartida
              </span>
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#f9fafb", margin: "0 0 8px", lineHeight: 1.25, letterSpacing: "-0.3px" }}>
              Compras en equipo,<br />sin olvidos.
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", margin: 0 }}>
              Gratis · Sin configuración · Lista en 10 segundos
            </p>
          </div>

          {/* Acciones */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {loginError && (
              <div style={{
                fontSize: "13px", color: "#ef4444",
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: "10px", padding: "12px 14px", textAlign: "center",
              }}>{loginError}</div>
            )}

            <button className="google-btn" onClick={handleLogin} disabled={loading}>
              {loading ? (
                <span style={{ color: "#6b7280", fontSize: "15px" }}>Iniciando sesión…</span>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Continuar con Google
                </>
              )}
            </button>
            <p style={{ fontSize: "12px", color: "#374151", textAlign: "center", margin: "0 0 4px" }}>
              Sincroniza tus grupos en todos tus dispositivos
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "4px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "#1f2937" }} />
              <span style={{ fontSize: "12px", color: "#374151" }}>o</span>
              <div style={{ flex: 1, height: "1px", background: "#1f2937" }} />
            </div>

            <button className="guest-btn" onClick={enterAsGuest}>
              Entrar sin cuenta
            </button>
            <p style={{ fontSize: "12px", color: "#374151", textAlign: "center", margin: 0 }}>
              Los grupos se guardan solo en este dispositivo
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
