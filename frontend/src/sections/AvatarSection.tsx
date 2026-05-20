import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, UserCog } from 'lucide-react';
import { Link } from 'react-router-dom';

const AvatarSection = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const avatars = {
    male: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&style=transparent&backgroundColor=b6e3f4",
    female: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&style=transparent&backgroundColor=ffdfbf"
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden py-20">
      {/* Background Spotlight Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/30 rounded-full blur-[80px] pointer-events-none" />

      {/* Gender Toggle */}
      <div className="absolute top-10 right-10 glass-panel p-1 rounded-full flex gap-1 z-20">
        <button
          onClick={() => setGender('male')}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
            gender === 'male' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          MALE
        </button>
        <button
          onClick={() => setGender('female')}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
            gender === 'female' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          FEMALE
        </button>
      </div>

      {/* Persona Display */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-64 h-[400px] md:w-80 md:h-[500px] flex items-center justify-center"
        >
          {/* Floor Shadow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-10 bg-black/40 blur-2xl rounded-full scale-x-150 opacity-60" />

          {/* Avatar Image Placeholder */}
          <AnimatePresence mode="wait">
            <motion.div
              key={gender}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex items-center justify-center"
            >
              <img 
                src={avatars[gender]} 
                alt="Persona Preview" 
                className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(91,140,255,0.5)]"
                onError={(e) => {
                  console.error("Avatar failed to load");
                  e.currentTarget.src = "https://api.dicebear.com/7.x/initials/svg?seed=" + gender;
                }}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Persona Info & Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-12 text-center"
        >
          <h2 className="text-4xl font-light tracking-widest text-white mb-2 uppercase">Your Persona</h2>
          <p className="text-text-secondary text-sm tracking-widest uppercase mb-8 opacity-60">Ready for the digital runway</p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              to="/outfits/new" 
              className="group relative px-8 py-4 bg-white text-background-main font-bold rounded-full overflow-hidden flex items-center gap-2 transition-all hover:pr-10"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
              <span>NEW OUTFIT</span>
              <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
            </Link>

            <Link 
              to="/persona" 
              className="px-8 py-4 border border-white/10 hover:border-white/30 text-white font-bold rounded-full flex items-center gap-2 transition-all bg-white/5 hover:bg-white/10"
            >
              <UserCog size={18} />
              <span>EDIT PERSONA</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background-main to-transparent pointer-events-none" />
    </section>
  );
};

export default AvatarSection;
