import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type ClothingTransform, ClothingCategory, PersonaType } from '../types';
import { DEFAULT_TRANSFORMS } from './FittingTool/Presets';

interface PersonaLayerProps {
  id: string;
  imageUrl?: string;
  zIndex: number;
  transform?: ClothingTransform;
  className?: string;
  alt?: string;
  category?: ClothingCategory;
  personaType?: PersonaType;
}

const PersonaLayer: React.FC<PersonaLayerProps> = ({ 
  imageUrl, 
  zIndex, 
  transform, 
  className = "", 
  alt = "",
  category,
  personaType
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          setContainerHeight(entry.contentRect.height);
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const VIRTUAL_HEIGHT = 1000;
  const viewScale = containerHeight / VIRTUAL_HEIGHT;

  const finalTransform = transform?.width 
    ? transform 
    : (category && personaType ? DEFAULT_TRANSFORMS[personaType][category] : null);

  // If no image, render nothing (no AnimatePresence lag)
  if (!imageUrl) return null;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible ${className}`}
      style={{ zIndex }}
    >
      <img 
        src={imageUrl} 
        alt={alt}
        className="pointer-events-none absolute"
        style={finalTransform ? {
          transform: `translate(${finalTransform.x * viewScale}px, ${finalTransform.y * viewScale}px) rotate(${finalTransform.rotation}deg) scale(${finalTransform.scale})`,
          width: finalTransform.width ? `${finalTransform.width * viewScale}px` : 'auto',
          height: finalTransform.height ? `${finalTransform.height * viewScale}px` : 'auto',
          maxWidth: 'none',
          maxHeight: 'none',
          visibility: 'visible',
          opacity: 1
        } : {
          height: '100%',
          width: 'auto',
          objectFit: 'contain',
          visibility: 'visible',
          opacity: 1
        }}
      />
    </motion.div>
  );
};

export default PersonaLayer;
