import { useState } from "react";
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
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <>
      <style>{`
        .groups-root {
          min-height: 100vh;
          background: #0b0f19;
          padding: 28px 20px 100px;
        }
        .group-card {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 16px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: background 150ms ease;
          -webkit-tap-highlight-color: transparent;
        }
        .group-card:active { background: #161e2e; }
        .g-btn-destroy {
          padding: 7px 12px; border-radius: 8px; font-size: 12px; font-weight: 500;
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          transition: all 150ms ease; border: 1px solid;
          -webkit-tap-highlight-color: transparent;
        }
        .g-btn-destroy.normal { background: transparent; color: #4b5563; border-color: #1f2937; }
        .g-btn-destroy.confirm { background: rgba(239,68,68,0.08); color: #ef4444; border-color: rgba(239,68,68,0.25); }
        .g-btn-primary {
          width: 100%; min-height: 50px; border-radius: 14px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          background: #3b82f6; color: #fff; border: none;
          transition: transform 150ms ease, background 150ms ease;
          -webkit-tap-highlight-color: transparent;
        }
        .g-btn-primary:active { transform: scale(0.97); background: #2563eb; }
        .g-btn-secondary {
          width: 100%; min-height: 46px; border-radius: 14px;
          font-size: 15px; font-weight: 500; cursor: pointer;
          background: transparent; color: #d1d5db; border: 1px solid #1f2937;
          transition: transform 150ms ease, background 150ms ease;
          -webkit-tap-highlight-color: transparent;
        }
        .g-btn-secondary:active { transform: scale(0.97); background: #111827; }
      `}</style>

      <main className="groups-root">
        <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "4px" }}>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#f9fafb", margin: 0 }}>
                Mis grupos
              </h1>
              <p style={{ fontSize: "13px", color: "#4b5563", margin: "2px 0 0" }}>
                {isGuest ? "Modo sin cuenta" : (user?.displayName ?? "")}
              </p>
            </div>
            {!isGuest && (
              <button
                onClick={() => navigate("/profile")}
                style={{
                  background: "#111827", border: "1px solid #1f2937",
                  borderRadius: "10px", padding: "8px 14px",
                  fontSize: "13px", color: "#6b7280", cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Perfil
              </button>
            )}
          </div>

          {/* Lista de grupos */}
          {isLoading ? (
            <p style={{ color: "#374151", fontSize: "14px" }}>Cargando…</p>
          ) : myGroups.length === 0 ? (
            <div style={{
              background: "#111827", border: "1px solid #1f2937",
              borderRadius: "16px", padding: "40px 24px", textAlign: "center",
            }}>
              <p style={{ color: "#f9fafb", fontSize: "16px", fontWeight: 600, margin: "0 0 6px" }}>
                Todavía no tenés grupos
              </p>
              <p style={{ color: "#4b5563", fontSize: "13px", margin: 0 }}>
                Creá uno o unite con un código
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {myGroups.map((group) => {
                const isCreator = isGuest
                  ? group.createdBy === "guest"
                  : group.createdBy === user?.uid;
                const pending = group.items?.filter((i) => !i.purchased).length ?? 0;
                const total = group.items?.length ?? 0;
                const isConfirm = confirmId === group.id;

                return (
                  <div
                    key={group.id}
                    className="group-card"
                    onClick={() => {
                      if (isConfirm) { setConfirmId(null); return; }
                      navigate(`/groups/${group.id}`);
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      background: groupColor(group.name),
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px", fontWeight: 700, color: "rgba(255,255,255,0.9)",
                      flexShrink: 0,
                    }}>
                      {group.name[0]?.toUpperCase() ?? "?"}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: "#f9fafb", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {group.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#4b5563", margin: "2px 0 0" }}>
                        {total === 0
                          ? "Lista vacía"
                          : pending > 0
                          ? `${pending} pendiente${pending !== 1 ? "s" : ""}`
                          : "Todo comprado ✓"}
                        {group.members.length > 1 && ` · ${group.members.length} personas`}
                      </p>
                    </div>

                    {/* Borrar / Salir */}
                    <button
                      className={`g-btn-destroy ${isConfirm ? "confirm" : "normal"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isCreator) { leaveGroup(group.id); return; }
                        if (isConfirm) {
                          deleteGroup(group.id);
                          setConfirmId(null);
                        } else {
                          setConfirmId(group.id);
                        }
                      }}
                      onBlur={() => setConfirmId(null)}
                    >
                      {isConfirm ? "¿Seguro?" : isCreator ? "Borrar" : "Salir"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Acciones */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button className="g-btn-primary" onClick={() => navigate("/create")}>
              + Crear grupo nuevo
            </button>
            <button className="g-btn-secondary" onClick={() => navigate("/join")}>
              Unirme con código
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
