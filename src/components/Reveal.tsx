'use client';

import { type ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

interface RevealProps {
  children: ReactNode;
  delay?: number;
}

/** Wrapper que aplica fade-up reveal con IntersectionObserver. Encapsula useInView para evitar hooks-in-loop. */
export function Reveal({ children, delay = 0 }: RevealProps) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={isInView ? 'reveal revealed' : 'reveal'}
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
