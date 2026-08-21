import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Search, X, Flame, Copy, Check, Info } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import CountUp from '../components/CountUp';
import ConfettiBurst from '../components/ConfettiBurst';
import { getJuneData, getMayData, getWagerGoal, getPrizePool } from '../utils/dataStore';


/* ============================================================================
   BACKGROUND BOKEH CANVAS COMPONENT
   Renders slow drifting blurred light spots and rising dust motes.
   ============================================================================ */
function BokehCanvas() {
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

    // Create particles
    const particles = [];
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 120 + 80,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        color: i % 4 === 0 
          ? 'rgba(230, 57, 70, 0.03)' 
          : i % 4 === 1 
          ? 'rgba(249, 115, 22, 0.02)' 
          : i % 4 === 2
          ? 'rgba(234, 179, 8, 0.02)'
          : 'rgba(255, 255, 255, 0.01)',
      });
    }

    // Add tiny dust motes
    const dustParticles = [];
    const dustCount = 35;
    for (let i = 0; i < dustCount; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.5,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -Math.random() * 0.18 - 0.06,
        opacity: Math.random() * 0.35 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      dustParticles.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;
        if (d.y < -5) d.y = height + 5;

        ctx.fillStyle = `rgba(255, 255, 255, ${d.opacity})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

/* ============================================================================
   ROTATING VECTOR GEAR COMPONENT FOR WATCH DIAL
   ============================================================================ */
function Gear({ cx, cy, r, teethCount, speed, clockwise = true }) {
  const teeth = Array.from({ length: teethCount }).map((_, i) => {
    const angle = (i * 360) / teethCount;
    return (
      <rect
        key={i}
        x={cx - 2}
        y={cy - r - 3}
        width="4"
        height="6"
        transform={`rotate(${angle} ${cx} ${cy})`}
        fill="none"
        stroke="rgba(255, 255, 255, 0.05)"
        strokeWidth="0.8"
      />
    );
  });

  return (
    <motion.g
      animate={{ rotate: clockwise ? 360 : -360 }}
      transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
      style={{ originX: `${cx}px`, originY: `${cy}px` }}
    >
      <circle cx={cx} cy={cy} r={r} stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.8" fill="none" />
      <circle cx={cx} cy={cy} r={r - 4} stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.6" fill="none" />
      <circle cx={cx} cy={cy} r="3" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.8" fill="none" />
      {teeth}
    </motion.g>
  );
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('june');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [copied, setCopied] = useState(false);
  const [showHowToEnter, setShowHowToEnter] = useState(false);
  const [selectedPodiumRank, setSelectedPodiumRank] = useState(1);

  // Responsive device state for podium translations
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Swiss dial jitter
  const [needleJitter, setNeedleJitter] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setNeedleJitter((Math.random() - 0.5) * 0.08);
    }, 110);
    return () => clearInterval(interval);
  }, []);

  // Flickering live digit
  const [lastDecimalDigit, setLastDecimalDigit] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setLastDecimalDigit(Math.floor(Math.random() * 10));
    }, 160);
    return () => clearInterval(interval);
  }, []);

  const rawData = useMemo(() => {
    return activeTab === 'june' ? getJuneData() : getMayData();
  }, [activeTab]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return rawData;
    return rawData.filter(player => 
      player.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rawData, searchQuery]);

  const podium = useMemo(() => {
    if (searchQuery) return [];
    const topThree = rawData.filter(p => p.isPodium);
    const sorted = [];
    if (topThree[1]) sorted.push(topThree[1]); // 2nd
    if (topThree[0]) sorted.push(topThree[0]); // 1st
    if (topThree[2]) sorted.push(topThree[2]); // 3rd
    return sorted;
  }, [rawData, searchQuery]);

  const tableData = useMemo(() => {
    if (searchQuery) return filteredData;
    return filteredData.filter(p => !p.isPodium);
  }, [filteredData, searchQuery]);

  const parsePlayerWager = (wagerStr) => {
    const cleaned = wagerStr.replace('$', '').trim();
    if (cleaned.endsWith('K')) {
      return parseFloat(cleaned.replace('K', '')) * 1000;
    }
    return parseFloat(cleaned) || 0;
  };

  const maxWagerVal = useMemo(() => {
    if (rawData.length === 0) return 1;
    return Math.max(...rawData.map(p => parsePlayerWager(p.wagered))) || 1;
  }, [rawData]);

  // Dynamic metrics from dataStore
  const totalWageredVal = useMemo(() => {
    return rawData.reduce((sum, p) => sum + parsePlayerWager(p.wagered), 0);
  }, [rawData]);

  const wagerGoal = useMemo(() => {
    return getWagerGoal();
  }, [activeTab, rawData]);

  const progressPercent = useMemo(() => {
    return Math.min((totalWageredVal / wagerGoal) * 100, 100);
  }, [totalWageredVal, wagerGoal]);

  const wageredFormatted = useMemo(() => {
    if (totalWageredVal >= 1000000) {
      return `$${(totalWageredVal / 1000000).toFixed(2)}M`;
    }
    if (totalWageredVal >= 1000) {
      return `$${(totalWageredVal / 1000).toFixed(1)}K`;
    }
    return `$${totalWageredVal.toFixed(2)}`;
  }, [totalWageredVal]);

  const wagerGoalFormatted = useMemo(() => {
    if (wagerGoal >= 1000000) {
      return `$${(wagerGoal / 1000000).toFixed(1)}M`;
    }
    if (wagerGoal >= 1000) {
      return `$${(wagerGoal / 1000).toFixed(0)}K`;
    }
    return `$${wagerGoal}`;
  }, [wagerGoal]);

  const prizePool = useMemo(() => {
    return getPrizePool(activeTab);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisibleCount(10);
    setSearchQuery('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('Hunchos');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stagger configurations
  const listContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const ticketRowVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  // Watch Face Dial Tick Generator
  const dialTicks = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const angle = (i * 360) / 60;
      const isMajor = i % 5 === 0;
      const length = isMajor ? 7 : 4;
      const opacity = isMajor ? 0.3 : 0.1;
      return (
        <line
          key={i}
          x1="100"
          y1={100 - 90}
          x2="100"
          y2={100 - 90 + length}
          transform={`rotate(${angle} 100 100)`}
          stroke="#ffffff"
          strokeWidth={isMajor ? 1.0 : 0.6}
          strokeOpacity={opacity}
        />
      );
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-bg-darker pb-24 overflow-hidden pt-28">
      <BokehCanvas />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Asymmetrical Split Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Sticky Header & Chrono-Dial */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-10">
            
            {/* Title & Branding Lockup */}
            <div className="flex flex-col items-start text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 text-[9px] font-bold tracking-[0.2em] text-accent uppercase mb-5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                <span>Live Feed Tracker</span>
              </motion.div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight font-display text-white uppercase leading-none mb-3">
                THE STAKE <br />
                <span className="font-serif italic font-normal text-white/50 text-4xl sm:text-5xl lg:text-6xl lowercase tracking-normal">leaderboard.</span>
              </h1>
              
              <div className="flex flex-col gap-4 mt-2">
                <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase leading-relaxed max-w-sm">
                  Weekly compilation of referral wagers registered under code Hunchos on Stake.com & Stake.us
                </p>
                
                <div className="flex flex-wrap gap-3 mt-1">
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 border border-white/10 hover:border-white px-4 py-2.5 text-[9px] text-white transition-all bg-white/5 uppercase rounded-full cursor-pointer font-bold relative overflow-visible"
                  >
                    <ConfettiBurst active={copied} />
                    <span className="relative z-10">Use Referral Code: <span className="text-accent">HUNCHOS</span></span>
                    {copied ? <Check size={8} className="text-emerald-400 relative z-10" /> : <Copy size={8} className="relative z-10" />}
                  </button>

                  <button 
                    onClick={() => setShowHowToEnter(true)}
                    className="flex items-center gap-2 bg-[#818cf8] hover:bg-[#6366f1] text-white px-5 py-2.5 text-[9px] font-bold tracking-widest uppercase rounded-full cursor-pointer transition-all shadow-[0_4px_20px_rgba(99,102,241,0.22)]"
                  >
                    <Info size={11} className="text-white" />
                    <span>HOW TO ENTER</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Swiss mechanical Chronograph Goal Indicator */}
            {activeTab === 'june' && (
              <ScrollReveal className="bg-[#0a0a0b]/80 border border-white/5 p-6 rounded-3xl relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col items-center">
                <div className="absolute top-0 right-0 w-60 h-60 bg-accent/[0.015] rounded-full blur-3xl pointer-events-none" />
                
                {/* Watch dial circle */}
                <div className="relative w-52 h-52 flex items-center justify-center mb-6">
                  
                  {/* Rotating gear movement backing shadows */}
                  <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
                    <Gear cx={74} cy={116} r={28} teethCount={18} speed={55} clockwise={true} />
                    <Gear cx={124} cy={88} r={20} teethCount={14} speed={40} clockwise={false} />
                    
                    {/* Dial ticks */}
                    {dialTicks}

                    {/* Sweep hand (goal progress) */}
                    <motion.g
                      animate={{ rotate: (progressPercent / 100) * 360 + needleJitter }}
                      transition={{ type: "spring", stiffness: 70, damping: 14 }}
                      style={{ originX: '100px', originY: '100px' }}
                    >
                      {/* Sweeping gold indicator needle */}
                      <line x1="100" y1="100" x2="100" y2="16" stroke="#eab308" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1="100" y1="100" x2="100" y2="114" stroke="#eab308" strokeWidth="0.8" strokeOpacity="0.3" />
                      <circle cx="100" cy="16" r="2.5" fill="#eab308" />
                    </motion.g>

                    {/* Central Golden watch hub cap */}
                    <circle cx="100" cy="100" r="4.5" fill="#eab308" stroke="#0a0a0b" strokeWidth="1.5" />
                  </svg>

                  {/* Circular digital progress readout inside watch ring */}
                  <div className="absolute flex flex-col items-center text-center mt-36">
                    <span className="text-[12px] font-mono text-accent tracking-widest font-black">
                      {progressPercent < 10 ? '0' + progressPercent.toFixed(2) : progressPercent.toFixed(2)}{lastDecimalDigit}%
                    </span>
                  </div>
                </div>

                {/* Dial Wager Metrics */}
                <div className="w-full grid grid-cols-2 border-t border-white/5 pt-5 text-center">
                  <div className="flex flex-col border-r border-white/5">
                    <span className="text-[7.5px] font-bold text-white/30 tracking-[0.2em] uppercase">Wagered Tracker</span>
                    <span className="text-sm font-mono font-bold text-white/80 mt-1">{wageredFormatted}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7.5px] font-bold text-white/30 tracking-[0.2em] uppercase">Goal Limit</span>
                    <span className="text-sm font-mono font-bold text-white/80 mt-1">{wagerGoalFormatted}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-1.5 self-start">
                  <Info size={10} className="text-white/20" />
                  <span className="text-[8px] font-mono text-white/25 uppercase tracking-wide">
                    Live watch chronograph records active wager volumes.
                  </span>
                </div>
              </ScrollReveal>
            )}

          </div>

          {/* RIGHT COLUMN: Fanned Podium Deck & Track List */}
          <div className="lg:col-span-7 relative">
            
            {/* Hidden Overlay for Past Leaderboard */}
            {activeTab === 'may' && (
              <div className="absolute inset-0 z-50 flex flex-col mt-36 items-center justify-start">
                <div className="bg-[#0c0c0d]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-w-sm mx-auto">
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center mb-5">
                    <Info size={20} />
                  </div>
                  <h3 className="text-2xl font-black font-display tracking-tight text-white uppercase mb-3">Leaderboard Hidden</h3>
                  <p className="text-xs text-white/60 font-semibold uppercase tracking-wider leading-relaxed">
                    Past leaderboard records are currently hidden. Switch back to the live tab to view active standings.
                  </p>
                </div>
              </div>
            )}

            <div className={`flex flex-col gap-12 transition-all duration-500 ${activeTab === 'may' ? 'blur-[8px] opacity-30 pointer-events-none select-none' : ''}`}>
            
            {/* Tab Controls & Search Layout */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-5 border-b border-white/5 pb-6">
              
              {/* Sliding pill selector */}
              <div className="flex gap-1 bg-[#0a0a0b]/60 p-1 rounded-full border border-white/5 self-start">
                {[
                  { id: 'june', label: 'Aug 16–23', status: 'Live' },
                  { id: 'may', label: 'Aug 9–16', status: 'Past' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative px-5 py-2 text-[9px] font-bold tracking-widest uppercase transition-all duration-300 rounded-full cursor-pointer flex items-center gap-2 ${
                      activeTab === tab.id ? 'text-black z-10' : 'text-white/45 hover:text-white'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-white rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                      />
                    )}
                    {tab.label}
                    <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === tab.id ? 'bg-black/10 text-black' : 'bg-white/5 text-white/30'
                    }`}>
                      {tab.status}
                    </span>
                  </button>
                ))}
              </div>

              {/* Minimal Search Bar */}
              <div className="relative flex items-center bg-white/[0.01] border border-white/5 rounded-full px-4 py-2.5 max-w-[260px] w-full transition-all focus-within:border-white/20 focus-within:bg-[#0a0a0b] group">
                <Search size={11} className="text-white/25 mr-2.5 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find competitor..."
                  className="bg-transparent border-none text-[10px] font-medium tracking-wide text-white placeholder-white/25 w-full focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    className="text-white/45 hover:text-white transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>

            {/* 3D Fanned Podium Ticket Deck */}
            {podium.length > 0 && (
              <ScrollReveal className="w-full flex flex-col items-center py-6 perspective-[1000px]">
                <motion.div 
                  initial="idle"
                  whileHover="hovered"
                  className="relative w-full max-w-[420px] h-[260px] flex items-center justify-center cursor-pointer"
                >
                  
                  {/* 2nd Place Card (Left) */}
                  {podium[0] && (
                    <motion.div
                      onClick={() => setSelectedPodiumRank(2)}
                      animate={isMobile ? (
                        selectedPodiumRank === 2 
                          ? { x: 0, y: -15, rotate: 0, zIndex: 40, scale: 1.05 } 
                          : selectedPodiumRank === 3 
                          ? { x: -80, y: 25, rotate: -8, zIndex: 10, scale: 0.86 }
                          : { x: -45, y: 15, rotate: -5, zIndex: 15, scale: 0.92 }
                      ) : undefined}
                      variants={!isMobile ? {
                        idle: { rotate: -6, x: -60, y: 15, zIndex: 10 },
                        hovered: { rotate: 0, x: -140, y: 0, zIndex: 20 }
                      } : undefined}
                      transition={{ type: "spring", stiffness: 180, damping: 18 }}
                      className={`absolute w-[150px] h-[210px] bg-[#0a0a0b]/90 border shadow-2xl rounded-2xl p-5 flex flex-col justify-between overflow-hidden cursor-pointer transition-colors duration-300 ${
                        isMobile && selectedPodiumRank === 2 ? 'border-zinc-400/50 shadow-[0_15px_35px_rgba(255,255,255,0.06)]' : 'border-white/5 hover:border-zinc-400/20'
                      }`}
                    >
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-zinc-400/10" />
                      
                      <div className="flex justify-between items-start">
                        <span className="text-[7.5px] font-bold tracking-[0.2em] text-white/30 uppercase">Tier II</span>
                        <div className="w-7 h-7 rounded-full border border-zinc-500/10 bg-zinc-500/5 flex items-center justify-center">
                          <span className="text-xs font-serif text-zinc-300 font-black">II</span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white truncate max-w-[110px]">{podium[0].username}</span>
                        <span className="text-[8px] font-semibold text-zinc-400 uppercase tracking-widest mt-0.5">{podium[0].prize} prize</span>
                      </div>

                      <div className="border-t border-white/5 pt-3 flex flex-col">
                        <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Wagered</span>
                        <span className="text-[10px] font-mono font-bold text-white/70 mt-0.5">{podium[0].wagered}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* 1st Place Card (Center) */}
                  {podium[1] && (
                    <motion.div
                      onClick={() => setSelectedPodiumRank(1)}
                      animate={isMobile ? (
                        selectedPodiumRank === 1 
                          ? { x: 0, y: -15, rotate: 0, zIndex: 40, scale: 1.05 } 
                          : selectedPodiumRank === 2 
                          ? { x: 45, y: 15, rotate: 5, zIndex: 15, scale: 0.92 }
                          : { x: -45, y: 15, rotate: -5, zIndex: 15, scale: 0.92 }
                      ) : undefined}
                      variants={!isMobile ? {
                        idle: { rotate: 0, x: 0, y: 0, zIndex: 30 },
                        hovered: { rotate: 0, x: 0, y: -25, zIndex: 30 }
                      } : undefined}
                      transition={{ type: "spring", stiffness: 180, damping: 18 }}
                      className={`absolute w-[165px] h-[230px] bg-[#0a0a0b]/90 border shadow-2xl rounded-2xl p-6 flex flex-col justify-between overflow-hidden cursor-pointer transition-colors duration-300 ${
                        isMobile && selectedPodiumRank === 1 ? 'border-yellow-500/50 shadow-[0_15px_35px_rgba(234,179,8,0.1)]' : 'border-yellow-500/10 hover:border-yellow-500/25'
                      }`}
                    >
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-yellow-500/15" />
                      
                      <div className="flex justify-between items-start">
                        <span className="text-[7.5px] font-bold tracking-[0.2em] text-yellow-500/80 uppercase">Champion</span>
                        <div className="w-8 h-8 rounded-full border border-yellow-500/20 bg-yellow-500/5 flex items-center justify-center">
                          <span className="text-sm font-serif text-yellow-500 font-black">I</span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white truncate max-w-[120px]">{podium[1].username}</span>
                        <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest mt-0.5">{podium[1].prize} prize</span>
                      </div>

                      <div className="border-t border-white/5 pt-3 flex flex-col">
                        <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Wagered</span>
                        <span className="text-[11px] font-mono font-bold text-white/95 mt-0.5">{podium[1].wagered}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* 3rd Place Card (Right) */}
                  {podium[2] && (
                    <motion.div
                      onClick={() => setSelectedPodiumRank(3)}
                      animate={isMobile ? (
                        selectedPodiumRank === 3 
                          ? { x: 0, y: -15, rotate: 0, zIndex: 40, scale: 1.05 } 
                          : selectedPodiumRank === 2 
                          ? { x: 80, y: 25, rotate: 8, zIndex: 10, scale: 0.86 }
                          : { x: 45, y: 15, rotate: 5, zIndex: 15, scale: 0.92 }
                      ) : undefined}
                      variants={!isMobile ? {
                        idle: { rotate: 6, x: 60, y: 15, zIndex: 10 },
                        hovered: { rotate: 0, x: 140, y: 0, zIndex: 20 }
                      } : undefined}
                      transition={{ type: "spring", stiffness: 180, damping: 18 }}
                      className={`absolute w-[150px] h-[210px] bg-[#0a0a0b]/90 border shadow-2xl rounded-2xl p-5 flex flex-col justify-between overflow-hidden cursor-pointer transition-colors duration-300 ${
                        isMobile && selectedPodiumRank === 3 ? 'border-orange-500/50 shadow-[0_15px_35px_rgba(249,115,22,0.1)]' : 'border-white/5 hover:border-orange-500/20'
                      }`}
                    >
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-orange-500/10" />
                      
                      <div className="flex justify-between items-start">
                        <span className="text-[7.5px] font-bold tracking-[0.2em] text-white/30 uppercase">Tier III</span>
                        <div className="w-7 h-7 rounded-full border border-orange-500/10 bg-orange-500/5 flex items-center justify-center">
                          <span className="text-xs font-serif text-orange-400 font-black">III</span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white truncate max-w-[110px]">{podium[2].username}</span>
                        <span className="text-[8px] font-semibold text-orange-400 uppercase tracking-widest mt-0.5">{podium[2].prize} prize</span>
                      </div>

                      <div className="border-t border-white/5 pt-3 flex flex-col">
                        <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Wagered</span>
                        <span className="text-[10px] font-mono font-bold text-white/70 mt-0.5">{podium[2].wagered}</span>
                      </div>
                    </motion.div>
                  )}

                </motion.div>

                {/* Mobile Podium Card Switcher Buttons */}
                {isMobile && (
                  <div className="flex justify-center items-center gap-2 mt-2 z-20 relative">
                    <button
                      onClick={() => setSelectedPodiumRank(2)}
                      className={`px-3 py-1 text-[8px] font-bold tracking-widest uppercase rounded-full transition-all duration-300 border cursor-pointer ${
                        selectedPodiumRank === 2
                          ? 'bg-zinc-400/20 border-zinc-400 text-white shadow-md scale-105'
                          : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                      }`}
                    >
                      2nd Place
                    </button>
                    <button
                      onClick={() => setSelectedPodiumRank(1)}
                      className={`px-3 py-1 text-[8px] font-bold tracking-widest uppercase rounded-full transition-all duration-300 border cursor-pointer ${
                        selectedPodiumRank === 1
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-md scale-105'
                          : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                      }`}
                    >
                      1st Place
                    </button>
                    <button
                      onClick={() => setSelectedPodiumRank(3)}
                      className={`px-3 py-1 text-[8px] font-bold tracking-widest uppercase rounded-full transition-all duration-300 border cursor-pointer ${
                        selectedPodiumRank === 3
                          ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-md scale-105'
                          : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                      }`}
                    >
                      3rd Place
                    </button>
                  </div>
                )}
              </ScrollReveal>
            )}

            {/* Standings list container */}
            <ScrollReveal className="flex flex-col gap-4">
              <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 text-[9px] font-bold tracking-widest text-white/35 uppercase">
                <span>Standings track list</span>
                <span>{activeTab === 'june' ? 'Aug 16–23' : 'Aug 9–16'} pool: {prizePool}</span>
              </div>

              <motion.div 
                variants={listContainerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-3.5"
              >
                {tableData.length === 0 ? (
                  <div className="py-16 text-center text-[9px] text-white/30 font-bold uppercase tracking-widest border border-dashed border-white/5 rounded-3xl bg-[#0a0a0b]/35">
                    No results found matching query
                  </div>
                ) : (
                  tableData.slice(0, visibleCount).map((player) => {
                    const wagerVal = parsePlayerWager(player.wagered);
                    const percent = Math.min((wagerVal / maxWagerVal) * 100, 100);
                    const initials = player.username.replace(/\*/g, '').slice(0, 2).toUpperCase() || 'P';

                    return (
                      <motion.div
                        key={player.rank}
                        variants={ticketRowVariants}
                        className="relative bg-[#0a0a0b]/80 border border-white/5 rounded-2xl h-20 transition-all duration-400 group overflow-hidden"
                      >
                        {/* Perforated ticket circular notches */}
                        <div className="absolute left-28 -top-2 w-4 h-4 rounded-full bg-bg-darker border-b border-white/5 z-20 pointer-events-none" />
                        <div className="absolute left-28 -bottom-2 w-4 h-4 rounded-full bg-bg-darker border-t border-white/5 z-20 pointer-events-none" />
                        
                        {/* Vertical tear dash border */}
                        <div className="absolute left-[7.5rem] top-3.5 bottom-3.5 border-l border-dashed border-white/10 z-10 pointer-events-none" />

                        {/* Sheen sweep */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.008] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-10" />

                        {/* Bottom Wager Indicator bar */}
                        <div 
                          className="absolute bottom-0 left-0 h-[1.8px] bg-accent/25 transition-all duration-700 ease-out" 
                          style={{ width: `${percent}%` }} 
                        />

                        {/* Card Layout Split Wrapper */}
                        <div className="w-full h-full flex items-center justify-between">
                          
                          {/* Left ticket stub (slides left on hover) */}
                          <div 
                            className="w-28 flex-shrink-0 flex items-center justify-start pl-6 gap-3 z-10 transition-transform duration-300 group-hover:-translate-x-1.5"
                          >
                            <span className="text-xs font-bold text-white/25 font-mono select-none w-6">
                              {player.rank < 10 ? `0${player.rank}` : player.rank}.
                            </span>
                            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                              <span className="text-[9px] font-serif font-black text-white/50">{initials}</span>
                            </div>
                          </div>

                          {/* Right ticket stub (slides right on hover) */}
                          <div 
                            className="flex-grow flex items-center justify-between pl-8 pr-6 z-10 transition-transform duration-300 group-hover:translate-x-1.5"
                          >
                            <div className="flex flex-col">
                              {/* Serial catalog label */}
                              <span className="text-[7px] font-mono font-bold text-white/20 tracking-wider">
                                CATALOG ID: HNC-007-{player.rank < 10 ? `0${player.rank}` : player.rank}
                              </span>
                              <span className="text-xs font-bold text-white tracking-wide mt-0.5 select-all">
                                {player.username}
                              </span>
                            </div>

                            <div className="flex items-center gap-7 md:gap-12">
                              <div className="flex flex-col items-start sm:items-end">
                                <span className="text-[7.5px] font-bold text-white/25 uppercase tracking-widest">Wagered</span>
                                <span className="text-xs font-mono font-bold text-white/80 mt-0.5">{player.wagered}</span>
                              </div>

                              <div className="flex flex-col items-end w-14">
                                {player.prize !== '—' ? (
                                  <>
                                    <span className="text-[7.5px] font-bold text-accent uppercase tracking-widest">Prize</span>
                                    <span className="text-xs font-bold text-accent mt-0.5">{player.prize}</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-[7.5px] font-bold text-white/15 uppercase tracking-widest font-semibold">Prize</span>
                                    <span className="text-xs font-normal text-white/15 mt-0.5 font-mono">—</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>

              {/* Reveal More Button */}
              {filteredData.length > (searchQuery ? 0 : 3) + visibleCount && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 10)}
                    className="border border-white/15 hover:border-white text-white/70 hover:text-white font-bold text-[9px] tracking-[0.25em] px-8 py-3.5 uppercase transition-all duration-300 rounded-full cursor-pointer hover:bg-white/5 shadow-lg"
                  >
                    Reveal More Standings
                  </button>
                </div>
              )}
            </ScrollReveal>

            </div>
          </div>

        </div>
      </div>

      {/* HOW TO ENTER MODAL OVERLAY */}
      <AnimatePresence>
        {showHowToEnter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHowToEnter(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="relative w-full max-w-md bg-[#0c0c0d] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.9)] z-10 flex flex-col text-center"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowHowToEnter(false)}
                className="absolute top-4 right-4 text-white/30 hover:text-white cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              {/* Icon Decoration */}
              <div className="w-12 h-12 rounded-full border border-[#818cf8]/20 bg-[#818cf8]/5 text-[#818cf8] flex items-center justify-center mx-auto mb-6">
                <Info size={20} />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-black font-display tracking-tight text-white uppercase mb-4">
                HOW TO ENTER
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-semibold uppercase tracking-wider mb-8">
                Click play now and start wagering on our codes to participate in the monthly leaderboard. Please check the rules below!
              </p>

              {/* Play Now Button */}
              <Link 
                to="/signup" 
                onClick={() => setShowHowToEnter(false)}
                className="bg-white hover:bg-white/95 text-black font-bold text-xs tracking-widest py-4 uppercase transition-all duration-300 rounded-2xl shadow-[0_4px_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
              >
                <span>PLAY NOW</span>
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
