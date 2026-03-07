import { lazy, Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';

// Lazy load por ruta (code-splitting: cada página en su chunk)
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const ProjectPage = lazy(() => import('./pages/ProjectPage').then(m => ({ default: m.ProjectPage })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));

const PageFallback = () => <div className="loading-placeholder" />;

/** Portfolio de Ione - @thebellepoque */
function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={
            <Suspense fallback={<PageFallback />}>
              <HomePage />
            </Suspense>
          } />
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
            <div className="error-boundary">
              <div className="error-content">
                <span className="error-icon">🕵️‍♀️</span>
                <h1>404 - No hay nada aquí</h1>
                <p>Esa ruta no existe. Quizás el enlace estaba roto o te has aventurado demasiado lejos.</p>
                <Link className="btn-main" to="/">
                  Volver al inicio
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
