export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export interface User {
  userId: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: Role;
}

export enum ClothingCategory {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  SHOES = 'SHOES',
  ACCESSORY = 'ACCESSORY',
  JACKET = 'JACKET'
}

export interface ClothingItem {
  id: number;
  name: string;
  description?: string;
  category: ClothingCategory;
  imageUrl: string;
}

export interface OutfitItem {
  id: number;
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
  createdAt: string;
}

export interface OutfitRequest {
  name: string;
  description?: string;
  items: {
    clothingItemId: number;
    positionX: number;
    positionY: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    itemOrder: number;
  }[];
}
