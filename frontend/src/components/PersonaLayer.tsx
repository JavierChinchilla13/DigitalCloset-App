import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonaLayerProps {
  id: string;
  imageUrl?: string;
  zIndex: number;
  className?: string;
  alt?: string;
}

const PersonaLayer: React.FC<PersonaLayerProps> = ({ imageUrl, zIndex, className = "", alt = "" }) => {
  return (
    <AnimatePresence mode="wait">
      {imageUrl && (
        <motion.div
          key={imageUrl}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
          style={{ zIndex }}
        >
          <img 
            src={imageUrl} 
            alt={alt}
            className="w-full h-full object-contain pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersonaLayer;
