export const ClothingCategory = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  SHOES: 'SHOES',
  ACCESSORY: 'ACCESSORY',
  JACKET: 'JACKET',
} as const;

export type ClothingCategory = (typeof ClothingCategory)[keyof typeof ClothingCategory];

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
}

export interface ClothingItem {
  id: number;
  name: string;
  description?: string;
  category: ClothingCategory;
  imageUrl: string;
}

export interface OutfitItem {
  id?: number;
  clothingItem: ClothingItem;
  positionX: number;
  positionY: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  itemOrder: number;
}

export interface Outfit {
  id: number;
  name: string;
  description?: string;
  items: OutfitItem[];
}

export interface OutfitRequest {
  name: string;
  description?: string;
  items: OutfitItemRequest[];
}

export interface OutfitItemRequest {
  clothingItemId: number;
  positionX: number;
  positionY: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  itemOrder: number;
}
