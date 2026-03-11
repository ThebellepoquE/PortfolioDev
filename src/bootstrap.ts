// Bootstrap de comportamiento que antes vivía en scripts inline del index.html

export function initThemeFromPreferences(): void {
  try {
    const stored = window.localStorage.getItem('theme');
    const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
    const theme = stored || (prefersLight ? 'light' : 'dark');
    document.documentElement.classList.add(theme);
  } catch {
    // Si algo falla (por ejemplo, localStorage bloqueado), no rompemos el render
  }
}

export function activateAsyncFonts(): void {
  const el = document.getElementById('fonts-async');
  if (el instanceof HTMLLinkElement) {
    el.media = 'all';
  }
}

