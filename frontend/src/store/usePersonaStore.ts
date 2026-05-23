import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonaType, type PersonaState } from '../types';

interface PersonaStore {
  persona: PersonaState;
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
      },
      setPersonaType: (type) => set((state) => ({ 
        persona: { ...state.persona, type } 
      })),
      updatePersona: (updates) => set((state) => ({ 
        persona: { ...state.persona, ...updates } 
      })),
      setEquippedItem: (category: string, itemId: number | null) => set((state) => {
        const key = `${category.toLowerCase()}Id` as keyof PersonaState;
        return {
          persona: { ...state.persona, [key]: itemId }
        };
      }),
    }),
    {
      name: 'persona-storage',
    }
  )
);
