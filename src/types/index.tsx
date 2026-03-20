export interface ShoppingItemType {
  id: string;
  name: string;
  quantity: string;
  purchased: boolean;
  addedBy: string;
  addedByName: string;
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