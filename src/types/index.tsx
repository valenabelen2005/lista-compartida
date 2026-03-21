export interface ShoppingItemType {
  id: string;
  name: string;
  quantity: string;
  price?: number;          // precio unitario (opcional)
  purchased: boolean;
  addedBy: string;
  addedByName: string;
  category?: string;       // categoría (para futuras versiones)
  purchasedAt?: number;    // timestamp cuando se marcó comprado
}

export interface GroupType {
  id: string;
  name: string;
  code?: string;
  createdAt?: number;
  createdBy: string;
  members: string[];
  items: ShoppingItemType[];
}
