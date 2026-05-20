import api from './axios';
import type { Outfit } from '../types';

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

export const outfitService = {
  getOutfits: async (): Promise<Outfit[]> => {
    const response = await api.get<Outfit[]>('/outfits');
    return response.data;
  },

  getOutfit: async (id: number): Promise<Outfit> => {
    const response = await api.get<Outfit>(`/outfits/${id}`);
    return response.data;
  },

  createOutfit: async (data: OutfitRequest): Promise<Outfit> => {
    const response = await api.post<Outfit>('/outfits', data);
    return response.data;
  },

  updateOutfit: async (id: number, data: OutfitRequest): Promise<Outfit> => {
    const response = await api.put<Outfit>(`/outfits/${id}`, data);
    return response.data;
  },

  deleteOutfit: async (id: number): Promise<void> => {
    await api.delete(`/outfits/${id}`);
  }
};
