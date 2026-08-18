import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [vipActive, setVipActive] = useState(false);
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

  // Check URL scroll param and scroll position
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('scroll') === 'vip-ranks') {
      setVipActive(true);
    } else if (location.pathname !== '/') {
      setVipActive(false);
    }
  }, [location.pathname, location.search]);

  // Scroll spy for VIP section when on Home page
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const el = document.getElementById('vip-ranks');
      if (el) {
        const rect = el.getBoundingClientRect();
        // If near or inside VIP section
        if (rect.top <= 200 && rect.bottom >= 150) {
          setVipActive(true);
        } else if (window.scrollY < 350) {
          setVipActive(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { name: 'HOME', path: '/', isVip: false },
    { name: 'LEADERBOARD', path: '/leaderboard', isVip: false },
    { name: 'CLAIM BONUS', path: '/signup', isVip: false },
    { name: 'VIP REWARDS', path: '/#vip-ranks', isVip: true },
  ];

  const handleLinkClick = (e, link) => {
    if (link.isVip) {
      e.preventDefault();
      setVipActive(true);
      if (location.pathname === '/') {
        const el = document.getElementById('vip-ranks');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/?scroll=vip-ranks');
      }
    } else {
      setVipActive(false);
      if (link.path === '/' && location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const showExpanded = !collapsed || isHovered;
  
  // Use fixed widths to prevent Framer Motion from jerking on layout calculations
  const expandedWidth = windowWidth < 520 ? `${windowWidth - 24}px` : '580px';

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
          paddingLeft: showExpanded ? '20px' : '10px',
          paddingRight: showExpanded ? '20px' : '10px',
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
              <Link 
                to="/" 
                onClick={(e) => handleLinkClick(e, navLinks[0])}
                className="flex items-center gap-2 font-black tracking-tighter text-[10px] group/logo shrink-0"
              >
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
                className="flex items-center gap-0.5 relative py-1 overflow-x-auto hide-scrollbar w-full justify-start md:justify-end ml-3"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {navLinks.map((link, idx) => {
                  const isActive = link.isVip
                    ? location.pathname === '/' && vipActive
                    : link.path === '/'
                    ? location.pathname === '/' && !vipActive
                    : location.pathname === link.path;

                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={(e) => handleLinkClick(e, link)}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`shrink-0 relative px-3 py-2 text-[9px] font-bold tracking-widest transition-colors duration-300 ${
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
