'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Scroll-reveal animation with a stable initial render.
 * The initial values must not depend on browser-only media queries:
 * server and client need matching markup during hydration.
 */
export default function Revealer({ children, className = '', delay = 0 }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.13 }}
      transition={{
        duration: reducedMotion ? 0 : 0.82,
        ease: [0.2, 0.7, 0.2, 1],
        delay: reducedMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
