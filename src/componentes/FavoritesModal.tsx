import type { FavoriteItemType, ShoppingItemType } from "../types";

interface Props {
  favorites: FavoriteItemType[];
  currentItems: ShoppingItemType[];
  onClose: () => void;
  onAddItem: (fav: FavoriteItemType) => Promise<void>;
  onRemoveFavorite: (id: string) => void;
}

export default function FavoritesModal({
  favorites, currentItems, onClose, onAddItem, onRemoveFavorite,
}: Props) {
  const fmt = (p: number) =>
    p.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });

  const isInList = (name: string) =>
    currentItems.some((i) => i.name.toLowerCase() === name.toLowerCase());

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
          <span style={{ fontSize: "17px", fontWeight: 700, color: "#f9fafb" }}>⭐ Favoritos</span>
          <button
            onClick={onClose}
            style={{
              background: "#1f2937", border: "none", borderRadius: "8px",
              color: "#9ca3af", fontSize: "16px", width: "32px", height: "32px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", flex: 1, padding: "12px 20px 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {favorites.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <p style={{ color: "#4b5563", fontSize: "14px", margin: "0 0 8px" }}>No tenés favoritos aún</p>
              <p style={{ color: "#374151", fontSize: "12px", margin: 0 }}>
                Guardá productos desde el detalle de un ítem (botón ℹ)
              </p>
            </div>
          ) : (
            favorites.map((fav) => {
              const inList = isInList(fav.name);
              return (
                <div
                  key={fav.id}
                  style={{
                    background: "#0b0f19", border: `1px solid ${inList ? "rgba(16,185,129,0.15)" : "#1f2937"}`,
                    borderRadius: "12px", padding: "12px 14px",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}
                >
                  {/* Tap area to add */}
                  <button
                    onClick={() => !inList && onAddItem(fav)}
                    style={{
                      flex: 1, background: "none", border: "none", cursor: inList ? "default" : "pointer",
                      textAlign: "left", padding: 0, WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <p style={{
                      margin: "0 0 3px", fontSize: "15px", fontWeight: 600,
                      color: inList ? "#6b7280" : "#f9fafb",
                    }}>
                      {fav.name}
                      {inList && <span style={{ fontSize: "12px", color: "#10b981", marginLeft: "6px" }}>✓ en lista</span>}
                    </p>
                    {(fav.quantity || fav.price || fav.store) && (
                      <p style={{ margin: 0, fontSize: "12px", color: "#4b5563" }}>
                        {[
                          fav.quantity || null,
                          fav.price && fav.price > 0 ? fmt(fav.price) + (fav.priceMode === "unit" ? " /u" : "") : null,
                          fav.store || null,
                        ].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </button>

                  {/* Add button */}
                  {!inList && (
                    <button
                      onClick={() => onAddItem(fav)}
                      style={{
                        width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
                        background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.2)",
                        color: "#60a5fa", fontSize: "20px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        lineHeight: 1,
                      }}
                    >+</button>
                  )}

                  {/* Remove from favorites */}
                  <button
                    onClick={() => onRemoveFavorite(fav.id)}
                    style={{
                      width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
                      background: "transparent", border: "none",
                      color: "#374151", fontSize: "15px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >✕</button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
