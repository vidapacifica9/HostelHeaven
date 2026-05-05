import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  primaryColor: '#4F46E5', // default primary
  setTheme: () => {},
  setPrimaryColor: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#4F46E5');

  // persist to localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const storedColor = localStorage.getItem('primaryColor');
    if (storedTheme) setTheme(storedTheme);
    if (storedColor) setPrimaryColor(storedColor);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
