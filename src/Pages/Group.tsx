import { useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";
import { useAuth } from "../context/AuthContext";

export default function Groups() {
  const { myGroups, isLoading, leaveGroup, deleteGroup } = useGroups();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .groups-root {
          min-height: 100vh;
          background: #0b0f19;
          background-image: radial-gradient(ellipse 120% 60% at 50% -5%, rgba(59,130,246,0.18), transparent);
          padding: 32px 24px;
        }
        .group-card {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: border-color 150ms ease, background 150ms ease;
          cursor: pointer;
        }
        .group-card:hover { background: #161e2e; border-color: #374151; }
        .btn-danger {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid #2a1a1a;
          background: transparent;
          color: #6b7280;
          transition: all 150ms ease;
          white-space: nowrap;
        }
        .btn-danger:hover { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.3); }
        .btn-new {
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
        .btn-new:hover { background: #2563eb; transform: scale(1.02); box-shadow: 0 4px 20px rgba(59,130,246,0.35); }
        .btn-new:active { transform: scale(0.97); }
      `}</style>

      <main className="groups-root">
        <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
                        <button className="back-btn" style={{ fontSize: "16px", color: "#9ca3af"}} onClick={() => navigate(-1)}>← Volver</button>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#f9fafb", margin: 0 }}>
                Mis grupos
              </h1>
              <p style={{ fontSize: "13px", color: "#4b5563", margin: 0, marginTop: "2px" }}>
                {user?.displayName}
              </p>
            </div>
            <button
              onClick={() => navigate("/profile")}
              style={{
                background: "#111827", border: "1px solid #1f2937",
                borderRadius: "10px", padding: "8px 14px",
                fontSize: "12px", color: "#6b7280", cursor: "pointer",
                transition: "color 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f9fafb")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
            >
              Perfil
            </button>
          </div>

          {/* Lista */}
          {isLoading ? (
            <p style={{ color: "#4b5563", fontSize: "14px" }}>Cargando...</p>
          ) : myGroups.length === 0 ? (
            <div style={{
              background: "#111827", border: "1px solid #1f2937",
              borderRadius: "14px", padding: "32px",
              textAlign: "center",
            }}>
              <p style={{ color: "#4b5563", fontSize: "14px", margin: 0 }}>
                No tenés grupos todavía
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {myGroups.map((group) => {
                const isCreator = group.createdBy === user?.uid;
                return (
                  <div key={group.id} className="group-card">
                    <div
                      style={{ flex: 1, minWidth: 0 }}
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      <p style={{ fontSize: "15px", fontWeight: 500, color: "#f9fafb", margin: 0 }}>
                        {group.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#4b5563", margin: 0, marginTop: "2px" }}>
                        {group.members.length} miembro{group.members.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      className="btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        isCreator ? deleteGroup(group.id) : leaveGroup(group.id);
                      }}
                    >
                      {isCreator ? "Borrar" : "Salir"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Acciones */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button className="btn-new" onClick={() => navigate("/create")}>
              Crear grupo nuevo
            </button>
            <button
              onClick={() => navigate("/join")}
              style={{
                width: "100%", padding: "13px 16px", borderRadius: "10px",
                fontSize: "14px", fontWeight: 500, cursor: "pointer",
                background: "transparent", color: "#f9fafb",
                border: "1px solid #1f2937", transition: "all 150ms ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#161e2e"; e.currentTarget.style.borderColor = "#374151"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#1f2937"; }}
            >
              Unirse con código
            </button>
          </div>

        </div>
      </main>
    </>
  );
}