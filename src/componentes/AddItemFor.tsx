import { useState, useRef } from "react";

const STORE_OPTIONS = ["Dia", "Mercadona", "Amazon", "Lidl", "Ikea", "Carrefour", "Otro"];

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 1200;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

interface Props {
  onAdd: (name: string, quantity: string, price?: number, store?: string, imageUrl?: string, priceMode?: "total" | "unit", notes?: string) => Promise<void>;
  onClose?: () => void;
}

export default function AddItemForm({ onAdd, onClose }: Props) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [priceMode, setPriceMode] = useState<"total" | "unit">("unit");
  const [store, setStore] = useState("");
  const [customStore, setCustomStore] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const parsedPrice = price ? parseFloat(price.replace(",", ".")) : undefined;
    const finalStore = store === "Otro" ? customStore.trim() || undefined : store || undefined;
    try {
      setError("");
      setLoading(true);
      await onAdd(
        trimmed,
        quantity.trim(),
        parsedPrice && parsedPrice > 0 ? parsedPrice : undefined,
        finalStore,
        imageUrl || undefined,
        parsedPrice && parsedPrice > 0 ? priceMode : undefined,
        notes.trim() || undefined,
      );
      setName("");
      setQuantity("");
      setPrice("");
      setPriceMode("unit");
      setStore("");
      setCustomStore("");
      setImageUrl("");
      setNotes("");
      onClose?.();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setImageUrl(compressed);
    e.target.value = "";
  };

  return (
    <>
      <style>{`
        .add-form-v2 {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .add-input-v2 {
          background: #0b0f19;
          border: 1px solid #1f2937;
          border-radius: 10px;
          padding: 13px 14px;
          font-size: 15px;
          color: #f9fafb;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 150ms ease;
          -webkit-appearance: none;
        }
        .add-input-v2::placeholder { color: #374151; }
        .add-input-v2:focus { border-color: #3b82f6; }
        .add-row-v2 {
          display: flex;
          gap: 8px;
        }
        .add-btn-v2 {
          width: 100%;
          min-height: 50px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          background: #3b82f6;
          color: #fff;
          border: none;
          transition: transform 150ms ease, background 150ms ease, box-shadow 150ms ease;
          -webkit-tap-highlight-color: transparent;
          letter-spacing: 0.2px;
        }
        .add-btn-v2:active { transform: scale(0.97); background: #2563eb; }
        .add-btn-v2:disabled { opacity: 0.5; cursor: default; }
        .error-msg-v2 {
          font-size: 12px;
          color: #ef4444;
          margin: 0;
          padding: 8px 10px;
          background: rgba(239,68,68,0.08);
          border-radius: 8px;
          border: 1px solid rgba(239,68,68,0.15);
        }
        .store-select-v2 {
          background: #0b0f19;
          border: 1px solid #1f2937;
          border-radius: 10px;
          padding: 13px 36px 13px 14px;
          font-size: 15px;
          color: #f9fafb;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          -webkit-appearance: none;
          appearance: none;
          cursor: pointer;
          transition: border-color 150ms ease;
        }
        .store-select-v2:focus { border-color: #3b82f6; }
        .store-select-v2.placeholder { color: #374151; }
        .add-img-btn {
          flex: 1;
          min-height: 46px;
          border-radius: 10px;
          font-size: 13px;
          color: #6b7280;
          background: #0b0f19;
          border: 1px dashed #374151;
          cursor: pointer;
          text-align: left;
          padding: 0 14px;
          -webkit-tap-highlight-color: transparent;
          transition: border-color 150ms ease, color 150ms ease;
        }
        .add-img-btn:active { border-color: #3b82f6; color: #3b82f6; }
      `}</style>

      <div className="add-form-v2">
        {error && <p className="error-msg-v2">{error}</p>}

        <input
          ref={nameRef}
          type="text"
          className="add-input-v2"
          placeholder="Nombre del producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          autoComplete="off"
          autoCapitalize="words"
        />

        <div className="add-row-v2">
          <input
            type="text"
            className="add-input-v2"
            placeholder="Cantidad"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            style={{ flex: 1 }}
          />
          <input
            type="number"
            inputMode="decimal"
            className="add-input-v2"
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            style={{ flex: 1 }}
          />
        </div>

        {price && parseFloat(price) > 0 && (
          <div style={{ display: "flex", gap: "6px" }}>
            {(["unit", "total"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPriceMode(mode)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: "8px", fontSize: "12px",
                  cursor: "pointer", border: "1px solid",
                  borderColor: priceMode === mode ? "#3b82f6" : "#1f2937",
                  background: priceMode === mode ? "rgba(59,130,246,0.12)" : "transparent",
                  color: priceMode === mode ? "#60a5fa" : "#6b7280",
                  transition: "all 120ms ease",
                  touchAction: "manipulation",
                }}
              >
                {mode === "unit" ? "Por unidad / kg" : "Precio total"}
              </button>
            ))}
          </div>
        )}

        {/* Tienda */}
        <div style={{ position: "relative" }}>
          <select
            className={`store-select-v2${!store ? " placeholder" : ""}`}
            value={store}
            onChange={(e) => { setStore(e.target.value); if (e.target.value !== "Otro") setCustomStore(""); }}
          >
            <option value="">Tienda (opcional)</option>
            {STORE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#374151", pointerEvents: "none", fontSize: "11px" }}>▼</span>
        </div>

        {store === "Otro" && (
          <input
            type="text"
            className="add-input-v2"
            placeholder="Nombre de la tienda"
            value={customStore}
            onChange={(e) => setCustomStore(e.target.value)}
            autoFocus
          />
        )}

        {/* Imagen */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            type="button"
            className="add-img-btn"
            onClick={() => fileRef.current?.click()}
          >
            📷 {imageUrl ? "Cambiar foto" : "Foto del producto (opcional)"}
          </button>
          {imageUrl && (
            <>
              <img
                src={imageUrl}
                alt="preview"
                style={{ width: "46px", height: "46px", borderRadius: "8px", objectFit: "cover", border: "1px solid #1f2937", flexShrink: 0 }}
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                style={{ background: "transparent", border: "none", color: "#6b7280", fontSize: "18px", cursor: "pointer", padding: "4px", lineHeight: 1, flexShrink: 0 }}
              >
                ✕
              </button>
            </>
          )}
        </div>

        {/* Notas opcionales */}
        <textarea
          className="add-input-v2"
          placeholder="Notas (opcional): marca, tamaño, solo si está en oferta…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          style={{ resize: "none", fontFamily: "inherit", fontSize: "13px" }}
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleImage}
        />

        <button
          type="button"
          className="add-btn-v2"
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
        >
          {loading ? "Agregando…" : "Agregar producto"}
        </button>
      </div>
    </>
  );
}
