import { create } from 'zustand';
import { ClothingCategory } from '../types';
import type { ClothingItem } from '../types';
import { clothingService } from '../api/clothingService';

interface ClothingState {
  items: ClothingItem[];
  favorites: number[]; // Array of itemId
  isLoading: boolean;
  error: string | null;
  fetchItems: (category?: ClothingCategory) => Promise<void>;
  addItem: (data: Omit<ClothingItem, 'itemId'>) => Promise<void>;
  updateItem: (itemId: number, data: Partial<ClothingItem>) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  toggleFavorite: (itemId: number) => void;
}

export const useClothingStore = create<ClothingState>((set) => ({
  items: [],
  favorites: JSON.parse(localStorage.getItem('closet-favorites') || '[]'),
  isLoading: false,
  error: null,

  fetchItems: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const items = await clothingService.getClothingItems(category);
      // Augment items with favorite state
      const augmentedItems = items.map(item => ({
        ...item,
        isFavorite: JSON.parse(localStorage.getItem('closet-favorites') || '[]').includes(item.itemId)
      }));
      set({ items: augmentedItems, isLoading: false });
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

  updateItem: async (itemId, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedItem = await clothingService.updateClothingItem(itemId, data);
      set((state) => ({
        items: state.items.map((item) => (item.itemId === itemId ? { ...updatedItem, isFavorite: state.favorites.includes(itemId) } : item)),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      await clothingService.deleteClothingItem(itemId);
      set((state) => ({
        items: state.items.filter((item) => item.itemId !== itemId),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  toggleFavorite: (itemId) => {
    set((state) => {
      const isFavorite = state.favorites.includes(itemId);
      const newFavorites = isFavorite 
        ? state.favorites.filter(id => id !== itemId)
        : [...state.favorites, itemId];
      
      localStorage.setItem('closet-favorites', JSON.stringify(newFavorites));
      
      return {
        favorites: newFavorites,
        items: state.items.map(item => 
          item.itemId === itemId ? { ...item, isFavorite: !isFavorite } : item
        )
      };
    });
  },
}));
