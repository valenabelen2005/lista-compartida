export interface ShoppingItemType {
  id: string;
  name: string;
  quantity: string;
  price?: number;          // precio (opcional)
  priceMode?: "total" | "unit"; // "total" = precio total del item, "unit" = precio por unidad/kg
  purchased: boolean;
  addedBy: string;
  addedByName: string;
  category?: string;       // categoría (para futuras versiones)
  purchasedAt?: number;    // timestamp cuando se marcó comprado
  store?: string;          // tienda (opcional)
  imageUrl?: string;       // foto del producto en base64 (opcional)
  notes?: string;          // notas libres (opcional)
}

export interface GroupType {
  id: string;
  name: string;
  code?: string;
  createdAt?: number;
  createdBy: string;
  members: string[];
  memberNames?: Record<string, string>; // uid → displayName
  items: ShoppingItemType[];
}
