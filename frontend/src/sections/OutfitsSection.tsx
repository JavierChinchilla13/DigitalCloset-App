import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit3, Share2, Loader2, Plus } from 'lucide-react';
import SectionWrapper from '../components/SectionWrapper';
import { useOutfitStore } from '../store/useOutfitStore';
import { useNavigate } from 'react-router-dom';

const OutfitsSection = () => {
  const { outfits, isLoading, fetchOutfits, removeOutfit } = useOutfitStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

  return (
    <SectionWrapper className="py-16">
      <div className="flex justify-between items-end mb-12 px-2">
        <div>
          <h2 className="text-4xl font-light tracking-tighter mb-2 uppercase">Saved Outfits</h2>
          <p className="text-text-secondary text-[10px] uppercase tracking-widest opacity-40">Your curated collection // {outfits.length} styles</p>
        </div>
        <button 
          onClick={() => navigate('/outfits/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all border border-white/5 font-black text-[10px] uppercase tracking-widest"
        >
          <Plus size={14} />
          <span>Create New</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-30">
          <Loader2 className="animate-spin text-accent" size={32} />
          <p className="text-[10px] font-black tracking-[0.2em] uppercase">Loading collection...</p>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar scroll-smooth">
          {outfits.map((outfit, idx) => (
            <motion.div
              key={outfit.outfitId}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="flex-shrink-0 w-64 md:w-72 group"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 border border-white/5 bg-white/5 shadow-xl">
                <img 
                  src={outfit.items?.[0]?.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop"} 
                  alt={outfit.name} 
                  className="w-full h-full object-cover transition-all duration-700"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-background-main/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-6 backdrop-blur-[2px]">
                  <div className="flex justify-end gap-2">
                    <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => removeOutfit(outfit.outfitId)}
                      className="p-2.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-[1px] w-6 bg-accent" />
                      <span className="text-[9px] font-black tracking-[0.3em] text-accent uppercase">{outfit.items?.length || 0} PIECES</span>
                    </div>
                    <button className="w-full py-3 bg-white text-background-main font-black text-[9px] rounded-lg tracking-[0.15em] uppercase">
                      VIEW STYLE
                    </button>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-light tracking-[0.15em] text-white text-center group-hover:text-accent transition-colors">
                {outfit.name.toUpperCase()}
              </h3>
            </motion.div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

export default OutfitsSection;
