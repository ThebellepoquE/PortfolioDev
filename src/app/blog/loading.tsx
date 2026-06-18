/**
 * Blog section Suspense fallback — renders skeleton blog cards.
 * Shown while getAllPosts() resolves in the blog Server Component.
 */
export default function BlogLoading() {
  return (
    <section className="blog-list">
      <div className="blog-list__container">
        <div className="blog-list__grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="blog-card blog-card--skeleton" aria-hidden="true">
              <div className="blog-card__content">
                <span className="skeleton" style={{ width: '60%', height: '1.25rem' }} />
                <span className="skeleton" style={{ width: '40%', height: '0.875rem', marginTop: '0.75rem' }} />
                <span className="skeleton" style={{ width: '100%', height: '3rem', marginTop: '1rem' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
