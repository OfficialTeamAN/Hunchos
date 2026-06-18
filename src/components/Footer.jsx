import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-bg-darker border-t border-white/5 py-12 px-6 md:px-12 text-white/40 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12 items-start">
        <span className="inline-block border border-white/10 rounded px-3 py-1 text-xs font-bold tracking-widest text-white/60 shrink-0">
          18+
        </span>
        <div className="text-[10px] leading-relaxed max-w-4xl uppercase tracking-wider font-semibold">
          <strong className="text-white/60 mr-1">RESPONSIBLE GAMING</strong> | Gamble Responsibly | BeGambleAware. 
          Most people gamble for fun and enjoyment. Do not think of gambling as a way to make money. 
          Only gamble with money you can afford to lose. Set a money and time limit in advance. 
          Never chase your losses. Don't use gambling to distract yourself from everyday problems.
        </div>
      </div>
    </footer>
  );
}
