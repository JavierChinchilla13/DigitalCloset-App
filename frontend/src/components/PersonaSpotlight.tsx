import React from 'react';
import { motion } from 'framer-motion';

const PersonaSpotlight = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Soft Top Ambient Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-white/[0.03] to-transparent opacity-50" />

      {/* Main Studio Spotlight Glow */}
      <motion.div 
        animate={{ 
          opacity: [0.4, 0.5, 0.4],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/[0.02] rounded-full blur-[160px]" 
      />

      {/* Floor Highlight (Studio Floor Effect) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-white/[0.03] rounded-[100%] blur-[80px]" />

      {/* Minimal Texture / Depth */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] mix-blend-overlay" />
    </div>
  );
};

export default PersonaSpotlight;
