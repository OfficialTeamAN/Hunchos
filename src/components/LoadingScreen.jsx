import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformance } from './PerformanceContext';

export default function LoadingScreen() {
  const { loading, setLoading, fps, performanceTier } = usePerformance();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('CALIBRATING RENDER ENGINE...');
  const [decipherText, setDecipherText] = useState('*******');
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  // 1. Text Deciphering Effect
  useEffect(() => {
    const target = "HUNCHOS";
    const chars = "X%$#@&*?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    // Calculate resolved letters based on progress percentage
    const resolvedCount = Math.floor((progress / 100) * target.length);
    let result = "";
    for (let i = 0; i < target.length; i++) {
      if (i < resolvedCount) {
        result += target[i];
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    setDecipherText(result);
  }, [progress]);

  // 2. Hardware Test Timer & Progress Simulation
  useEffect(() => {
    let start = performance.now();
    let duration = 1850; // Match stress test

    const updateProgress = () => {
      const now = performance.now();
      const elapsed = now - start;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setProgress(currentProgress);

      if (currentProgress < 20) {
        setStatusText('INITIALIZING RENDER ENVIRONMENT...');
      } else if (currentProgress < 45) {
        setStatusText('STRESS TESTING GPU & CANVAS LATENCY...');
      } else if (currentProgress < 70) {
        setStatusText('RUNNING CPU MATHEMATICAL BENCHMARK...');
      } else if (currentProgress < 90) {
        setStatusText('ANALYZING DYNAMIC HARDWARE CAPACITY...');
      } else {
        setStatusText('APPLYING AUTOMATIC GRAPHICS PROFILES...');
      }

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  // 3. Interactive Particle Orbit Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Particle Setup
    const NUM_PARTICLES = 160;
    const particles = [];

    const initParticle = (p) => {
      p.angle = Math.random() * Math.PI * 2;
      p.distance = 90 + Math.random() * 80;
      p.targetDistance = p.distance;
      p.orbitSpeed = 0.008 + Math.random() * 0.012;
      p.yScale = 0.2 + Math.random() * 0.3; // creates flat 3D ellipse orbits
      p.tilt = (Math.random() - 0.5) * 0.4; // orbit tilt
      p.size = 1.0 + Math.random() * 2.0;
      p.color = Math.random() > 0.4 ? '230, 57, 70' : '255, 255, 255'; // Red or White
      p.opacity = 0.1 + Math.random() * 0.7;
      p.vx = 0;
      p.vy = 0;
    };

    // Initialize particles
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const p = {};
      initParticle(p);
      particles.push(p);
    }

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse track
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Transition States: 'orbit' | 'implode' | 'explode' | 'complete'
    let state = 'orbit';
    let stateTimer = 0;

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Check transition trigger
      const progressPercent = progress; // read state
      if (progressPercent === 100 && state === 'orbit') {
        state = 'implode';
        stateTimer = 18; // 18 frames of implosion
      }

      if (state === 'implode') {
        stateTimer--;
        if (stateTimer <= 0) {
          state = 'explode';
          stateTimer = 40; // 40 frames of explosion
        }
      } else if (state === 'explode') {
        stateTimer--;
        if (stateTimer <= 0) {
          state = 'complete';
          setLoading(false); // Lock loading complete!
          return;
        }
      }

      // Draw and animate particles
      particles.forEach((p) => {
        if (state === 'orbit') {
          // Orbit calculations
          p.angle += p.orbitSpeed * (1.0 + progressPercent / 50.0); // Spin faster as loader finishes
          
          // Pulsate distance
          p.distance = p.targetDistance + Math.sin(p.angle * 2) * 5;

          // Project coordinates to 2D ellipse (flat 3D)
          let px = Math.cos(p.angle) * p.distance;
          let py = Math.sin(p.angle) * p.distance * p.yScale;

          // Apply orbit tilt angle
          const rotatedX = px * Math.cos(p.tilt) - py * Math.sin(p.tilt);
          const rotatedY = px * Math.sin(p.tilt) + py * Math.cos(p.tilt);

          p.x = cx + rotatedX;
          p.y = cy + rotatedY;

          // Interactive: Mouse attraction ripple
          if (mouseRef.current.active) {
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const dist = Math.hypot(p.x - mx, p.y - my);
            if (dist < 120) {
              const force = (120 - dist) * 0.05;
              p.x += ((p.x - mx) / dist) * force;
              p.y += ((p.y - my) / dist) * force;
            }
          }
        } else if (state === 'implode') {
          // Spiraling implode down to center (cx, cy)
          p.angle += p.orbitSpeed * 4.0;
          p.distance *= 0.76; // rapidly shrink distance
          
          let px = Math.cos(p.angle) * p.distance;
          let py = Math.sin(p.angle) * p.distance * p.yScale;

          p.x = cx + (px * Math.cos(p.tilt) - py * Math.sin(p.tilt));
          p.y = cy + (px * Math.sin(p.tilt) + py * Math.cos(p.tilt));
        } else if (state === 'explode') {
          // Explode outwards radially
          if (p.vx === 0 && p.vy === 0) {
            // Set explosion velocity vectors
            const angle = Math.random() * Math.PI * 2;
            const speed = 6 + Math.random() * 10;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
          }
          p.x += p.vx;
          p.y += p.vy;
          p.opacity *= 0.94; // fade out
          p.size *= 0.96; // shrink
        }

        // Draw particle
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = `rgba(${p.color}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [progress]);

  // Neon flicker animation properties for "007" badge
  const flickerBadge = {
    initial: { opacity: 0 },
    animate: { 
      opacity: [1, 0.4, 0.9, 0.2, 1, 0.7, 1],
      transition: { 
        duration: 0.6,
        repeat: progress < 100 ? Infinity : 0, 
        repeatType: 'reverse' 
      } 
    }
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          ref={containerRef}
          key="loader-screen"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-[9999] bg-[#060607] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Swirling particle background canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

          {/* Foreground UI */}
          <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
            
            {/* Decrypting Title Header */}
            <motion.h1 
              className="text-4xl md:text-5xl font-black tracking-tighter mb-4 font-display flex items-center gap-2 justify-center"
            >
              <span className="font-mono text-white tracking-widest">{decipherText}</span>
              <motion.span 
                variants={flickerBadge}
                initial="initial"
                animate="animate"
                className="bg-accent text-white px-2 py-0.5 text-lg font-extrabold skew-x-[-10deg] inline-block border-none shadow-[2px_2px_0px_0px_#8b001a]"
              >
                007
              </motion.span>
            </motion.h1>

            {/* Sub-label */}
            <p className="text-[9px] font-black tracking-[0.3em] text-accent uppercase mb-16">
              System Optimization Engine
            </p>

            {/* Circular Progress Gauge */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-12 bg-white/[0.01] rounded-full border border-white/5 backdrop-blur-md">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(255, 255, 255, 0.02)"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e63946"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 56}
                  animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - progress / 100) }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                />
              </svg>
              {/* Display Percentage */}
              <div className="flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-black text-white tracking-tighter">{progress}%</span>
                <span className="text-[7px] font-black tracking-[0.2em] text-white/30 uppercase mt-1">PROFILING</span>
              </div>
            </div>

            {/* Dynamic Status message log */}
            <div className="h-6 mb-2">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={statusText}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-[8px] font-black tracking-[0.2em] text-white/55 uppercase font-mono"
                >
                  {statusText}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Result lock panel */}
            <div className="h-12 mt-4">
              {progress === 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="bg-white/[0.02] border border-white/10 px-4 py-2.5 rounded-lg flex items-center gap-3 justify-center shadow-2xl backdrop-blur-xl"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-[pulse_1.5s_infinite]" />
                  <span className="font-mono text-[9px] font-bold tracking-[0.12em] text-white/90 uppercase">
                    {performanceTier} Tier locked &bull; {fps} FPS target set
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
