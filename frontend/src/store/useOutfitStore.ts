import { create } from 'zustand';
import type { Outfit } from '../types';
import { outfitService } from '../api/outfitService';
import type { OutfitRequest } from '../api/outfitService';

interface OutfitState {
  outfits: Outfit[];
  isLoading: boolean;
  error: string | null;
  fetchOutfits: () => Promise<void>;
  saveOutfit: (data: OutfitRequest) => Promise<void>;
  removeOutfit: (id: number) => Promise<void>;
}

export const useOutfitStore = create<OutfitState>((set) => ({
  outfits: [],
  isLoading: false,
  error: null,

  fetchOutfits: async () => {
    set({ isLoading: true, error: null });
    try {
      const outfits = await outfitService.getOutfits();
      set({ outfits, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  saveOutfit: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newOutfit = await outfitService.createOutfit(data);
      set((state) => ({ outfits: [...state.outfits, newOutfit], isLoading: false }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  removeOutfit: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await outfitService.deleteOutfit(id);
      set((state) => ({
        outfits: state.outfits.filter((o) => o.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
