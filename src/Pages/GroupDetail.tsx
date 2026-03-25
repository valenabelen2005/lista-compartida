import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";
import type { GroupType, ShoppingItemType } from "../types";
import AddItemForm from "../componentes/AddItemFor";
import ItemCard from "../componentes/ItemCard";
import ItemDetailModal from "../componentes/ItemDetailModal";

type FilterType = "pending" | "purchased";

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
    updateItemQuantity, updateItemName, updateItemPrice, updateItemNotes, clearPurchasedItems,
  } = useGroups();

  const [filter, setFilter] = useState<FilterType>("pending");
  const [showAddModal, setShowAddModal] = useState(false);
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [clearConfirm, setClearConfirm] = useState(false);
  const [detailItemId, setDetailItemId] = useState<string | null>(null);

  const group = useMemo(() => myGroups.find((g: GroupType) => g.id === id), [myGroups, id]);

  const detailItem = useMemo(
    () => (detailItemId ? group?.items.find((i) => i.id === detailItemId) ?? null : null),
    [detailItemId, group]
  );

  // Tiendas únicas presentes en los items del grupo
  const availableStores = useMemo(() => {
    if (!group) return [];
    const stores = group.items.map((i) => i.store).filter(Boolean) as string[];
    return [...new Set(stores)];
  }, [group]);

  const filteredItems = useMemo(() => {
    if (!group) return [];
    let items = group.items;
    if (filter === "pending") items = items.filter((i) => !i.purchased);
    else items = items.filter((i) => i.purchased);
    if (storeFilter !== "all") items = items.filter((i) => (i.store ?? "") === storeFilter);
    return items;
  }, [group, filter, storeFilter]);

  const pendingCount = useMemo(() => group ? group.items.filter((i) => !i.purchased).length : 0, [group]);
  const purchasedCount = useMemo(() => group ? group.items.filter((i) => i.purchased).length : 0, [group]);

  const itemTotal = (item: ShoppingItemType) => {
    if (!item.price || item.price <= 0) return 0;
    if (item.priceMode === "total") return item.price;
    return item.price * (parseFloat(item.quantity) || 1);
  };

  const totalEstimado = useMemo(() => {
    if (!group) return null;
    const priced = group.items.filter((i) => i.price !== undefined && i.price > 0);
    if (!priced.length) return null;
    return priced.reduce((acc, item) => acc + itemTotal(item), 0);
  }, [group]);

  const totalComprado = useMemo(() => {
    if (!group) return null;
    const priced = group.items.filter((i) => i.purchased && i.price !== undefined && i.price > 0);
    if (!priced.length) return null;
    return priced.reduce((acc, item) => acc + itemTotal(item), 0);
  }, [group]);

  const fmt = (n: number) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });

  // Nombres de miembros desde memberNames o fallback al count
  const memberNamesDisplay = useMemo(() => {
    if (!group) return null;
    const names = group.memberNames ? Object.values(group.memberNames) : [];
    if (names.length === 0) return `${group.members.length} miembro${group.members.length !== 1 ? "s" : ""}`;
    return names.join(", ");
  }, [group]);

  const handleClearPurchased = async () => {
    if (!clearConfirm) { setClearConfirm(true); return; }
    await clearPurchasedItems(group!.id);
    setClearConfirm(false);
    setFilter("pending");
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
        .store-chip {
          padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;
          cursor: pointer; border: 1px solid; white-space: nowrap;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          transition: all 150ms ease; flex-shrink: 0;
        }
        .store-chip.active { background: rgba(59,130,246,0.15); color: #60a5fa; border-color: rgba(59,130,246,0.3); }
        .store-chip.inactive { background: transparent; color: #6b7280; border-color: #1f2937; }
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

            {/* Miembros */}
            {memberNamesDisplay && (
              <p style={{ fontSize: "12px", color: "#4b5563", margin: "6px 0 0", lineHeight: 1.4 }}>
                👥 {memberNamesDisplay}
              </p>
            )}
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

          {/* Botón agregar */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              width: "100%", minHeight: "50px", borderRadius: "12px",
              fontSize: "15px", fontWeight: 600, cursor: "pointer",
              background: "#3b82f6", color: "#fff", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              WebkitTapHighlightColor: "transparent",
              transition: "background 150ms ease",
            }}
          >
            + Agregar producto
          </button>

          {/* Filtro por estado */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "6px", flex: 1 }}>
              {(["pending", "purchased"] as FilterType[]).map((f) => (
                <button key={f} className={`filter-btn ${filter === f ? "active" : "inactive"}`} onClick={() => setFilter(f)}>
                  {f === "pending" ? `Pendientes (${pendingCount})` : `Comprados (${purchasedCount})`}
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

          {/* Filtro por tienda — solo si hay tiendas */}
          {availableStores.length > 0 && (
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
              <button
                className={`store-chip ${storeFilter === "all" ? "active" : "inactive"}`}
                onClick={() => setStoreFilter("all")}
              >
                Todas
              </button>
              {availableStores.map((s) => (
                <button
                  key={s}
                  className={`store-chip ${storeFilter === s ? "active" : "inactive"}`}
                  onClick={() => setStoreFilter(s)}
                >
                  🛒 {s}
                </button>
              ))}
            </div>
          )}

          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredItems.length === 0 ? (
              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "36px", textAlign: "center" }}>
                <p style={{ color: "#4b5563", fontSize: "14px", margin: 0 }}>
                  {storeFilter !== "all" ? `Sin productos de ${storeFilter} en este filtro` :
                    group.items.length === 0 ? "Lista vacía · agregá un producto arriba" :
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
                  onUpdatePrice={(price, priceMode) => updateItemPrice(group.id, item.id, price, priceMode)}
                  onOpenDetail={() => setDetailItemId(item.id)}
                />
              ))
            )}
          </div>

        </div>
      </main>

      {/* Modal de detalle */}
      {detailItem && (
        <ItemDetailModal
          item={detailItem}
          onClose={() => setDetailItemId(null)}
          onUpdateNotes={(notes) => updateItemNotes(group.id, detailItem.id, notes)}
        />
      )}

      {/* Modal agregar producto */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.65)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            padding: "0 0 16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0b0f19", borderRadius: "20px 20px 16px 16px",
              border: "1px solid #1f2937",
              width: "100%", maxWidth: "480px",
              maxHeight: "90vh", overflowY: "auto",
              padding: "12px 16px 24px",
              display: "flex", flexDirection: "column", gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#f9fafb" }}>Agregar producto</span>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: "#1f2937", border: "none", borderRadius: "8px",
                  color: "#9ca3af", fontSize: "16px", width: "32px", height: "32px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >✕</button>
            </div>
            <AddItemForm
              onClose={() => setShowAddModal(false)}
              onAdd={async (name, quantity, price, store, imageUrl, priceMode, notes) => {
                const exists = group.items.some((item) => item.name.toLowerCase() === name.toLowerCase());
                if (exists) throw new Error(`"${name}" ya está en la lista`);
                await addItemToGroup(group.id, name, quantity, price, store, imageUrl, priceMode, notes);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
