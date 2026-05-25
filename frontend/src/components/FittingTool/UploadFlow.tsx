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

import ShoeSymmetryCheck from './ShoeSymmetryCheck';
import ShoeFittingEditor from './ShoeFittingEditor';
import JacketSegmentationTool from './JacketSegmentationTool';
import JacketFittingEditor from './JacketFittingEditor';

interface UploadFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'UPLOAD' | 'CONFIG' | 'PROCESSING' | 'FITTING' | 'SHOE_SYMMETRY' | 'SHOE_UPLOAD_RIGHT' | 'SHOE_FITTING' | 'JACKET_SEGMENTATION' | 'JACKET_FITTING';

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
  
  // Shoe Specific State
  const [rightFile, setRightFile] = useState<File | null>(null);
  const [isAsymmetrical, setIsAsymmetrical] = useState(false);
  const [leftProcessedUrl, setLeftProcessedUrl] = useState<string | null>(null);
  const [rightProcessedUrl, setRightProcessedUrl] = useState<string | null>(null);

  // Jacket Specific State
  const [jacketSegments, setJacketSegments] = useState<Record<string, string>>({});

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
    setRightFile(null);
    setIsAsymmetrical(false);
    setLeftProcessedUrl(null);
    setRightProcessedUrl(null);
    setJacketSegments({});
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

  const handleNextAfterConfig = () => {
    if (category === ClothingCategory.SHOES) {
      setStep('SHOE_SYMMETRY');
    } else {
      startProcessing();
    }
  };

  const startProcessing = async () => {
    if (!file) return;
    
    setStep('PROCESSING');
    setError(null);
    
    try {
      if (category === ClothingCategory.SHOES) {
         setProcessingStatus('Digitizing pair assets...');
         const leftBlob = await removeBackground(file);
         const leftUrl = await cloudinaryService.uploadImage(leftBlob);
         setLeftProcessedUrl(leftUrl);

         if (isAsymmetrical && rightFile) {
            setProcessingStatus('Perfecting right shoe...');
            const rightBlob = await removeBackground(rightFile);
            const rightUrl = await cloudinaryService.uploadImage(rightBlob);
            setRightProcessedUrl(rightUrl);
         } else {
            setRightProcessedUrl(leftUrl);
         }
         setStep('SHOE_FITTING');
      } else if (category === ClothingCategory.JACKET) {
         setProcessingStatus('Isolating outerwear structure...');
         const transparentBlob = await removeBackground(file);
         const blobFile = new File([transparentBlob], 'jacket.png', { type: 'image/png' });
         setFile(blobFile);
         setStep('JACKET_SEGMENTATION');
      } else {
         setProcessingStatus('Removing background...');
         const transparentBlob = await removeBackground(file);
         setProcessingStatus('Uploading to secure cloud...');
         const url = await cloudinaryService.uploadImage(transparentBlob);
         setProcessedImageUrl(url);
         setStep('FITTING');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Processing failed. Please try again.';
      setError(message);
    }
  };

  const startProcessingStandard = async () => {
    if (!file) return;
    setStep('PROCESSING');
    setProcessingStatus('Finalizing single-layer asset...');
    try {
      const url = await cloudinaryService.uploadImage(file);
      setProcessedImageUrl(url);
      setStep('FITTING');
    } catch (err: unknown) {
      setError('Failed to upload image.');
    }
  };

  const handleJacketSegmentationComplete = (segments: Record<string, string>) => {
    setJacketSegments(segments);
    if (Object.keys(segments).length > 0) {
      setStep('JACKET_FITTING');
    } else {
      startProcessingStandard();
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
      setError('Failed to save garment.');
    }
  };

  const handleShoeSave = async (data: { 
    name: string; 
    description: string; 
    leftTransform: ClothingTransform; 
    rightTransform: ClothingTransform;
    skipLeft: boolean;
    skipRight: boolean;
  }) => {
    try {
      if (!data.skipLeft && leftProcessedUrl) {
        await addItem({
          name: `${data.name} (Left)`,
          description: data.description,
          category: ClothingCategory.SHOES,
          personaType,
          imageUrl: leftProcessedUrl,
          side: 'left',
          transform: data.leftTransform
        });
      }
      if (!data.skipRight && rightProcessedUrl) {
        await addItem({
          name: `${data.name} (Right)`,
          description: data.description,
          category: ClothingCategory.SHOES,
          personaType,
          imageUrl: rightProcessedUrl,
          side: 'right',
          transform: data.rightTransform
        });
      }
      handleClose();
    } catch (err: unknown) {
      setError('Failed to save shoe pair.');
    }
  };

  const handleModularJacketSave = async (data: { 
    name: string; 
    description: string; 
    modularData: string;
    previewUrl: string;
  }) => {
    try {
      setStep('PROCESSING');
      setProcessingStatus('Finalizing modular asset...');
      
      // Upload the composite preview to Cloudinary
      // Convert DataURL to Blob
      const response = await fetch(data.previewUrl);
      const blob = await response.blob();
      const uploadedPreviewUrl = await cloudinaryService.uploadImage(blob);

      await addItem({
        name: data.name,
        description: data.description,
        category: ClothingCategory.JACKET,
        personaType,
        imageUrl: uploadedPreviewUrl,
        isModular: true,
        modularData: data.modularData,
        transform: { x: 375, y: 300, scaleX: 1, scaleY: 1, rotation: 0, width: 450, height: 450 }
      });
      handleClose();
    } catch (err: unknown) {
      setError('Failed to save modular jacket.');
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
          step === 'FITTING' || step === 'SHOE_FITTING' || step === 'JACKET_FITTING' ? 'w-full max-w-6xl h-[90vh]' : 'w-full max-w-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-full transition-colors text-text-secondary hover:text-white z-50"
        >
          <X size={20} />
        </button>

        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: '0%' }}
            animate={{ 
              width: step === 'UPLOAD' ? '10%' : 
                     step === 'CONFIG' ? '25%' : 
                     step === 'SHOE_SYMMETRY' ? '40%' :
                     step === 'JACKET_SEGMENTATION' ? '50%' :
                     step === 'PROCESSING' ? '75%' : '100%' 
            }}
          />
        </div>

        <div className="p-8 md:p-12 h-full flex flex-col overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {step === 'UPLOAD' && (
              <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-light tracking-tighter text-white uppercase italic">Step 1 — Initial Intake</h2>
                  <p className="text-text-secondary text-[10px] font-black tracking-widest uppercase opacity-40">Drop your garment to begin digitization</p>
                </div>
                <div onClick={() => document.getElementById('file-input')?.click()} className="aspect-video rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent/50 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center group">
                  <input id="file-input" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
                    <Upload className="text-accent" size={32} />
                  </div>
                  <p className="text-white font-bold tracking-tight text-lg">Select Image</p>
                </div>
              </motion.div>
            )}

            {step === 'CONFIG' && (
              <motion.div key="config" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-light tracking-tighter text-white uppercase italic">Step 2 — Architecture</h2>
                  <p className="text-text-secondary text-[10px] font-black tracking-widest uppercase opacity-40">Define garment category and persona target</p>
                </div>
                <div className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                      <Layers size={14} className="text-accent" />
                      <label className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">Garment Category</label>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {Object.values(ClothingCategory).filter(cat => cat !== ClothingCategory.ACCESSORY).map((cat) => {
                        const Icon = CATEGORY_ICONS[cat];
                        return (
                          <button key={cat} onClick={() => setCategory(cat)} className={`flex flex-col items-center gap-3 p-4 w-24 rounded-2xl border transition-all ${category === cat ? 'bg-accent/10 border-accent text-white' : 'bg-white/[0.02] border-white/5 text-text-secondary hover:border-white/20'}`}>
                            <Icon size={18} />
                            <span className="text-[8px] font-black uppercase tracking-widest">{cat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                      <User size={14} className="text-accent" />
                      <label className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">Persona Target</label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[PersonaType.MALE, PersonaType.FEMALE].map((type) => (
                        <button key={type} onClick={() => setPersonaType(type)} className={`flex items-center justify-center gap-4 py-6 rounded-[2rem] border transition-all ${personaType === type ? 'bg-accent/10 border-accent text-white' : 'bg-white/[0.02] border-white/5 text-text-secondary hover:border-white/20'}`}>
                          <span className="text-xs font-black uppercase tracking-[0.3em]">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={handleNextAfterConfig} className="w-full py-6 bg-accent hover:bg-accent-hover text-white rounded-[2rem] font-black text-xs tracking-[0.4em] uppercase transition-all shadow-xl shadow-accent/20 active:scale-[0.98] flex items-center justify-center gap-3">
                  <Sparkles size={18} />
                  <span>Next Step</span>
                </button>
              </motion.div>
            )}

            {step === 'JACKET_SEGMENTATION' && file && (
              <JacketSegmentationTool 
                originalFile={file}
                onBack={() => setStep('CONFIG')}
                onComplete={handleJacketSegmentationComplete}
              />
            )}

            {step === 'SHOE_SYMMETRY' && (
              <ShoeSymmetryCheck onSelect={(diff) => {
                 setIsAsymmetrical(diff);
                 if (diff) setStep('SHOE_UPLOAD_RIGHT');
                 else startProcessing();
              }} />
            )}

            {step === 'SHOE_UPLOAD_RIGHT' && (
              <motion.div key="upload-right" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-light tracking-tighter text-white uppercase italic">Step 3 — Second Asset</h2>
                  <p className="text-text-secondary text-[10px] font-black tracking-widest uppercase opacity-40">Upload the RIGHT shoe image</p>
                </div>
                <div onClick={() => document.getElementById('right-file-input')?.click()} className="aspect-video rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/50 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center group">
                  <input id="right-file-input" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && (setRightFile(e.target.files[0]), startProcessing())} />
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-500">
                    <Upload className="text-emerald-500" size={32} />
                  </div>
                  <p className="text-white font-bold tracking-tight text-lg">Select Right Shoe</p>
                </div>
              </motion.div>
            )}

            {step === 'PROCESSING' && (
              <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex flex-col items-center justify-center py-20 space-y-8">
                {!error ? (
                  <>
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-2 border-white/5 flex items-center justify-center">
                        <Loader2 className="text-accent animate-spin" size={48} />
                      </div>
                      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-white font-bold tracking-tight text-xl">{processingStatus}</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <AlertCircle size={40} className="text-red-500 mx-auto" />
                    <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{error}</p>
                    <button onClick={resetFlow} className="py-4 px-8 bg-white/5 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all">Reset</button>
                  </div>
                )}
              </motion.div>
            )}

            {step === 'FITTING' && (
              <motion.div key="fitting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 h-full">
                <FittingEditor imageUrl={processedImageUrl!} category={category} personaType={personaType} onSave={handleSave} onBack={() => setStep('CONFIG')} />
              </motion.div>
            )}

            {step === 'SHOE_FITTING' && (
              <motion.div key="shoe-fitting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 h-full">
                <ShoeFittingEditor leftImageUrl={leftProcessedUrl!} rightImageUrl={rightProcessedUrl!} personaType={personaType} onSave={handleShoeSave} onBack={() => setStep('SHOE_SYMMETRY')} />
              </motion.div>
            )}

            {step === 'JACKET_FITTING' && (
              <motion.div key="jacket-fitting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 h-full">
                <JacketFittingEditor 
                  segments={jacketSegments}
                  personaType={personaType}
                  onSave={handleModularJacketSave}
                  onBack={() => setStep('JACKET_SEGMENTATION')}
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
