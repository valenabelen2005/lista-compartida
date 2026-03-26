import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";
import type { GroupType, ShoppingItemType } from "../types";
import AddItemForm from "../componentes/AddItemFor";
import ItemCard from "../componentes/ItemCard";
import ItemDetailModal from "../componentes/ItemDetailModal";
import TemplatesModal from "../componentes/TemplatesModal";
import FavoritesModal from "../componentes/FavoritesModal";
import { useTemplatesFavorites } from "../hooks/useTemplatesFavorites";

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
    updateItemQuantity, updateItemName, updateItemPrice, updateItemStore, updateItemNotes, clearPurchasedItems,
    updateGroupName, addItemsFromTemplate, setItemsFromTemplate,
    createGroupTemplate, updateGroupTemplate, deleteGroupTemplate,
  } = useGroups();

  const { favorites, addFavorite, removeFavorite } = useTemplatesFavorites();

  const [filter, setFilter] = useState<FilterType>("pending");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [clearConfirm, setClearConfirm] = useState(false);
  const [detailItemId, setDetailItemId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [groupNameValue, setGroupNameValue] = useState("");

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
          padding: 24px 16px 100px;
        }
        .tab-btn {
          flex: 1; padding: 10px 0; font-size: 15px; font-weight: 500;
          cursor: pointer; border: none; background: transparent;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          transition: color 150ms ease; border-bottom: 2px solid transparent;
        }
        .tab-btn.active { color: #f9fafb; border-bottom-color: #3b82f6; }
        .tab-btn.inactive { color: #4b5563; }
        .tab-btn.inactive:active { color: #9ca3af; }
        .store-chip {
          padding: 5px 12px; border-radius: 20px; font-size: 12px;
          cursor: pointer; border: 1px solid; white-space: nowrap;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          transition: all 150ms ease; flex-shrink: 0;
        }
        .store-chip.active { background: rgba(59,130,246,0.1); color: #60a5fa; border-color: rgba(59,130,246,0.25); }
        .store-chip.inactive { background: transparent; color: #6b7280; border-color: #1f2937; }
        .back-btn {
          background: none; border: none; cursor: pointer; font-size: 13px;
          color: #4b5563; padding: 0; display: flex; align-items: center; gap: 6px;
          -webkit-tap-highlight-color: transparent; min-height: 44px;
        }
        .back-btn:active { color: #9ca3af; }
        .share-btn {
          min-height: 36px; padding: 0 12px; border-radius: 8px; font-size: 13px;
          cursor: pointer; background: transparent; color: #4b5563;
          border: 1px solid #1f2937; -webkit-tap-highlight-color: transparent;
          display: flex; align-items: center; gap: 6px;
        }
        .share-btn:active { color: #f9fafb; border-color: #374151; }
        .clear-btn {
          min-height: 34px; padding: 0 12px; border-radius: 8px;
          font-size: 12px; font-weight: 500; cursor: pointer;
          -webkit-tap-highlight-color: transparent; white-space: nowrap;
        }
        .clear-btn.normal { background: transparent; color: #6b7280; border: 1px solid #1f2937; }
        .clear-btn.confirm { background: rgba(239,68,68,0.08); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
        .clear-btn:active { opacity: 0.7; }
      `}</style>

      <main className="detail-root">
        <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Back + Share en la misma fila */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button className="back-btn" onClick={() => navigate("/groups")}>← Mis grupos</button>
            <button className="share-btn" onClick={() => shareGroupCode(group.name, group.code ?? "")}>
              🔗 Compartir
            </button>
          </div>

          {/* Header — nombre centrado y editable */}
          <div style={{ textAlign: "center" }}>
            {editingGroupName ? (
              <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "center", marginBottom: "6px" }}>
                <input
                  type="text"
                  value={groupNameValue}
                  onChange={(e) => setGroupNameValue(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && groupNameValue.trim()) {
                      await updateGroupName(group.id, groupNameValue.trim());
                      setEditingGroupName(false);
                    }
                    if (e.key === "Escape") setEditingGroupName(false);
                  }}
                  autoFocus
                  style={{
                    background: "#111827", border: "1px solid #374151", borderRadius: "10px",
                    padding: "10px 14px", fontSize: "22px", fontWeight: 700, color: "#f9fafb",
                    outline: "none", textAlign: "center", width: "100%", maxWidth: "300px",
                  }}
                />
                <button
                  onClick={async () => { if (groupNameValue.trim()) { await updateGroupName(group.id, groupNameValue.trim()); setEditingGroupName(false); } }}
                  style={{ height: "44px", minWidth: "44px", borderRadius: "10px", border: "none", background: "rgba(16,185,129,0.12)", color: "#10b981", fontSize: "18px", cursor: "pointer" }}
                >✓</button>
                <button
                  onClick={() => setEditingGroupName(false)}
                  style={{ height: "44px", minWidth: "44px", borderRadius: "10px", border: "1px solid #1f2937", background: "transparent", color: "#6b7280", fontSize: "18px", cursor: "pointer" }}
                >✕</button>
              </div>
            ) : (
              <h1
                onClick={() => { setGroupNameValue(group.name); setEditingGroupName(true); }}
                style={{ fontSize: "28px", fontWeight: 700, color: "#f9fafb", margin: "0 0 6px", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
              >
                {group.name} <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.25)" }}>✎</span>
              </h1>
            )}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
                onClick={() => shareGroupCode(group.name, group.code ?? "")}>
                {group.code}
              </span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)" }}>·</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
                {purchasedCount > 0 && ` · ${purchasedCount} comprado${purchasedCount !== 1 ? "s" : ""}`}
              </span>
              {memberNamesDisplay && (
                <>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)" }}>·</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{memberNamesDisplay}</span>
                </>
              )}
            </div>
          </div>

          {/* Total estimado — limpio, sin card */}
          {(totalEstimado !== null || totalComprado !== null) && (
            <div style={{ paddingLeft: "2px", display: "flex", flexDirection: "column", gap: "2px" }}>
              {totalEstimado !== null && (
                <span style={{ fontSize: "14px", color: "#9ca3af" }}>
                  Total estimado <span style={{ color: "#f9fafb", fontWeight: 700, fontSize: "22px", marginLeft: "6px" }}>{fmt(totalEstimado)}</span>
                </span>
              )}
              {totalComprado !== null && (
                <span style={{ fontSize: "12px", color: "rgba(16,185,129,0.7)" }}>
                  Ya compraste <span style={{ fontWeight: 600, color: "#10b981" }}>{fmt(totalComprado)}</span>
                </span>
              )}
            </div>
          )}

          {/* CTA principal */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              width: "100%", minHeight: "46px", borderRadius: "12px",
              fontSize: "15px", fontWeight: 600, cursor: "pointer",
              background: "#3b82f6", color: "#fff", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              WebkitTapHighlightColor: "transparent",
              transition: "opacity 150ms ease",
              letterSpacing: "0.1px",
            }}
          >
            + Agregar producto
          </button>

          {/* Acciones secundarias: Plantillas + Favoritos */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setShowTemplates(true)}
              style={{
                flex: 1, minHeight: "38px", borderRadius: "10px", fontSize: "13px", fontWeight: 500,
                cursor: "pointer", background: "transparent", color: "#9ca3af",
                border: "1px solid #1f2937", WebkitTapHighlightColor: "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
              }}
            >
              📋 Plantillas
            </button>
            <button
              onClick={() => setShowFavorites(true)}
              style={{
                flex: 1, minHeight: "38px", borderRadius: "10px", fontSize: "13px", fontWeight: 500,
                cursor: "pointer", background: "transparent", color: "#9ca3af",
                border: "1px solid #1f2937", WebkitTapHighlightColor: "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
              }}
            >
              ⭐ Favoritos
            </button>
          </div>

          {/* Tabs — estilo underline, sin fondos pesados */}
          <div>
            <div style={{ display: "flex", borderBottom: "1px solid #1f2937" }}>
              {(["pending", "purchased"] as FilterType[]).map((f) => (
                <button key={f} className={`tab-btn ${filter === f ? "active" : "inactive"}`} onClick={() => setFilter(f)}>
                  {f === "pending" ? `Pendientes (${pendingCount})` : `Comprados (${purchasedCount})`}
                </button>
              ))}
            </div>
            {purchasedCount > 0 && filter === "purchased" && (
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "10px" }}>
                <button className={`clear-btn ${clearConfirm ? "confirm" : "normal"}`}
                  onClick={handleClearPurchased} onBlur={() => setClearConfirm(false)}>
                  {clearConfirm ? "¿Seguro?" : "Limpiar ✓"}
                </button>
              </div>
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
                  onUpdateStore={(store) => updateItemStore(group.id, item.id, store)}
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
          isFavorite={favorites.some((f) => f.name.toLowerCase() === detailItem.name.toLowerCase())}
          onSaveAsFavorite={(item) => addFavorite({
            name: item.name, quantity: item.quantity,
            price: item.price, priceMode: item.priceMode,
            store: item.store, imageUrl: item.imageUrl,
          })}
        />
      )}

      {/* Modal Plantillas */}
      {showTemplates && (
        <TemplatesModal
          templates={group.templates ?? []}
          currentItems={group.items}
          onClose={() => setShowTemplates(false)}
          onAddItems={(items) => addItemsFromTemplate(group.id, items)}
          onReplaceItems={(items) => setItemsFromTemplate(group.id, items)}
          onCreateTemplate={(name, items) => createGroupTemplate(group.id, name, items)}
          onUpdateTemplate={(tplId, changes) => updateGroupTemplate(group.id, tplId, changes)}
          onDeleteTemplate={(tplId) => deleteGroupTemplate(group.id, tplId)}
        />
      )}

      {/* Modal Favoritos */}
      {showFavorites && (
        <FavoritesModal
          favorites={favorites}
          currentItems={group.items}
          onClose={() => setShowFavorites(false)}
          onAddItem={async (fav) => {
            await addItemToGroup(group.id, fav.name, fav.quantity, fav.price, fav.store, fav.imageUrl, fav.priceMode);
          }}
          onRemoveFavorite={removeFavorite}
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
