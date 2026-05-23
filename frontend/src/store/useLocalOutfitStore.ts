import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocalOutfit {
  id: string;
  name: string;
  createdAt: string;
  preview: string; // Base64 or URL
  items: {
    topId: number | null;
    bottomId: number | null;
    shoesId: number | null;
    accessoryId: number | null;
    jacketId: number | null;
  };
}

interface LocalOutfitStore {
  outfits: LocalOutfit[];
  saveOutfit: (outfit: Omit<LocalOutfit, 'id' | 'createdAt'>) => void;
  updateOutfit: (id: string, updates: Partial<LocalOutfit>) => void;
  deleteOutfit: (id: string) => void;
  duplicateOutfit: (id: string) => void;
}

export const useLocalOutfitStore = create<LocalOutfitStore>()(
  persist(
    (set) => ({
      outfits: [],
      saveOutfit: (outfit) => set((state) => ({
        outfits: [
          {
            ...outfit,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
          ...state.outfits
        ]
      })),
      updateOutfit: (id, updates) => set((state) => ({
        outfits: state.outfits.map((o) => (o.id === id ? { ...o, ...updates } : o))
      })),
      deleteOutfit: (id) => set((state) => ({
        outfits: state.outfits.filter((o) => o.id !== id)
      })),
      duplicateOutfit: (id) => set((state) => {
        const original = state.outfits.find((o) => o.id === id);
        if (!original) return state;
        return {
          outfits: [
            {
              ...original,
              id: crypto.randomUUID(),
              name: `${original.name} (Copy)`,
              createdAt: new Date().toISOString(),
            },
            ...state.outfits
          ]
        };
      }),
    }),
    {
      name: 'saved-outfits-storage',
    }
  )
);
