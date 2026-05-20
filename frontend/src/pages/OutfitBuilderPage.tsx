import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import { useClothingStore } from '../store/useClothingStore';
import { useOutfitStore } from '../store/useOutfitStore';
import { ClothingCategory } from '../types';
import type { ClothingItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Trash2, RotateCcw, Layout, Shirt, ChevronLeft, Loader2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useImage from 'use-image';

// Individual Canvas Item Component
const URLImage = ({ 
  item, 
  isSelected, 
  onSelect, 
  onChange 
}: { 
  item: any, 
  isSelected: boolean, 
  onSelect: () => void, 
  onChange: (newAttrs: any) => void 
}) => {
  const [img] = useImage(item.imageUrl, 'anonymous');
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <KonvaImage
        image={img}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...item}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...item,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...item,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const OutfitBuilderPage = () => {
  const { items: closetItems, fetchItems, isLoading: loadingCloset } = useClothingStore();
  const { saveOutfit, isLoading: savingOutfit } = useOutfitStore();
  const [canvasItems, setCanvasItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ClothingCategory>(ClothingCategory.TOP);
  const [outfitName, setOutfitName] = useState('My New Outfit');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const addToCanvas = (clothingItem: ClothingItem) => {
    const newItem = {
      id: `canvas-${Date.now()}`,
      clothingItemId: clothingItem.id,
      imageUrl: clothingItem.imageUrl,
      x: 100,
      y: 100,
      width: 200,
      height: 250,
      rotation: 0,
      itemOrder: canvasItems.length,
    };
    setCanvasItems([...canvasItems, newItem]);
  };

  const handleSave = async () => {
    if (canvasItems.length === 0) return;
    
    const requestData = {
      name: outfitName,
      items: canvasItems.map((item, index) => ({
        clothingItemId: item.clothingItemId,
        positionX: item.x,
        positionY: item.y,
        scaleX: item.width / 200, // Normalized
        scaleY: item.height / 250, // Normalized
        rotation: item.rotation,
        itemOrder: index,
      })),
    };

    try {
      await saveOutfit(requestData);
      navigate('/outfits');
    } catch (err) {
      console.error('Failed to save outfit', err);
    }
  };

  const clearCanvas = () => setCanvasItems([]);
  const removeSelectedItem = () => {
    if (selectedId) {
      setCanvasItems(canvasItems.filter(i => i.id !== selectedId));
      setSelectedId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background-main flex flex-col md:flex-row pt-24 pb-12 px-6 gap-8">
      {/* Sidebar: Wardrobe */}
      <aside className="w-full md:w-80 glass-panel rounded-3xl p-6 flex flex-col max-h-[80vh]">
        <div className="flex items-center gap-2 mb-8 text-white uppercase tracking-widest text-xs font-black">
          <Shirt size={16} className="text-accent" />
          <span>YOUR WARDROBE</span>
        </div>

        {/* Categories Toggle */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {Object.values(ClothingCategory).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${
                activeCategory === cat ? 'bg-accent text-white' : 'bg-white/5 text-text-secondary hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-grow overflow-y-auto pr-2 space-y-4 no-scrollbar">
          {loadingCloset ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
          ) : (
            closetItems.filter(i => i.category === activeCategory).map(item => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCanvas(item)}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer premium-card group"
              >
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Plus className="text-white" size={32} />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-grow flex flex-col gap-6 h-[80vh]">
        <header className="flex justify-between items-center glass-panel px-8 py-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-text-secondary transition-colors">
              <ChevronLeft size={20} />
            </button>
            <input 
              value={outfitName} 
              onChange={e => setOutfitName(e.target.value)}
              className="bg-transparent text-white font-bold tracking-widest uppercase border-b border-transparent focus:border-accent focus:outline-none px-2"
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={clearCanvas} className="p-2 hover:bg-white/5 rounded-full text-text-secondary hover:text-red-400 transition-colors" title="Clear All">
              <RotateCcw size={20} />
            </button>
            {selectedId && (
              <button onClick={removeSelectedItem} className="p-2 hover:bg-white/5 rounded-full text-red-400 transition-colors" title="Remove Item">
                <Trash2 size={20} />
              </button>
            )}
            <button 
              onClick={handleSave} 
              disabled={canvasItems.length === 0 || savingOutfit}
              className="ml-4 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-accent/20"
            >
              {savingOutfit ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>SAVE STYLE</span>
            </button>
          </div>
        </header>

        <div className="flex-grow bg-[#14171d] rounded-[2.5rem] relative overflow-hidden border border-white/5 shadow-inner">
          {/* Canvas Background Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(#5B8CFF 1px, transparent 1px)', 
              backgroundSize: '30px 30px' 
            }} 
          />
          
          <Stage 
            width={1000} 
            height={700}
            onClick={(e) => {
              const clickedOnEmpty = e.target === e.target.getStage();
              if (clickedOnEmpty) setSelectedId(null);
            }}
          >
            <Layer>
              {canvasItems.map((item, i) => (
                <URLImage
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedId}
                  onSelect={() => setSelectedId(item.id)}
                  onChange={(newAttrs) => {
                    const items = canvasItems.slice();
                    items[i] = newAttrs;
                    setCanvasItems(items);
                  }}
                />
              ))}
            </Layer>
          </Stage>

          {canvasItems.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary pointer-events-none">
              <Layout size={64} className="opacity-10 mb-6" />
              <p className="text-xs font-black tracking-[0.3em] uppercase opacity-20">Drop garments here to start styling</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OutfitBuilderPage;
