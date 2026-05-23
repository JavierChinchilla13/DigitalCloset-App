import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { PersonaType } from '../types';
import PersonaLayer from './PersonaLayer';
import { useClothingStore } from '../store/useClothingStore';
import { usePersonaStore } from '../store/usePersonaStore';

const PersonaRenderer: React.FC = () => {
  const { items, isLoading, fetchItems, _hasHydrated: closetHydrated } = useClothingStore();
  const { persona, _hasHydrated: personaHydrated } = usePersonaStore();

  const isMale = persona.type === PersonaType.MALE;
  const baseImage = isMale ? '/personas/male-base.png' : '/personas/female-base.png';

  useEffect(() => {
    if (closetHydrated && items.length === 0 && !isLoading) {
      fetchItems();
    }
  }, [fetchItems, items.length, isLoading, closetHydrated]);

  if (!personaHydrated || !closetHydrated) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[600px]">
        <Loader2 className="animate-spin text-accent/20" size={32} />
      </div>
    );
  }

  const getItem = (itemId: number | null | undefined) => {
    if (!itemId) return undefined;
    const item = items.find(i => String(i.itemId) === String(itemId));
    if (item && item.personaType !== persona.type) return undefined;
    return item;
  };

  const bottom = getItem(persona.bottomId);
  const shoes = getItem(persona.shoesId);
  const top = getItem(persona.topId);
  const dress = getItem(persona.dressId);
  const jacket = getItem(persona.jacketId);
  const accessory = getItem(persona.accessoryId);

  const layers = [
    { id: 'base', imageUrl: baseImage, zIndex: 1, alt: 'Mannequin' },
    { id: 'bottom', imageUrl: bottom?.imageUrl, zIndex: 10, transform: bottom?.transform, category: bottom?.category, personaType: persona.type },
    { id: 'shoes', imageUrl: shoes?.imageUrl, zIndex: 20, transform: shoes?.transform, category: shoes?.category, personaType: persona.type },
    { id: 'dress', imageUrl: dress?.imageUrl, zIndex: 25, transform: dress?.transform, category: dress?.category, personaType: persona.type },
    { id: 'top', imageUrl: top?.imageUrl, zIndex: 30, transform: top?.transform, category: top?.category, personaType: persona.type },
    { id: 'jacket', imageUrl: jacket?.imageUrl, zIndex: 40, transform: jacket?.transform, category: jacket?.category, personaType: persona.type },
    { id: 'accessory', imageUrl: accessory?.imageUrl, zIndex: 50, transform: accessory?.transform, category: accessory?.category, personaType: persona.type },
  ];

  return (
    <div className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-visible">
      {/* Clean Minimal shadow for depth */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-4 bg-black/40 blur-2xl rounded-full scale-x-150 z-0" />

      {/* Main Persona Container */}
      <div className="relative w-full h-full flex items-center justify-center z-10 overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={persona.type}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="relative h-full aspect-[3/4] flex items-center justify-center overflow-visible"
          >
            {layers.map((layer) => (
              <PersonaLayer 
                key={`${layer.id}-${layer.imageUrl || 'none'}`}
                {...layer}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PersonaRenderer;
