import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import SplitText from '../components/SplitText';
import ScrollReveal from '../components/ScrollReveal';
import SocialDeck from '../components/SocialDeck';
import TiltCard, { TiltParallax } from '../components/TiltCard';
import CountUp from '../components/CountUp';
import HeroCanvasBackground from '../components/HeroCanvasBackground';
import PremiumPartnership from '../components/PremiumPartnership';

export default function Home() {
  const location = useLocation();

  // Scroll parallax effects for hero
  const { scrollY } = useScroll();
  const videoScale = useTransform(scrollY, [0, 800], [1, 0.92]);
  const videoOpacity = useTransform(scrollY, [0, 800], [0.75, 0.2]);
  const heroY = useTransform(scrollY, [0, 800], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Entrance animations for the hero section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      }
    }
  };

  const titleVariants = {
    hidden: { y: 80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1] // easeOutExpo
      }
    }
  };

  const badgeVariants = {
    hidden: { scale: 0, rotate: -15, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 12,
        delay: 0.6
      }
    }
  };

  const subtitleVariants = {
    hidden: { letterSpacing: '0.28em', opacity: 0, y: 20 },
    visible: {
      letterSpacing: '0.15em',
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 0.4,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 140,
        damping: 12
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('scroll') === 'vip-ranks') {
      const el = document.getElementById('vip-ranks');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location]);

  const stats = [
    { value: '1000', label: 'MONTHLY POOL', prefix: '$' },
    { value: '50', label: 'PLAYERS ON BOARD', suffix: '+' },
    { value: 'DAILY', label: 'DATA UPDATES', isText: true },
  ];

  const vipRanks = [
    { 
      name: 'Bronze VIP', 
      perks: 'Unlock rakeback + weekly bonuses',
      gradient: 'from-orange-950/10 via-orange-900/5 to-transparent',
      borderColor: 'border-orange-500/10 hover:border-orange-500/30',
      glowColor: 'hover:shadow-[0_20px_50px_rgba(249,115,22,0.04)]',
      badgeColor: 'text-orange-500/80 border-orange-500/10 bg-orange-500/5',
      number: '01',
      accent: '#f97316',
      svgEmblem: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 opacity-35 group-hover:opacity-100 transition-all duration-700 animate-[spin_35s_linear_infinite]" style={{ stroke: '#f97316', fill: 'none', strokeWidth: 1.2 }}>
          <polygon points="50,15 85,75 15,75" />
          <polygon points="50,25 75,70 25,70" className="opacity-30" />
        </svg>
      )
    },
    { 
      name: 'Silver VIP', 
      perks: 'Increased monthly bonuses + VIP growth',
      gradient: 'from-zinc-800/10 via-zinc-900/5 to-transparent',
      borderColor: 'border-zinc-500/10 hover:border-zinc-400/30',
      glowColor: 'hover:shadow-[0_20px_50px_rgba(161,161,170,0.04)]',
      badgeColor: 'text-zinc-400/80 border-zinc-400/10 bg-zinc-400/5',
      number: '02',
      accent: '#a1a1aa',
      svgEmblem: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 opacity-35 group-hover:opacity-100 transition-all duration-700 animate-[spin_40s_linear_infinite_reverse]" style={{ stroke: '#a1a1aa', fill: 'none', strokeWidth: 1.2 }}>
          <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" />
          <rect x="30" y="30" width="40" height="40" transform="rotate(45 50 50)" className="opacity-30" />
        </svg>
      )
    },
    { 
      name: 'Gold VIP', 
      perks: 'Higher level-up rewards + custom offers',
      gradient: 'from-yellow-950/10 via-yellow-900/5 to-transparent',
      borderColor: 'border-yellow-500/10 hover:border-yellow-500/30',
      glowColor: 'hover:shadow-[0_20px_50px_rgba(234,179,8,0.04)]',
      badgeColor: 'text-yellow-500/80 border-yellow-500/10 bg-yellow-500/5',
      number: '03',
      accent: '#eab308',
      svgEmblem: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 opacity-35 group-hover:opacity-100 transition-all duration-700 animate-[spin_45s_linear_infinite]" style={{ stroke: '#eab308', fill: 'none', strokeWidth: 1.2 }}>
          <polygon points="50,12 83,31 83,69 50,88 17,69 17,31" />
          <polygon points="50,22 75,36 75,64 50,78 25,64 25,36" className="opacity-30" />
        </svg>
      )
    },
    { 
      name: 'Diamond VIP', 
      perks: 'Dedicated host + maximum limits',
      gradient: 'from-sky-950/10 via-sky-900/5 to-transparent',
      borderColor: 'border-sky-500/10 hover:border-sky-500/30',
      glowColor: 'hover:shadow-[0_20px_50px_rgba(14,165,233,0.04)]',
      badgeColor: 'text-sky-400/80 border-sky-500/10 bg-sky-500/5',
      number: '04',
      accent: '#38bdf8',
      svgEmblem: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 opacity-35 group-hover:opacity-100 transition-all duration-700 animate-[spin_50s_linear_infinite_reverse]" style={{ stroke: '#38bdf8', fill: 'none', strokeWidth: 1.2 }}>
          <polygon points="50,10 63,38 90,50 63,62 50,90 37,62 10,50 37,38" />
          <polygon points="50,24 58,42 76,50 58,58 50,76 42,58 24,50 42,42" className="opacity-30" />
        </svg>
      )
    },
  ];


  return (
    <div className="relative min-h-screen bg-bg-darker overflow-x-hidden">
      {/* Hero Video Section */}
      <div className="relative h-[100dvh] flex items-center justify-center overflow-hidden w-full">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ scale: videoScale, opacity: videoOpacity }}
        >
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-bg-darker via-transparent to-transparent opacity-85" />
        </motion.div>

        {/* Interactive canvas blobs overlay */}
        <HeroCanvasBackground />

        {/* Hero Copy */}
        <motion.div 
          className="relative z-20 max-w-4xl mx-auto text-center px-6"
          style={{ y: heroY, opacity: heroOpacity }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="overflow-hidden py-1 mb-2">
            <motion.h1 
              variants={titleVariants}
              className="text-6xl md:text-9xl font-black tracking-tighter select-none font-display flex items-center justify-center flex-wrap"
            >
              HUNCHOS 
              <motion.span 
                variants={badgeVariants}
                className="inline-block bg-accent text-white ml-4 px-4 py-1 text-2xl md:text-4xl font-extrabold skew-x-[-10deg] border-none shadow-[4px_4px_0px_0px_#8b001a] origin-center"
              >
                007
              </motion.span>
            </motion.h1>
          </div>

          <motion.h2 
            variants={subtitleVariants}
            className="text-lg md:text-2xl font-bold tracking-widest text-accent mb-2 uppercase font-display"
          >
            $1,000 MONTHLY LEADERBOARD
          </motion.h2>
          
          <motion.p 
            variants={textVariants}
            className="text-white text-xs md:text-sm font-semibold tracking-wider uppercase mb-10"
          >
            Competition live &bull; updated daily
          </motion.p>

          <motion.div 
            variants={buttonContainerVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div 
              variants={buttonVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Link 
                to="/leaderboard" 
                className="block w-full sm:w-auto bg-white hover:bg-white/90 text-black font-bold text-xs tracking-widest px-8 py-4 uppercase transition-all duration-300 rounded-none text-center"
              >
                VIEW LEADERBOARD
              </Link>
            </motion.div>
            <motion.div 
              variants={buttonVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <a 
                href="#vip-ranks" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('vip-ranks')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block w-full sm:w-auto border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold text-xs tracking-widest px-8 py-4 uppercase transition-all duration-300 rounded-none text-center"
              >
                VIP RANKS
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-[10px] font-bold tracking-widest uppercase">Scroll</span>
          <span className="text-sm">&darr;</span>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col gap-24">
        {/* Stats Ribbon */}
        <ScrollReveal className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-white/5 bg-bg-dark/30 backdrop-blur-sm">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center p-4">
              <span className="text-4xl md:text-5xl font-black font-display tracking-tight text-white mb-2">
                {stat.isText ? (
                  stat.value
                ) : (
                  <CountUp 
                    end={stat.value} 
                    prefix={stat.prefix || ''} 
                    suffix={stat.suffix || ''} 
                  />
                )}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </ScrollReveal>

        {/* Promo Banner with 3D Tilt Wrapper */}
        <ScrollReveal>
          <PremiumPartnership concept="cyber" />
        </ScrollReveal>

        {/* VIP Ranks Section */}
        <section id="vip-ranks" className="scroll-mt-24">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white mb-4 uppercase">
              VIP RANKS
            </h2>
            <p className="text-sm text-white/40 max-w-xl mx-auto uppercase font-bold tracking-widest">
              Earn status and level up your staking experience
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vipRanks.map((rank, idx) => (
              <ScrollReveal 
                key={rank.name} 
                delay={idx * 0.08}
              >
                <TiltCard className={`bg-[#0b0b0c] hover:bg-[#0e0e0f] border border-white/5 rounded-3xl overflow-hidden group transition-all duration-500 flex flex-col h-full relative ${rank.borderColor} ${rank.glowColor}`}>
                  {/* Slow sweeping light glint sheen overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.006] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                  
                  {/* Soft Radial Backlight Glow matching the Tier color */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${rank.gradient} opacity-40 group-hover:opacity-75 transition-opacity duration-500`} />
                  
                  <div className="p-7 flex flex-col h-full relative z-10 flex-grow justify-between">
                    {/* Card Header: SVG Emblem and Card Number */}
                    <div className="flex justify-between items-start mb-8">
                      {/* Geometric SVG Emblem */}
                      <div className="p-1 rounded-xl bg-white/[0.01] border border-white/5 group-hover:border-white/10 transition-colors duration-500">
                        {rank.svgEmblem}
                      </div>
                      
                      {/* Display Tier Number */}
                      <span className="text-sm font-semibold tracking-wide text-white/15 group-hover:text-white/35 transition-colors duration-300">
                        {rank.number}
                      </span>
                    </div>

                    {/* Card Body: Title and Perks */}
                    <div className="mb-6">
                      <span className={`text-[8px] font-semibold tracking-[0.18em] uppercase border-b pb-0.5 border-current inline-block mb-3 ${rank.badgeColor.split(' ')[0]}`}>
                        VIP Tier
                      </span>
                      <h4 className="text-xl font-bold tracking-tight text-white uppercase mb-2">
                        {rank.name}
                      </h4>
                      <p className="text-xs text-white/50 leading-relaxed font-normal group-hover:text-white/70 transition-colors">
                        {rank.perks}
                      </p>
                    </div>

                    {/* Card Footer: Signature / Clean Dot Indicator */}
                    <div className="border-t border-white/5 pt-4 flex justify-between items-center mt-auto">
                      <span className="text-[9px] font-normal tracking-wider text-white/20 group-hover:text-white/35 transition-colors">
                        Exclusive Access
                      </span>
                      {/* Mini glowing circle indicator */}
                      <div 
                        className="w-1.5 h-1.5 rounded-full transition-transform duration-500 group-hover:scale-125"
                        style={{ 
                          backgroundColor: rank.accent, 
                          boxShadow: `0 0 10px ${rank.accent}` 
                        }} 
                      />
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Social Channels Section */}
        <section id="socials">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white mb-4 uppercase">
              SOCIAL CHANNELS
            </h2>
            <p className="text-sm text-white/40 max-w-xl mx-auto uppercase font-bold tracking-widest">
              Follow along on the platforms where the community is most active
            </p>
          </ScrollReveal>
          <SocialDeck />
        </section>
      </div>
    </div>
  );
}
