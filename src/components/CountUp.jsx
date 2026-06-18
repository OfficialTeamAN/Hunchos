import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

export default function CountUp({ end, duration = 1.5, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  useEffect(() => {
    if (!isInView) return;

    // Remove commas, dollar signs, and letters like 'K', '+' to get raw number
    const numericString = end.replace(/[^0-9.]/g, '');
    const endValue = parseFloat(numericString);
    
    if (isNaN(endValue)) {
      setCount(end);
      return;
    }

    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeProgress = progress * (2 - progress); // easeOutQuad
      
      const current = easeProgress * endValue;
      
      if (frame >= totalFrames) {
        clearInterval(counter);
        setCount(endValue);
      } else {
        setCount(current);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [isInView, end, duration]);

  const formatCount = () => {
    if (typeof count === 'string') return count;
    
    // Match suffix letters like 'K' or '+' from original end string
    const suffixMatches = end.match(/[A-Za-z+]+/);
    const suffixStr = suffixMatches ? suffixMatches[0] : suffix;
    
    // Check if original number was decimal
    const hasDecimal = end.includes('.');
    const formattedNum = hasDecimal 
      ? count.toFixed(1) 
      : Math.round(count).toLocaleString();

    return `${prefix}${formattedNum}${suffixStr}`;
  };

  return <span ref={ref}>{formatCount()}</span>;
}
