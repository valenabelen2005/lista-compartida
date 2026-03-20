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
        <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "24px" }}>

          <button className="back-btn "style={{ fontSize: "15px", color: "#9ca3af",}} onClick={() => navigate(-1)}>← Volver</button>

          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#f9fafb", margin: 0 }}>
              Crear grupo
            </h1>
            <p style={{ fontSize: "16px", color: "#9ca3af", margin: 0, marginTop: "4px" }}>
              Dale un nombre a tu lista compartida
            </p>
          </div>

          <div style={{
            background: "#111827", border: "1px solid #1f2937",
            borderRadius: "16px", padding: "20px",
            display: "flex", flexDirection: "column", gap: "12px", 
          }}>
            <input
            style={{ fontSize: "15px", color: "#9ca3af",}}
              type="text"
              className="page-input"
              placeholder="Nombre del grupo"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              autoFocus
            />
            <button
              type="button"
              className="btn-primary"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear grupo"}
            </button>
          </div>

        </div>
      </main>
    </>
  );
}