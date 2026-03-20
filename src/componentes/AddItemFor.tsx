import { useState } from "react";

interface Props {
  onAdd: (name: string, quantity: string) => Promise<void>;
}

export default function AddItemForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      setError("");
      await onAdd(trimmed, quantity.trim());
      setName("");
      setQuantity("");
    } catch (e) {
      setError(`Error: ${e}`);
    }
  };

  return (
    <>
      <style>{`
        .add-form {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .add-input {
          background: #0b0f19;
          border: 1px solid #1f2937;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 14px;
          color: #f9fafb;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 150ms ease;
        }
        .add-input::placeholder { color: #374151; }
        .add-input:focus { border-color: #3b82f6; }
        .add-btn {
          width: 100%;
          padding: 11px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background: #3b82f6;
          color: #fff;
          border: none;
          transition: transform 150ms ease, background 150ms ease, box-shadow 150ms ease;
        }
        .add-btn:hover { background: #2563eb; transform: scale(1.02); box-shadow: 0 4px 20px rgba(59,130,246,0.35); }
        .add-btn:active { transform: scale(0.97); }
      `}</style>

      <div className="add-form">
        {error && <p style={{ color: "#ef4444", fontSize: "12px", margin: 0 }}>{error}</p>}
        <input
          type="text"
          className="add-input"
          placeholder="Producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
        />
        <input
          type="text"
          className="add-input"
          placeholder="Cantidad (opcional)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
        />
        <button type="button" className="add-btn" onClick={handleSubmit}>
          Agregar producto
        </button>
      </div>
    </>
  );
}