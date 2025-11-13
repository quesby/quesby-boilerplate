const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

// Get default theme from HTML class (set by site.defaultVisualTheme)
const defaultTheme = root.classList.contains('dark') ? 'dark' : 'light';

// On startup: use saved preference or default theme (ignore system preference)
const savedTheme = localStorage.getItem('theme');

// Clear any existing theme classes first
root.classList.remove('dark');

if (savedTheme === 'dark') {
  root.classList.add('dark');
} else if (savedTheme === 'light') {
  // Light theme - no class needed
} else {
  // No saved preference, use default theme from site.json
  if (defaultTheme === 'dark') {
    root.classList.add('dark');
  }
  // Light theme requires no class
}

if (toggleBtn) {
  const cycleTheme = () => {
    const isDark = root.classList.contains('dark');
    let next;
    if (!isDark) {
      next = 'dark';
      root.classList.add('dark');
    } else {
      next = 'light';
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', next);
  };
  toggleBtn.addEventListener('click', cycleTheme);
}