export interface ShoppingItemType {
  id: string;
  name: string;
  quantity: string;
  purchased: boolean;
}

export interface GroupType {
  id: string;
  name: string;
  code?: string;
  createdAt?: number;
  createdBy: string;   // ← uid del creador
  members: string[];   // ← uids de los miembros
  items: ShoppingItemType[];
}