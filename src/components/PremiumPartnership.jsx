import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function PremiumPartnership({ concept }) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, rx: 0, ry: 0, isHovered: false });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized coordinates (-0.5 to 0.5) for parallax rotation
    const rx = (x / rect.width) - 0.5;
    const ry = (y / rect.height) - 0.5;
    
    setMousePos({ x, y, rx, ry, isHovered: true });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, rx: 0, ry: 0, isHovered: false }));
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full relative transition-all duration-500 overflow-hidden rounded-3xl"
      style={{
        perspective: '1200px'
      }}
    >
      <AnimatePresence mode="wait">
        {concept === 'minimal' && (
          <ConceptSilk key="silk" mousePos={mousePos} />
        )}
        {concept === 'dashboard' && (
          <ConceptLens key="lens" mousePos={mousePos} />
        )}
        {concept === 'cyber' && (
          <ConceptEclipse key="eclipse" mousePos={mousePos} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================================
   CONCEPT A: THE VELVET SILK FLOW
   Features smooth, draping curtain-like waves in a deep burgundy-crimson palette.
   ============================================================================ */
function ConceptSilk({ mousePos }) {
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

    const draw = (time) => {
      // Obsidian base
      ctx.fillStyle = '#060606';
      ctx.fillRect(0, 0, width, height);

      // Render vertical drapery waves
      const waveSpacing = 30;
      for (let x = -20; x < width + waveSpacing; x += waveSpacing) {
        // Natural sine wave offset + mouse shift
        let wave = Math.sin(x * 0.003 + time * 0.0006) * 45;
        
        if (mousePos.isHovered) {
          const dx = mousePos.x - x;
          const dist = Math.abs(dx);
          if (dist < 250) {
            const force = (250 - dist) / 250;
            // Pull waves slightly toward cursor
            wave += dx * force * 0.18;
          }
        }

        // Draw organic gradient folds
        const grad = ctx.createLinearGradient(x + wave, 0, x + wave + waveSpacing, height);
        grad.addColorStop(0, 'rgba(139, 0, 26, 0.035)');
        grad.addColorStop(0.5, 'rgba(6, 6, 6, 0)');
        grad.addColorStop(1, 'rgba(139, 0, 26, 0.025)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x + wave, 0);
        ctx.lineTo(x + wave + waveSpacing, 0);
        ctx.lineTo(x + wave + waveSpacing * 0.8, height);
        ctx.lineTo(x + wave - waveSpacing * 0.2, height);
        ctx.closePath();
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  const rotateX = mousePos.rx * 6;
  const rotateY = -mousePos.ry * 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full bg-[#0c0c0c]/90 border border-white/5 p-8 md:p-12 overflow-hidden relative"
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotateY}deg) rotateY(${rotateX}deg)`,
        transition: 'transform 0.2s ease-out'
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
        <div className="flex flex-col max-w-lg" style={{ transform: 'translateZ(20px)' }}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-widest text-white/50 uppercase mb-5 self-start select-none">
            <span>Exclusive Partnership</span>
          </div>
          
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display mb-4 text-white uppercase leading-none">
            CLAIM FREE<br/>WAGER BONUSES
          </h3>
          
          <p className="text-sm text-white/55 leading-relaxed mb-8 font-normal max-w-md">
            Sign up with Stake or Stake US using code <span className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono font-semibold">Hunchos</span> to unlock exclusive bonuses and automatically track wagers.
          </p>
          
          <Link 
            to="/signup" 
            className="bg-white hover:bg-white/90 text-black font-semibold text-xs tracking-widest px-8 py-4 uppercase self-start transition-all duration-300 rounded-none shadow-lg"
          >
            SIGN UP NOW &rarr;
          </Link>
        </div>
        
        {/* Sleek Floating Glass Holder */}
        <div 
          className="flex flex-col items-center justify-center self-center md:self-auto relative group mt-6 md:mt-0"
          style={{ transform: 'translateZ(45px)' }}
        >
          <div className="w-36 h-36 bg-white/[0.01] backdrop-blur-[4px] border border-white/5 rounded-2xl flex flex-col items-center justify-center shadow-2xl transition-all duration-500 group-hover:border-white/10 relative">
            <img 
              src="/stake_clean.png" 
              alt="Stake logo" 
              className="h-10 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.12)] group-hover:scale-105 transition-all duration-500 select-none" 
            />
            <span className="text-[7px] font-mono tracking-[0.25em] text-white/20 uppercase mt-4 select-none group-hover:text-white/40 transition-colors">STAKE.COM</span>
          </div>
        </div>
      </div>
      
      <p className="text-[9px] text-white/30 tracking-wide mt-10 border-t border-white/5 pt-4 uppercase font-semibold">
        Use code Hunchos on Stake.com or Hunchos007 on Stake.US &bull; Must be 18+ &bull; Gambling involves risk
      </p>
    </motion.div>
  );
}

/* ============================================================================
   CONCEPT B: THE FROSTED GLASS LENS
   Features two-column layout with a frosted glass refraction lens.
   ============================================================================ */
function ConceptLens({ mousePos }) {
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

    const draw = (time) => {
      ctx.fillStyle = '#070709';
      ctx.fillRect(0, 0, width, height);

      // Smooth white reflection sheen sweeping horizontally
      const sheenPos = (time * 0.12) % (width + 300) - 150;
      const sheenGrad = ctx.createLinearGradient(sheenPos, 0, sheenPos + 140, height);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.012)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = sheenGrad;
      ctx.fillRect(0, 0, width, height);

      // Light ambient spotlight
      if (mousePos.isHovered) {
        const spot = ctx.createRadialGradient(
          mousePos.x, mousePos.y, 0,
          mousePos.x, mousePos.y, 240
        );
        spot.addColorStop(0, 'rgba(255, 255, 255, 0.015)');
        spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spot;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 240, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  const rotateX = mousePos.rx * 8;
  const rotateY = -mousePos.ry * 8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full bg-[#070709] border border-white/5 overflow-hidden relative"
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotateY}deg) rotateY(${rotateX}deg)`,
        transition: 'transform 0.2s ease-out'
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch relative z-10">
        {/* Left Side Content */}
        <div className="lg:col-span-8 p-8 md:p-12 flex flex-col justify-between" style={{ transform: 'translateZ(20px)' }}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-widest text-white/60 uppercase mb-5">
              <span>Verified Campaign</span>
            </div>
            
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display mb-4 text-white uppercase leading-none">
              CLAIM FREE<br/>WAGER BONUSES
            </h3>
            
            <p className="text-sm text-white/55 leading-relaxed mb-8 font-normal max-w-md">
              Sign up with Stake or Stake US using code <span className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono font-semibold">Hunchos</span> to unlock exclusive bonuses and automatically track wagers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
            <Link 
              to="/signup" 
              className="bg-white hover:bg-white/95 text-black font-semibold text-xs tracking-widest px-8 py-4 uppercase transition-all duration-300 rounded-none w-full sm:w-auto text-center"
            >
              SIGN UP NOW &rarr;
            </Link>
            
            {/* Elegant live connection pill */}
            <div className="border border-white/5 bg-white/[0.01] px-4 py-2 flex items-center gap-2.5 rounded-full select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase">CONNECTION SECURE</span>
            </div>
          </div>
        </div>

        {/* Right Side Lens Refraction */}
        <div 
          className="lg:col-span-4 p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden bg-white/[0.005] border-t lg:border-t-0 lg:border-l border-white/5"
          style={{ transform: 'translateZ(40px)' }}
        >
          {/* Frosted Lens Circle */}
          <div className="w-40 h-40 bg-white/[0.02] backdrop-blur-[16px] border border-white/10 rounded-full flex items-center justify-center p-8 relative shadow-2xl group transition-all duration-500 hover:border-white/25 hover:shadow-white/5">
            <img 
              src="/stake_clean.png" 
              alt="Stake" 
              className="w-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-all select-none relative z-10" 
            />
          </div>
          <span className="mt-4 font-mono text-[7px] text-white/20 tracking-[0.25em] uppercase select-none">AUTHENTIC PARTNER</span>
        </div>
      </div>

      <p className="text-[9px] text-white/20 tracking-wide px-8 md:px-12 py-4 border-t border-white/5 uppercase font-semibold bg-[#040405] relative z-10">
        Use code Hunchos on Stake.com or Hunchos007 on Stake.US &bull; Must be 18+ &bull; Gambling involves risk
      </p>
    </motion.div>
  );
}

/* ============================================================================
   CONCEPT C: THE AMBIENT ECLIPSE
   Features a centered layout with a dynamic soft-shadow radial aurora.
   ============================================================================ */
function ConceptEclipse({ mousePos }) {
  const canvasRef = useRef(null);
  
  // Custom inertia/spring simulation for smooth gradient lag
  const gradientPos = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Initial position in center
    gradientPos.current = { x: width / 2, y: height / 2 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = (time) => {
      ctx.fillStyle = '#050506';
      ctx.fillRect(0, 0, width, height);

      // Smooth inertia interpolation towards mouse (or center on idle)
      const targetX = mousePos.isHovered ? mousePos.x : width / 2;
      const targetY = mousePos.isHovered ? mousePos.y : height / 2;
      
      gradientPos.current.x += (targetX - gradientPos.current.x) * 0.08;
      gradientPos.current.y += (targetY - gradientPos.current.y) * 0.08;

      // Pulse gradient radius slowly
      const pulseRadius = 240 + Math.sin(time * 0.001) * 30;

      // Draw Apple-style ambient eclipse glow
      const grad = ctx.createRadialGradient(
        gradientPos.current.x, gradientPos.current.y, 0,
        gradientPos.current.x, gradientPos.current.y, pulseRadius
      );
      grad.addColorStop(0, 'rgba(189, 21, 38, 0.08)');
      grad.addColorStop(0.5, 'rgba(189, 21, 38, 0.02)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gradientPos.current.x, gradientPos.current.y, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  const rotateX = mousePos.rx * 5;
  const rotateY = -mousePos.ry * 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full bg-[#050506] border border-white/5 p-8 md:p-12 overflow-hidden relative text-center flex flex-col items-center justify-center min-h-[360px]"
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotateY}deg) rotateY(${rotateX}deg)`,
        transition: 'transform 0.2s ease-out'
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Floating Centered Layout Elements */}
      <div 
        className="flex flex-col items-center max-w-xl relative z-10"
        style={{ transform: 'translateZ(25px)' }}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-widest text-white/50 uppercase mb-6">
          <span>Official Stake Campaign</span>
        </div>
        
        {/* Floating white logo right in the center */}
        <div className="mb-6 relative group" style={{ transform: 'translateZ(40px)' }}>
          <img 
            src="/stake_clean.png" 
            alt="Stake Logo" 
            className="h-9 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-500 select-none" 
          />
        </div>

        <h3 className="text-3xl md:text-5xl font-black tracking-tight font-display mb-4 text-white uppercase leading-none">
          CLAIM FREE WAGER BONUSES
        </h3>
        
        <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-md font-normal">
          Register on Stake or Stake US using exclusive code <span className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono font-semibold">Hunchos</span> to track wagers.
        </p>

        <Link 
          to="/signup" 
          className="bg-white hover:bg-white/90 text-black font-semibold text-xs tracking-widest px-8 py-4 uppercase transition-all duration-300 rounded-none shadow-xl"
        >
          SIGN UP NOW &rarr;
        </Link>
      </div>

      <p className="text-[8px] text-white/25 tracking-wide mt-10 border-t border-white/5 pt-4 uppercase font-semibold w-full relative z-10">
        Must be 18+ &bull; Gambling involves risk &bull; Use code Hunchos on Stake.com or Hunchos007 on Stake.US
      </p>
    </motion.div>
  );
}
