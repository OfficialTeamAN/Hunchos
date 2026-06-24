import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Copy, Check, ExternalLink, Gift, Coins, Flame, Ticket } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard, { useTilt, TiltParallax } from '../components/TiltCard';
import ConfettiBurst from '../components/ConfettiBurst';

/* ============================================================================
   MAGNETIC AURORA BACKGROUND CANVAS
   Drifts slow color halos that warp slightly toward the mouse.
   ============================================================================ */
function AuroraCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };

    const handleMouseMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const blobs = [
      { x: width * 0.25, y: height * 0.3, r: 350, tx: width * 0.25, ty: height * 0.3, vx: 0.15, vy: 0.1, color: 'rgba(230, 57, 70, 0.04)' },
      { x: width * 0.75, y: height * 0.4, r: 300, tx: width * 0.75, ty: height * 0.4, vx: -0.1, vy: 0.2, color: 'rgba(16, 185, 129, 0.03)' },
      { x: width * 0.5, y: height * 0.7, r: 400, tx: width * 0.5, ty: height * 0.7, vx: 0.08, vy: -0.15, color: 'rgba(99, 102, 241, 0.025)' },
      { x: width * 0.3, y: height * 0.8, r: 250, tx: width * 0.3, ty: height * 0.8, vx: -0.15, vy: -0.08, color: 'rgba(234, 179, 8, 0.015)' }
    ];

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse coordinates
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      blobs.forEach((b) => {
        b.tx += b.vx;
        b.ty += b.vy;
        if (b.tx < 0 || b.tx > width) b.vx *= -1;
        if (b.ty < 0 || b.ty > height) b.vy *= -1;

        b.x += (b.tx - b.x) * 0.02;
        b.y += (b.ty - b.y) * 0.02;

        const dx = mouse.x - b.x;
        const dy = mouse.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const pullForce = Math.min(200 / dist, 1.5);
        const drawX = b.x + dx * pullForce * 0.1;
        const drawY = b.y + dy * pullForce * 0.1;

        const r = b.r + Math.sin(time * 0.0008) * 25;

        const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(drawX, drawY, r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

/* ============================================================================
   CYBERNETIC GLOBE WATERMARK COMPONENT
   Renders a futuristic glowing vector Globe for Stake.com.
   ============================================================================ */
function GlobeWatermark() {
  return (
    <svg 
      width="145" 
      height="145" 
      viewBox="0 0 110 110" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="filter brightness-[0.8] group-hover:brightness-125 drop-shadow-[0_0_12px_rgba(0,180,216,0.3)] group-hover:drop-shadow-[0_0_28px_rgba(0,180,216,0.85)] group-hover:scale-[1.06] transition-all duration-500 ease-out"
    >
      <defs>
        <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2fe" />
          <stop offset="100%" stopColor="#4facfe" />
        </linearGradient>
      </defs>
      {/* Outer Ring */}
      <circle cx="55" cy="55" r="52" stroke="url(#globeGrad)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="55" cy="55" r="44" stroke="url(#globeGrad)" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />
      
      {/* Latitudes */}
      <line x1="4" y1="55" x2="106" y2="55" stroke="url(#globeGrad)" strokeWidth="1" opacity="0.35" />
      <path d="M12 35C30 43 80 43 98 35" stroke="url(#globeGrad)" strokeWidth="1" opacity="0.25" />
      <path d="M12 75C30 67 80 67 98 75" stroke="url(#globeGrad)" strokeWidth="1" opacity="0.25" />
      <path d="M22 20C40 26 70 26 88 20" stroke="url(#globeGrad)" strokeWidth="0.75" opacity="0.2" />
      <path d="M22 90C40 84 70 84 88 90" stroke="url(#globeGrad)" strokeWidth="0.75" opacity="0.2" />
      
      {/* Longitudes */}
      <ellipse cx="55" cy="55" rx="32" ry="52" stroke="url(#globeGrad)" strokeWidth="1" opacity="0.3" />
      <ellipse cx="55" cy="55" rx="16" ry="52" stroke="url(#globeGrad)" strokeWidth="1" opacity="0.25" />
      <line x1="55" y1="4" x2="55" y2="106" stroke="url(#globeGrad)" strokeWidth="1.2" opacity="0.4" />

      {/* Nodes / Stars */}
      <circle cx="55" cy="19" r="1.5" fill="#ffffff" opacity="0.85" />
      <circle cx="55" cy="91" r="1.5" fill="#ffffff" opacity="0.85" />
      <circle cx="23" cy="55" r="1.5" fill="#ffffff" opacity="0.85" />
      <circle cx="87" cy="55" r="1.5" fill="#ffffff" opacity="0.85" />
      <circle cx="39" cy="35" r="1.2" fill="#ffffff" opacity="0.75" />
      <circle cx="71" cy="75" r="1.2" fill="#ffffff" opacity="0.75" />
    </svg>
  );
}

/* ============================================================================
   MINIMALIST USA FLAG COMPONENT
   Renders a clean monochrome/translucent vector US Flag.
   ============================================================================ */
function USAFlag() {
  return (
    <svg 
      width="165" 
      height="87" 
      viewBox="0 0 74 39" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="filter grayscale-[55%] brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-110 drop-shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:drop-shadow-[0_0_28px_rgba(59,130,246,0.8)] group-hover:scale-[1.06] transition-all duration-500 ease-out"
    >
      {/* 13 Stripes: Red and White */}
      {Array.from({ length: 13 }).map((_, i) => {
        const isRed = i % 2 === 0;
        return (
          <rect
            key={i}
            x="0"
            y={i * 3}
            width="74"
            height="1.5"
            fill={isRed ? "#B22234" : "#ffffff"}
            opacity={isRed ? 0.75 : 0.5}
          />
        );
      })}
      {/* Canton (Blue field) */}
      <rect x="0" y="0" width="32" height="21" fill="#3C3B6E" opacity="0.85" rx="0.5" />
      {/* Stars Grid */}
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => (
          <circle
            key={`${r}-${c}`}
            cx={3.2 + c * 5.1}
            cy={2.5 + r * 4}
            r="0.8"
            fill="#ffffff"
            opacity={0.95}
          />
        ))
      )}
    </svg>
  );
}

/* ============================================================================
   REAL-TIME GRADIENT GLARE OVERLAY
   Uses the active TiltContext to sweep a colored spotlight on mouse move.
   ============================================================================ */
function FoilGlare({ color }) {
  const tilt = useTilt();
  const defaultVal = useMotionValue(0);
  const x = tilt ? tilt.x : defaultVal;
  const y = tilt ? tilt.y : defaultVal;
  const active = tilt ? tilt.enableTilt : false;

  const gx = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), { damping: 25, stiffness: 180 });
  const gy = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), { damping: 25, stiffness: 180 });
  const opacity = useSpring(useTransform(x, (val) => val === 0 ? 0 : 0.45), { damping: 20, stiffness: 150 });

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
      style={{
        opacity: active ? opacity : 0,
        background: useTransform([gx, gy], ([xVal, yVal]) => 
          `radial-gradient(circle 160px at ${xVal}% ${yVal}%, ${color}, transparent)`
        )
      }}
    />
  );
}

