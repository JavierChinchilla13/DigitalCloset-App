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
    }
  }, [location.hash]); // Only run when hash changes explicitly

  useEffect(() => {
    const sections = ['persona', 'closet', 'outfits'];
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Center-ish trigger
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          // Update hash without triggering a full route change or jump
          window.history.replaceState(null, '', `/#${id}`);
          // Manually dispatch a popstate event so components using useLocation/location.hash update
          window.dispatchEvent(new Event('popstate'));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
