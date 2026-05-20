import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background-main flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      <footer className="py-12 border-t border-white/5 text-center text-text-secondary text-sm">
        <p>© 2026 DIGITAL CLOSET. DESIGNED FOR THE FUTURE OF FASHION.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
