import React from 'react';
import { RotateCcw, Maximize, RotateCw, RefreshCcw } from 'lucide-react';
import { type ClothingTransform } from '../../types';

interface ControlsProps {
  transform: ClothingTransform;
  onTransformChange: (transform: Partial<ClothingTransform>) => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({ transform, onTransformChange, onReset }) => {
  return (
    <div className="space-y-8 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
      {/* Scale Control */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <Maximize size={14} className="text-accent" />
            <label className="text-[10px] font-black tracking-[0.2em] text-accent uppercase">Scale Factor</label>
          </div>
          <span className="text-[10px] font-mono text-white opacity-50">{transform.scale.toFixed(2)}x</span>
        </div>
        <input 
          type="range"
          min="0.1"
          max="3"
          step="0.01"
          value={transform.scale}
          onChange={(e) => onTransformChange({ scale: parseFloat(e.target.value) })}
          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
        />
      </div>

      {/* Rotation Control */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <RotateCw size={14} className="text-accent" />
            <label className="text-[10px] font-black tracking-[0.2em] text-accent uppercase">Rotation</label>
          </div>
          <span className="text-[10px] font-mono text-white opacity-50">{transform.rotation.toFixed(0)}°</span>
        </div>
        <input 
          type="range"
          min="-180"
          max="180"
          step="1"
          value={transform.rotation}
          onChange={(e) => onTransformChange({ rotation: parseFloat(e.target.value) })}
          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
        >
          <RotateCcw size={14} className="text-text-secondary group-hover:text-white transition-colors" />
          <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary group-hover:text-white transition-colors">Reset Fit</span>
        </button>
        <button 
          onClick={() => onTransformChange({ rotation: 0 })}
          className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
        >
          <RefreshCcw size={14} className="text-text-secondary group-hover:text-white transition-colors" />
          <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary group-hover:text-white transition-colors">Zero Rotate</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;
