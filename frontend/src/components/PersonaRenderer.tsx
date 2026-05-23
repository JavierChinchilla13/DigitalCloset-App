import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonaType, type PersonaState } from '../types';
import PersonaLayer from './PersonaLayer';
import { useClothingStore } from '../store/useClothingStore';

interface PersonaRendererProps {
  persona: PersonaState;
}

const PersonaRenderer: React.FC<PersonaRendererProps> = ({ persona }) => {
  const { items } = useClothingStore();

  const isMale = persona.type === PersonaType.MALE;
  const baseImage = isMale ? '/personas/male-base.png' : '/personas/female-base.png';

  // Helper to find item by ID
  const getImageUrl = (itemId: number | null | undefined) => {
    if (!itemId) return undefined;
    const item = items.find(i => i.itemId === itemId);
    return item?.imageUrl;
  };

  // Define Layering Order (Z-Index)
  // Base: 0
  // Bottoms: 10
  // Shoes: 20
  // Tops: 30
  // Jackets: 40
  // Accessories: 50
  const layers = useMemo(() => [
    { 
      id: 'base', 
      imageUrl: baseImage, 
      zIndex: 0,
      alt: `${persona.type} Base Mannequin`
    },
    { 
      id: 'bottom', 
      imageUrl: getImageUrl(persona.bottomId), 
      zIndex: 10,
      alt: 'Bottom Layer'
    },
    { 
      id: 'shoes', 
      imageUrl: getImageUrl(persona.shoesId), 
      zIndex: 20,
      alt: 'Shoes Layer'
    },
    { 
      id: 'top', 
      imageUrl: getImageUrl(persona.topId), 
      zIndex: 30,
      alt: 'Top Layer'
    },
    { 
      id: 'jacket', 
      imageUrl: getImageUrl(persona.jacketId), 
      zIndex: 40,
      alt: 'Outerwear Layer'
    },
    { 
      id: 'accessory', 
      imageUrl: getImageUrl(persona.accessoryId), 
      zIndex: 50,
      alt: 'Accessory Layer'
    },
  ], [persona, items, baseImage]);

  return (
    <div className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-visible">
      {/* Refined Atmospheric Base (Minimal) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-2 bg-white/5 blur-xl rounded-full scale-x-150 z-0" />

      {/* Main Persona Container */}
      <motion.div
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative w-full h-full flex items-center justify-center z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={persona.type}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ 
              duration: 0.6, 
              ease: "circOut"
            }}
            className="relative w-full h-full flex items-center justify-center p-8"
          >
            {/* Aspect Ratio Controlled Container */}
            <div className="relative h-full aspect-[3/4] flex items-center justify-center">
              {layers.map((layer) => (
                <PersonaLayer 
                  key={`${persona.type}-${layer.id}`}
                  {...layer}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PersonaRenderer;
