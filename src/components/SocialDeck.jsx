import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SocialDeck() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const socialLinks = [
    {
      platform: 'Kick',
      handle: 'hunchos007',
      statsCount: 'Live Stream',
      statsLabel: 'Interactive Chat & Spins',
      href: 'https://kick.com/hunchos007',
      action: 'Follow Live',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="4" fill="#53fc18"/><path d="M7 6v12h3v-4l2-2 3 6h3.5l-4-7 3.5-5h-3.5l-2.5 4-2-2V6H7z" fill="#000"/></svg>
      ),
      accentColor: '#53fc18',
      bgGlow: 'from-[#53fc18]/15 via-transparent to-transparent',
      borderColor: 'border-[#53fc18]/10 hover:border-[#53fc18]/30',
      glowShadow: 'shadow-[0_15px_45px_rgba(83,252,24,0.18)]',
      colorText: 'text-[#53fc18]',
      badgeText: 'Live Stream'
    },
    {
      platform: 'YouTube',
      handle: '@Hunchos007',
      statsCount: 'Daily Clips',
      statsLabel: 'Epic Wager Highlights',
      href: 'https://www.youtube.com/@Hunchos007',
      action: 'Subscribe',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-red-600"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      ),
      accentColor: '#ff0000',
      bgGlow: 'from-[#ff0000]/15 via-transparent to-transparent',
      borderColor: 'border-[#ff0000]/10 hover:border-[#ff0000]/30',
      glowShadow: 'shadow-[0_15px_45px_rgba(255,0,0,0.18)]',
      colorText: 'text-red-500',
      badgeText: 'Official'
    },
    {
      platform: 'Discord',
      handle: 'hunchos',
      statsCount: '12K+ Online',
      statsLabel: 'Community Hangout & Chats',
      href: 'https://discord.com/invite/hunchos',
      action: 'Join Server',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#5865F2]"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.118.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
      ),
      accentColor: '#5865F2',
      bgGlow: 'from-[#5865F2]/15 via-transparent to-transparent',
      borderColor: 'border-[#5865F2]/10 hover:border-[#5865F2]/30',
      glowShadow: 'shadow-[0_15px_45px_rgba(88,101,242,0.18)]',
      colorText: 'text-[#5865F2]',
      badgeText: 'Active Guild'
    },
    {
      platform: 'X',
      handle: 'Hunchos007tv',
      statsCount: 'Daily Feed',
      statsLabel: 'Giveaways & Streams',
      href: 'https://x.com/Hunchos007tv',
      action: 'Follow Feed',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.398H5.078z"/></svg>
      ),
      accentColor: '#ffffff',
      bgGlow: 'from-white/5 via-transparent to-transparent',
      borderColor: 'border-white/10 hover:border-white/35',
      glowShadow: 'shadow-[0_15px_45px_rgba(255,255,255,0.08)]',
      colorText: 'text-white',
      badgeText: 'Updates'
    },
    {
      platform: 'Instagram',
      handle: 'hunchos007tv',
      statsCount: 'Active Hub',
      statsLabel: 'Community Stories & Updates',
      href: 'https://www.instagram.com/hunchos007tv',
      action: 'Follow Page',
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.88z"/></svg>
      ),
      accentColor: '#E1306C',
      bgGlow: 'from-[#E1306C]/15 via-transparent to-transparent',
      borderColor: 'border-[#E1306C]/10 hover:border-[#E1306C]/30',
      glowShadow: 'shadow-[0_15px_45px_rgba(225,48,108,0.18)]',
      colorText: 'text-[#E1306C]',
      badgeText: 'Visual Hub'
    },
  ];

  // Helper values to structure the fan layout geometry on desktop
  const getOuterStyles = (index) => {
    const isHovered = hoveredIdx === index;
    const isAnyHovered = hoveredIdx !== null;
    
    // Relative coordinates centered on the middle card (index 2)
    const offset = index - 2; 
    
    // Fan Math
    let rotate = offset * 11; // -22, -11, 0, 11, 22 degrees
    let translateY = Math.abs(offset) * 12; // curves upward at the edges
    let translateX = offset * 45; // spreads them horizontally
    let zIndex = 10 - Math.abs(offset);

    if (isHovered) {
      zIndex = 50; // brings hovered card completely to front
    }

    if (isAnyHovered && !isHovered) {
      // Shift neighboring cards outwards slightly to prevent layout squeeze
      const hoverOffset = index - hoveredIdx;
      translateX += hoverOffset > 0 ? 25 : -25;
    }

    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg)`,
      zIndex,
      transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)'
    };
  };

  return (
    <div className="w-full relative py-12">
      {/* Desktop Fanned Deck Layout */}
      <div className="hidden md:flex justify-center items-center h-[460px] relative w-full select-none">
        <div className="relative flex items-center justify-center w-full max-w-4xl h-full">
          {socialLinks.map((link, idx) => {
            const isHovered = hoveredIdx === idx;
            const isAnyHovered = hoveredIdx !== null;
            
            return (
              /* Static Trigger Wrapper: remains in original position to prevent mouse flickering */
              <div
                key={link.platform}
                style={getOuterStyles(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="absolute w-[240px] h-[360px] flex items-center justify-center p-5"
              >
                {/* Inner Card: translates/rotates smoothly relative to static wrapper */}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-[200px] h-[340px] bg-[#0c0c0d] border border-white/5 rounded-[2.2rem] p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] relative cursor-pointer hover:border-white/15 ${
                    isAnyHovered && !isHovered ? 'opacity-35 blur-[0.5px] scale-95' : 'opacity-100'
                  } ${isHovered ? `translate-y-[-50px] rotate-0 scale-[1.12] ${link.glowShadow}` : 'translate-y-0 rotate-0 scale-100'}`}
                >
                  {/* Brand Spotlight Glow */}
                  <div className={`absolute inset-x-0 top-0 h-44 bg-gradient-to-b ${link.bgGlow} opacity-40 transition-opacity duration-500`} />

                  {/* Sweeping metallic light sheen overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.008] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                  {/* Card Header Block */}
                  <div className={`relative z-10 flex justify-between items-start w-full ${idx > 2 ? 'flex-row-reverse' : ''}`}>
                    {/* Platform Icon */}
                    <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
                      {link.iconSvg}
                    </div>
                    {/* Editorial Platform Badge */}
                    <span className={`text-[7px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border border-white/5 bg-white/[0.01] ${link.colorText}`}>
                      {link.badgeText}
                    </span>
                  </div>

                  {/* Card Mid Block: Handles and Stats */}
                  <div className={`relative z-10 flex flex-col mt-6 mb-6 ${idx > 2 ? 'items-end text-right' : 'items-start'}`}>
                    <span className="text-[10px] font-semibold text-white/30 tracking-wide font-mono">
                      /{link.handle}
                    </span>
                    <h4 className="text-lg font-extrabold tracking-tight text-white uppercase mt-1">
                      {link.statsCount}
                    </h4>
                    <p className="text-[9px] text-white/50 leading-relaxed font-normal mt-0.5">
                      {link.statsLabel}
                    </p>
                  </div>

                  {/* Card Footer: CTA */}
                  <div className={`relative z-10 flex justify-between items-center w-full border-t border-white/5 pt-4 mt-auto ${idx > 2 ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] font-semibold tracking-wider text-white/40 group-hover:text-white/60 transition-colors uppercase">
                      {link.action}
                    </span>
                    <span className="text-white/30 text-xs font-bold transition-transform group-hover:translate-x-1 duration-300">&rarr;</span>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Swipeable Track Layout */}
      <div className="md:hidden w-full overflow-x-auto pb-6 scrollbar-none snap-x px-4">
        <div className="flex gap-4 w-max px-2">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="snap-center shrink-0 w-[210px] h-[320px] bg-[#0c0c0d] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden shadow-xl relative active:scale-95 transition-transform"
            >
              <div className={`absolute inset-x-0 top-0 h-40 bg-gradient-to-b ${link.bgGlow} opacity-40`} />

              <div className="relative z-10 flex justify-between items-start w-full">
                <div className="w-9 h-9 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5">
                  {link.iconSvg}
                </div>
                <span className={`text-[7px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border border-white/5 bg-white/[0.01] ${link.colorText}`}>
                  {link.badgeText}
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-start mt-6 mb-6">
                <span className="text-[9px] font-semibold text-white/35 tracking-wide font-mono">
                  /{link.handle}
                </span>
                <h4 className="text-base font-extrabold tracking-tight text-white uppercase mt-1">
                  {link.statsCount}
                </h4>
                <p className="text-[8px] text-white/50 leading-relaxed font-normal mt-0.5">
                  {link.statsLabel}
                </p>
              </div>

              <div className="relative z-10 flex justify-between items-center w-full border-t border-white/5 pt-4 mt-auto">
                <span className="text-[9px] font-semibold tracking-wider text-white/40 uppercase">
                  {link.action}
                </span>
                <span className="text-white/35 text-xs">&rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
