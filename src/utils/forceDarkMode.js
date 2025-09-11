// src/utils/forceDarkMode.js
export const initializeDarkMode = () => {
  // Set data-theme to dark
  document.documentElement.setAttribute('data-theme', 'dark');
  
  // Add dark class for Tailwind
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
  
  // Set color scheme
  document.documentElement.style.colorScheme = 'dark';
  
  // Save preference
  localStorage.setItem('theme', 'dark');
  
  // Override any system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = () => {
    // Always force dark regardless of system change
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.colorScheme = 'dark';
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  return () => mediaQuery.removeEventListener('change', handleChange);
};