import { useState, useRef } from "react";
import type { ShoppingItemType } from "../types";

interface Props {
  item: ShoppingItemType;
  groupId: string;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateName: (name: string) => Promise<void>;
  onUpdateQuantity: (quantity: string) => Promise<void>;
  onUpdatePrice: (price: number | undefined) => Promise<void>;
}

export default function ItemCard({
  item,
  onToggle,
  onDelete,
  onUpdateName,
  onUpdateQuantity,
  onUpdatePrice,
}: Props) {
  const [editingField, setEditingField] = useState<"name" | "quantity" | "price" | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingQuantity, setEditingQuantity] = useState("");
  const [editingPrice, setEditingPrice] = useState("");

  // Swipe-to-delete
  const touchStartX = useRef<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swiped, setSwiped] = useState(false);

  const startEdit = (field: "name" | "quantity" | "price") => {
    setSwiped(false);
    setSwipeOffset(0);
    setEditingField(field);
    if (field === "name") setEditingName(item.name);
    if (field === "quantity") setEditingQuantity(item.quantity);
    if (field === "price") setEditingPrice(item.price !== undefined ? String(item.price) : "");
  };

  const cancelEdit = () => setEditingField(null);

  const saveEdit = async () => {
    if (editingField === "name" && editingName.trim()) await onUpdateName(editingName.trim());
    if (editingField === "quantity") await onUpdateQuantity(editingQuantity.trim());
    if (editingField === "price") {
      const parsed = parseFloat(editingPrice.replace(",", "."));
      await onUpdatePrice(isNaN(parsed) || parsed <= 0 ? undefined : parsed);
    }
    setEditingField(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (editingField) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || editingField) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    if (delta < 0) setSwipeOffset(Math.max(delta, -80));
    else setSwipeOffset(0);
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -60) {
      setSwiped(true);
      setSwipeOffset(-80);
    } else {
      setSwiped(false);
      setSwipeOffset(0);
    }
    touchStartX.current = null;
  };

  const handleCardClick = () => {
    if (swiped) { setSwiped(false); setSwipeOffset(0); }
  };

  const formatPrice = (p: number) =>
    p.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: "14px" }}>
      {/* Zona roja de borrar (swipe) */}
      <div
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "80px",
          background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", borderRadius: "14px",
        }}
        onClick={() => { setSwiped(false); setSwipeOffset(0); onDelete(); }}
      >
        <span style={{ fontSize: "22px" }}>🗑️</span>
      </div>

      {/* Tarjeta principal */}
      <div
        className={`item-card-v2 ${item.purchased ? "purchased" : ""}`}
        style={{ transform: `translateX(${swipeOffset}px)`, transition: touchStartX.current === null ? "transform 220ms ease" : "none" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        <style>{`
          .item-card-v2 {
            background: #111827;
            border: 1px solid #1f2937;
            border-radius: 14px;
            padding: 14px 14px;
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
            -webkit-tap-highlight-color: transparent;
            touch-action: pan-y;
          }
          .item-card-v2.purchased { opacity: 0.5; }
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
          }
          .btn-micro-cancel {
            min-height: 44px; min-width: 44px;
            padding: 0 12px; border-radius: 8px; font-size: 16px;
            cursor: pointer; background: transparent;
            color: #6b7280; border: 1px solid #1f2937;
            -webkit-tap-highlight-color: transparent;
          }
          .btn-circle-toggle {
            width: 40px; height: 40px; border-radius: 50%;
            border: 2px solid #1f2937; background: transparent;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            font-size: 16px; flex-shrink: 0; transition: all 150ms ease;
            -webkit-tap-highlight-color: transparent; color: transparent;
          }
          .btn-circle-toggle.checked {
            background: rgba(16,185,129,0.15); border-color: #10b981; color: #10b981;
          }
          .btn-circle-toggle:active { transform: scale(0.88); }
          .btn-x-delete {
            width: 44px; height: 44px; border-radius: 10px; border: none;
            background: transparent; color: #374151; font-size: 16px;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; -webkit-tap-highlight-color: transparent; transition: all 150ms ease;
          }
          .btn-x-delete:active { color: #ef4444; background: rgba(239,68,68,0.1); }
          .editable-tap {
            background: none; border: none; cursor: pointer; padding: 2px 0;
            text-align: left; width: 100%; -webkit-tap-highlight-color: transparent;
          }
          .price-chip {
            display: inline-flex; align-items: center; gap: 4px;
            font-size: 11px; color: #10b981;
            background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2);
            border-radius: 6px; padding: 3px 8px; margin-top: 3px; cursor: pointer;
            -webkit-tap-highlight-color: transparent;
          }
          .add-price-tap {
            font-size: 11px; color: #374151; background: none;
            border: 1px dashed #1f2937; border-radius: 6px;
            padding: 3px 8px; cursor: pointer; margin-top: 3px;
            -webkit-tap-highlight-color: transparent;
          }
          .add-price-tap:active { border-color: #10b981; color: #10b981; }
        `}</style>

        {/* Checkbox circular */}
        <button
          type="button"
          className={`btn-circle-toggle ${item.purchased ? "checked" : ""}`}
          onClick={onToggle}
          aria-label={item.purchased ? "Desmarcar" : "Marcar como comprado"}
        >
          {item.purchased ? "✓" : ""}
        </button>

        {/* Contenido */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1px" }}>

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
            <button className="editable-tap" type="button" onClick={() => startEdit("name")}>
              <span style={{ fontSize: "15px", fontWeight: 500, lineHeight: 1.4,
                color: item.purchased ? "#4b5563" : "#f9fafb",
                textDecoration: item.purchased ? "line-through" : "none" }}>
                {item.name}
              </span>
            </button>
          )}

          {editingField === "quantity" ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
              <input type="text" className="edit-input-v2" value={editingQuantity}
                onChange={(e) => setEditingQuantity(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                style={{ maxWidth: "140px" }} autoFocus />
              <button type="button" className="btn-micro-save" onClick={saveEdit}>✓</button>
              <button type="button" className="btn-micro-cancel" onClick={cancelEdit}>✕</button>
            </div>
          ) : (
            <button className="editable-tap" type="button" onClick={() => startEdit("quantity")}>
              <span style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.4 }}>
                {item.quantity || "Sin cantidad"} · {item.addedByName || "Alguien"}
              </span>
            </button>
          )}

          {editingField === "price" ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
              <input type="number" inputMode="decimal" className="edit-input-v2" placeholder="Precio"
                value={editingPrice} onChange={(e) => setEditingPrice(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                style={{ maxWidth: "130px" }} autoFocus />
              <button type="button" className="btn-micro-save" onClick={saveEdit}>✓</button>
              <button type="button" className="btn-micro-cancel" onClick={cancelEdit}>✕</button>
            </div>
          ) : item.price !== undefined && item.price > 0 ? (
            <button className="price-chip" type="button" onClick={() => startEdit("price")}>
              💰 {formatPrice(item.price)}
            </button>
          ) : (
            <button className="add-price-tap" type="button" onClick={() => startEdit("price")}>
              + agregar precio
            </button>
          )}
        </div>

        {/* Eliminar (desktop / fallback) */}
        <button type="button" className="btn-x-delete" onClick={onDelete} aria-label="Eliminar">✕</button>
      </div>
    </div>
  );
}