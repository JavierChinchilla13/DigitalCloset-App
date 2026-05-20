import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink, Loader2, Plus } from 'lucide-react';
import { ClothingCategory } from '../types';
import type { ClothingItem } from '../types';
import SectionWrapper from '../components/SectionWrapper';
import { useClothingStore } from '../store/useClothingStore';
import UploadGarmentModal from '../components/UploadGarmentModal';

const ClosetSection = () => {
  const { items, isLoading, fetchItems } = useClothingStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ClothingItem[]>);

  // If no items are found, we could show a placeholder or some message
  const categories = Object.keys(groupedItems).length > 0 
    ? Object.entries(groupedItems) 
    : [];

  return (
    <SectionWrapper className="bg-background-secondary/20 border-y border-white/5">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-5xl font-light tracking-tighter mb-4">YOUR CLOSET</h2>
          <p className="text-text-secondary max-w-md">Your digital inventory of premium garments, ready to be styled.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg shadow-accent/20 text-xs uppercase tracking-widest"
          >
            <Plus size={16} />
            <span>Add Garment</span>
          </button>
          <button className="flex items-center gap-2 text-text-secondary hover:text-white font-bold transition-all uppercase tracking-widest text-xs">
            <span>Manage All</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-accent" size={40} />
          <p className="text-xs font-black tracking-[0.2em] text-text-secondary uppercase opacity-50">Syncing with mainframe...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[2rem]">
          <p className="text-text-secondary uppercase tracking-[0.3em] text-xs font-black opacity-30">Your closet is currently empty</p>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-8 px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black tracking-widest rounded-full transition-all"
          >
            UPLOAD FIRST GARMENT
          </button>
        </div>
      ) : (
        <div className="space-y-24">
          {categories.map(([category, categoryItems], categoryIdx) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIdx * 0.2 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-black tracking-[0.3em] text-accent uppercase">{category}</span>
                <div className="h-[1px] flex-grow bg-white/5" />
                <button className="text-[10px] font-bold text-text-secondary hover:text-white transition-colors uppercase tracking-widest">
                  View All ({categoryItems.length})
                </button>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
                {categoryItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="flex-shrink-0 w-64 md:w-72 group"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 premium-card glow-effect">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-main/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <button className="w-full py-3 bg-white text-background-main text-xs font-black rounded-full flex items-center justify-center gap-2">
                          <ExternalLink size={14} />
                          DETAILS
                        </button>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold tracking-tight text-white mb-1">{item.name}</h3>
                    <p className="text-[10px] text-text-secondary font-black tracking-widest uppercase opacity-40">COLLECTION 2026</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <UploadGarmentModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </SectionWrapper>
  );
};

export default ClosetSection;
