import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Save, 
  Type, 
  AlignLeft, 
  Sparkles
} from 'lucide-react';
import { ClothingCategory, PersonaType, type ClothingTransform } from '../../types';
import Canvas from './Canvas';
import Controls from './Controls';
import { DEFAULT_TRANSFORMS } from './Presets';

interface FittingEditorProps {
  imageUrl: string;
  category: ClothingCategory;
  personaType: PersonaType;
  onSave: (data: { name: string; description: string; transform: ClothingTransform }) => void;
  onBack: () => void;
}

const FittingEditor: React.FC<FittingEditorProps> = ({ 
  imageUrl, 
  category, 
  personaType, 
  onSave, 
  onBack 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [transform, setTransform] = useState<ClothingTransform>(
    DEFAULT_TRANSFORMS[personaType][category]
  );

  const handleTransformChange = (newTransform: Partial<ClothingTransform>) => {
    setTransform(prev => ({ ...prev, ...newTransform }));
  };

  const handleReset = () => {
    setTransform(DEFAULT_TRANSFORMS[personaType][category]);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Left Sidebar: Controls */}
      <div className="w-full md:w-72 flex flex-col gap-6 order-2 md:order-1">
        <div>
          <h3 className="text-xs font-black tracking-[0.3em] text-white uppercase mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full" />
            Fitting Controls
          </h3>
          <Controls 
            transform={transform} 
            onTransformChange={handleTransformChange}
            onReset={handleReset}
          />
        </div>

        <div className="mt-auto hidden md:block">
          <p className="text-[10px] text-text-secondary leading-relaxed uppercase tracking-widest font-bold opacity-30">
            Precision alignment ensures high-fidelity visualization on your digital twin.
          </p>
        </div>
      </div>

      {/* Center: Canvas */}
      <div className="flex-1 flex flex-col gap-4 order-1 md:order-2">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">Fitting Studio</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <Sparkles size={12} className="text-accent" />
            <span className="text-[9px] font-black tracking-widest text-white uppercase">{category} — {personaType}</span>
          </div>
        </div>
        
        <Canvas 
          imageUrl={imageUrl}
          personaType={personaType}
          transform={transform}
          onTransformChange={setTransform}
        />
      </div>

      {/* Right Sidebar: Metadata */}
      <div className="w-full md:w-80 flex flex-col gap-8 order-3">
        <h3 className="text-xs font-black tracking-[0.3em] text-white uppercase flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full" />
          Garment Identity
        </h3>

        <div className="space-y-8">
          {/* Name Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Type size={14} className="text-accent" />
              <label className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">Identity Name</label>
            </div>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chrome Hearts Vintage Tee"
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <AlignLeft size={14} className="text-accent" />
              <label className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">Provenance & Details</label>
            </div>
            <textarea 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us more about the fit, material, or history of this piece..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all resize-none"
            />
          </div>
        </div>

        <div className="mt-auto pt-8">
          <button 
            onClick={() => onSave({ name, description, transform })}
            disabled={!name}
            className={`
              w-full py-6 rounded-2xl font-black text-xs tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-3
              ${!name
                ? 'bg-white/5 text-text-secondary cursor-not-allowed' 
                : 'bg-accent hover:bg-accent-hover text-white shadow-xl shadow-accent/20 active:scale-[0.98]'
              }
            `}
          >
            <Save size={18} />
            <span>ARCHIVE GARMENT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FittingEditor;
