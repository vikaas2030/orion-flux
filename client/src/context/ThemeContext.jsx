import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('dark'); // 'dark' | 'light'
  const [accentColor, setAccentColor] = useState('purple'); // 'purple' | 'cyber' | 'emerald'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    document.documentElement.setAttribute('data-accent', accentColor);
  }, [themeMode, accentColor]);

  const toggleThemeMode = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleThemeMode, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
