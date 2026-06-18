import React from 'react';
import { motion } from 'framer-motion';

export default function SplitText({ children, className = '' }) {
  if (typeof children !== 'string') {
    return <span className={className}>{children}</span>;
  }

  const words = children.split(' ');

  const containerVars = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const childVars = {
    hidden: { y: '100%' },
    visible: {
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap overflow-hidden py-1 ${className}`}
      variants={containerVars}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <motion.span className="inline-block origin-top-left" variants={childVars}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
