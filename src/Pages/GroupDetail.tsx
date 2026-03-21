import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";
import type { GroupType, ShoppingItemType } from "../types";
import AddItemForm from "../componentes/AddItemFor";
import ItemCard from "../componentes/ItemCard";

type FilterType = "all" | "pending" | "purchased";

async function shareGroupCode(name: string, code: string) {
  const text = `Unite a mi lista "${name}" en Lista Compartida 🛒\nCódigo: ${code}`;
  if (navigator.share) {
    try { await navigator.share({ title: `Lista: ${name}`, text }); return; } catch { /* cancelado */ }
  }
  try {
    await navigator.clipboard.writeText(code);
    alert(`Código copiado: ${code}`);
  } catch { alert(`Código del grupo: ${code}`); }
}

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    myGroups, isLoading,
    addItemToGroup, toggleItemPurchased, deleteItemFromGroup,
    updateItemQuantity, updateItemName, updateItemPrice, clearPurchasedItems,
  } = useGroups();
  const [filter, setFilter] = useState<FilterType>("all");
  const [clearConfirm, setClearConfirm] = useState(false);

  const group = useMemo(() => myGroups.find((g: GroupType) => g.id === id), [myGroups, id]);

  const filteredItems = useMemo(() => {
    if (!group) return [];
    if (filter === "pending") return group.items.filter((i: ShoppingItemType) => !i.purchased);
    if (filter === "purchased") return group.items.filter((i: ShoppingItemType) => i.purchased);
    return group.items;
  }, [group, filter]);

  const pendingCount = useMemo(() => group ? group.items.filter((i) => !i.purchased).length : 0, [group]);
  const purchasedCount = useMemo(() => group ? group.items.filter((i) => i.purchased).length : 0, [group]);

  const totalEstimado = useMemo(() => {
    if (!group) return null;
    const priced = group.items.filter((i) => i.price !== undefined && i.price > 0);
    if (!priced.length) return null;
    return priced.reduce((acc, item) => acc + (item.price ?? 0) * (parseFloat(item.quantity) || 1), 0);
  }, [group]);

  const totalComprado = useMemo(() => {
    if (!group) return null;
    const priced = group.items.filter((i) => i.purchased && i.price !== undefined && i.price > 0);
    if (!priced.length) return null;
    return priced.reduce((acc, item) => acc + (item.price ?? 0) * (parseFloat(item.quantity) || 1), 0);
  }, [group]);

  const fmt = (n: number) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });

  const handleClearPurchased = async () => {
    if (!clearConfirm) { setClearConfirm(true); return; }
    await clearPurchasedItems(group!.id);
    setClearConfirm(false);
    setFilter("all");
  };

  if (isLoading) return (
    <main style={{ minHeight: "100vh", background: "#0b0f19", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#4b5563", fontSize: "14px" }}>Cargando…</p>
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
          padding: 28px 16px 100px;
        }
        .filter-btn {
          padding: 9px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
          cursor: pointer; border: none; transition: all 150ms ease;
          -webkit-tap-highlight-color: transparent; min-height: 38px; flex: 1;
        }
        .filter-btn.active { background: #f9fafb; color: #0b0f19; }
        .filter-btn.inactive { background: #111827; color: #6b7280; border: 1px solid #1f2937; }
        .filter-btn.inactive:active { background: #161e2e; color: #f9fafb; }
        .back-btn {
          background: none; border: none; cursor: pointer; font-size: 13px;
          color: #4b5563; padding: 0; display: flex; align-items: center; gap: 6px;
          -webkit-tap-highlight-color: transparent; min-height: 44px;
        }
        .back-btn:active { color: #f9fafb; }
        .share-btn {
          min-height: 40px; padding: 0 14px; border-radius: 10px; font-size: 13px;
          font-weight: 500; cursor: pointer; background: rgba(59,130,246,0.1);
          color: #3b82f6; border: 1px solid rgba(59,130,246,0.2);
          -webkit-tap-highlight-color: transparent;
        }
        .share-btn:active { background: rgba(59,130,246,0.2); }
        .clear-btn {
          min-height: 38px; padding: 0 14px; border-radius: 8px;
          font-size: 12px; font-weight: 500; cursor: pointer;
          -webkit-tap-highlight-color: transparent; white-space: nowrap;
        }
        .clear-btn.normal { background: transparent; color: #6b7280; border: 1px solid #1f2937; }
        .clear-btn.confirm { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.25); }
        .clear-btn:active { transform: scale(0.96); }
      `}</style>

      <main className="detail-root">
        <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Back */}
          <button className="back-btn" onClick={() => navigate("/groups")}>← Mis grupos</button>

          {/* Header */}
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#f9fafb", margin: 0, flex: 1 }}>{group.name}</h1>
              <button className="share-btn" onClick={() => shareGroupCode(group.name, group.code ?? "")}>
                Compartir 🔗
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "#4b5563" }}>
                Código: <span style={{ color: "#3b82f6", fontWeight: 600, letterSpacing: "1px", cursor: "pointer" }}
                  onClick={() => shareGroupCode(group.name, group.code ?? "")}>{group.code}</span>
              </span>
              <span style={{ fontSize: "12px", color: "#374151" }}>·</span>
              <span style={{ fontSize: "12px", color: "#4b5563" }}>
                {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
              </span>
              {purchasedCount > 0 && <>
                <span style={{ fontSize: "12px", color: "#374151" }}>·</span>
                <span style={{ fontSize: "12px", color: "#10b981" }}>{purchasedCount} comprado{purchasedCount !== 1 ? "s" : ""}</span>
              </>}
            </div>
          </div>

          {/* Total estimado */}
          {(totalEstimado !== null || totalComprado !== null) && (
            <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {totalEstimado !== null && (
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    Total estimado: <span style={{ color: "#f9fafb", fontWeight: 600 }}>{fmt(totalEstimado)}</span>
                  </span>
                )}
                {totalComprado !== null && (
                  <span style={{ fontSize: "12px", color: "#10b981" }}>
                    Ya compraste: <span style={{ fontWeight: 600 }}>{fmt(totalComprado)}</span>
                  </span>
                )}
              </div>
              <span style={{ fontSize: "24px" }}>🧮</span>
            </div>
          )}

          {/* Agregar item */}
          <AddItemForm
            onAdd={async (name, quantity, price) => {
              const exists = group.items.some((item) => item.name.toLowerCase() === name.toLowerCase());
              if (exists) throw new Error(`"${name}" ya está en la lista`);
              await addItemToGroup(group.id, name, quantity, price);
            }}
          />

          {/* Filtros + limpiar */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "6px", flex: 1 }}>
              {(["all", "pending", "purchased"] as FilterType[]).map((f) => (
                <button key={f} className={`filter-btn ${filter === f ? "active" : "inactive"}`} onClick={() => setFilter(f)}>
                  {f === "all" ? "Todos" : f === "pending" ? "Pendientes" : "Comprados"}
                </button>
              ))}
            </div>
            {purchasedCount > 0 && (
              <button className={`clear-btn ${clearConfirm ? "confirm" : "normal"}`}
                onClick={handleClearPurchased} onBlur={() => setClearConfirm(false)}>
                {clearConfirm ? "¿Seguro?" : "Limpiar ✓"}
              </button>
            )}
          </div>

          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredItems.length === 0 ? (
              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "36px", textAlign: "center" }}>
                <p style={{ color: "#4b5563", fontSize: "14px", margin: 0 }}>
                  {filter === "all" ? "Lista vacía · agregá un producto arriba" :
                    filter === "pending" ? "¡Todo comprado! 🎉" : "Todavía no compraste nada"}
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
                  onUpdatePrice={(price) => updateItemPrice(group.id, item.id, price)}
                />
              ))
            )}
          </div>

        </div>
      </main>
    </>
  );
}