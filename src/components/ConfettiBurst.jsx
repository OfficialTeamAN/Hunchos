import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfettiBurst({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const numParticles = 14;
      const newParticles = [];

      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const distance = 40 + Math.random() * 35;
        const speed = 0.5 + Math.random() * 0.3;
        
        newParticles.push({
          id: Math.random(),
          angle,
          distance,
          speed,
          color: Math.random() > 0.4 ? '#e63946' : '#ffffff', // Crimson red or white sparks
          size: 3 + Math.random() * 3
        });
      }

      setParticles(newParticles);

      // Clear particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
      <AnimatePresence>
        {particles.map((p) => {
          const tx = Math.cos(p.angle) * p.distance;
          const ty = Math.sin(p.angle) * p.distance;

          return (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ 
                x: tx, 
                y: ty, 
                scale: 0.2, 
                opacity: 0,
                rotate: p.angle * 180 / Math.PI
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.1, 0.8, 0.2, 1] }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
