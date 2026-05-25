export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export enum PersonaType {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface PersonaState {
  type: PersonaType;
  skinTone?: string;
  bodyType?: string;
  height?: number;
  hairId?: string;
  topIds: number[];
  bottomIds: number[];
  leftShoeId: number | null;
  rightShoeId: number | null;
  accessoryIds: number[];
  jacketIds: number[];
  dressIds: number[];
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
  JACKET = 'JACKET',
  DRESS = 'DRESS'
}

export interface ClothingTransform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  width?: number;
  height?: number;
  opacity?: number;
  flipX?: boolean;
  flipY?: boolean;
  zIndex?: number;
  maskTop?: number;
  maskLeft?: number;
  maskWidth?: number;
  maskHeight?: number;
}

export interface ClothingItem {
  itemId: number;
  name: string;
  description?: string;
  category: ClothingCategory;
  imageUrl: string;
  personaType: PersonaType;
  transform: ClothingTransform;
  side?: 'left' | 'right';
  active?: boolean;
  uploadDate?: string;
  isFavorite?: boolean;
}

export interface OutfitItem {
  outfitItemId: number;
  itemId: number;
  itemName?: string;
  imageUrl?: string;
  positionX: number;
  positionY: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  itemOrder: number;
}

export interface ShoePair {
  leftShoe: {
    imageUrl: string;
    transform: ClothingTransform;
  };
  rightShoe: {
    imageUrl: string;
    transform: ClothingTransform;
  };
  mirrored: boolean;
  category: ClothingCategory;
  personaType: PersonaType;
}

export interface Outfit {
  outfitId: number;
  name: string;
  description?: string;
  items: OutfitItem[];
  createdAt: string;
}

export interface OutfitRequest {
  name: string;
  description?: string;
  items: {
    itemId: number;
    positionX: number;
    positionY: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    itemOrder: number;
  }[];
}
