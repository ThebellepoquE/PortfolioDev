import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: '404 - No encontrado',
  description: 'Página no encontrada',
});

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__glow" />
      <div className="not-found__content">
        <span className="not-found__number">404</span>
        <h1 className="not-found__title">Te has perdido</h1>
        <p className="not-found__text">
          Esta ruta no existe. Quizás el enlace estaba roto o te has aventurado demasiado lejos.
        </p>
        <Link href="/" className="not-found__btn">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
