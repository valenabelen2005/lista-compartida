import { useState, useRef } from "react";
import type { ShoppingItemType } from "../types";

interface Props {
  item: ShoppingItemType;
  onClose: () => void;
  onUpdateNotes: (notes: string | undefined) => Promise<void>;
}

export default function ItemDetailModal({ item, onClose, onUpdateNotes }: Props) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(item.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const saveNotes = async () => {
    setSaving(true);
    await onUpdateNotes(notesValue.trim() || undefined);
    setSaving(false);
    setEditingNotes(false);
  };

  const fmt = (p: number) =>
    p.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });

  const fmtDate = (ts: number) =>
    new Date(ts).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <>
    <div
      onClick={onClose}
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
          background: "#111827", border: "1px solid #1f2937",
          borderRadius: "20px 20px 16px 16px",
          width: "100%", maxWidth: "480px",
          display: "flex", flexDirection: "column", gap: 0,
          maxHeight: "85vh", overflow: "hidden",
        }}
      >
        {/* Handle */}
        <div style={{ padding: "14px 20px 0", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "36px", height: "4px", background: "#374151", borderRadius: "2px" }} />
        </div>

        <div style={{ overflowY: "auto", padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Imagen grande */}
          {item.imageUrl && (
            <div
              onClick={() => setShowFullImage(true)}
              style={{
                width: "100%", maxHeight: "200px",
                borderRadius: "12px", border: "1px solid #1f2937",
                background: "#0b0f19", display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", cursor: "zoom-in", position: "relative",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain" }}
              />
              <div style={{
                position: "absolute", bottom: "8px", right: "8px",
                background: "rgba(0,0,0,0.55)", borderRadius: "6px",
                padding: "3px 8px", fontSize: "11px", color: "#d1d5db",
                pointerEvents: "none",
              }}>
                🔍 Ver
              </div>
            </div>
          )}

          {/* Nombre + estado */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <p style={{
                fontSize: "20px", fontWeight: 700, color: item.purchased ? "#9ca3af" : "#f9fafb",
                margin: 0, textDecoration: item.purchased ? "line-through" : "none",
                textDecorationColor: "rgba(156,163,175,0.5)",
              }}>
                {item.name}
              </p>
              {item.purchased && (
                <span style={{
                  fontSize: "11px", color: "#10b981", background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.2)", borderRadius: "20px",
                  padding: "2px 8px", marginTop: "4px", display: "inline-block",
                }}>
                  ✓ Comprado
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                background: "#1f2937", border: "none", borderRadius: "8px",
                color: "#9ca3af", fontSize: "16px", width: "32px", height: "32px",
                cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>

          {/* Metadata */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Row label="Cantidad" value={item.quantity || "Sin cantidad"} />
            <Row label="Agregado por" value={item.addedByName || "Alguien"} />
            {item.createdAt && <Row label="Fecha de agregado" value={fmtDate(item.createdAt)} />}
            {item.price !== undefined && item.price > 0 && (
              <Row
                label="Precio"
                value={`${fmt(item.price)} ${item.priceMode === "total" ? "(total)" : "/unidad"}`}
              />
            )}
            {item.store && (
              <Row label="Tienda" value={`🛒 ${item.store}`} />
            )}
            {item.purchasedAt && <Row label="Fecha de compra" value={fmtDate(item.purchasedAt)} />}
          </div>

          {/* Notas */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Notas
              </span>
              {!editingNotes && (
                <button
                  onClick={() => {
                    setNotesValue(item.notes ?? "");
                    setEditingNotes(true);
                    setTimeout(() => notesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
                  }}
                  style={{
                    background: "transparent", border: "1px solid #1f2937",
                    borderRadius: "6px", padding: "3px 10px", fontSize: "12px",
                    color: "#6b7280", cursor: "pointer",
                  }}
                >
                  {item.notes ? "Editar" : "+ Agregar"}
                </button>
              )}
            </div>

            {editingNotes ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <textarea
                  ref={notesRef}
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  placeholder="ej: marca concreta, sin sal, solo si está en oferta…"
                  rows={3}
                  autoFocus
                  style={{
                    background: "#0b0f19", border: "1px solid #374151", borderRadius: "10px",
                    padding: "10px 12px", fontSize: "14px", color: "#f9fafb",
                    outline: "none", resize: "none", width: "100%", boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#374151")}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={saveNotes}
                    disabled={saving}
                    style={{
                      flex: 1, padding: "10px", borderRadius: "8px", fontSize: "14px",
                      fontWeight: 500, cursor: "pointer", border: "none",
                      background: "#3b82f6", color: "#fff",
                    }}
                  >
                    {saving ? "Guardando…" : "Guardar"}
                  </button>
                  <button
                    onClick={() => setEditingNotes(false)}
                    style={{
                      padding: "10px 16px", borderRadius: "8px", fontSize: "14px",
                      cursor: "pointer", background: "transparent",
                      color: "#6b7280", border: "1px solid #1f2937",
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : item.notes ? (
              <p style={{
                fontSize: "14px", color: "#d1d5db", margin: 0, lineHeight: 1.5,
                background: "#0b0f19", border: "1px solid #1f2937",
                borderRadius: "10px", padding: "10px 12px",
              }}>
                {item.notes}
              </p>
            ) : (
              <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>Sin notas</p>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Lightbox */}

    {showFullImage && item.imageUrl && (
      <div
        onClick={() => setShowFullImage(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(0,0,0,0.92)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "12px" }}
        />
        <button
          onClick={() => setShowFullImage(false)}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "rgba(255,255,255,0.1)", border: "none",
            borderRadius: "50%", width: "36px", height: "36px",
            color: "#fff", fontSize: "18px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>
    )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
      <span style={{ fontSize: "12px", color: "#6b7280", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: "14px", color: "#e5e7eb", textAlign: "right" }}>{value}</span>
    </div>
  );
}
