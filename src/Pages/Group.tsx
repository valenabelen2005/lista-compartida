import { useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";
import { useAuth } from "../context/AuthContext";

const GROUP_COLORS = [
  "linear-gradient(135deg, #1e3a5f, #2563eb)",
  "linear-gradient(135deg, #4a1d6e, #7c3aed)",
  "linear-gradient(135deg, #064e3b, #059669)",
  "linear-gradient(135deg, #7c2d12, #ea580c)",
  "linear-gradient(135deg, #881337, #e11d48)",
  "linear-gradient(135deg, #164e63, #0891b2)",
];

function groupColor(name: string): string {
  return GROUP_COLORS[name.charCodeAt(0) % GROUP_COLORS.length];
}

export default function Groups() {
  const { myGroups, isLoading, leaveGroup, deleteGroup } = useGroups();
  const { user, isGuest } = useAuth();
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
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: border-color 180ms ease, background 180ms ease, transform 180ms ease, box-shadow 180ms ease;
          cursor: pointer;
        }
        .group-card:hover {
          background: #161e2e;
          border-color: #374151;
          transform: scale(1.01);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .btn-action-danger {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(239,68,68,0.2);
          background: transparent;
          color: #6b7280;
          transition: all 150ms ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .btn-action-danger:hover { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.4); }
        .btn-primary {
          width: 100%;
          padding: 13px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background: #3b82f6;
          color: #fff;
          border: none;
          transition: transform 150ms ease, background 150ms ease, box-shadow 150ms ease;
        }
        .btn-primary:hover { background: #2563eb; transform: scale(1.02); box-shadow: 0 4px 20px rgba(59,130,246,0.35); }
        .btn-primary:active { transform: scale(0.97); }
        .btn-secondary {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          background: transparent;
          color: #9ca3af;
          border: 1px solid #1f2937;
          transition: all 150ms ease;
        }
        .btn-secondary:hover { background: #161e2e; border-color: #374151; color: #f9fafb; }
      `}</style>

      <main className="groups-root">
        <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

          <button
            className="back-btn"
            style={{ fontSize: "16px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
            onClick={() => navigate("/")}
          >
            ← Volver
          </button>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#f9fafb", margin: 0 }}>
                Mis grupos
              </h1>
              <p style={{ fontSize: "13px", color: "#4b5563", margin: 0, marginTop: "2px" }}>
                {isGuest ? "Modo invitado" : user?.displayName}
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
                const isCreator = isGuest
                  ? group.createdBy === "guest"
                  : group.createdBy === user?.uid;
                return (
                  <div key={group.id} className="group-card">

                    {/* Avatar del grupo */}
                    <div
                      onClick={() => navigate(`/groups/${group.id}`)}
                      style={{
                        width: "40px", height: "40px", borderRadius: "50%",
                        background: groupColor(group.name),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "16px", fontWeight: 700, color: "rgba(255,255,255,0.9)",
                        flexShrink: 0,
                      }}
                    >
                      {group.name[0]?.toUpperCase() ?? "?"}
                    </div>

                    {/* Info */}
                    <div
                      style={{ flex: 1, minWidth: 0 }}
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      <p style={{ fontSize: "15px", fontWeight: 600, color: "#f9fafb", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {group.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#4b5563", margin: 0, marginTop: "2px" }}>
                        {group.members.length} miembro{group.members.length !== 1 ? "s" : ""}
                        {group.items?.length > 0 && ` · ${group.items.length} ítems`}
                      </p>
                    </div>

                    {/* Acción */}
                    <button
                      className="btn-action-danger"
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
            <button className="btn-primary" onClick={() => navigate("/create")}>
              + Crear grupo nuevo
            </button>
            <button className="btn-secondary" onClick={() => navigate("/join")}>
              Unirse con código
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
