import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Copy, Play, Calendar, Check, X } from 'lucide-react';
import type { LocalOutfit } from '../store/useLocalOutfitStore';
import { useLocalOutfitStore } from '../store/useLocalOutfitStore';
import { usePersonaStore } from '../store/usePersonaStore';
import { useNavigate } from 'react-router-dom';
import PersonaRenderer from './PersonaRenderer';
import { PersonaType } from '../types';

interface OutfitCardProps {
  outfit: LocalOutfit;
}

const OutfitCard: React.FC<OutfitCardProps> = ({ outfit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteOutfit, duplicateOutfit } = useLocalOutfitStore();
  const { updatePersona } = usePersonaStore();
  const navigate = useNavigate();

  const handleApply = () => {
    updatePersona(outfit.items);
    // Auto-scroll to persona section to see the full look
    const personaEl = document.getElementById('persona');
    if (personaEl) {
      personaEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const outfitPersona = {
    type: outfit.personaType || PersonaType.MALE,
    ...outfit.items
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/5 bg-background-secondary shadow-xl transition-all group-hover:shadow-accent/5">
        <div className="w-full h-full scale-[0.6] origin-center translate-y-[-5%] transition-transform duration-700 group-hover:scale-[0.65]">
           <PersonaRenderer persona={outfitPersona} className="h-full" />
        </div>
        
        {/* Actions Overlay */}
        <div className="absolute inset-0 bg-background-main/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6 backdrop-blur-[2px]">
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => duplicateOutfit(outfit.id)}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors border border-white/5"
              title="Duplicate"
            >
              <Copy size={14} />
            </button>
            <button 
              onClick={() => navigate(`/outfits/edit/${outfit.id}`)}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors border border-white/5"
              title="Edit"
            >
              <Edit2 size={14} />
            </button>
            <button 
              onClick={() => setIsDeleting(true)}
              className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/10"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleApply}
              className="w-full py-3 bg-white text-background-main font-black text-[10px] rounded-xl tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
            >
              <Play size={12} fill="currentColor" />
              WEAR STYLE
            </button>
          </div>
        </div>

        {/* Delete Confirmation Overlay */}
        <AnimatePresence>
          {isDeleting && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-rose-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              <p className="text-white text-[10px] font-black uppercase tracking-widest mb-4">Confirm Deletion?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => deleteOutfit(outfit.id)}
                  className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg"
                >
                  <Check size={20} />
                </button>
                <button 
                  onClick={() => setIsDeleting(false)}
                  className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 px-2 space-y-1">
        <h3 className="text-sm font-bold text-white group-hover:text-accent transition-colors line-clamp-1 uppercase tracking-wider">
          {outfit.name}
        </h3>
        <div className="flex items-center gap-2 opacity-30">
          <Calendar size={10} className="text-text-secondary" />
          <span className="text-[8px] font-black uppercase tracking-widest text-text-secondary">
            {formatDate(outfit.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitCard;
