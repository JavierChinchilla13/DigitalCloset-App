import React from "react";
import { motion } from "framer-motion";
import { Plus, UserCog, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { usePersonaStore } from "../store/usePersonaStore";
import PersonaRenderer from "../components/PersonaRenderer";
import PersonaSelector from "../components/PersonaSelector";
import PersonaSpotlight from "../components/PersonaSpotlight";

const AvatarSection = () => {
  const { persona, setPersonaType } = usePersonaStore();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-32 bg-background-main">
      {/* Cinematic Background Effects */}
      <PersonaSpotlight />

      {/* Header Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-24 z-20 text-center pointer-events-none"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={14} className="text-accent" />
          <span className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">
            Persona Core
          </span>
        </div>
        {/* <h2 className="text-5xl font-light tracking-[0.2em] text-white uppercase">Your Digital Self</h2> */}
      </motion.div>

      {/* Main Persona Display Area */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        <PersonaRenderer persona={persona} />

        {/* Action Controls & Selector */}
        <div className="mt-12 flex flex-col items-center gap-10 w-full px-6">
          {/* Persona Selector (Premium Segmented Control) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <PersonaSelector
              currentType={persona.type}
              onTypeChange={setPersonaType}
            />
          </motion.div>

          {/* Core Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              to="/outfits/new"
              className="group relative px-10 py-5 bg-white text-background-main font-black rounded-full overflow-hidden flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
            >
              <Plus
                size={20}
                className="group-hover:rotate-90 transition-transform duration-500"
              />
              <span className="text-[11px] tracking-[0.2em] uppercase">
                Initialize Outfit
              </span>
              <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" />
            </Link>

            <Link
              to="/persona"
              className="px-10 py-5 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 text-white font-black rounded-full flex items-center gap-3 transition-all backdrop-blur-md shadow-xl"
            >
              <UserCog size={18} className="text-text-secondary" />
              <span className="text-[11px] tracking-[0.2em] uppercase">
                Configure Persona
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Environmental Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background-main via-background-main/80 to-transparent pointer-events-none z-20" />

      {/* Side HUD-like text (Cinematic detail) */}
      <div className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 -rotate-90">
        <p className="text-[8px] font-black tracking-[0.5em] text-white/20 uppercase">
          Digital Closet System v2.0 // Node: Persona_Main
        </p>
      </div>
      <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 rotate-90">
        <p className="text-[8px] font-black tracking-[0.5em] text-white/20 uppercase">
          Biometric Data: {persona.type} // Sync: Stable
        </p>
      </div>
    </section>
  );
};

export default AvatarSection;
