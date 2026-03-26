import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGroups } from "../context/GroupsContext";

export default function Home() {
  const navigate = useNavigate();
  const { user, isGuest, loginWithGoogle, logout } = useAuth();
  const { myGroups, isLoading } = useGroups();
  const [loginLoading, setLoginLoading] = useState(false);

  // Usuarios con grupos → directo a la lista (sin paso extra)
  useEffect(() => {
    if (!isLoading && myGroups.length > 0) {
      navigate("/groups", { replace: true });
    }
  }, [isLoading, myGroups.length, navigate]);

  const handleLogin = async () => {
    setLoginLoading(true);
    try { await loginWithGoogle(); } finally { setLoginLoading(false); }
  };

  // Cargando grupos
  if (isLoading) {
    return (
      <main style={{ minHeight: "100vh", background: "#0b0f19", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#374151", fontSize: "14px" }}>Cargando…</p>
      </main>
    );
  }

  return (
    <>
      <style>{`
        .home-root {
          min-height: 100vh;
          background: #0b0f19;
          background-image: radial-gradient(ellipse 120% 60% at 50% -5%, rgba(59,130,246,0.13), transparent);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .h-btn-primary {
          width: 100%; min-height: 52px; border-radius: 14px;
          font-size: 16px; font-weight: 600; cursor: pointer;
          background: #3b82f6; color: #fff; border: none;
          transition: transform 150ms ease, background 150ms ease;
          -webkit-tap-highlight-color: transparent;
        }
        .h-btn-primary:active { transform: scale(0.97); background: #2563eb; }
        .h-btn-ghost {
          width: 100%; min-height: 48px; border-radius: 14px;
          font-size: 15px; font-weight: 500; cursor: pointer;
          background: transparent; color: #d1d5db; border: 1px solid #1f2937;
          transition: transform 150ms ease, background 150ms ease;
          -webkit-tap-highlight-color: transparent;
        }
        .h-btn-ghost:active { transform: scale(0.97); background: #111827; }
      `}</style>

      <main className="home-root">
        <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Brand + primer mensaje */}
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
            <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#f9fafb", margin: "0 0 8px", lineHeight: 1.25 }}>
              Empezá tu primera<br />lista compartida
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", margin: 0 }}>
              Crear un grupo tarda 10 segundos.
            </p>
          </div>

          {/* Acciones principales */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button className="h-btn-primary" onClick={() => navigate("/create")}>
              Crear mi primer grupo
            </button>
            <button className="h-btn-ghost" onClick={() => navigate("/join")}>
              Unirme con código
            </button>
          </div>

          {/* Banner invitado */}
          {isGuest && (
            <div style={{
              background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: "14px", padding: "16px",
              display: "flex", flexDirection: "column", gap: "12px",
            }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, color: "#d1d5db" }}>
                  Modo sin cuenta
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>
                  Tus listas se guardan solo en este dispositivo. Con Google, las compartís y las tenés en todos tus teléfonos.
                </p>
              </div>
              <button
                onClick={handleLogin}
                disabled={loginLoading}
                style={{
                  background: "#3b82f6", color: "#fff", border: "none",
                  borderRadius: "10px", padding: "10px 14px", fontSize: "14px",
                  fontWeight: 600, cursor: "pointer", opacity: loginLoading ? 0.6 : 1,
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {loginLoading ? "Iniciando sesión…" : "Conectar con Google"}
              </button>
              <button
                onClick={() => logout()}
                style={{
                  background: "transparent", color: "#4b5563", border: "none",
                  padding: "4px", fontSize: "12px", cursor: "pointer",
                }}
              >
                Salir del modo invitado
              </button>
            </div>
          )}

          {/* Perfil para usuarios logueados */}
          {!isGuest && user && (
            <button
              onClick={() => navigate("/profile")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "14px", color: "#6b7280", textAlign: "center",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {user.displayName} · Perfil →
            </button>
          )}

        </div>
      </main>
    </>
  );
}
