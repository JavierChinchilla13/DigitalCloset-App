import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import { useLocalOutfitStore } from '../store/useLocalOutfitStore';
import { usePersonaStore } from '../store/usePersonaStore';
import { useNavigate } from 'react-router-dom';
import { PersonaType } from '../types';
import OutfitCard from '../components/OutfitCard';

const OutfitsSection = () => {
  const { outfits, _hasHydrated } = useLocalOutfitStore();
  const { persona } = usePersonaStore();
  const navigate = useNavigate();

  const filteredOutfits = outfits.filter(o => {
    const outfitType = o.personaType || PersonaType.MALE;
    return outfitType === persona.type;
  });

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
        <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth px-2">
          {filteredOutfits.map((outfit) => (
            <div key={outfit.id} className="flex-shrink-0 w-64 md:w-72">
              <OutfitCard outfit={outfit} />
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

export default OutfitsSection;
