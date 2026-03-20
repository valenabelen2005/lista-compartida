import { useState } from "react";
import type { ShoppingItemType } from "../types";

interface Props {
  item: ShoppingItemType;
  groupId: string;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateName: (name: string) => Promise<void>;
  onUpdateQuantity: (quantity: string) => Promise<void>;
}

export default function ItemCard({ item, onToggle, onDelete, onUpdateName, onUpdateQuantity }: Props) {
  const [editingField, setEditingField] = useState<"name" | "quantity" | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingQuantity, setEditingQuantity] = useState("");

  const startEdit = (field: "name" | "quantity") => {
    setEditingField(field);
    if (field === "name") setEditingName(item.name);
    if (field === "quantity") setEditingQuantity(item.quantity);
  };

  const cancelEdit = () => setEditingField(null);

  const saveEdit = async () => {
    if (editingField === "name" && editingName.trim()) await onUpdateName(editingName.trim());
    if (editingField === "quantity") await onUpdateQuantity(editingQuantity.trim());
    setEditingField(null);
  };

  return (
    <>
      <style>{`
        .item-card {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: border-color 150ms ease, background 150ms ease;
        }
        .item-card:hover { background: #161e2e; border-color: #374151; }
        .item-card.purchased { opacity: 0.5; }
        .edit-input {
          background: #0b0f19;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 13px;
          color: #f9fafb;
          outline: none;
          flex: 1;
          min-width: 0;
          transition: border-color 150ms ease;
        }
        .edit-input:focus { border-color: #3b82f6; }
        .btn-save {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          background: rgba(16,185,129,0.15);
          color: #10b981;
          border: 1px solid rgba(16,185,129,0.2);
          transition: all 150ms ease;
          white-space: nowrap;
        }
        .btn-save:hover { background: rgba(16,185,129,0.25); }
        .btn-cancel {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          color: #6b7280;
          border: 1px solid #1f2937;
          transition: all 150ms ease;
          white-space: nowrap;
        }
        .btn-cancel:hover { color: #f9fafb; border-color: #374151; }
        .btn-toggle {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          background: rgba(16,185,129,0.1);
          color: #10b981;
          border: 1px solid rgba(16,185,129,0.15);
          transition: all 150ms ease;
          white-space: nowrap;
        }
        .btn-toggle:hover { background: rgba(16,185,129,0.2); }
        .btn-delete {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          color: #6b7280;
          border: 1px solid #1f2937;
          transition: all 150ms ease;
          white-space: nowrap;
        }
        .btn-delete:hover { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.3); }
        .editable-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          text-align: left;
          width: 100%;
          transition: opacity 150ms ease;
        }
        .editable-btn:hover { opacity: 0.75; }
      `}</style>

      <div className={`item-card ${item.purchased ? "purchased" : ""}`}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>

          {/* Nombre */}
          {editingField === "name" ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                className="edit-input"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                autoFocus
              />
              <button type="button" className="btn-save" onClick={saveEdit}>Guardar</button>
              <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancelar</button>
            </div>
          ) : (
            <button className="editable-btn" type="button" onClick={() => startEdit("name")}>
              <span style={{
                fontSize: "14px",
                fontWeight: 500,
                color: item.purchased ? "#4b5563" : "#f9fafb",
                textDecoration: item.purchased ? "line-through" : "none",
              }}>
                {item.name} <span style={{ color: "#374151", fontSize: "11px" }}>✎</span>
              </span>
            </button>
          )}

          {/* Cantidad */}
          {editingField === "quantity" ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                className="edit-input"
                value={editingQuantity}
                onChange={(e) => setEditingQuantity(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                style={{ maxWidth: "120px" }}
                autoFocus
              />
              <button type="button" className="btn-save" onClick={saveEdit}>Guardar</button>
              <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancelar</button>
            </div>
          ) : (
            <button className="editable-btn" type="button" onClick={() => startEdit("quantity")}>
              <span style={{ fontSize: "12px", color: "#4b5563" }}>
                {item.quantity || "Sin cantidad"} <span style={{ color: "#374151", fontSize: "11px" }}>✎</span>
              </span>
            </button>
          )}
            {/* Debajo del botón de cantidad, antes de cerrar el div izquierdo */}
            <span style={{ fontSize: "11px", color: "#374151", marginTop: "2px" }}>
              Agregado por {item.addedByName || "Alguien"}
            </span>
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <button type="button" className="btn-toggle" onClick={onToggle}>
            {item.purchased ? "Desmarcar" : "Comprado"}
          </button>
          <button type="button" className="btn-delete" onClick={onDelete}>
            Borrar
          </button>
        </div>
      </div>
    </>
  );
}