import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { loginWithGoogle, enterAsGuest, loginError } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-root {
          min-height: 100vh;
          background: #0b0f19;
          background-image: radial-gradient(ellipse 120% 60% at 50% -5%, rgba(59,130,246,0.18), transparent);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .google-btn {
          width: 100%;
          min-height: 50px;
          padding: 0 16px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          background: #f9fafb;
          color: #0b0f19;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: transform 150ms ease, background 150ms ease;
          -webkit-tap-highlight-color: transparent;
        }
        .google-btn:hover { background: #e5e7eb; transform: scale(1.02); }
        .google-btn:active { transform: scale(0.97); }
        .google-btn:disabled { opacity: 0.6; cursor: default; transform: none; }
        .guest-btn {
          width: 100%;
          min-height: 50px;
          padding: 0 16px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          color: #f9fafb;
          border: 1px solid #1f2937;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: transform 150ms ease, background 150ms ease, border-color 150ms ease;
          -webkit-tap-highlight-color: transparent;
        }
        .guest-btn:hover { background: #161e2e; border-color: #374151; transform: scale(1.02); }
        .guest-btn:active { transform: scale(0.97); }
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: #1f2937;
        }
        .login-error {
          font-size: 13px;
          color: #ef4444;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 12px 14px;
          text-align: center;
        }
        .mode-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mode-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: #4b5563;
          line-height: 1.4;
        }
        .mode-icon { flex-shrink: 0; margin-top: 1px; }
      `}</style>

      <main className="login-root">
        <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* Header */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "9px",
                background: "rgba(59,130,246,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "17px",
              }}>🛒</div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#3b82f6", letterSpacing: "1px", textTransform: "uppercase" }}>
                Lista Compartida
              </span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: 700, color: "#f9fafb", margin: 0, lineHeight: 1.2, letterSpacing: "-0.5px" }}>
              Bienvenido
            </h1>
            <p style={{ fontSize: "15px", color: "#9ca3af", margin: 0, marginTop: "4px" }}>
              Elegí cómo querés usar la app
            </p>
          </div>

          {/* Card */}
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {loginError && (
              <div className="login-error">{loginError}</div>
            )}

            {/* Opción Google */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button className="google-btn" onClick={handleLogin} disabled={loading}>
                {loading ? (
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>Iniciando sesión…</span>
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
              <p style={{ fontSize: "12px", color: "#4b5563", margin: 0, textAlign: "center", lineHeight: 1.4 }}>
                Tus grupos se sincronizan en todos tus dispositivos
              </p>
            </div>

            {/* Divider */}
            <div className="divider">
              <div className="divider-line" />
              <span style={{ fontSize: "12px", color: "#374151", whiteSpace: "nowrap" }}>o mejor</span>
              <div className="divider-line" />
            </div>

            {/* Opción invitado */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button className="guest-btn" onClick={enterAsGuest}>
                👤 Entrar sin registrarse
              </button>
              <p style={{ fontSize: "12px", color: "#4b5563", margin: 0, textAlign: "center", lineHeight: 1.4 }}>
                Los grupos se guardan solo en este dispositivo
              </p>
            </div>
          </div>

          <p style={{ fontSize: "12px", color: "#374151", textAlign: "center", margin: 0 }}>
            Al continuar aceptás usar esto para organizar tus compras.
          </p>

        </div>
      </main>
    </>
  );
}
