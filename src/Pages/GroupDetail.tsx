import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";
import type { GroupType, ShoppingItemType } from "../types";
import AddItemForm from "../componentes/AddItemFor";
import ItemCard from "../componentes/ItemCard";

type FilterType = "all" | "pending" | "purchased";

export default function GroupDetail() {
  const { id } = useParams();
  const { myGroups, isLoading, addItemToGroup, toggleItemPurchased, deleteItemFromGroup, updateItemQuantity, updateItemName } = useGroups();
  const [filter, setFilter] = useState<FilterType>("all");

  const group = useMemo(() => {
    return myGroups.find((g: GroupType) => g.id === id);
  }, [myGroups, id]);

  const filteredItems = useMemo(() => {
    if (!group) return [];
    if (filter === "pending") return group.items.filter((item: ShoppingItemType) => !item.purchased);
    if (filter === "purchased") return group.items.filter((item: ShoppingItemType) => item.purchased);
    return group.items;
  }, [group, filter]);

  const pendingCount = useMemo(() => {
    if (!group) return 0;
    return group.items.filter((item) => !item.purchased).length;
  }, [group]);

  if (isLoading) {
    return <main className="min-h-screen bg-white p-6"><p className="text-gray-500">Cargando...</p></main>;
  }

  if (!group) {
    return <main className="min-h-screen bg-white p-6"><h1 className="text-2xl font-bold">Grupo no encontrado</h1></main>;
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
          <AddItemForm onAdd={(name, quantity) => addItemToGroup(group.id, name, quantity)} />
        </div>

        <div className="mt-8 flex gap-2 flex-wrap">
          {(["all", "pending", "purchased"] as FilterType[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm ${filter === f ? "bg-black text-white" : "bg-gray-100"}`}
            >
              {f === "all" ? "Todos" : f === "pending" ? "Pendientes" : "Comprados"}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Productos</h2>
          {filteredItems.length === 0 ? (
            <p className="text-gray-500">No hay productos para este filtro.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  groupId={group.id}
                  onToggle={() => toggleItemPurchased(group.id, item.id)}
                  onDelete={() => deleteItemFromGroup(group.id, item.id)}
                  onUpdateName={(name) => updateItemName(group.id, item.id, name)}
                  onUpdateQuantity={(quantity) => updateItemQuantity(group.id, item.id, quantity)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}