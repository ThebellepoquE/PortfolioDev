import { useEffect, useState } from 'react';
import styles from './ScrollToTopButton.module.scss';

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 300);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      className={`${styles.button} ${isVisible ? styles.visible : ''}`.trim()}
      aria-label="Subir arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      type="button"
    >
      ↑
    </button>
  );
};
