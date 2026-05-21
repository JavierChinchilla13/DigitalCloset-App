import api from './axios';
import { ClothingCategory } from '../types';
import type { ClothingItem } from '../types';

export const clothingService = {
  getClothingItems: async (category?: ClothingCategory): Promise<ClothingItem[]> => {
    const params = category ? { category } : {};
    const response = await api.get<ClothingItem[]>('/clothing', { params });
    return response.data;
  },

  getClothingItem: async (itemId: number): Promise<ClothingItem> => {
    const response = await api.get<ClothingItem>(`/clothing/${itemId}`);
    return response.data;
  },

  createClothingItem: async (data: Omit<ClothingItem, 'itemId'>): Promise<ClothingItem> => {
    const response = await api.post<ClothingItem>('/clothing', data);
    return response.data;
  },

  updateClothingItem: async (itemId: number, data: Partial<ClothingItem>): Promise<ClothingItem> => {
    const response = await api.put<ClothingItem>(`/clothing/${itemId}`, data);
    return response.data;
  },

  deleteClothingItem: async (itemId: number): Promise<void> => {
    await api.delete(`/clothing/${itemId}`);
  }
};
