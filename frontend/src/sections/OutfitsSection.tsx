import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit3, Share2, Loader2, Plus, Calendar } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import { useLocalOutfitStore } from '../store/useLocalOutfitStore';
import { usePersonaStore } from '../store/usePersonaStore';
import { useNavigate } from 'react-router-dom';
import { PersonaType } from '../types';
import PersonaRenderer from '../components/PersonaRenderer';

const OutfitsSection = () => {
  const { outfits, _hasHydrated, deleteOutfit } = useLocalOutfitStore();
  const { persona, updatePersona } = usePersonaStore();
  const navigate = useNavigate();

  const filteredOutfits = outfits.filter(o => {
    // For legacy data, we default to MALE or allow it if personaType is missing
    const outfitType = o.personaType || PersonaType.MALE;
    return outfitType === persona.type;
  });

  const handleApply = (outfit: any) => {
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
      day: 'numeric'
    });
  };

  if (!_hasHydrated) {
    return (
      <SectionWrapper className="py-16">
        <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-30">
          <Loader2 className="animate-spin text-accent" size={32} />
          <p className="text-[10px] font-black tracking-[0.2em] uppercase">Syncing Outfits...</p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper className="py-16">
      <div className="flex justify-between items-end mb-12 px-2">
        <div>
          <h2 className="text-4xl font-light tracking-tighter mb-2 uppercase">Saved Outfits</h2>
          <p className="text-text-secondary text-[10px] uppercase tracking-widest opacity-40">Your curated collection // {filteredOutfits.length} styles</p>
        </div>
        <button 
          onClick={() => navigate('/outfits/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all border border-white/5 font-black text-[10px] uppercase tracking-widest"
        >
          <Plus size={14} />
          <span>Create New</span>
        </button>
      </div>

      {filteredOutfits.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-3xl opacity-20">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-black">No styles saved yet for this persona</p>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar scroll-smooth">
          {filteredOutfits.map((outfit, idx) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="flex-shrink-0 w-64 md:w-72 group"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 border border-white/5 bg-background-secondary shadow-xl">
                <div className="w-full h-full scale-[0.6] origin-center translate-y-[-5%] transition-transform duration-700 group-hover:scale-[0.65]">
                  <PersonaRenderer 
                    persona={{
                      type: outfit.personaType || PersonaType.MALE,
                      ...outfit.items
                    }} 
                    className="h-full" 
                  />
                </div>
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-background-main/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-6 backdrop-blur-[2px]">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/outfits/edit/${outfit.id}`)}
                      className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => deleteOutfit(outfit.id)}
                      className="p-2.5 bg-rose-500/20 hover:bg-rose-500/40 rounded-lg text-rose-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-[1px] w-6 bg-accent" />
                      <span className="text-[9px] font-black tracking-[0.3em] text-accent uppercase">LOCAL STYLE</span>
                    </div>
                    <button 
                      onClick={() => handleApply(outfit)}
                      className="w-full py-3 bg-white text-background-main font-black text-[9px] rounded-lg tracking-[0.15em] uppercase"
                    >
                      WEAR STYLE
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-light tracking-[0.15em] text-white group-hover:text-accent transition-colors">
                  {outfit.name.toUpperCase()}
                </h3>
                <p className="text-[8px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-40 mt-1 flex items-center justify-center gap-1">
                  <Calendar size={8} /> {formatDate(outfit.createdAt)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

export default OutfitsSection;
