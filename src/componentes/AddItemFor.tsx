import { useState } from "react";

interface Props {
  onAdd: (name: string, quantity: string) => Promise<void>;
}

export default function AddItemForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");  // ← nuevo
  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      setError("");
      await onAdd(trimmed, quantity.trim());
      setName("");
      setQuantity("");
    } catch (e) {
      setError(`Error: ${e}`);  // ← muestra el error en pantalla
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Agregar producto</h2>
 {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>  // ← visible en móvil
      )}
      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Producto"
          className="border rounded-xl px-4 py-3"
        />

        <input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Cantidad"
          className="border rounded-xl px-4 py-3"
        />

        <button
          type="button"  
          onClick={handleSubmit}
          className="bg-blue-100 hover:bg-blue-200 rounded-xl px-4 py-3"
        >
          Añadir
        </button>
      </div>
    </div>
  );
}