import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';
import { Navbar } from '@/components/Navbar'; // Assuming Navbar should be here

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Projects />
      <Contact />
    </>
  );
}
