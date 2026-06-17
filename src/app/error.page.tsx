'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }, [error]);

  return (
    <section className="error-boundary">
      <div className="error-content">
        <span className="error-icon">!</span>
        <h1>Puuuuuf... algo se ha roto</h1>
        <p>Parece que el código ha entrado en un bucle infinito de nostalgia o un error inesperado.</p>
        <button type="button" className="btn-main" onClick={reset}>
          Reintentar
        </button>
      </div>
    </section>
  );
}
