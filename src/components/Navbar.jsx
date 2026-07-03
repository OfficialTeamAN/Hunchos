import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY, scrollYProgress } = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef(null);

  // Magnetic coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 120) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
  });

  const handleVipClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById('vip-ranks');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/?scroll=vip-ranks');
    }
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'LEADERBOARD', path: '/leaderboard' },
    { name: 'CLAIM BONUS', path: '/signup' },
  ];

  const showExpanded = !collapsed || isHovered;
  
  // Use fixed widths to prevent Framer Motion from jerking on layout calculations
  const expandedWidth = windowWidth < 480 ? `${windowWidth - 30}px` : '520px';

  // Magnetic calculations
  const handleMouseMove = (e) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(x, y);
    
    if (dist < 120) {
      setIsNear(true);
      setMousePos({ x: x * 0.15, y: y * 0.15 });
    } else {
      setIsNear(false);
      setMousePos({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setIsNear(false);
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const containerCircumference = 2 * Math.PI * 13; // Radius = 13

  return (
    <div 
      className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
      onMouseMove={handleMouseMove}
    >
      <motion.nav
        ref={navRef}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={handleMouseLeave}
        className="pointer-events-auto bg-black/75 border border-white/10 backdrop-blur-xl shadow-2xl relative flex items-center select-none overflow-hidden"
        style={{
          boxShadow: showExpanded 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 35px rgba(230, 57, 70, 0.05)' 
            : '0 10px 20px -10px rgba(0, 0, 0, 0.8)'
        }}
        animate={{
          width: showExpanded ? expandedWidth : '155px',
          height: '50px',
          borderRadius: '25px',
          paddingLeft: showExpanded ? '18px' : '10px',
          paddingRight: showExpanded ? '18px' : '10px',
          x: isNear ? mousePos.x : 0,
          y: isNear ? mousePos.y : 0,
        }}
        transition={{ type: 'spring', damping: 18, stiffness: 180 }}
      >
        {/* Sleek bottom accent glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <AnimatePresence mode="wait">
          {!showExpanded ? (
            <motion.div
              key="collapsed-stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full flex items-center justify-between px-2 cursor-pointer"
            >
              {/* Circular Progress Ring around Face Avatar */}
              <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth="1.8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="16"
                    cy="16"
                    r="13"
                    stroke="#e63946"
                    strokeWidth="1.8"
                    fill="transparent"
                    strokeDasharray={containerCircumference}
                    initial={{ strokeDashoffset: containerCircumference }}
                    animate={{ strokeDashoffset: containerCircumference * (1 - Math.max(0.04, scrollProgress)) }} // Dynamic scroll progress gauge
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }} // spring transition for smoothness
                  />
                </svg>
                {/* Face Logo inside circular frame */}
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-[22px] h-[22px] rounded-full object-cover z-10"
                />
              </div>

              {/* Ticker status */}
              <div className="flex items-center gap-1 text-white/80 shrink-0">
                <Flame size={11} className="text-accent animate-pulse" />
                <span className="font-mono text-[9px] font-bold tracking-wider">$55.3K</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="h-full w-full flex items-center justify-between"
            >
              {/* Logo (Avatar + Title) */}
              <Link to="/" className="flex items-center gap-2 font-black tracking-tighter text-[10px] group/logo shrink-0">
                <div className="w-6 h-6 rounded-full border border-white/10 overflow-hidden relative bg-white/5">
                  <img src="/logo.png" alt="Hunchos Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-display text-white">HUNCHOS</span>
                <motion.span 
                  className="bg-accent text-white px-1.5 py-0.5 text-[8px] font-black skew-x-[-10deg] inline-block"
                  whileHover={{ rotate: [-3, 3, -3], scale: 1.05 }}
                >
                  007
                </motion.span>
              </Link>

              {/* Links */}
              <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              <div 
                className="flex items-center gap-0.5 relative py-1 overflow-x-auto hide-scrollbar w-full justify-start md:justify-end ml-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {navLinks.map((link, idx) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`shrink-0 relative px-3.5 py-2 text-[9px] font-bold tracking-widest transition-colors duration-300 ${
                        isActive ? 'text-black z-10' : 'text-white/60 hover:text-white z-10'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activePill"
                          className="absolute inset-0 bg-white rounded-full -z-10"
                          transition={{ type: 'spring', damping: 16, stiffness: 180 }}
                        />
                      )}
                      {hoveredIndex === idx && !isActive && (
                        <motion.div
                          layoutId="hoverPill"
                          className="absolute inset-0 bg-white/5 rounded-full -z-10"
                          transition={{ type: 'spring', damping: 16, stiffness: 180 }}
                        />
                      )}
                      {link.name}
                    </Link>
                  );
                })}
                <a
                  href="#vip-ranks"
                  onClick={handleVipClick}
                  className="shrink-0 px-3.5 py-2 text-[9px] font-bold tracking-widest text-white/60 hover:text-white transition-colors duration-300"
                >
                  VIP RANKS
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
