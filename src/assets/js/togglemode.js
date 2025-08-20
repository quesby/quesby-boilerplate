  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // All'avvio: usa preferenza salvata o sistema
  if (localStorage.getItem('theme') === 'dark' || 
     (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
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
