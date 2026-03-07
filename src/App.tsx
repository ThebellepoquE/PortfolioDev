import { lazy, Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SEO } from './components/SEO';

// Lazy load components below the fold
const Projects = lazy(() => import('./components/Projects').then(m => ({ default: m.Projects })));
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const BlogList = lazy(() => import('./components/Blog/BlogList').then(m => ({ default: m.BlogList })));
const BlogPost = lazy(() => import('./components/Blog/BlogPost').then(m => ({ default: m.BlogPost })));
const ProjectPage = lazy(() => import('./pages/ProjectPage').then(m => ({ default: m.ProjectPage })));

/** Portfolio de Ione - @thebellepoque */
function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          {/* Home - Portfolio */}
          <Route path="/" element={
            <>
              <SEO
                title="Ione | Full-stack Developer"
                description="Portfolio de Ione: Desarrolladora Full-stack especializada en React, TypeScript y automatizaciones. Descubre mis proyectos y artículos sobre desarrollo."
                url="/"
                noSuffix
              />
              <Hero />
              <Suspense fallback={<div className="loading-placeholder" />}>
                <Projects />
                <Contact />
              </Suspense>
            </>
          } />
          
          {/* Blog routes */}
          <Route path="/blog" element={
            <>
              <SEO
                title="Blog"
                description="El Laberinto del Código: pensamientos sobre desarrollo, automatización y el ecosistema de JavaScript."
                url="/blog"
              />
              <Suspense fallback={<div className="loading-state"><p>Cargando...</p></div>}>
                <BlogList />
              </Suspense>
            </>
          } />
          <Route path="/blog/:slug" element={
            <Suspense fallback={<div className="loading-state"><p>Cargando...</p></div>}>
              <BlogPost />
            </Suspense>
          } />
          <Route path="/proyecto/:id" element={
            <Suspense fallback={<div className="loading-state"><p>Cargando...</p></div>}>
              <ProjectPage />
            </Suspense>
          } />

          {/* 404 - Catch all */}
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

