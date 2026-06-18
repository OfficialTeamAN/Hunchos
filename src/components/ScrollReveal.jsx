import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  stagger = false,
  className = ''
}) {
  const getDirections = () => {
    switch (direction) {
      case 'up':
        return { y: 30, x: 0 };
      case 'down':
        return { y: -30, x: 0 };
      case 'left':
        return { y: 0, x: 30 };
      case 'right':
        return { y: 0, x: -30 };
      default:
        return { y: 30, x: 0 };
    }
  };

  const initial = {
    opacity: 0,
    ...getDirections(),
  };

  const animate = {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      staggerChildren: stagger ? 0.05 : 0,
    },
  };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-10%' }}
    >
      {children}
    </motion.div>
  );
}
