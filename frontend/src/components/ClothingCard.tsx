import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Edit2, Trash2, Calendar, Shirt } from 'lucide-react';
import type { ClothingItem } from '../types';
import { usePersonaStore } from '../store/usePersonaStore';

interface ClothingCardProps {
  item: ClothingItem;
  onViewDetails: (item: ClothingItem) => void;
  onEdit: (item: ClothingItem) => void;
  onDelete: (item: ClothingItem) => void;
}

const ClothingCard: React.FC<ClothingCardProps> = ({ 
  item, 
  onViewDetails, 
  onEdit, 
  onDelete 
}) => {
  const { setEquippedItem, persona } = usePersonaStore();

  const isEquipped = Object.values(persona).includes(item.itemId);

  const handleEquip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEquipped) {
      setEquippedItem(item.category, null);
    } else {
      setEquippedItem(item.category, item.itemId);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      className="flex-shrink-0 w-64 md:w-72 group"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 premium-card glow-effect">
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-background-main/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center gap-3 p-6">
          <button 
            onClick={handleEquip}
            className={`
              w-full py-3 text-[10px] font-black rounded-full flex items-center justify-center gap-2 transition-all uppercase tracking-widest
              ${isEquipped 
                ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                : 'bg-white text-background-main hover:bg-white/90'
              }
            `}
          >
            <Shirt size={14} />
            {isEquipped ? 'Unequip' : 'Wear on Persona'}
          </button>

          <button 
            onClick={() => onViewDetails(item)}
            className="w-full py-3 bg-white/10 text-white text-[10px] font-black rounded-full flex items-center justify-center gap-2 hover:bg-white/20 transition-colors uppercase tracking-widest"
          >
            <ExternalLink size={14} />
            Details
          </button>
          
          <div className="flex w-full gap-2">
            <button 
              onClick={() => onEdit(item)}
              className="flex-1 py-3 bg-white/5 text-white text-[10px] font-black rounded-full flex items-center justify-center gap-2 hover:bg-white/10 transition-colors uppercase tracking-widest"
            >
              <Edit2 size={12} />
              Edit
            </button>
            <button 
              onClick={() => onDelete(item)}
              className="flex-1 py-3 bg-rose-500/10 text-rose-500 text-[10px] font-black rounded-full flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest border border-rose-500/20"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>

        {/* Category Tag (Floating) */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[8px] font-black tracking-widest uppercase rounded-full border border-white/10">
            {item.category}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold tracking-tight text-white line-clamp-1">{item.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-text-secondary font-black tracking-widest uppercase opacity-40">
            {item.category}
          </p>
          {item.createdAt && (
            <div className="flex items-center gap-1 text-[8px] text-text-secondary opacity-30 font-bold uppercase tracking-tighter">
              <Calendar size={10} />
              <span>
                {Array.isArray(item.createdAt) 
                  ? item.createdAt[0] 
                  : new Date(item.createdAt).getFullYear() || '2026'}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ClothingCard;
