import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Loader2, 
  Shirt, 
  Footprints, 
  Watch, 
  User, 
  ShoppingBag,
  Layers,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';
import { ClothingCategory, PersonaType, type ClothingTransform } from '../../types';
import { useClothingStore } from '../../store/useClothingStore';
import { cloudinaryService } from '../../api/cloudinaryService';
import { removeBackground } from '../../utils/removeBackground';
import FittingEditor from './FittingEditor';

interface UploadFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'UPLOAD' | 'CONFIG' | 'PROCESSING' | 'FITTING';

const CATEGORY_ICONS: Record<ClothingCategory, React.ElementType> = {
  [ClothingCategory.TOP]: Shirt,
  [ClothingCategory.BOTTOM]: ShoppingBag,
  [ClothingCategory.SHOES]: Footprints,
  [ClothingCategory.JACKET]: User,
  [ClothingCategory.ACCESSORY]: Watch,
  [ClothingCategory.DRESS]: Layers,
};

const UploadFlow: React.FC<UploadFlowProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>('UPLOAD');
  const [file, setFile] = useState<File | null>(null);
  
  // Config State
  const [category, setCategory] = useState<ClothingCategory>(ClothingCategory.TOP);
  const [personaType, setPersonaType] = useState<PersonaType>(PersonaType.MALE);
  
  // Processing State
  const [processingStatus, setProcessingStatus] = useState('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useClothingStore();

  const resetFlow = () => {
    setStep('UPLOAD');
    setFile(null);
    setCategory(ClothingCategory.TOP);
    setPersonaType(PersonaType.MALE);
    setProcessedImageUrl(null);
    setError(null);
  };

  const handleClose = () => {
    resetFlow();
    onClose();
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setStep('CONFIG');
  };

  const startProcessing = async () => {
    if (!file) return;
    
    setStep('PROCESSING');
    setError(null);
    
    try {
      // 1. Remove Background
      setProcessingStatus('Removing background...');
      const transparentBlob = await removeBackground(file);
      
      // 2. Upload to Cloudinary
      setProcessingStatus('Uploading to secure cloud...');
      const url = await cloudinaryService.uploadImage(transparentBlob);
      
      setProcessedImageUrl(url);
      setStep('FITTING');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Processing failed. Please try again.';
      setError(message);
    }
  };

  const handleSave = async (data: { name: string; description: string; transform: ClothingTransform }) => {
    if (!processedImageUrl) return;

    try {
      await addItem({
        name: data.name,
        description: data.description,
        category,
        personaType,
        imageUrl: processedImageUrl,
        transform: data.transform
      });
      handleClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save garment.';
      setError(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-background-main/90 backdrop-blur-2xl"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={`relative bg-background-secondary border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden transition-all duration-700 ${
          step === 'FITTING' ? 'w-full max-w-6xl h-[90vh]' : 'w-full max-w-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-full transition-colors text-text-secondary hover:text-white z-50"
        >
          <X size={20} />
        </button>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: '0%' }}
            animate={{ 
              width: step === 'UPLOAD' ? '25%' : step === 'CONFIG' ? '50%' : step === 'PROCESSING' ? '75%' : '100%' 
            }}
          />
        </div>

        <div className="p-8 md:p-12 h-full flex flex-col">
          <AnimatePresence mode="wait">
            {step === 'UPLOAD' && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-light tracking-tighter text-white uppercase italic">Step 1 — Initial Intake</h2>
                  <p className="text-text-secondary text-[10px] font-black tracking-widest uppercase opacity-40">Drop your garment to begin digitization</p>
                </div>

                <div 
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="aspect-video rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent/50 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center group"
                >
                  <input 
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
                    <Upload className="text-accent" size={32} />
                  </div>
                  <p className="text-white font-bold tracking-tight text-lg">Select Garment Image</p>
                  <p className="text-text-secondary text-[10px] font-black tracking-[0.3em] uppercase opacity-30 mt-2">PNG / JPG / WEBP</p>
                </div>
              </motion.div>
            )}

            {step === 'CONFIG' && (
              <motion.div 
                key="config"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-light tracking-tighter text-white uppercase italic">Step 2 — Architecture</h2>
                  <p className="text-text-secondary text-[10px] font-black tracking-widest uppercase opacity-40">Define garment category and persona target</p>
                </div>

                <div className="space-y-10">
                  {/* Category */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                      <Layers size={14} className="text-accent" />
                      <label className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">Garment Category</label>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {Object.values(ClothingCategory)
                        .filter(cat => cat !== ClothingCategory.ACCESSORY)
                        .map((cat) => {
                        const Icon = CATEGORY_ICONS[cat];
                        return (
                          <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`flex flex-col items-center gap-3 p-4 w-24 rounded-2xl border transition-all ${
                              category === cat 
                                ? 'bg-accent/10 border-accent text-white' 
                                : 'bg-white/[0.02] border-white/5 text-text-secondary hover:border-white/20'
                            }`}
                          >
                            <Icon size={18} />
                            <span className="text-[8px] font-black uppercase tracking-widest">{cat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Persona */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                      <User size={14} className="text-accent" />
                      <label className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">Persona Target</label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[PersonaType.MALE, PersonaType.FEMALE].map((type) => (
                        <button
                          key={type}
                          onClick={() => setPersonaType(type)}
                          className={`flex items-center justify-center gap-4 py-6 rounded-[2rem] border transition-all ${
                            personaType === type 
                              ? 'bg-accent/10 border-accent text-white' 
                              : 'bg-white/[0.02] border-white/5 text-text-secondary hover:border-white/20'
                          }`}
                        >
                          <span className="text-xs font-black uppercase tracking-[0.3em]">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={startProcessing}
                  className="w-full py-6 bg-accent hover:bg-accent-hover text-white rounded-[2rem] font-black text-xs tracking-[0.4em] uppercase transition-all shadow-xl shadow-accent/20 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <Sparkles size={18} />
                  <span>Begin Digitization</span>
                </button>
              </motion.div>
            )}

            {step === 'PROCESSING' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center justify-center py-20 space-y-8"
              >
                {!error ? (
                  <>
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-2 border-white/5 flex items-center justify-center">
                        <Loader2 className="text-accent animate-spin" size={48} />
                      </div>
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-accent/20 blur-3xl rounded-full"
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-white font-bold tracking-tight text-xl">{processingStatus}</p>
                      <p className="text-text-secondary text-[10px] font-black tracking-[0.4em] uppercase opacity-40">Engine running background extraction</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                      <AlertCircle size={40} />
                    </div>
                    <div className="text-center space-y-4">
                      <h3 className="text-white font-bold text-xl uppercase tracking-tighter italic">Digitization Failed</h3>
                      <p className="text-red-400 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">{error}</p>
                    </div>
                    <div className="flex gap-4 w-full max-w-sm">
                      <button 
                        onClick={() => setStep('CONFIG')}
                        className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all"
                      >
                        Go Back
                      </button>
                      <button 
                        onClick={async () => {
                          if (!file) return;
                          setProcessingStatus('Uploading original image...');
                          try {
                            const url = await cloudinaryService.uploadImage(file);
                            setProcessedImageUrl(url);
                            setStep('FITTING');
                          } catch (err: unknown) {
                            setError(err instanceof Error ? err.message : 'Upload failed');
                          }
                        }}
                        className="flex-1 py-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all"
                      >
                        Skip AI
                      </button>
                      <button 
                        onClick={startProcessing}
                        className="flex-1 py-5 bg-accent text-white rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all"
                      >
                        Retry
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {step === 'FITTING' && (
              <motion.div 
                key="fitting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 h-full"
              >
                <FittingEditor 
                  imageUrl={processedImageUrl!}
                  category={category}
                  personaType={personaType}
                  onSave={handleSave}
                  onBack={() => setStep('CONFIG')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadFlow;
