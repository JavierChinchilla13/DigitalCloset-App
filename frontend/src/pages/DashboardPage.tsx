import React from 'react';
import AvatarSection from '../sections/AvatarSection';
import ClosetSection from '../sections/ClosetSection';
import OutfitsSection from '../sections/OutfitsSection';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20"
    >
      {/* Centered Avatar Section (Centerpiece) */}
      <AvatarSection />

      {/* Horizontal Scroll Closet Section */}
      <ClosetSection />

      {/* Grid Outfits Section */}
      <OutfitsSection />
    </motion.div>
  );
};

export default DashboardPage;
