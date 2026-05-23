import React, { useEffect } from 'react';
import AvatarSection from '../sections/AvatarSection';
import ClosetSection from '../sections/ClosetSection';
import OutfitsSection from '../sections/OutfitsSection';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const DashboardPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash scrolling on initial load or hash change
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20 bg-background-main scroll-smooth"
    >
      <div id="persona">
        <AvatarSection />
      </div>
      
      <div id="closet">
        <ClosetSection />
      </div>
      
      <div id="outfits">
        <OutfitsSection />
      </div>
    </motion.div>
  );
};

export default DashboardPage;
