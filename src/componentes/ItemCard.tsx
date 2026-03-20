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

export default function ItemCard({
  item,
  onToggle,
  onDelete,
  onUpdateName,
  onUpdateQuantity,
}: Props) {
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
    if (editingField === "name" && editingName.trim()) {
      await onUpdateName(editingName.trim());
    }
    if (editingField === "quantity") {
      await onUpdateQuantity(editingQuantity.trim());
    }
    setEditingField(null);
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0 flex flex-col gap-1">

        {/* Nombre */}
        {editingField === "name" ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="border rounded-lg px-2 py-1 text-sm flex-1 min-w-0"
              autoFocus
            />
            <button type="button" onClick={saveEdit} className="bg-green-100 px-2 py-1 rounded-lg text-sm whitespace-nowrap">
              Guardar
            </button>
            <button type="button" onClick={cancelEdit} className="bg-gray-100 px-2 py-1 rounded-lg text-sm whitespace-nowrap">
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => startEdit("name")}
            className={`font-medium text-left w-full ${
              item.purchased ? "line-through text-gray-400" : "text-black"
            }`}
          >
            {item.name} ✎
          </button>
        )}

        {/* Cantidad */}
        {editingField === "quantity" ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editingQuantity}
              onChange={(e) => setEditingQuantity(e.target.value)}
              className="border rounded-lg px-2 py-1 text-sm w-20"
              autoFocus
            />
            <button type="button" onClick={saveEdit} className="bg-green-100 px-2 py-1 rounded-lg text-sm whitespace-nowrap">
              Guardar
            </button>
            <button type="button" onClick={cancelEdit} className="bg-gray-100 px-2 py-1 rounded-lg text-sm whitespace-nowrap">
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => startEdit("quantity")}
            className="text-sm text-gray-500 text-left w-full"
          >
            Cantidad: {item.quantity || "—"} ✎
          </button>
        )}

      </div>

      {/* Acciones */}
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggle}
          className="bg-green-100 hover:bg-green-200 transition px-3 py-2 rounded-xl text-sm"
        >
          {item.purchased ? "Desmarcar" : "Comprado"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="bg-red-100 hover:bg-red-200 transition px-3 py-2 rounded-xl text-sm"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}