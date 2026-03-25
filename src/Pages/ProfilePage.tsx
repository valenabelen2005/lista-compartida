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
  const [selectorOpen, setSelectorOpen] = useState(false);
  const { avatar, setAvatar } = useAvatar(user?.uid);
  const navigate = useNavigate();

  // Si es invitado o no hay usuario, redirigir al home
  useEffect(() => {
    if (isGuest || !user) {
      navigate("/", { replace: true });
    }
  }, [isGuest, user, navigate]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    await updateDisplayName(trimmed);
    setSaving(false);
    navigate("/");
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <style>{`
        .page-root {
          min-height: 100vh;
          background: #0b0f19;
          background-image: radial-gradient(ellipse 120% 60% at 50% -5%, rgba(59,130,246,0.18), transparent);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .page-input {
          background: #0b0f19;
          border: 1px solid #1f2937;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 14px;
          color: #f9fafb;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 150ms ease;
        }
        .page-input::placeholder { color: #374151; }
        .page-input:focus { border-color: #3b82f6; }
        .btn-primary {
          width: 100%;
          padding: 13px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background: #3b82f6;
          color: #fff;
          border: none;
          transition: transform 150ms ease, background 150ms ease, box-shadow 150ms ease;
        }
        .btn-primary:hover { background: #2563eb; transform: scale(1.02); box-shadow: 0 4px 20px rgba(59,130,246,0.35); }
        .btn-primary:active { transform: scale(0.97); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-danger {
          width: 100%;
          padding: 13px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          color: #6b7280;
          border: 1px solid #1f2937;
          transition: all 150ms ease;
        }
        .btn-danger:hover { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.3); }
        .back-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
          color: #4b5563;
          padding: 0;
          transition: color 150ms ease;
        }
        .back-btn:hover { color: #f9fafb; }
      `}</style>

      <main className="page-root">
        <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "28px" }}>

          <button className="back-btn" onClick={() => navigate(-1)}>← Volver</button>

          {/* Avatar centrado */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setSelectorOpen(true)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative" }}
              title="Cambiar avatar"
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
              <p style={{ fontSize: "18px", fontWeight: 700, color: "#f9fafb", margin: 0 }}>
                {user?.displayName ?? "Sin nombre"}
              </p>
              <p style={{ fontSize: "13px", color: "#4b5563", margin: 0, marginTop: "3px" }}>
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

          <div style={{
            background: "#111827", border: "1px solid #1f2937",
            borderRadius: "16px", padding: "20px",
            display: "flex", flexDirection: "column", gap: "12px",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>
                Nombre
              </label>
              <input
                type="text"
                className="page-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              />
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
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