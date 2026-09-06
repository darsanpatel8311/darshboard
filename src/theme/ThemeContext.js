import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_THEME_ID, isValidThemeId, THEME_STORAGE_KEY, themeMap, themeOptions } from './themes';

const ThemeContext = createContext(null);

const getStoredTheme = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME_ID;
  }

  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isValidThemeId(savedTheme) ? savedTheme : DEFAULT_THEME_ID;
  } catch (error) {
    return DEFAULT_THEME_ID;
  }
};

const getInitialTheme = () => {
  if (typeof document !== 'undefined') {
    const { theme } = document.documentElement.dataset;
    if (isValidThemeId(theme)) {
      return theme;
    }
  }

  return getStoredTheme();
};

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const activeTheme = themeMap[themeId] || themeMap[DEFAULT_THEME_ID];

    root.dataset.theme = activeTheme.id;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, activeTheme.id);
    } catch (error) {
      // Ignore storage failures and continue using the current session theme.
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', activeTheme.metaColor);
    }
  }, [themeId]);

  const value = useMemo(
    () => ({
      themeId,
      theme: themeMap[themeId] || themeMap[DEFAULT_THEME_ID],
      themes: themeOptions,
      setTheme: (nextThemeId) => {
        if (isValidThemeId(nextThemeId)) {
          setThemeId(nextThemeId);
        }
      },
    }),
    [themeId]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
};
