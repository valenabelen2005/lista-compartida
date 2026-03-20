import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";
import type { GroupType, ShoppingItemType } from "../types";
import AddItemForm from "../componentes/AddItemFor";
import ItemCard from "../componentes/ItemCard";

type FilterType = "all" | "pending" | "purchased";

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { myGroups, isLoading, addItemToGroup, toggleItemPurchased, deleteItemFromGroup, updateItemQuantity, updateItemName } = useGroups();
  const [filter, setFilter] = useState<FilterType>("all");

  const group = useMemo(() => myGroups.find((g: GroupType) => g.id === id), [myGroups, id]);

  const filteredItems = useMemo(() => {
    if (!group) return [];
    if (filter === "pending") return group.items.filter((i: ShoppingItemType) => !i.purchased);
    if (filter === "purchased") return group.items.filter((i: ShoppingItemType) => i.purchased);
    return group.items;
  }, [group, filter]);

  const pendingCount = useMemo(() => {
    if (!group) return 0;
    return group.items.filter((i) => !i.purchased).length;
  }, [group]);

  if (isLoading) return (
    <main style={{ minHeight: "100vh", background: "#0b0f19", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#4b5563", fontSize: "14px" }}>Cargando...</p>
    </main>
  );

  if (!group) return (
    <main style={{ minHeight: "100vh", background: "#0b0f19", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#4b5563", fontSize: "14px" }}>Grupo no encontrado</p>
    </main>
  );

  return (
    <>
      <style>{`
        .detail-root {
          min-height: 100vh;
          background: #0b0f19;
          background-image: radial-gradient(ellipse 120% 60% at 50% -5%, rgba(59,130,246,0.18), transparent);
          padding: 32px 24px;
        }
        .filter-btn {
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 150ms ease;
        }
        .filter-btn.active {
          background: #f9fafb;
          color: #0b0f19;
        }
        .filter-btn.inactive {
          background: #111827;
          color: #6b7280;
          border: 1px solid #1f2937;
        }
        .filter-btn.inactive:hover {
          background: #161e2e;
          color: #f9fafb;
          border-color: #374151;
        }
        .back-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
          color: #4b5563;
          padding: 0;
          transition: color 150ms ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .back-btn:hover { color: #f9fafb; }
      `}</style>

      <main className="detail-root">
        <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Back */}
          <button className="back-btn" onClick={() => navigate("/groups")}>
            ← Mis grupos
          </button>

          {/* Header */}
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#f9fafb", margin: 0 }}>
              {group.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
              <span style={{ fontSize: "12px", color: "#4b5563" }}>
                Código: <span style={{ color: "#6b7280", fontWeight: 500 }}>{group.code}</span>
              </span>
              <span style={{ fontSize: "12px", color: "#4b5563" }}>·</span>
              <span style={{ fontSize: "12px", color: "#4b5563" }}>
                {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Agregar item */}
          <AddItemForm onAdd={(name, quantity) => addItemToGroup(group.id, name, quantity)} />

          {/* Filtros */}
          <div style={{ display: "flex", gap: "8px" }}>
            {(["all", "pending", "purchased"] as FilterType[]).map((f) => (
              <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : "inactive"}`}
              onClick={() => setFilter(f)}
              >
                {f === "all" ? "Todos" : f === "pending" ? "Pendientes" : "Comprados"}
              </button>
            ))}
          </div>

          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredItems.length === 0 ? (
              <div style={{
                background: "#111827", border: "1px solid #1f2937",
                borderRadius: "14px", padding: "32px", textAlign: "center",
              }}>
                <p style={{ color: "#4b5563", fontSize: "14px", margin: 0 }}>
                  No hay productos aquí
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  groupId={group.id}
                  onToggle={() => toggleItemPurchased(group.id, item.id)}
                  onDelete={() => deleteItemFromGroup(group.id, item.id)}
                  onUpdateName={(name) => updateItemName(group.id, item.id, name)}
                  onUpdateQuantity={(quantity) => updateItemQuantity(group.id, item.id, quantity)}
                />
              ))
            )}
          </div>

        </div>
      </main>
    </>
  );
}