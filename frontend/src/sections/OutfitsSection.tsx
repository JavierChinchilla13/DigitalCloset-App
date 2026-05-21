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
    <SectionWrapper>
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-5xl font-light tracking-tighter mb-4">SAVED OUTFITS</h2>
          <p className="text-text-secondary max-w-md">Your curated collection of digital styles, ready for any occasion.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-accent" size={40} />
          <p className="text-xs font-black tracking-[0.2em] text-text-secondary uppercase opacity-50">Loading your collection...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {outfits.map((outfit, idx) => (
            <motion.div
              key={outfit.outfitId}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 premium-card">
                {/* Use the first item's image as preview */}
                <img 
                  src={outfit.items?.[0]?.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop"} 
                  alt={outfit.name} 
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-background-main/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-8 backdrop-blur-[2px]">
                  <div className="flex justify-end gap-3">
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                      <Edit3 size={18} />
                    </button>
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                      <Share2 size={18} />
                    </button>
                    <button 
                      onClick={() => removeOutfit(outfit.outfitId)}
                      className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-[1px] w-8 bg-accent" />
                      <span className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">{outfit.items?.length || 0} PIECES</span>
                    </div>
                    <button className="w-full py-4 bg-white text-background-main font-black text-xs rounded-xl tracking-[0.2em]">
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-light tracking-[0.2em] text-white text-center group-hover:text-accent transition-colors">{outfit.name.toUpperCase()}</h3>
            </motion.div>
          ))}

          {/* Create New Placeholder */}
          <motion.button
            whileHover={{ scale: 0.98 }}
            onClick={() => navigate('/outfits/new')}
            className="aspect-[3/4] rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 group hover:border-accent/40 hover:bg-accent/5 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
              <Plus size={24} />
            </div>
            <span className="text-sm font-bold tracking-widest text-text-secondary group-hover:text-white transition-colors">CREATE NEW STYLE</span>
          </motion.button>
        </div>
      )}
    </SectionWrapper>
  );
};

export default OutfitsSection;
