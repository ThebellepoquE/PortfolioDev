import type { Metadata, Viewport } from 'next';
import '@/styles/main.scss';
import { SITE_CONFIG } from '@/lib/config';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton/ScrollToTopButton';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Ione | Desarrolladora Web',
  description:
    'Portfolio de Ione: Desarrolladora Web. Python, JavaScript, React, TypeScript & Automatizaciones.',
  metadataBase: new URL(SITE_CONFIG.baseUrl),
};

export const viewport: Viewport = {
  themeColor: '#FF1493',
  colorScheme: 'dark',
};

const THEME_SCRIPT = `
(function () {
  try {
    let theme = localStorage.getItem('theme');
    if (theme !== 'dark' && theme !== 'light') {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.classList.add(theme);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <Navbar />
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <ScrollToTopButton />
        <Footer />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </body>
    </html>
  );
}
