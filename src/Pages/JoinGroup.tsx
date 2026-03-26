import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";
import { useAuth } from "../context/AuthContext";

export default function JoinGroup() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { joinGroup } = useGroups();
  const { isGuest, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async () => {
    setLoginLoading(true);
    await loginWithGoogle();
    setLoginLoading(false);
  };

  const handleJoin = async () => {
    const cleaned = code.trim().toUpperCase();
    if (!cleaned) return;
    try {
      setLoading(true);
      setError("");
      const groupId = await joinGroup(cleaned);
      if (groupId === "GUEST_CANNOT_JOIN") {
        setError("Necesitás una cuenta de Google para unirte a grupos de otras personas.");
        return;
      }
      if (!groupId) {
        setError("Código incorrecto. Pedíle el código al creador del grupo.");
        return;
      }
      navigate(`/groups/${groupId}`);
    } catch {
      setError("Algo salió mal. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .page-root {
          min-height: 100vh;
          background: #0b0f19;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .page-input {
          background: #0b0f19; border: 1px solid #1f2937; border-radius: 12px;
          padding: 16px; font-size: 22px; font-weight: 700; color: #f9fafb;
          outline: none; width: 100%; box-sizing: border-box;
          letter-spacing: 5px; text-transform: uppercase; text-align: center;
          transition: border-color 150ms ease; -webkit-appearance: none;
        }
        .page-input::placeholder { color: #374151; letter-spacing: 2px; font-weight: 400; font-size: 15px; text-align: center; }
        .page-input:focus { border-color: #3b82f6; }
        .btn-primary {
          width: 100%; min-height: 52px; border-radius: 14px;
          font-size: 16px; font-weight: 600; cursor: pointer;
          background: #3b82f6; color: #fff; border: none;
          transition: transform 150ms ease, background 150ms ease;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-primary:active { transform: scale(0.97); background: #2563eb; }
        .btn-primary:disabled { opacity: 0.5; cursor: default; }
        .back-btn {
          background: none; border: none; cursor: pointer;
          font-size: 14px; color: #4b5563; padding: 0;
          transition: color 150ms ease; -webkit-tap-highlight-color: transparent;
        }
        .back-btn:active { color: #f9fafb; }
      `}</style>

      <main className="page-root">
        <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "24px" }}>

          <button className="back-btn" onClick={() => navigate(-1)}>← Volver</button>

          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#f9fafb", margin: "0 0 6px" }}>
              Unirse a un grupo
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", margin: 0 }}>
              Pedíle el código al creador del grupo.
            </p>
          </div>

          {/* Banner invitado */}
          {isGuest && (
            <div style={{
              background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: "14px", padding: "16px",
              display: "flex", flexDirection: "column", gap: "12px",
            }}>
              <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", lineHeight: 1.5 }}>
                Para unirte a grupos de otros necesitás una cuenta de Google.
              </p>
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
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {error && (
              <div style={{
                fontSize: "13px", color: "#ef4444",
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: "10px", padding: "12px 14px",
              }}>{error}</div>
            )}
            <input
              type="text"
              className="page-input"
              placeholder="Código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); }}
              autoFocus
              autoComplete="off"
            />
            <button
              type="button"
              className="btn-primary"
              onClick={handleJoin}
              disabled={loading || !code.trim()}
            >
              {loading ? "Buscando…" : "Unirme al grupo"}
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
