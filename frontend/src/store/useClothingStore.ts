import { create } from 'zustand';
import { ClothingCategory } from '../types';
import type { ClothingItem } from '../types';
import { clothingService } from '../api/clothingService';

interface ClothingState {
  items: ClothingItem[];
  isLoading: boolean;
  error: string | null;
  fetchItems: (category?: ClothingCategory) => Promise<void>;
  addItem: (data: Omit<ClothingItem, 'id'>) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
}

export const useClothingStore = create<ClothingState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const items = await clothingService.getClothingItems(category);
      set({ items, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addItem: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await clothingService.createClothingItem(data);
      set((state) => ({ items: [...state.items, newItem], isLoading: false }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  removeItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await clothingService.deleteClothingItem(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
