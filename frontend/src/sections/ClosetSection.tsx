import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2, Plus } from 'lucide-react';
import { ClothingCategory } from '../types';
import type { ClothingItem } from '../types';
import SectionWrapper from '../components/SectionWrapper';
import { useClothingStore } from '../store/useClothingStore';
import UploadGarmentModal from '../components/UploadGarmentModal';
import ClothingCard from '../components/ClothingCard';
import ClothingDetailsModal from '../components/ClothingDetailsModal';
import EditClothingModal from '../components/EditClothingModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const ClosetSection = () => {
  const { items, isLoading, fetchItems } = useClothingStore();
  
  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Selected Item State
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleViewDetails = (item: ClothingItem) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (item: ClothingItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item: ClothingItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ClothingItem[]>);

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

      {isLoading && items.length === 0 ? (
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
                  <ClothingCard 
                    key={item.itemId}
                    item={item}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <UploadGarmentModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />

      <ClothingDetailsModal 
        item={selectedItem}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      <EditClothingModal 
        item={selectedItem}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <DeleteConfirmationModal 
        itemId={selectedItem?.itemId || null}
        itemName={selectedItem?.name || ''}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </SectionWrapper>
  );
};

export default ClosetSection;
