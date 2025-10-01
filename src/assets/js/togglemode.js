const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

// Get default theme from HTML class (set by site.defaultVisualTheme)
const defaultTheme = root.classList.contains('dark') ? 'dark' : 
                    root.classList.contains('sepia') ? 'sepia' : 'light';

// On startup: use saved preference, system preference, or default theme
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Clear any existing theme classes first
root.classList.remove('dark', 'sepia');

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  root.classList.add('dark');
} else if (savedTheme === 'sepia') {
  root.classList.add('sepia');
} else if (savedTheme === 'light') {
  // Light theme - no class needed
} else {
  // No saved preference, use default theme
  if (defaultTheme === 'dark') {
    root.classList.add('dark');
  } else if (defaultTheme === 'sepia') {
    root.classList.add('sepia');
  }
  // Light theme requires no class
}

if (toggleBtn) {
  const cycleTheme = () => {
    const isDark = root.classList.contains('dark');
    const isSepia = root.classList.contains('sepia');
    let next;
    if (!isDark && !isSepia) {
      next = 'dark';
      root.classList.add('dark');
      root.classList.remove('sepia');
    } else if (isDark) {
      next = 'sepia';
      root.classList.remove('dark');
      root.classList.add('sepia');
    } else {
      next = 'light';
      root.classList.remove('sepia');
    }
    localStorage.setItem('theme', next);
  };
  toggleBtn.addEventListener('click', cycleTheme);
}