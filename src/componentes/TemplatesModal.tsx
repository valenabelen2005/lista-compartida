import { useState } from "react";
import type { TemplateType, TemplateItemType, ShoppingItemType } from "../types";

interface Props {
  templates: TemplateType[];
  currentItems: ShoppingItemType[];
  onClose: () => void;
  onAddItems: (items: TemplateItemType[]) => Promise<void>;
  onReplaceItems: (items: TemplateItemType[]) => Promise<void>;
  onCreateTemplate: (name: string, items: TemplateItemType[]) => Promise<void>;
  onUpdateTemplate: (id: string, changes: Partial<Pick<TemplateType, "name" | "items">>) => Promise<void>;
  onDeleteTemplate: (id: string) => Promise<void>;
}

type View = "list" | "detail" | "editor";

export default function TemplatesModal({
  templates, currentItems, onClose,
  onAddItems, onReplaceItems,
  onCreateTemplate, onUpdateTemplate, onDeleteTemplate,
}: Props) {
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replaceConfirm, setReplaceConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Editor state
  const [editorName, setEditorName] = useState("");
  const [editorItems, setEditorItems] = useState<TemplateItemType[]>([]);
  const [editorNewItem, setEditorNewItem] = useState("");
  const [editorNewQty, setEditorNewQty] = useState("");

  const selected = templates.find((t) => t.id === selectedId) ?? null;

  const openDetail = (id: string) => {
    setSelectedId(id);
    setReplaceConfirm(false);
    setView("detail");
  };

  const openNewEditor = () => {
    setSelectedId(null);
    setEditorName("");
    setEditorItems(
      currentItems
        .filter((i) => !i.purchased)
        .map((i) => ({
          id: `ti-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: i.name, quantity: i.quantity,
          price: i.price, priceMode: i.priceMode,
          store: i.store, imageUrl: i.imageUrl,
        }))
    );
    setEditorNewItem("");
    setEditorNewQty("");
    setView("editor");
  };

  const openEditEditor = (tpl: TemplateType) => {
    setSelectedId(tpl.id);
    setEditorName(tpl.name);
    setEditorItems([...tpl.items]);
    setEditorNewItem("");
    setEditorNewQty("");
    setView("editor");
  };

  const editorAddItem = () => {
    const name = editorNewItem.trim();
    if (!name) return;
    if (editorItems.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
      setEditorNewItem("");
      setEditorNewQty("");
      return;
    }
    setEditorItems((prev) => [
      ...prev,
      {
        id: `ti-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name, quantity: editorNewQty.trim(),
      },
    ]);
    setEditorNewItem("");
    setEditorNewQty("");
  };

  const editorRemoveItem = (id: string) =>
    setEditorItems((prev) => prev.filter((i) => i.id !== id));

  const saveEditor = async () => {
    setSaveError("");
    setLoading(true);
    try {
      const name = editorName.trim() || "Plantilla sin nombre";
      if (selectedId) {
        await onUpdateTemplate(selectedId, { name, items: editorItems });
      } else {
        await onCreateTemplate(name, editorItems);
      }
      setView("list");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setSaveError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (items: TemplateItemType[]) => {
    setLoading(true);
    await onAddItems(items);
    setLoading(false);
    onClose();
  };

  const handleReplace = async (items: TemplateItemType[]) => {
    if (!replaceConfirm) { setReplaceConfirm(true); return; }
    setLoading(true);
    await onReplaceItems(items);
    setLoading(false);
    onClose();
  };

  const fmt = (p: number) =>
    p.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });

  return (
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
          maxHeight: "85vh", display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Handle */}
        <div style={{ padding: "14px 20px 0", display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: "36px", height: "4px", background: "#374151", borderRadius: "2px" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "14px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderBottom: "1px solid #1f2937" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {view !== "list" && (
              <button
                onClick={() => { setView("list"); setReplaceConfirm(false); }}
                style={{ background: "none", border: "none", color: "#6b7280", fontSize: "20px", cursor: "pointer", padding: "0 4px", lineHeight: 1 }}
              >←</button>
            )}
            <span style={{ fontSize: "17px", fontWeight: 700, color: "#f9fafb" }}>
              {view === "list" ? "📋 Plantillas" : view === "detail" ? selected?.name ?? "" : selectedId ? "Editar plantilla" : "Nueva plantilla"}
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {view === "list" && (
              <button
                onClick={openNewEditor}
                style={{
                  background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)",
                  borderRadius: "8px", color: "#60a5fa", fontSize: "13px", fontWeight: 600,
                  padding: "6px 12px", cursor: "pointer",
                }}
              >
                + Nueva
              </button>
            )}
            {view === "detail" && selected && (
              <button
                onClick={() => openEditEditor(selected)}
                style={{
                  background: "transparent", border: "1px solid #1f2937",
                  borderRadius: "8px", color: "#6b7280", fontSize: "13px",
                  padding: "6px 10px", cursor: "pointer",
                }}
              >
                Editar
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: "#1f2937", border: "none", borderRadius: "8px",
                color: "#9ca3af", fontSize: "16px", width: "32px", height: "32px",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", flex: 1, padding: "12px 20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>

          {/* LIST VIEW */}
          {view === "list" && (
            templates.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <p style={{ color: "#4b5563", fontSize: "14px", margin: "0 0 8px" }}>No tenés plantillas guardadas</p>
                <p style={{ color: "#374151", fontSize: "12px", margin: 0 }}>Creá una desde la lista actual o desde cero</p>
              </div>
            ) : (
              templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => openDetail(tpl.id)}
                  style={{
                    background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "14px",
                    padding: "14px 16px", cursor: "pointer", textAlign: "left", width: "100%",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <div>
                    <p style={{ margin: "0 0 3px", fontSize: "16px", fontWeight: 600, color: "#f9fafb" }}>{tpl.name}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                      {tpl.items.length} producto{tpl.items.length !== 1 ? "s" : ""}
                      {tpl.items[0] && ` · ${tpl.items[0].name}${tpl.items.length > 1 ? "…" : ""}`}
                    </p>
                  </div>
                  <span style={{ color: "#374151", fontSize: "18px" }}>›</span>
                </button>
              ))
            )
          )}

          {/* DETAIL VIEW */}
          {view === "detail" && selected && (
            <>
              {/* Items list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {selected.items.map((item) => (
                  <div key={item.id} style={{
                    background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "10px",
                    padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <span style={{ fontSize: "15px", color: "#e5e7eb", fontWeight: 500 }}>{item.name}</span>
                      {(item.quantity || item.price || item.store) && (
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6b7280" }}>
                          {[
                            item.quantity || null,
                            item.price && item.price > 0 ? fmt(item.price) + (item.priceMode === "unit" ? " /u" : "") : null,
                            item.store || null,
                          ].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                <button
                  onClick={() => handleAdd(selected.items)}
                  disabled={loading}
                  style={{
                    width: "100%", minHeight: "46px", borderRadius: "12px",
                    fontSize: "15px", fontWeight: 600, cursor: "pointer",
                    background: "#3b82f6", color: "#fff", border: "none",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Cargando…" : "Agregar a la lista"}
                </button>
                <button
                  onClick={() => handleReplace(selected.items)}
                  disabled={loading}
                  style={{
                    width: "100%", minHeight: "42px", borderRadius: "12px",
                    fontSize: "14px", fontWeight: 500, cursor: "pointer",
                    background: replaceConfirm ? "rgba(239,68,68,0.08)" : "transparent",
                    color: replaceConfirm ? "#ef4444" : "#6b7280",
                    border: `1px solid ${replaceConfirm ? "rgba(239,68,68,0.2)" : "#1f2937"}`,
                    opacity: loading ? 0.6 : 1,
                    transition: "all 150ms ease",
                  }}
                >
                  {replaceConfirm ? "¿Reemplazar todo? (confirmar)" : "Reemplazar lista con esta plantilla"}
                </button>
                <button
                  onClick={async () => {
                    await onDeleteTemplate(selected.id);
                    setView("list");
                  }}
                  style={{
                    background: "transparent", border: "none",
                    color: "#4b5563", fontSize: "13px", cursor: "pointer",
                    padding: "8px", textAlign: "center",
                  }}
                >
                  Eliminar plantilla
                </button>
              </div>
            </>
          )}

          {/* EDITOR VIEW */}
          {view === "editor" && (
            <>
              <input
                type="text"
                placeholder="Nombre de la plantilla"
                value={editorName}
                onChange={(e) => setEditorName(e.target.value)}
                autoFocus
                style={{
                  background: "#0b0f19", border: "1px solid #374151", borderRadius: "10px",
                  padding: "12px 14px", fontSize: "16px", fontWeight: 600, color: "#f9fafb",
                  outline: "none", width: "100%", boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#374151")}
              />

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {editorItems.map((item) => (
                  <div key={item.id} style={{
                    background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "10px",
                    padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontSize: "14px", color: "#e5e7eb" }}>
                      {item.name}{item.quantity ? ` · ${item.quantity}` : ""}
                    </span>
                    <button
                      onClick={() => editorRemoveItem(item.id)}
                      style={{ background: "none", border: "none", color: "#4b5563", fontSize: "18px", cursor: "pointer", padding: "0 0 0 12px", lineHeight: 1 }}
                    >✕</button>
                  </div>
                ))}
              </div>

              {/* Add item input */}
              <div style={{ display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  placeholder="Producto"
                  value={editorNewItem}
                  onChange={(e) => setEditorNewItem(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") editorAddItem(); }}
                  style={{
                    background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "10px",
                    padding: "10px 12px", fontSize: "14px", color: "#f9fafb",
                    outline: "none", flex: 2, minWidth: 0,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#1f2937")}
                />
                <input
                  type="text"
                  placeholder="Cantidad"
                  value={editorNewQty}
                  onChange={(e) => setEditorNewQty(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") editorAddItem(); }}
                  style={{
                    background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "10px",
                    padding: "10px 12px", fontSize: "14px", color: "#f9fafb",
                    outline: "none", flex: 1, minWidth: 0,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#1f2937")}
                />
                <button
                  onClick={editorAddItem}
                  style={{
                    height: "42px", minWidth: "42px", borderRadius: "10px", border: "none",
                    background: "rgba(59,130,246,0.12)", color: "#60a5fa",
                    fontSize: "20px", cursor: "pointer", flexShrink: 0,
                  }}
                >+</button>
              </div>

              <button
                onClick={saveEditor}
                disabled={loading}
                style={{
                  width: "100%", minHeight: "46px", borderRadius: "12px",
                  fontSize: "15px", fontWeight: 600, cursor: loading ? "default" : "pointer",
                  background: "#3b82f6", color: "#fff", border: "none", marginTop: "4px",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Guardando…" : selectedId ? "Guardar cambios" : "Crear plantilla"}
              </button>
              {saveError && (
                <p style={{ margin: 0, fontSize: "12px", color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "8px", padding: "8px 10px" }}>
                  Error: {saveError}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
