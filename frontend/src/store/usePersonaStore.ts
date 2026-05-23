import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonaType, type PersonaState } from '../types';

interface PersonaStore {
  persona: PersonaState;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setPersonaType: (type: PersonaType) => void;
  updatePersona: (updates: Partial<PersonaState>) => void;
  setEquippedItem: (category: string, itemId: number | null) => void;
}

export const usePersonaStore = create<PersonaStore>()(
  persist(
    (set) => ({
      persona: {
        type: PersonaType.MALE,
        skinTone: 'default',
        bodyType: 'standard',
        height: 180,
        hairId: 'default',
        topId: null,
        bottomId: null,
        shoesId: null,
        accessoryId: null,
        jacketId: null,
        dressId: null,
      },
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setPersonaType: (type) => set((state) => ({ 
        persona: { ...state.persona, type } 
      })),
      updatePersona: (updates) => set((state) => ({ 
        persona: { ...state.persona, ...updates } 
      })),
      setEquippedItem: (category: string, itemId: number | null) => set((state) => {
        const key = `${category.toLowerCase()}Id` as keyof PersonaState;
        
        // Logical override: If wearing a dress, clear top and bottom
        const overrides: Partial<PersonaState> = {};
        if (category === 'DRESS' && itemId !== null) {
          overrides.topId = null;
          overrides.bottomId = null;
        } else if ((category === 'TOP' || category === 'BOTTOM') && itemId !== null) {
          overrides.dressId = null;
        }

        return {
          persona: { ...state.persona, ...overrides, [key]: itemId }
        };
      }),
    }),
    {
      name: 'persona-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
