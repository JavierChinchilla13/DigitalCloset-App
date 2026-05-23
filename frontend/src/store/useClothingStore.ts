import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClothingCategory } from '../types';
import type { ClothingItem } from '../types';
import { clothingService } from '../api/clothingService';

interface ClothingState {
  items: ClothingItem[];
  favorites: number[]; // Array of itemId
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  fetchItems: (category?: ClothingCategory) => Promise<void>;
  addItem: (data: Omit<ClothingItem, 'itemId'>) => Promise<void>;
  updateItem: (itemId: number, data: Partial<ClothingItem>) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  toggleFavorite: (itemId: number) => void;
}

export const useClothingStore = create<ClothingState>()(
  persist(
    (set, get) => ({
      items: [],
      favorites: JSON.parse(localStorage.getItem('closet-favorites') || '[]'),
      isLoading: false,
      error: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      fetchItems: async (category) => {
        set({ isLoading: true, error: null });
        try {
          const items = await clothingService.getClothingItems(category);
          // Augment items with favorite state
          const favorites = JSON.parse(localStorage.getItem('closet-favorites') || '[]');
          const augmentedItems = items.map(item => ({
            ...item,
            isFavorite: favorites.includes(item.itemId)
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
          const currentItems = get().items;
          set({ items: [...currentItems, newItem], isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      updateItem: async (itemId, data) => {
        set({ isLoading: true, error: null });
        try {
          const updatedItem = await clothingService.updateClothingItem(itemId, data);
          const { items, favorites } = get();
          set({
            items: items.map((item) => (item.itemId === itemId ? { ...updatedItem, isFavorite: favorites.includes(itemId) } : item)),
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true, error: null });
        try {
          await clothingService.deleteClothingItem(itemId);
          const currentItems = get().items;
          set({
            items: currentItems.filter((item) => item.itemId !== itemId),
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      toggleFavorite: (itemId) => {
        const { items, favorites } = get();
        const isFavorite = favorites.includes(itemId);
        const newFavorites = isFavorite 
          ? favorites.filter(id => id !== itemId)
          : [...favorites, itemId];
        
        localStorage.setItem('closet-favorites', JSON.stringify(newFavorites));
        
        set({
          favorites: newFavorites,
          items: items.map(item => 
            item.itemId === itemId ? { ...item, isFavorite: !isFavorite } : item
          )
        });
      },
    }),
    {
      name: 'clothing-closet-storage',
      partialize: (state) => ({ items: state.items, favorites: state.favorites }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
