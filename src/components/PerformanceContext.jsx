import React, { createContext, useContext, useState, useEffect } from 'react';

const PerformanceContext = createContext(null);

export function usePerformance() {
  return useContext(PerformanceContext);
}

export function PerformanceProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [fps, setFps] = useState(60);
  const [cpuScore, setCpuScore] = useState(0);
  const [performanceTier, setPerformanceTier] = useState('high');
  const [settings, setSettings] = useState({
    particleCount: 32,
    gridCols: 60,
    gridRows: 40,
    enableTilt: true,
    enableLenis: true,
    decaySpeed: 0.015
  });

  useEffect(() => {
    let active = true;
    let frames = 0;
    let startTime = performance.now();
    let cpuOperations = 0;

    // 1. Run CPU math benchmark
    const mathStart = performance.now();
    // Calculate square roots in a tight loop for 80ms to score CPU speed
    while (performance.now() - mathStart < 80) {
      Math.sqrt(Math.random() * 100000);
      cpuOperations++;
    }

    // 2. Measure actual rendering FPS over 1.8 seconds
    const checkFps = () => {
      if (!active) return;
      frames++;
      const now = performance.now();
      const elapsed = now - startTime;

      if (elapsed < 1850) {
        requestAnimationFrame(checkFps);
      } else {
        const measuredFps = Math.round((frames * 1000) / elapsed);
        setFps(measuredFps);
        setCpuScore(cpuOperations);

        // Classify device tier
        // High Tier: stable FPS (>=55) and decent CPU compute speed
        // Medium Tier: moderate FPS (45-54) or moderate CPU
        // Low Tier: poor FPS (<45) or very weak device CPU
        let tier = 'high';
        if (measuredFps < 45 || cpuOperations < 50000) {
          tier = 'low';
        } else if (measuredFps < 55 || cpuOperations < 120000) {
          tier = 'medium';
        }

        setPerformanceTier(tier);

        // Apply optimized settings for fluid liquid metaballs
        if (tier === 'low') {
          setSettings({
            particleCount: 12,
            gridCols: 30,
            gridRows: 20,
            enableTilt: false,
            enableLenis: true,
            decaySpeed: 0.030
          });
        } else if (tier === 'medium') {
          setSettings({
            particleCount: 20,
            gridCols: 45,
            gridRows: 30,
            enableTilt: true,
            enableLenis: true,
            decaySpeed: 0.020
          });
        } else {
          setSettings({
            particleCount: 32,
            gridCols: 60,
            gridRows: 40,
            enableTilt: true,
            enableLenis: true,
            decaySpeed: 0.015
          });
        }

        // Settings are locked! The loading screen will handle triggering its explosion and dismissing itself.
      }
    };

    requestAnimationFrame(checkFps);

    return () => {
      active = false;
    };
  }, []);

  return (
    <PerformanceContext.Provider value={{ loading, setLoading, fps, cpuScore, performanceTier, settings }}>
      {children}
    </PerformanceContext.Provider>
  );
}
