import api from './axios';
import { ClothingCategory } from '../types';
import type { ClothingItem } from '../types';

export const clothingService = {
  getClothingItems: async (category?: ClothingCategory): Promise<ClothingItem[]> => {
    const params = category ? { category } : {};
    const response = await api.get<ClothingItem[]>('/clothing', { params });
    return response.data;
  },

  getClothingItem: async (id: number): Promise<ClothingItem> => {
    const response = await api.get<ClothingItem>(`/clothing/${id}`);
    return response.data;
  },

  createClothingItem: async (data: Omit<ClothingItem, 'id'>): Promise<ClothingItem> => {
    const response = await api.post<ClothingItem>('/clothing', data);
    return response.data;
  },

  updateClothingItem: async (id: number, data: Partial<ClothingItem>): Promise<ClothingItem> => {
    const response = await api.put<ClothingItem>(`/clothing/${id}`, data);
    return response.data;
  },

  deleteClothingItem: async (id: number): Promise<void> => {
    await api.delete(`/clothing/${id}`);
  }
};
