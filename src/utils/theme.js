/**
 * Theme Manager
 * Handles theme switching between light and dark modes
 */
class ThemeManager {
  /**
   * Initialize the theme manager
   * Sets the initial theme based on user preference or previous selection
   */
  static initialize() {
    // Check if a theme preference is stored in localStorage
    const storedTheme = localStorage.getItem('theme');
    // Or check if user prefers dark mode at the system level
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set the initial theme
    const initialTheme = storedTheme || (prefersDarkMode ? 'dark' : 'light');
    ThemeManager.setTheme(initialTheme);
    
    // Set up theme toggle event listeners after header component is loaded
    document.addEventListener('componentLoaded', (e) => {
      if (e.detail.id === 'header-container') {
        ThemeManager.setupToggle();
      }
    });
    
    // Also try to set up immediately in case header already exists
    ThemeManager.setupToggle();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        // Only auto-switch if user hasn't explicitly chosen a theme
        ThemeManager.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  /**
   * Set up the theme toggle button event listener
   */
  static setupToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      // Update the icon to match current theme
      ThemeManager.updateToggleIcon();
      
      // Add click event listener
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        ThemeManager.setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      });
    }
  }
  
  /**
   * Set the current theme
   * @param {string} theme - The theme to set ('light' or 'dark')
   */
  static setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    ThemeManager.updateToggleIcon();
  }
  
  /**
   * Update the theme toggle icon based on current theme
   */
  static updateToggleIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    
    if (currentTheme === 'dark') {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      themeToggle.setAttribute('aria-label', '切换到亮色模式');
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      themeToggle.setAttribute('aria-label', '切换到暗色模式');
    }
  }
}

// Initialize the theme manager when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.initialize();
});

// Export the ThemeManager class
export default ThemeManager;

// Make the ThemeManager available globally
window.ThemeManager = ThemeManager; 