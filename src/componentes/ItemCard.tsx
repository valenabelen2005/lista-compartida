import { useState } from "react";
import type { ShoppingItemType } from "../types";

const STORE_OPTIONS = ["Dia", "Mercadona", "Amazon", "Lidl", "Ikea", "Carrefour", "Otro"];

interface Props {
  item: ShoppingItemType;
  groupId: string;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateName: (name: string) => Promise<void>;
  onUpdateQuantity: (quantity: string) => Promise<void>;
  onUpdatePrice: (price: number | undefined, priceMode: "total" | "unit") => Promise<void>;
  onUpdateStore: (store: string | undefined) => Promise<void>;
  onOpenDetail: () => void;
}

export default function ItemCard({
  item, onToggle, onDelete, onUpdateName, onUpdateQuantity, onUpdatePrice, onUpdateStore, onOpenDetail,
}: Props) {
  const [editingField, setEditingField] = useState<"name" | "quantity" | "price" | "store" | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingQuantity, setEditingQuantity] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [editingPriceMode, setEditingPriceMode] = useState<"total" | "unit">("unit");
  const [editingStore, setEditingStore] = useState("");
  const [editingStoreCustom, setEditingStoreCustom] = useState("");

  const startEdit = (field: "name" | "quantity" | "price" | "store") => {
    setEditingField(field);
    if (field === "name") setEditingName(item.name);
    if (field === "quantity") setEditingQuantity(item.quantity);
    if (field === "price") {
      setEditingPrice(item.price !== undefined ? String(item.price) : "");
      setEditingPriceMode(item.priceMode ?? "unit");
    }
    if (field === "store") {
      const current = item.store ?? "";
      const isKnown = STORE_OPTIONS.includes(current);
      setEditingStore(isKnown ? current : (current ? "Otro" : ""));
      setEditingStoreCustom(isKnown ? "" : current);
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
    if (editingField === "store") {
      const final = editingStore === "Otro" ? editingStoreCustom.trim() : editingStore;
      await onUpdateStore(final || undefined);
    }
    setEditingField(null);
  };

  const formatPrice = (n: number) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });

  const fmtDate = (ts: number) =>
    new Date(ts).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" });

  const p = item.purchased;

  return (
    <div
      onClick={!editingField ? onOpenDetail : undefined}
      style={{
        background: p ? "rgba(16,185,129,0.04)" : "#111827",
        border: `1px solid ${p ? "rgba(16,185,129,0.12)" : "#1f2937"}`,
        borderRadius: "16px",
        padding: "14px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        cursor: !editingField ? "pointer" : "default",
        WebkitTapHighlightColor: "transparent",
        transition: "background 150ms ease",
      }}
    >
      <style>{`
        .ic-inp {
          background: #0b0f19; border: 1px solid #374151; border-radius: 10px;
          padding: 10px 12px; font-size: 15px; color: #f9fafb; outline: none;
          flex: 1; min-width: 0; -webkit-appearance: none; font-family: inherit;
        }
        .ic-inp:focus { border-color: #3b82f6; }
        .ic-ok {
          height: 42px; min-width: 42px; padding: 0 12px; border-radius: 10px;
          background: rgba(16,185,129,0.12); color: #10b981; border: 1px solid rgba(16,185,129,0.2);
          cursor: pointer; font-size: 16px; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
        }
        .ic-cx {
          height: 42px; min-width: 42px; padding: 0 12px; border-radius: 10px;
          background: transparent; color: #6b7280; border: 1px solid #1f2937;
          cursor: pointer; font-size: 16px; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
        }
        .ic-tap {
          background: none; border: none; cursor: pointer; padding: 0;
          text-align: left; -webkit-tap-highlight-color: transparent; touch-action: manipulation;
        }
        .ic-sel {
          background: #0b0f19; border: 1px solid #374151; border-radius: 10px;
          padding: 10px 30px 10px 12px; font-size: 14px; color: #f9fafb;
          outline: none; -webkit-appearance: none; appearance: none; cursor: pointer; flex: 1;
        }
        .ic-sel:focus { border-color: #3b82f6; }
        .ic-mini-btn {
          width: 28px; height: 28px; border-radius: 7px; border: none;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          font-size: 13px; transition: background 120ms ease;
        }
      `}</style>

      {/* Círculo de toggle — 1 toque para marcar comprado */}
      {!editingField && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          style={{
            width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0, marginTop: "3px",
            border: p ? "none" : "2px solid #374151",
            background: p ? "#10b981" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation", transition: "all 150ms ease",
          }}
        >
          {p && <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700, lineHeight: 1 }}>✓</span>}
        </button>
      )}

      {/* Bloque de contenido */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "5px" }}>

        {/* Nombre del producto */}
        {editingField === "name" ? (
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" className="ic-inp" value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
              autoFocus />
            <button type="button" className="ic-ok" onClick={saveEdit}>✓</button>
            <button type="button" className="ic-cx" onClick={cancelEdit}>✕</button>
          </div>
        ) : (
          <button type="button" className="ic-tap"
            onClick={(e) => { e.stopPropagation(); startEdit("name"); }}
            style={{ display: "block", width: "100%" }}>
            <span style={{
              fontSize: "18px", fontWeight: 600, color: p ? "#9ca3af" : "#f9fafb",
              textDecoration: p ? "line-through" : "none",
              textDecorationColor: "rgba(107,114,128,0.4)",
              display: "block", lineHeight: 1.3,
            }}>
              {item.name}
            </span>
          </button>
        )}

        {/* Precio + Tienda */}
        {editingField === "price" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {(["unit", "total"] as const).map((mode) => (
                <button key={mode} type="button" onClick={() => setEditingPriceMode(mode)} style={{
                  flex: 1, padding: "6px 0", borderRadius: "8px", fontSize: "12px", cursor: "pointer",
                  border: `1px solid ${editingPriceMode === mode ? "#3b82f6" : "#1f2937"}`,
                  background: editingPriceMode === mode ? "rgba(59,130,246,0.12)" : "transparent",
                  color: editingPriceMode === mode ? "#60a5fa" : "#6b7280",
                }}>
                  {mode === "unit" ? "Por unidad" : "Total"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="number" inputMode="decimal" className="ic-inp" placeholder="Precio"
                value={editingPrice} onChange={(e) => setEditingPrice(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                style={{ maxWidth: "140px" }} autoFocus />
              <button type="button" className="ic-ok" onClick={saveEdit}>✓</button>
              <button type="button" className="ic-cx" onClick={cancelEdit}>✕</button>
            </div>
          </div>
        ) : editingField === "store" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <select className="ic-sel" value={editingStore}
                  onChange={(e) => { setEditingStore(e.target.value); if (e.target.value !== "Otro") setEditingStoreCustom(""); }}
                  autoFocus>
                  <option value="">Sin tienda</option>
                  {STORE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#4b5563", pointerEvents: "none", fontSize: "10px" }}>▼</span>
              </div>
              <button type="button" className="ic-ok" onClick={saveEdit}>✓</button>
              <button type="button" className="ic-cx" onClick={cancelEdit}>✕</button>
            </div>
            {editingStore === "Otro" && (
              <input type="text" className="ic-inp" placeholder="Nombre de la tienda"
                value={editingStoreCustom} onChange={(e) => setEditingStoreCustom(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                autoFocus />
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
            {/* Precio — elemento dominante junto al nombre */}
            {item.price !== undefined && item.price > 0 ? (
              <button type="button" className="ic-tap"
                onClick={(e) => { e.stopPropagation(); startEdit("price"); }}>
                <span style={{ fontSize: "16px", fontWeight: 600, color: "#10b981" }}>
                  {formatPrice(item.price)}{item.priceMode === "unit" ? " /u" : ""}
                </span>
              </button>
            ) : (
              <button type="button" className="ic-tap"
                onClick={(e) => { e.stopPropagation(); startEdit("price"); }}>
                <span style={{ fontSize: "12px", color: "#374151" }}>+ precio</span>
              </button>
            )}
            {/* Tienda — chip secundario */}
            {item.store ? (
              <button type="button" className="ic-tap"
                onClick={(e) => { e.stopPropagation(); startEdit("store"); }}>
                <span style={{
                  fontSize: "13px", color: "#60a5fa",
                  background: "rgba(59,130,246,0.08)", borderRadius: "6px",
                  padding: "3px 8px", display: "inline-block",
                }}>
                  🛒 {item.store}
                </span>
              </button>
            ) : (
              <button type="button" className="ic-tap"
                onClick={(e) => { e.stopPropagation(); startEdit("store"); }}>
                <span style={{ fontSize: "12px", color: "#374151" }}>+ tienda</span>
              </button>
            )}
          </div>
        )}

        {/* Editor de cantidad */}
        {editingField === "quantity" && (
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" className="ic-inp" value={editingQuantity}
              onChange={(e) => setEditingQuantity(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
              placeholder="Cantidad" style={{ maxWidth: "160px" }} autoFocus />
            <button type="button" className="ic-ok" onClick={saveEdit}>✓</button>
            <button type="button" className="ic-cx" onClick={cancelEdit}>✕</button>
          </div>
        )}

        {/* Meta: cantidad · usuario · fecha + acciones discretas */}
        {!editingField && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginTop: "1px" }}>
            <button type="button" className="ic-tap"
              onClick={(e) => { e.stopPropagation(); startEdit("quantity"); }}>
              <span style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.4 }}>
                {[
                  item.quantity || null,
                  item.addedByName || null,
                  item.createdAt ? fmtDate(item.createdAt) : null,
                ].filter(Boolean).join(" · ")}
                {item.purchasedAt && (
                  <span style={{ color: "rgba(16,185,129,0.6)" }}> · ✓ {fmtDate(item.purchasedAt)}</span>
                )}
              </span>
            </button>
            {/* Acciones: info + borrar (discreta, baja prioridad) */}
            <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
              <button type="button" className="ic-mini-btn"
                onClick={(e) => { e.stopPropagation(); onOpenDetail(); }}
                style={{ background: "rgba(59,130,246,0.08)", color: "#4b8df8" }}>
                ℹ
              </button>
              <button type="button" className="ic-mini-btn"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                style={{ background: "rgba(239,68,68,0.06)", color: "#f87171" }}>
                🗑
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Imagen — terciaria, pequeña */}
      {item.imageUrl && !editingField && (
        <div style={{
          width: "44px", height: "44px", borderRadius: "10px", flexShrink: 0,
          border: "1px solid #1f2937", background: "#0b0f19", overflow: "hidden",
          opacity: p ? 0.45 : 1, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img src={item.imageUrl} alt={item.name}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        </div>
      )}
    </div>
  );
}
