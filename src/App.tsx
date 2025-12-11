import { lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

// Lazy load components below the fold
const Projects = lazy(() => import('./components/Projects').then(m => ({ default: m.Projects })));
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));

/** Portfolio de Ione - @thebellepoque */
function App() {
  return (
    <div className="min-h-screen bg-[#000000]">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<div className="min-h-[50vh]" />}>
          <Projects />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
