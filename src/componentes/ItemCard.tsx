import { useState } from "react";
import type { ShoppingItemType } from "../types";

interface Props {
  item: ShoppingItemType;
  groupId: string;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateName: (name: string) => Promise<void>;
  onUpdateQuantity: (quantity: string) => Promise<void>;
  onUpdatePrice: (price: number | undefined, priceMode: "total" | "unit") => Promise<void>;
  onOpenDetail: () => void;
}

export default function ItemCard({
  item,
  onToggle,
  onDelete,
  onUpdateName,
  onUpdateQuantity,
  onUpdatePrice,
  onOpenDetail,
}: Props) {
  const [editingField, setEditingField] = useState<"name" | "quantity" | "price" | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingQuantity, setEditingQuantity] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [editingPriceMode, setEditingPriceMode] = useState<"total" | "unit">("unit");

  const startEdit = (field: "name" | "quantity" | "price") => {
    setEditingField(field);
    if (field === "name") setEditingName(item.name);
    if (field === "quantity") setEditingQuantity(item.quantity);
    if (field === "price") {
      setEditingPrice(item.price !== undefined ? String(item.price) : "");
      setEditingPriceMode(item.priceMode ?? "unit");
    }
  };

  const cancelEdit = () => setEditingField(null);

  const saveEdit = async () => {
    if (editingField === "name" && editingName.trim()) await onUpdateName(editingName.trim());
    if (editingField === "quantity") await onUpdateQuantity(editingQuantity.trim());
    if (editingField === "price") {
      const parsed = parseFloat(editingPrice.replace(",", "."));
      await onUpdatePrice(isNaN(parsed) || parsed <= 0 ? undefined : parsed, editingPriceMode);
    }
    setEditingField(null);
  };

  const formatPrice = (p: number) =>
    p.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });

  const fmtDate = (ts: number) =>
    new Date(ts).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const p = item.purchased;

  return (
    <div
      onClick={!editingField ? onOpenDetail : undefined}
      style={{
        background: p ? "rgba(16,185,129,0.05)" : "#111827",
        border: `1px solid ${p ? "rgba(16,185,129,0.22)" : "#1f2937"}`,
        borderRadius: "14px",
        padding: "12px 12px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        WebkitTapHighlightColor: "transparent",
        transition: "background 200ms ease, border-color 200ms ease",
        cursor: !editingField ? "pointer" : "default",
      }}
    >
      <style>{`
        .edit-input-v2 {
          background: #0b0f19;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 15px;
          color: #f9fafb;
          outline: none;
          flex: 1;
          min-width: 0;
          -webkit-appearance: none;
        }
        .edit-input-v2:focus { border-color: #3b82f6; }
        .btn-micro-save {
          min-height: 44px; min-width: 44px;
          padding: 0 12px; border-radius: 8px; font-size: 16px;
          cursor: pointer; background: rgba(16,185,129,0.15);
          color: #10b981; border: 1px solid rgba(16,185,129,0.2);
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .btn-micro-cancel {
          min-height: 44px; min-width: 44px;
          padding: 0 12px; border-radius: 8px; font-size: 16px;
          cursor: pointer; background: transparent;
          color: #6b7280; border: 1px solid #1f2937;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .btn-toggle-card {
          padding: 11px 16px; border-radius: 20px; font-size: 15px; font-weight: 600;
          cursor: pointer; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent; white-space: nowrap;
          touch-action: manipulation;
          transition: all 150ms ease;
          border: 1px solid rgba(16,185,129,0.35);
          background: rgba(16,185,129,0.08);
          color: #10b981;
          letter-spacing: 0.2px;
        }
        .btn-toggle-card.done {
          border-color: rgba(16,185,129,0.4);
          background: rgba(16,185,129,0.12);
          color: #34d399;
        }
        .btn-toggle-card:active { transform: scale(0.92); }
        .btn-delete-card {
          width: 46px; height: 46px; border-radius: 8px; border: none;
          background: rgba(239,68,68,0.07); color: #f87171; font-size: 20px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          transition: background 150ms ease;
        }
        .btn-delete-card:active { background: rgba(239,68,68,0.18); }
        .editable-tap {
          background: none; border: none; cursor: pointer; padding: 1px 0;
          text-align: left; width: 100%; -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .price-chip-card {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 14px; color: #10b981;
          background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.18);
          border-radius: 20px; padding: 5px 12px; cursor: pointer;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          white-space: nowrap;
        }
        .add-price-tap-card {
          font-size: 14px; color: #4b5563; background: none;
          border: 1px dashed #1f2937; border-radius: 20px;
          padding: 5px 12px; cursor: pointer;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
        }
        .add-price-tap-card:active { border-color: #10b981; color: #10b981; }
        .store-badge {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 14px; color: #60a5fa;
          background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.15);
          border-radius: 20px; padding: 5px 12px;
          white-space: nowrap;
        }
      `}</style>

      {/* Toggle — oculto mientras se edita */}
      {!editingField && (
        <button
          type="button"
          className={`btn-toggle-card ${p ? "done" : ""}`}
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
        >
          {p ? "✓ Listo" : "Comprar"}
        </button>
      )}

      {/* Contenido */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "3px" }}>

        {/* Nombre */}
        {editingField === "name" ? (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input type="text" className="edit-input-v2" value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
              autoFocus />
            <button type="button" className="btn-micro-save" onClick={saveEdit}>✓</button>
            <button type="button" className="btn-micro-cancel" onClick={cancelEdit}>✕</button>
          </div>
        ) : (
          <button className="editable-tap" type="button" onClick={(e) => { e.stopPropagation(); startEdit("name"); }}>
            <span style={{
              fontSize: "19px", fontWeight: 600, lineHeight: 1.3,
              color: p ? "#9ca3af" : "#f9fafb",
              textDecoration: p ? "line-through" : "none",
              textDecorationColor: "rgba(156,163,175,0.5)",
            }}>
              {item.name}
            </span>
          </button>
        )}

        {/* Cantidad + quién agregó */}
        {editingField === "quantity" ? (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input type="text" className="edit-input-v2" value={editingQuantity}
              onChange={(e) => setEditingQuantity(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
              style={{ maxWidth: "140px" }} autoFocus />
            <button type="button" className="btn-micro-save" onClick={saveEdit}>✓</button>
            <button type="button" className="btn-micro-cancel" onClick={cancelEdit}>✕</button>
          </div>
        ) : (
          <button className="editable-tap" type="button" onClick={(e) => { e.stopPropagation(); startEdit("quantity"); }}>
            <span style={{ fontSize: "15px", color: p ? "#6b7280" : "#9ca3af", lineHeight: 1.4 }}>
              {item.quantity || "Sin cantidad"} · {item.addedByName || "Alguien"}
            </span>
          </button>
        )}

        {/* Fechas */}
        {!editingField && (item.createdAt || item.purchasedAt) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "1px" }}>
            {item.createdAt && (
              <span style={{ fontSize: "11px", color: "#4b5563" }}>
                Agregado: {fmtDate(item.createdAt)}
              </span>
            )}
            {item.purchasedAt && (
              <>
                <span style={{ fontSize: "11px", color: "#374151" }}>·</span>
                <span style={{ fontSize: "11px", color: "#10b981" }}>
                  Comprado: {fmtDate(item.purchasedAt)}
                </span>
              </>
            )}
          </div>
        )}

        {/* Precio + tienda en la misma fila */}
        {editingField === "price" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "2px" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {(["unit", "total"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setEditingPriceMode(mode)}
                  style={{
                    flex: 1, padding: "5px 0", borderRadius: "6px", fontSize: "11px",
                    cursor: "pointer", border: "1px solid",
                    borderColor: editingPriceMode === mode ? "#3b82f6" : "#1f2937",
                    background: editingPriceMode === mode ? "rgba(59,130,246,0.15)" : "transparent",
                    color: editingPriceMode === mode ? "#60a5fa" : "#6b7280",
                    transition: "all 120ms ease",
                  }}
                >
                  {mode === "unit" ? "Por unidad" : "Total"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input type="number" inputMode="decimal" className="edit-input-v2" placeholder="Precio"
                value={editingPrice} onChange={(e) => setEditingPrice(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                style={{ maxWidth: "130px" }} autoFocus />
              <button type="button" className="btn-micro-save" onClick={saveEdit}>✓</button>
              <button type="button" className="btn-micro-cancel" onClick={cancelEdit}>✕</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center", marginTop: "1px" }}>
            {item.price !== undefined && item.price > 0 ? (
              <button className="price-chip-card" type="button" onClick={(e) => { e.stopPropagation(); startEdit("price"); }}>
                💰 {formatPrice(item.price)}{item.priceMode === "unit" ? " /u" : " total"}
              </button>
            ) : (
              <button className="add-price-tap-card" type="button" onClick={(e) => { e.stopPropagation(); startEdit("price"); }}>
                + precio
              </button>
            )}
            {item.store && (
              <span className="store-badge">🛒 {item.store}</span>
            )}
          </div>
        )}
      </div>

      {/* Imagen */}
      {item.imageUrl && !editingField && (
        <div style={{
          width: "48px", height: "48px", borderRadius: "10px", flexShrink: 0,
          border: p ? "1px solid rgba(16,185,129,0.2)" : "1px solid #1f2937",
          background: "#0b0f19", overflow: "hidden", opacity: p ? 0.7 : 1,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img
            src={item.imageUrl}
            alt={item.name}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      {/* Detalle + Borrar — ocultos mientras se edita */}
      {!editingField && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpenDetail(); }}
            aria-label="Ver detalle"
            style={{
              width: "46px", height: "46px", borderRadius: "8px", border: "1px solid #1f2937",
              background: "rgba(59,130,246,0.07)", color: "#60a5fa", fontSize: "20px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, WebkitTapHighlightColor: "transparent",
            }}
          >
            ℹ
          </button>
          <button
            type="button"
            className="btn-delete-card"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            aria-label="Eliminar"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
}
