import React, { createContext, useContext, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePerformance } from './PerformanceContext';

const TiltContext = createContext(null);

export function useTilt() {
  return useContext(TiltContext);
}

export default function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const perf = usePerformance();
  const enableTilt = perf ? perf.settings.enableTilt : true;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    damping: 25,
    stiffness: 150,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    damping: 25,
    stiffness: 150,
  });

  const handleMouseMove = (e) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Normalize coordinates from -0.5 to 0.5
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    if (!enableTilt) return;
    x.set(0);
    y.set(0);
  };

  return (
    <TiltContext.Provider value={{ x, y, enableTilt }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: enableTilt ? rotateX : 0,
          rotateY: enableTilt ? rotateY : 0,
          transformStyle: enableTilt ? 'preserve-3d' : 'flat',
        }}
        className={`relative ${className}`}
      >
        {children}
      </motion.div>
    </TiltContext.Provider>
  );
}

// Helper component to add depth layers inside TiltCard
export function TiltParallax({ children, depth = 1.0, className = '' }) {
  const tilt = useTilt();
  
  const defaultVal = useMotionValue(0);
  const x = tilt ? tilt.x : defaultVal;
  const y = tilt ? tilt.y : defaultVal;
  const active = tilt ? tilt.enableTilt : false;

  // Map mouse movement to translation offsets (depth multiplier)
  // Negative offset shifts the child in the opposite direction, enhancing 3D depth
  const tx = useTransform(x, [-0.5, 0.5], [-15 * depth, 15 * depth]);
  const ty = useTransform(y, [-0.5, 0.5], [-15 * depth, 15 * depth]);

  const px = useSpring(tx, { damping: 25, stiffness: 150 });
  const py = useSpring(ty, { damping: 25, stiffness: 150 });

  return (
    <motion.div
      style={{
        x: active ? px : 0,
        y: active ? py : 0,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
