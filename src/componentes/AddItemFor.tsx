import { useState, useRef } from "react";

interface Props {
  onAdd: (name: string, quantity: string, price?: number) => Promise<void>;
}

export default function AddItemForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const parsedPrice = price ? parseFloat(price.replace(",", ".")) : undefined;
    try {
      setError("");
      setLoading(true);
      await onAdd(trimmed, quantity.trim(), parsedPrice && parsedPrice > 0 ? parsedPrice : undefined);
      setName("");
      setQuantity("");
      setPrice("");
      nameRef.current?.focus();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
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
      `}</style>

      <div className="add-form-v2">
        {error && <p className="error-msg-v2">{error}</p>}

        {/* Nombre del producto */}
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

        {/* Cantidad y precio en la misma fila */}
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