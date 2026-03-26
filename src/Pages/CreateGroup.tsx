import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const { addGroup } = useGroups();
  const navigate = useNavigate();

  const handleCreate = async () => {
    const trimmed = groupName.trim();
    if (!trimmed) return;
    try {
      setLoading(true);
      await addGroup(trimmed);
      navigate("/groups");
    } catch (e) {
      console.error(e);
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
          padding: 14px 16px; font-size: 17px; color: #f9fafb; outline: none;
          width: 100%; box-sizing: border-box; transition: border-color 150ms ease;
          -webkit-appearance: none;
        }
        .page-input::placeholder { color: #374151; }
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
              Nuevo grupo
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", margin: 0 }}>
              Después compartís el código y listo.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              className="page-input"
              placeholder="Ej: Supermercado, Casa, Trabajo…"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              autoFocus
              autoCapitalize="words"
            />
            <button
              type="button"
              className="btn-primary"
              onClick={handleCreate}
              disabled={loading || !groupName.trim()}
            >
              {loading ? "Creando…" : "Crear grupo"}
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
