import api from './axios';
import type { Outfit } from '../types';

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

export const outfitService = {
  getOutfits: async (): Promise<Outfit[]> => {
    const response = await api.get<Outfit[]>('/outfits');
    return response.data;
  },

  getOutfit: async (outfitId: number): Promise<Outfit> => {
    const response = await api.get<Outfit>(`/outfits/${outfitId}`);
    return response.data;
  },

  createOutfit: async (data: OutfitRequest): Promise<Outfit> => {
    const response = await api.post<Outfit>('/outfits', data);
    return response.data;
  },

  updateOutfit: async (outfitId: number, data: OutfitRequest): Promise<Outfit> => {
    const response = await api.put<Outfit>(`/outfits/${outfitId}`, data);
    return response.data;
  },

  deleteOutfit: async (outfitId: number): Promise<void> => {
    await api.delete(`/outfits/${outfitId}`);
  }
};
