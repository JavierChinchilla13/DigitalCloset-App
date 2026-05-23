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
      className="pb-20 bg-background-main"
    >
      <AvatarSection />
      <ClosetSection />
      <OutfitsSection />
    </motion.div>
  );
};

export default DashboardPage;
