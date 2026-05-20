import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const SectionWrapper = ({ children, className, delay = 0 }: SectionWrapperProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 1.2, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={cn("w-full py-20 px-6 max-w-7xl mx-auto", className)}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;
