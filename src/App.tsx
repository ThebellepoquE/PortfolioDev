import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

// Lazy load components below the fold
const Projects = lazy(() => import('./components/Projects').then(m => ({ default: m.Projects })));
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const BlogList = lazy(() => import('./components/Blog/BlogList').then(m => ({ default: m.BlogList })));
const BlogPost = lazy(() => import('./components/Blog/BlogPost').then(m => ({ default: m.BlogPost })));

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
              <Hero />
              <Suspense fallback={<div className="loading-placeholder" />}>
                <Projects />
                <Contact />
              </Suspense>
            </>
          } />
          
          {/* Blog routes */}
          <Route path="/blog" element={
            <Suspense fallback={<div className="loading-state"><p>Cargando...</p></div>}>
              <BlogList />
            </Suspense>
          } />
          <Route path="/blog/:slug" element={
            <Suspense fallback={<div className="loading-state"><p>Cargando...</p></div>}>
              <BlogPost />
            </Suspense>
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