export default function Signup() {
  const [copiedCode, setCopiedCode] = useState(null); // null | 'com' | 'us'

  const handleCopy = (code, type) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const platforms = [
    {
      type: 'com',
      name: 'Stake.com',
      logo: '/stake_com_clean.png',
      url: 'https://www.stake.com/?c=Hunchos',
      badge: 'INTERNATIONAL TIER',
      code: 'Hunchos',
      voucherId: 'VOUCHER: STK-2026-COM',
      perks: [
        { icon: <Gift size={12} className="text-accent" />, text: 'EXCLUSIVE 200% DEPOSIT BONUS' },
        { icon: <Coins size={12} className="text-accent" />, text: 'MIN: $100 — MAX: $500 LIMIT' },
        { icon: <Flame size={12} className="text-accent" />, text: 'AUTOMATIC LEADERBOARD ACCESS' }
      ],
      hoverClass: 'hover:border-accent/20 hover:shadow-[0_30px_70px_rgba(230,57,70,0.06)]',
      lineColor: 'bg-accent font-bold text-accent border-accent/20 bg-accent/5',
      glareColor: 'rgba(230, 57, 70, 0.12)',
      btnGlow: 'shadow-[0_4px_20px_rgba(230,57,70,0.15)] hover:bg-[#eaeaea]'
    },
    {
      type: 'us',
      name: 'Stake.us',
      logo: '/stake_us_clean.png',
      url: 'https://www.stake.us/?c=Hunchos007&offer=hunchos007',
      badge: 'US REGION PLAYERS',
      code: 'Hunchos007',
      voucherId: 'VOUCHER: STK-2026-US',
      perks: [
        { icon: <Gift size={12} className="text-emerald-400" />, text: 'FREE $25 INITIAL BONUS COINS' },
        { icon: <Coins size={12} className="text-emerald-400" />, text: 'FREE 250,000 GOLD COINS INSTANT' },
        { icon: <Flame size={12} className="text-emerald-400" />, text: 'AUTOMATIC LEADERBOARD ACCESS' }
      ],
      hoverClass: 'hover:border-emerald-500/20 hover:shadow-[0_30px_70px_rgba(16,185,129,0.05)]',
      lineColor: 'bg-emerald-500 font-bold text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      glareColor: 'rgba(16, 185, 129, 0.08)',
      btnGlow: 'shadow-[0_4px_20px_rgba(16,185,129,0.12)] hover:bg-[#eaeaea]'
    }
  ];

  return (
    <div className="relative min-h-screen bg-bg-darker flex flex-col justify-center items-center pt-28 pb-20 px-6 overflow-hidden">
      <AuroraCanvas />

      <div className="max-w-4xl w-full flex flex-col gap-12 relative z-10">
        
        {/* Header Block */}
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white mb-4 uppercase leading-none"
          >
            CLAIM BONUSES
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[10px] sm:text-[11px] text-white max-w-md mx-auto leading-relaxed uppercase font-bold tracking-[0.25em]"
          >
            Select your region, lock in the referral code, and initialize your account to track leaderboard stakes.
          </motion.p>
        </div>

        {/* Platform Boarding Passes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {platforms.map((platform, idx) => (
            <ScrollReveal 
              key={platform.name}
              delay={idx * 0.12}
            >
              <TiltCard className={`relative bg-[#0c0c0d]/90 border border-white/5 flex flex-col justify-between group transition-all duration-500 rounded-3xl h-[520px] ${platform.hoverClass}`}>
                
                {/* 3D glint overlay reflection */}
                <FoilGlare color={platform.glareColor} />

                {/* Perforated Boarding Pass Side Notch Cutouts */}
                <div className="absolute top-1/2 -left-2.5 w-5 h-5 rounded-full bg-bg-darker border-r border-white/5 -translate-y-1/2 z-20 pointer-events-none" />
                <div className="absolute top-1/2 -right-2.5 w-5 h-5 rounded-full bg-bg-darker border-l border-white/5 -translate-y-1/2 z-20 pointer-events-none" />
                
                {/* Horizontal dash perforation tear border */}
                <div className="absolute top-1/2 left-4 right-4 border-t border-dashed border-white/10 -translate-y-1/2 z-10 pointer-events-none" />

                {/* Sweeping metallic light sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-10" />

                {/* TOP HALF: Branding & Perks */}
                <div className="p-7 sm:p-8 pb-4 flex flex-col h-1/2 justify-between relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[7.5px] font-bold tracking-[0.22em] text-white/35 uppercase">
                      BOARDING PASS
                    </span>
                    <span className={`text-[7.5px] tracking-widest px-2.5 py-1 uppercase rounded-full border ${platform.lineColor}`}>
                      {platform.badge}
                    </span>
                  </div>

                  {/* Platform Logo & Region Decoration */}
                  <TiltParallax depth={1.1} className="relative flex items-center justify-center my-6 w-full h-24">
                    {/* The Logo */}
                    <img 
                      src={platform.logo} 
                      alt={platform.name} 
                      className="h-18 md:h-22 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.12)] group-hover:scale-[1.05] transition-all duration-500 select-none relative z-10"
                    />

                    {/* Stake.com Globe Icon behind it */}
                    {platform.type === 'com' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
                        className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none select-none z-0 group-hover:opacity-55 transition-all duration-500"
                      >
                        <GlobeWatermark />
                      </motion.div>
                    )}

                    {/* Stake.us USA Flag behind it */}
                    {platform.type === 'us' && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none select-none z-0 group-hover:opacity-55 transition-all duration-500">
                        <USAFlag />
                      </div>
                    )}
                  </TiltParallax>

                  {/* Custom Icon Perks list */}
                  <ul className="flex flex-col gap-2.5 mt-2">
                    {platform.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="flex items-center text-[9px] font-bold tracking-widest text-white/50 uppercase">
                        <span className="mr-3 shrink-0 p-1 rounded-md bg-white/[0.02] border border-white/5">
                          {perk.icon}
                        </span>
                        {perk.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BOTTOM HALF: Referral Voucher & Call-To-Action */}
                <div className="p-7 sm:p-8 pt-4 flex flex-col h-1/2 justify-between relative z-10">
                  
                  {/* Voucher Ticket Code Stub */}
                  <TiltParallax depth={0.85} className="flex flex-col gap-2.5 bg-black/40 p-4 border border-white/5 rounded-2xl relative group-focus-within:border-white/15">
                    <div className="flex justify-between items-center">
                      <span className="text-[7.5px] font-bold tracking-[0.2em] text-white/30 uppercase">{platform.voucherId}</span>
                      <span className="text-[9px] font-mono font-bold text-white/70">{platform.code}</span>
                    </div>
                    
                    <button
                      onClick={() => handleCopy(platform.code, platform.type)}
                      className="w-full mt-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/5 py-2.5 text-[8.5px] font-bold tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-2 rounded-xl cursor-pointer relative overflow-visible"
                    >
                      <ConfettiBurst active={copiedCode === platform.type} />
                      {copiedCode === platform.type ? (
                        <>
                          <Check size={11} className="text-emerald-400 relative z-10 animate-bounce" />
                          <span className="relative z-10 text-emerald-400 font-bold">VOUCHER ACTIVE</span>
                        </>
                      ) : (
                        <>
                          <Ticket size={11} className="relative z-10 text-white/50 group-hover:text-white" />
                          <span className="relative z-10">COPY VOUCHER CODE</span>
                        </>
                      )}
                    </button>
                  </TiltParallax>

                  {/* Sign Up CTA */}
                  <TiltParallax depth={0.6} className="w-full">
                    <a 
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full bg-white text-black font-bold text-[10px] tracking-[0.25em] py-4 uppercase transition-all duration-300 text-center block rounded-2xl flex items-center justify-center gap-2 cursor-pointer ${platform.btnGlow}`}
                    >
                      <span>REDEEM PASS</span>
                      <ExternalLink size={11} className="text-black/60 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </TiltParallax>
                </div>

              </TiltCard>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </div>
  );
}
