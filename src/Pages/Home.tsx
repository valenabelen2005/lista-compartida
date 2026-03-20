import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <style>{`
        .home-root {
          min-height: 100vh;
          background: #0b0f19;
          background-image: radial-gradient(ellipse 160% 60% at 50% -5%, rgba(59,130,246,0.18), transparent);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .btn {
          width: 100%;
          padding: 13px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: transform 150ms ease, background 150ms ease, box-shadow 150ms ease;
          outline: none;
        }
        .btn:active { transform: scale(0.97); }
        .btn-primary {
          background: #3b82f6;
          color: #fff;
          box-shadow: 0 0 0 0 rgba(59,130,246,0);
        }
        .btn-primary:hover {
          background: #2563eb;
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(59,130,246,0.35);
        }
        .btn-primary:focus-visible {
          box-shadow: 0 0 0 3px rgba(59,130,246,0.5);
        }
        .btn-ghost {
          background: transparent;
          color: #f9fafb;
          border: 1px solid #1f2937 !important;
        }
        .btn-ghost:hover {
          background: #161e2e;
          transform: scale(1.01);
          border-color: #374151 !important;
        }
        .btn-neutral {
          background: #161e2e;
          color: #f9fafb;
        }
        .btn-neutral:hover {
          background: #1e2a3a;
          transform: scale(1.01);
        }
        .profile-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
          color: #4b5563;
          transition: color 150ms ease;
          padding: 8px;
        }
        .profile-btn:hover { color: #9ca3af; }
      `}</style>

      <main className="home-root">
        <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Header */}
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
              Compras en equipo,<br />sin fricción.
            </h1>
            <p style={{ fontSize: "16px", color: "#9ca3af", margin: 0, marginTop: "4px" }}>
              Crea un grupo, comparte el código, listo.
            </p>
          </div>

          {/* Acciones */}
          <div style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            <button className="btn btn-primary" onClick={() => navigate("/create")}>
              Crear un grupo nuevo
            </button>
            <button className="btn btn-ghost" onClick={() => navigate("/join")}>
              Unirse con código
            </button>
            <button className="btn btn-neutral" onClick={() => navigate("/groups")}>
              Ver mis grupos
            </button>
          </div>

          {/* Perfil */}
          <button className="profile-btn" onClick={() => navigate("/profile")} style={{ textAlign: "center", fontSize: "16px", color: "#9ca3af" }}>
            {user?.displayName ?? "Mi perfil"} →
          </button>

        </div>
      </main>
    </>
  );
}