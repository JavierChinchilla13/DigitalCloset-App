import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  Type,
  AlignLeft,
  LayoutGrid,
  Shirt,
  Footprints,
  Watch,
  User,
  ShoppingBag
} from 'lucide-react';
import { ClothingCategory } from '../types';
import { useClothingStore } from '../store/useClothingStore';
import { cloudinaryService } from '../api/cloudinaryService';

interface UploadGarmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<ClothingCategory, any> = {
  [ClothingCategory.TOP]: Shirt,
  [ClothingCategory.BOTTOM]: ShoppingBag, // Using ShoppingBag as a placeholder for bottoms if specific icon is missing
  [ClothingCategory.SHOES]: Footprints,
  [ClothingCategory.JACKET]: User, // User or a custom jacket icon
  [ClothingCategory.ACCESSORY]: Watch,
};

const CATEGORY_LABELS: Record<ClothingCategory, string> = {
  [ClothingCategory.TOP]: 'Top',
  [ClothingCategory.BOTTOM]: 'Bottom',
  [ClothingCategory.SHOES]: 'Shoes',
  [ClothingCategory.JACKET]: 'Jacket',
  [ClothingCategory.ACCESSORY]: 'Accessory',
};

const UploadGarmentModal: React.FC<UploadGarmentModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ClothingCategory>(ClothingCategory.TOP);

  const { addItem } = useClothingStore();

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setStatus('error');
      setErrorMessage('Please select an image file (PNG, JPG, WEBP)');
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setStatus('idle');
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

  const handleUpload = async () => {
    if (!file || !name) return;

    setIsUploading(true);
    setStatus('uploading');

    try {
      // 1. Upload to Cloudinary
      const imageUrl = await cloudinaryService.uploadImage(file);

      // 2. Save to Backend
      await addItem({
        name,
        description,
        category,
        imageUrl
      });

      setStatus('success');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setName('');
    setDescription('');
    setCategory(ClothingCategory.TOP);
    setStatus('idle');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background-main/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-background-secondary border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-white/5">
              <div>
                <h2 className="text-2xl font-light tracking-tighter text-white uppercase">Upload Garment</h2>
                <p className="text-text-secondary text-[10px] font-black tracking-widest uppercase opacity-50 mt-1">Add to your digital collection</p>
              </div>
              <button 
                onClick={handleClose}
                className="p-3 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              {/* Step 1: Dropzone */}
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
                className={`
                  relative aspect-video rounded-[2rem] border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden group
                  ${isDragging ? 'border-accent bg-accent/5 scale-[0.98]' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}
                  ${preview ? 'border-solid border-accent/20' : ''}
                `}
              >
                <input 
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  accept="image/*"
                />

                <AnimatePresence mode="wait">
                  {!preview ? (
                    <motion.div 
                      key="instructions"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
                        <Upload className="text-accent" size={28} />
                      </div>
                      <p className="text-white font-bold tracking-tight mb-1">Drop your garment here</p>
                      <p className="text-text-secondary text-xs uppercase tracking-widest font-black opacity-40">or click to browse gallery</p>
                      
                      {/* Sublte Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0"
                    >
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-main/80 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 flex items-center gap-3">
                        <div className="bg-accent text-white p-2 rounded-lg">
                          <ImageIcon size={16} />
                        </div>
                        <p className="text-xs font-bold text-white uppercase tracking-widest">Image Loaded Successfully</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(null);
                          setFile(null);
                        }}
                        className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 2: Form Reveal */}
              <AnimatePresence>
                {preview && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-10 space-y-10">
                      {/* Name Input */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <Type size={14} className="text-accent" />
                          <label className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">Garment Name</label>
                        </div>
                        <input 
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Chrome Hearts Vintage Tee"
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all"
                        />
                      </div>

                      {/* Premium Category Selector */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <LayoutGrid size={14} className="text-accent" />
                          <label className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">Category Selection</label>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                          {Object.values(ClothingCategory).map((cat) => {
                            const Icon = CATEGORY_ICONS[cat];
                            const isSelected = category === cat;
                            return (
                              <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`
                                  relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300
                                  ${isSelected 
                                    ? 'bg-accent/10 border-accent text-white shadow-lg shadow-accent/5' 
                                    : 'bg-white/[0.02] border-white/5 text-text-secondary hover:border-white/20 hover:bg-white/[0.05]'
                                  }
                                `}
                              >
                                <Icon size={20} className={isSelected ? 'text-accent' : 'opacity-40'} />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'opacity-100' : 'opacity-40'}`}>
                                  {CATEGORY_LABELS[cat]}
                                </span>
                                {isSelected && (
                                  <motion.div 
                                    layoutId="category-glow"
                                    className="absolute inset-0 bg-accent/5 blur-xl pointer-events-none"
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Description (Small) */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <AlignLeft size={14} className="text-accent" />
                          <label className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">Details (Optional)</label>
                        </div>
                        <textarea 
                          rows={2}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Tell us more about the fit, material, or history of this piece..."
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all resize-none"
                        />
                      </div>

                      {/* Error State */}
                      {status === 'error' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400"
                        >
                          <AlertCircle size={20} />
                          <p className="text-xs font-bold uppercase tracking-widest">{errorMessage}</p>
                        </motion.div>
                      )}

                      {/* Success State */}
                      {status === 'success' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-5 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-400"
                        >
                          <CheckCircle2 size={20} />
                          <p className="text-xs font-bold uppercase tracking-widest">Garment archived successfully!</p>
                        </motion.div>
                      )}

                      {/* Action Button */}
                      <button 
                        onClick={handleUpload}
                        disabled={!name || isUploading || status === 'success'}
                        className={`
                          w-full py-6 rounded-2xl font-black text-xs tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-3
                          ${!name || isUploading || status === 'success' 
                            ? 'bg-white/5 text-text-secondary cursor-not-allowed' 
                            : 'bg-accent hover:bg-accent-hover text-white shadow-xl shadow-accent/20 active:scale-[0.98]'
                          }
                        `}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            <span>SYNCING TO MAINFRAME...</span>
                          </>
                        ) : status === 'success' ? (
                          <span>ARCHIVED</span>
                        ) : (
                          <>
                            <CheckCircle2 size={18} />
                            <span>SAVE TO CLOSET</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadGarmentModal;
