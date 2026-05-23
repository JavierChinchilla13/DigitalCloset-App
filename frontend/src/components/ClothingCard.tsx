import React from 'react';
import { motion } from 'framer-motion';
import { Shirt, Info, Edit2, Trash2 } from 'lucide-react';
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
      whileHover={{ y: -4, scale: 1.02 }}
      className="flex-shrink-0 w-40 md:w-48 group cursor-pointer"
      onClick={handleEquip}
    >
      <div className={`
        relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border transition-all duration-300
        ${isEquipped 
          ? 'border-accent ring-2 ring-accent/20 shadow-lg shadow-accent/10' 
          : 'border-white/5 bg-white/5 hover:border-white/20'
        }
      `}>
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-background-main/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(item);
              }}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10"
              title="Details"
            >
              <Info size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10"
              title="Edit"
            >
              <Edit2 size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 hover:text-white rounded-lg transition-colors border border-rose-500/20"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-[8px] font-black uppercase tracking-widest
            ${isEquipped ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white/10 text-white/50'}
          `}>
            <Shirt size={10} />
            <span>{isEquipped ? 'Equipped' : 'Wear'}</span>
          </div>
        </div>

        {/* Category Tag (Mini) */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 bg-black/40 backdrop-blur-md text-white text-[7px] font-black tracking-widest uppercase rounded-full border border-white/10">
            {item.category}
          </span>
        </div>
      </div>

      <div className="px-1">
        <h3 className={`
          text-[10px] font-bold tracking-tight line-clamp-1 transition-colors
          ${isEquipped ? 'text-accent' : 'text-white group-hover:text-accent'}
        `}>
          {item.name}
        </h3>
        <p className="text-[8px] text-text-secondary font-black tracking-widest uppercase opacity-40 mt-0.5">
          {item.category}
        </p>
      </div>
    </motion.div>
  );
};

export default ClothingCard;
