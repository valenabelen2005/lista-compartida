import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();

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
          padding: 13px 16px;
          border-radius: 10px;
          font-size: 14px;
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
          outline: none;
        }
        .google-btn:hover {
          background: #e5e7eb;
          transform: scale(1.02);
        }
        .google-btn:active { transform: scale(0.97); }
        .google-btn:focus-visible { box-shadow: 0 0 0 3px rgba(249,250,251,0.3); }
      `}</style>

      <main className="login-root">
        <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "32px" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "rgba(59,130,246,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px",
              }}>🛒</div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#3b82f6", letterSpacing: "1px", textTransform: "uppercase" }}>
                Lista Compartida
              </span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: 700, color: "#f9fafb", margin: 0, lineHeight: 1.2, letterSpacing: "-0.5px" }}>
              Bienvenido
            </h1>
            <p style={{ fontSize: "14px", color: "#4b5563", margin: 0, marginTop: "4px" }}>
              Inicia sesión para continuar
            </p>
          </div>

          <div style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "16px",
            padding: "20px",
          }}>
            <button className="google-btn" onClick={loginWithGoogle}>
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: "16px", height: "16px" }} />
              Continuar con Google
            </button>
          </div>

          <p style={{ fontSize: "12px", color: "#374151", textAlign: "center", margin: 0 }}>
            Al continuar aceptas usar esto para organizar tus compras.
          </p>

        </div>
      </main>
    </>
  );
}