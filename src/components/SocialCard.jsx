import React from 'react';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

export default function SocialCard({ platform, href, action, iconSvg }) {
  const getColors = () => {
    switch (platform.toLowerCase()) {
      case 'kick':
        return {
          hoverBorder: 'group-hover:border-[#53fc18]/30',
          accent: 'bg-[#53fc18]',
          glow: 'rgba(83, 252, 24, 0.12)',
          glowText: 'text-[#53fc18]',
          bgGlow: 'from-[#53fc18]/5 to-transparent',
        };
      case 'youtube':
        return {
          hoverBorder: 'group-hover:border-[#ff0000]/30',
          accent: 'bg-[#ff0000]',
          glow: 'rgba(255, 0, 0, 0.12)',
          glowText: 'text-[#ff0000]',
          bgGlow: 'from-[#ff0000]/5 to-transparent',
        };
      case 'discord':
        return {
          hoverBorder: 'group-hover:border-[#5865F2]/30',
          accent: 'bg-[#5865F2]',
          glow: 'rgba(88, 101, 242, 0.12)',
          glowText: 'text-[#5865F2]',
          bgGlow: 'from-[#5865F2]/5 to-transparent',
        };
      case 'x':
        return {
          hoverBorder: 'group-hover:border-white/30',
          accent: 'bg-white',
          glow: 'rgba(255, 255, 255, 0.12)',
          glowText: 'text-white',
          bgGlow: 'from-white/5 to-transparent',
        };
      case 'instagram':
        return {
          hoverBorder: 'group-hover:border-[#E1306C]/30',
          accent: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040]',
          glow: 'rgba(225, 48, 108, 0.12)',
          glowText: 'text-[#E1306C]',
          bgGlow: 'from-[#E1306C]/5 to-transparent',
        };
      default:
        return {
          hoverBorder: 'group-hover:border-accent/30',
          accent: 'bg-accent',
          glow: 'rgba(230, 57, 70, 0.12)',
          glowText: 'text-accent',
          bgGlow: 'from-accent/5 to-transparent',
        };
    }
  };

  const colors = getColors();

  return (
    <div className="w-full h-full">
      <TiltCard className="w-full h-full">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative flex items-center justify-between p-6 bg-bg-light border border-white/5 rounded-xl overflow-hidden transition-all duration-500 h-full ${colors.hoverBorder}`}
          style={{
            boxShadow: `0 4px 30px rgba(0, 0, 0, 0.4)`
          }}
        >
          {/* Sweeping light glint sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          
          {/* Platform Glow Backdrop */}
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.bgGlow} opacity-30 group-hover:opacity-75 transition-opacity`} />
          
          <div className="flex items-center gap-4 relative z-10">
            {/* Animated Icon Frame */}
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 group-hover:bg-white/5 group-hover:border-white/10 transition-all duration-300 transform group-hover:scale-105">
              {iconSvg}
            </div>
            
            <div className="flex flex-col">
              <span className={`text-[8px] font-semibold tracking-[0.15em] uppercase opacity-55 group-hover:opacity-100 transition-opacity ${colors.glowText}`}>
                {platform}
              </span>
              <span className="text-[11px] font-bold tracking-wider text-white mt-0.5 uppercase">
                {action}
              </span>
            </div>
          </div>
          
          {/* Arrow Shift Animation */}
          <span 
            className="text-white/20 group-hover:text-white transition-all duration-500 text-lg relative z-10"
            style={{
              textShadow: `0 0 10px ${colors.glow}`
            }}
          >
            <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">
              &rarr;
            </span>
          </span>

          {/* Glowing bottom line */}
          <div className={`absolute bottom-0 left-0 right-0 h-[2px] w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${colors.accent}`} />
        </a>
      </TiltCard>
    </div>
  );
}
