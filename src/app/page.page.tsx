import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="home-placeholder">
      <h1>Ione | Desarrolladora Web</h1>
      <p>Portfolio en proceso de migración a Next.js.</p>
      <Link href="/blog" className="btn-main">
        Ver blog
      </Link>
    </section>
  );
}
