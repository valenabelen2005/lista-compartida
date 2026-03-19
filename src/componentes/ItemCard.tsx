import type { ShoppingItemType } from "../types";

interface Props {
  item: ShoppingItemType;
  onToggle: () => void;
  onDelete: () => void;
}

export default function ItemCard({ item, onToggle, onDelete }: Props) {
  return (
    <div className="border rounded-2xl p-4 flex justify-between items-center">
      <div>
        <p className={item.purchased ? "line-through text-gray-400" : ""}>
          {item.name}
        </p>

        {item.quantity && (
          <p className="text-sm text-gray-500">{item.quantity}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={onToggle} className="bg-green-100 px-3 py-2 rounded-xl">
          {item.purchased ? "Undo" : "OK"}
        </button>

        <button onClick={onDelete} className="bg-red-100 px-3 py-2 rounded-xl">
          X
        </button>
      </div>
    </div>
  );
}