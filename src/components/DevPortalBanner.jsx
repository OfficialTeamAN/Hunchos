import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ConfettiBurst from './ConfettiBurst';

/* ============================================================================
   LUXURY NEURAL CONSTELLATION CANVAS
   Renders a slow, organic mesh constellation. Connections form dynamically
   between nodes within proximity. Nodes are pushed elastically by the cursor
   and return to their paths, simulating a high-end neural fabric.
   ============================================================================ */
function ConstellationCanvas({ isHovered, mousePos }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize 45 nodes
    const nodeCount = 45;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 0.8 + 0.6
      });
    }

    const draw = () => {
      // Pure clean dark background
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, width, height);

      // 1. Update node coordinates & handle elastic repulsion
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce gently off canvas bounds
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Elastic repulsion from cursor position
        if (isHovered && mousePos) {
          const dx = node.x - mousePos.x;
          const dy = node.y - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            // Smooth elastic push vector
            const force = (150 - dist) * 0.05;
            node.x += (dx / dist) * force * 0.12;
            node.y += (dy / dist) * force * 0.12;
          }
        }

        // Draw small dot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw micro-thin connection lines between proximate nodes
      ctx.lineWidth = 0.45;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect if within 85px radius
          if (dist < 85) {
            const alpha = (85 - dist) / 85 * 0.12;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, mousePos]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none rounded-[23px] z-0" />;
}

export default function DevPortalBanner() {
  const cardRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, rx: 0, ry: 0, isHovered: false });
  const [sparkTrigger, setSparkTrigger] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Luxury 3D tilt coordinates
    const rx = (x / rect.width) - 0.5;
    const ry = (y / rect.height) - 0.5;
    
    setMouse({ x, y, rx, ry, isHovered: true });
  };

  const handleMouseLeave = () => {
    setMouse((prev) => ({ ...prev, rx: 0, ry: 0, isHovered: false }));
  };

  const handleClick = (e) => {
    e.preventDefault();
    setSparkTrigger(true);
    setTimeout(() => {
      setSparkTrigger(false);
      window.open('https://discord.gg/J7fQyJnEZQ', '_blank', 'noopener,noreferrer');
    }, 450);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mt-16 pb-12 select-none relative overflow-visible">
      {/* INJECT SYSTEM STYLES FOR THE GLIDE METALLIC TEXT SHEEN */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sheenSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .chrome-text-sheen {
          background: linear-gradient(90deg, #6b7280 0%, #f3f4f6 25%, #ffffff 50%, #f3f4f6 75%, #6b7280 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: sheenSweep 6.5s linear infinite;
        }
      `}} />

      <div 
        style={{ perspective: '1200px' }}
        className="w-full relative overflow-visible"
      >
        {/* CARD CONTAINER WITH LASER BORDER SWEEP */}
        <div className="relative w-full rounded-3xl p-[1px] overflow-hidden group/wrapper shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
          
          {/* Rotating Laser Light Beam */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: mouse.isHovered ? 4.5 : 8,
              ease: 'linear'
            }}
            className="absolute w-[200%] h-[200%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
            style={{
              background: `conic-gradient(from 0deg, transparent 40%, rgba(129, 140, 248, 0.4) 48%, rgba(244, 63, 94, 0.4) 52%, transparent 60%)`,
              originX: 0.5,
              originY: 0.5
            }}
          />

          {/* INNER CARD BASE */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{
              transform: `rotateX(${-mouse.ry * 5}deg) rotateY(${mouse.rx * 5}deg) translateZ(0px)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.22s cubic-bezier(0.25, 0.8, 0.25, 1)'
            }}
            className="w-full h-32 sm:h-36 bg-[#040404]/92 rounded-[23px] flex items-center justify-between px-8 sm:px-16 relative overflow-hidden cursor-pointer z-10"
          >
            {/* Confetti spark trigger */}
            <ConfettiBurst active={sparkTrigger} />

            {/* Luxury Constellation Mesh Canvas */}
            <ConstellationCanvas isHovered={mouse.isHovered} mousePos={mouse} />

            {/* Decorative Glow Layer */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-10"
              style={{
                background: `radial-gradient(circle 260px at ${mouse.x}px ${mouse.y}px, rgba(99, 102, 241, 0.05) 0%, transparent 80%)`,
                opacity: mouse.isHovered ? 1 : 0
              }}
            />

            {/* ================================================================
                LEFT SECTION: TYPOGRAPHY
                ================================================================ */}
            <div 
              style={{ transform: 'translateZ(25px)' }}
              className="flex items-center gap-3 z-20 text-left"
            >
              <div className="flex items-center gap-2 sm:gap-3.5 font-display text-2xl sm:text-3xl font-black tracking-wide uppercase">
                {/* Made with text */}
                <span className="chrome-text-sheen">Made with</span>
                
                {/* Beating Heart Icon */}
                <motion.span
                  animate={{ scale: [1, 1.25, 1.1, 1.3, 1] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: [0.25, 1, 0.5, 1],
                    repeatDelay: 0.8
                  }}
                  className="inline-block px-1 select-none filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                >
                  💗
                </motion.span>
                
                {/* by Nobita text */}
                <span className="chrome-text-sheen">by Nobita</span>
              </div>
            </div>

            {/* ================================================================
                RIGHT SECTION: ESCAPEMENT PORTAL SATELLITE GATE
                ================================================================ */}
            <div 
              style={{ transform: 'translateZ(30px)' }}
              className="flex items-center gap-4 z-20 shrink-0"
            >
              {/* Minimalist satellite ring gate */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="w-14 h-14 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.04] flex items-center justify-center relative transition-all duration-500 shadow-xl group/vortex"
              >
                {/* Outer breathing ring */}
                <div className="absolute inset-0 rounded-full border border-white/5 animate-pulse" />

                {/* Orbiting Satellite Dot (Spins Clockwise, speeds up on card hover) */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: mouse.isHovered ? 1.5 : 5.5,
                    ease: 'linear'
                  }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full absolute -top-0.5 left-1/2 -translate-x-1/2 bg-white" 
                    style={{ boxShadow: '0 0 8px #fff' }}
                  />
                </motion.div>

                {/* Inner simple breathing core dot (No arrow) */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover/vortex:bg-white/80 transition-colors duration-300 shadow-glow"
                  style={{ boxShadow: '0 0 6px rgba(255, 255, 255, 0.3)' }}
                />
              </motion.div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
