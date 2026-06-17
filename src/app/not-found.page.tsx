import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="not-found">
      <h1>404</h1>
      <p>Página no encontrada.</p>
      <Link href="/" className="btn-main">
        Volver al inicio
      </Link>
    </section>
  );
}
