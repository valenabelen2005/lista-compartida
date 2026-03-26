import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAvatar } from "../hooks/useAvatar";
import UserAvatar from "../componentes/UserAvatar";
import AvatarSelector from "../componentes/AvatarSelector";

export default function ProfilePage() {
  const { user, isGuest, updateDisplayName, logout } = useAuth();
  const [name, setName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const { avatar, setAvatar } = useAvatar(user?.uid);
  const navigate = useNavigate();

  useEffect(() => {
    if (isGuest || !user) navigate("/", { replace: true });
  }, [isGuest, user, navigate]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    await updateDisplayName(trimmed);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <style>{`
        .page-root {
          min-height: 100vh; background: #0b0f19;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; padding: 24px;
        }
        .page-input {
          background: #0b0f19; border: 1px solid #1f2937; border-radius: 12px;
          padding: 14px 16px; font-size: 16px; color: #f9fafb; outline: none;
          width: 100%; box-sizing: border-box; transition: border-color 150ms ease;
          -webkit-appearance: none;
        }
        .page-input::placeholder { color: #374151; }
        .page-input:focus { border-color: #3b82f6; }
        .btn-primary {
          width: 100%; min-height: 50px; border-radius: 14px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          border: none; transition: transform 150ms ease, background 150ms ease;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-primary:active { transform: scale(0.97); }
        .btn-primary:disabled { opacity: 0.5; cursor: default; }
        .btn-danger {
          width: 100%; min-height: 46px; border-radius: 14px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          background: transparent; color: #6b7280; border: 1px solid #1f2937;
          transition: all 150ms ease; -webkit-tap-highlight-color: transparent;
        }
        .btn-danger:active { background: rgba(239,68,68,0.08); color: #ef4444; border-color: rgba(239,68,68,0.2); }
        .back-btn {
          background: none; border: none; cursor: pointer;
          font-size: 14px; color: #4b5563; padding: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .back-btn:active { color: #f9fafb; }
      `}</style>

      <main className="page-root">
        <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "28px" }}>

          <button className="back-btn" onClick={() => navigate(-1)}>← Volver</button>

          {/* Avatar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setSelectorOpen(true)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative", WebkitTapHighlightColor: "transparent" }}
            >
              <UserAvatar user={user} avatar={avatar} size={76} />
              <span style={{
                position: "absolute", bottom: 2, right: 2,
                width: "22px", height: "22px", borderRadius: "50%",
                background: "#3b82f6", border: "2px solid #0b0f19",
                fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center",
              }}>✏️</span>
            </button>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "#f9fafb", margin: "0 0 3px" }}>
                {user?.displayName ?? "Sin nombre"}
              </p>
              <p style={{ fontSize: "13px", color: "#4b5563", margin: 0 }}>
                {user?.email}
              </p>
            </div>
          </div>

          {selectorOpen && (
            <AvatarSelector
              current={avatar}
              onSelect={setAvatar}
              onClose={() => setSelectorOpen(false)}
            />
          )}

          {/* Nombre */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Nombre
            </label>
            <input
              type="text"
              className="page-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              autoCapitalize="words"
            />
            <button
              type="button"
              className="btn-primary"
              onClick={handleSave}
              disabled={saving || !name.trim()}
              style={{
                background: saved ? "rgba(16,185,129,0.15)" : "#3b82f6",
                color: saved ? "#10b981" : "#fff",
                border: saved ? "1px solid rgba(16,185,129,0.2)" : "none",
              }}
            >
              {saving ? "Guardando…" : saved ? "✓ Guardado" : "Guardar nombre"}
            </button>
          </div>

          <button type="button" className="btn-danger" onClick={handleLogout}>
            Cerrar sesión
          </button>

        </div>
      </main>
    </>
  );
}
