import type { ReactNode } from 'react';

interface SectionTitleProps {
  title?: string;
  children?: ReactNode;
  className?: string;
}

export function SectionTitle({ title, children, className = '' }: SectionTitleProps) {
  return (
    <h2 className={`title-neon text-gradient ${className}`.trim()}>
      {title || children}
    </h2>
  );
}
