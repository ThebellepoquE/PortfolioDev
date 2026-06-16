import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ScrollToTopButton } from './components/ScrollToTopButton/ScrollToTopButton';
import { HomePage } from './pages/HomePage';

// Lazy load por ruta (code-splitting: cada página en su chunk)
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const ProjectPage = lazy(() => import('./pages/ProjectPage').then(m => ({ default: m.ProjectPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));

const PageFallback = () => <div className="loading-placeholder" />;

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}

/** Portfolio de Ione - @thebellepoque */
function App() {
  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <ScrollToTop />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={
            <Suspense fallback={<PageFallback />}>
              <BlogPage />
            </Suspense>
          } />
          <Route path="/blog/:slug" element={
            <Suspense fallback={<PageFallback />}>
              <BlogPostPage />
            </Suspense>
          } />
          <Route path="/proyecto/:id" element={
            <Suspense fallback={<PageFallback />}>
              <ProjectPage />
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<PageFallback />}>
              <NotFoundPage />
            </Suspense>
          } />
        </Routes>
      </main>
      <ScrollToTopButton />
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
