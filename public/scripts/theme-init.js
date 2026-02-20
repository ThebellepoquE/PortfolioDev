(function() {
  const theme = localStorage.getItem('theme') || 
               (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.classList.add(theme);
})();
