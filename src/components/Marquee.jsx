import React from 'react';

export default function Marquee({ text }) {
  // We duplicate the text to ensure it extends beyond the screen width for loop seamlessness
  const marqueeItems = Array(6).fill(text);

  return (
    <div className="relative w-full overflow-hidden bg-bg-light border-y border-white/5 py-4 flex select-none">
      <div className="animate-marquee whitespace-nowrap flex items-center shrink-0">
        {marqueeItems.map((item, idx) => (
          <span key={idx} className="inline-flex items-center text-[10px] md:text-xs font-bold tracking-widest text-white/50 mx-4 uppercase">
            {item}
            <span className="ml-8 text-accent">&bull;</span>
          </span>
        ))}
      </div>
      <div className="animate-marquee whitespace-nowrap flex items-center shrink-0" aria-hidden="true">
        {marqueeItems.map((item, idx) => (
          <span key={`dup-${idx}`} className="inline-flex items-center text-[10px] md:text-xs font-bold tracking-widest text-white/50 mx-4 uppercase">
            {item}
            <span className="ml-8 text-accent">&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
