import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useActiveSection(sectionIds: string[]): string | null {
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const ratiosRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (pathname !== '/') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection(null);
      return;
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const ratios = ratiosRef.current;
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.intersectionRatio);
        });

        let bestSection: string | null = null;
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestSection = id;
          }
        }

        // Only update when section is clearly visible (>= threshold).
        // Preserves last active section on overscroll — sticky behavior.
        if (bestRatio >= 0.3) {
          setActiveSection(bestSection);
        }
      },
      { threshold: 0.3 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname, sectionIds]);

  return activeSection;
}
