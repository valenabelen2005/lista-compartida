import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";
import type { GroupType, ShoppingItemType } from "../types";
import AddItemForm from "../componentes/AddItemFor";

type FilterType = "all" | "pending" | "purchased";

export default function GroupDetail() {
  const { id } = useParams();
const { myGroups, isLoading, addItemToGroup, toggleItemPurchased, deleteItemFromGroup, updateItemQuantity  } = useGroups();
  const [filter, setFilter] = useState<FilterType>("all");
const [editingId, setEditingId] = useState<string | null>(null);
const [editingQuantity, setEditingQuantity] = useState("");
 
const group = useMemo(() => {
  return myGroups.find((group: GroupType) => group.id === id); 
}, [myGroups, id]);

  const filteredItems = useMemo(() => {
    if (!group) return [];

    if (filter === "pending") {
      return group.items.filter((item: ShoppingItemType) => !item.purchased);
    }

    if (filter === "purchased") {
      return group.items.filter((item: ShoppingItemType) => item.purchased);
    }

    return group.items;
  }, [group, filter]);

  const pendingCount = useMemo(() => {
    if (!group) return 0;
    return group.items.filter((item) => !item.purchased).length;
  }, [group]);
    if (isLoading) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="max-w-xl mx-auto">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold">Grupo no encontrado</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
       Código: <span className="font-semibold">{group.code ?? "Sin código"}</span>
        </p>
        <p className="text-gray-500 mt-2">Lista de compras compartida</p>
        <p className="text-sm text-gray-600 mt-2">
          Pendientes: <span className="font-semibold">{pendingCount}</span>
        </p>
<div className="mt-8">
<AddItemForm
  onAdd={(name, quantity) => addItemToGroup(group.id, name, quantity)}
/>
</div>
        <div className="mt-8 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm ${
              filter === "all" ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-xl text-sm ${
              filter === "pending" ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter("purchased")}
            className={`px-4 py-2 rounded-xl text-sm ${
              filter === "purchased" ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            Comprados
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Productos</h2>

          {filteredItems.length === 0 ? (
            <p className="text-gray-500">No hay productos para este filtro.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4"
                >
                  <div>
  <p className={`font-medium ${item.purchased ? "line-through text-gray-400" : "text-black"}`}>
    {item.name}
  </p>

  {editingId === item.id ? (
    <div className="flex gap-2 mt-1">
      <input
        type="text"
        value={editingQuantity}
        onChange={(e) => setEditingQuantity(e.target.value)}
        className="border rounded-lg px-2 py-1 text-sm w-20"
        autoFocus
      />
      <button
        type="button"
        onClick={async () => {
          await updateItemQuantity(group.id, item.id, editingQuantity);
          setEditingId(null);
        }}
        className="bg-green-100 px-2 py-1 rounded-lg text-sm"
      >
        Guardar
      </button>
      <button
        type="button"
        onClick={() => setEditingId(null)}
        className="bg-gray-100 px-2 py-1 rounded-lg text-sm"
      >
        Cancelar
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => {
        setEditingId(item.id);
        setEditingQuantity(item.quantity);
      }}
      className="text-sm text-gray-500 hover:text-gray-700 mt-1"
    >
      Cantidad: {item.quantity || "—"} ✎
    </button>
  )}
</div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleItemPurchased(group.id, item.id)}
                      className="bg-green-100 hover:bg-green-200 transition px-3 py-2 rounded-xl text-sm"
                    >
                      {item.purchased ? "Desmarcar" : "Comprado"}
                    </button>

                    <button
                      onClick={() => deleteItemFromGroup(group.id, item.id)}
                      className="bg-red-100 hover:bg-red-200 transition px-3 py-2 rounded-xl text-sm">
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}