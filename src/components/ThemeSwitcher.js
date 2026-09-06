import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../theme/ThemeContext';

const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef(null);
  const { theme, themeId, themes, setTheme } = useTheme();

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="theme_switcher" ref={switcherRef}>
      <button
        type="button"
        className={`theme_switcher__trigger ${isOpen ? 'is-open' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Theme options. Current theme: ${theme.label}`}
        data-tooltip={`Theme ${theme.label}`}
        onClick={() => setIsOpen((currentState) => !currentState)}
      >
        <span className="theme_switcher__trigger-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>
        </span>
      </button>

      <div
        className={`theme_switcher__panel ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-label="Theme options"
      >
        <div className="theme_switcher__panel-head">
          <p className="theme_switcher__panel-title">Theme Options</p>
          <span className="theme_switcher__panel-meta">{themes.length} curated styles</span>
        </div>

        <div className="theme_switcher__list">
          {themes.map((item) => {
            const isActive = item.id === themeId;

            return (
              <button
                key={item.id}
                type="button"
                className={`theme_switcher__option ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  setTheme(item.id);
                  setIsOpen(false);
                }}
              >
                <span
                  className="theme_switcher__preview"
                  style={{
                    '--theme-preview-primary': item.preview.primary,
                    '--theme-preview-surface': item.preview.surface,
                    '--theme-preview-accent': item.preview.accent,
                  }}
                  aria-hidden="true"
                />
                <span className="theme_switcher__option-copy">
                  <span className="theme_switcher__option-name">{item.label}</span>
                  <span className="theme_switcher__option-description">{item.description}</span>
                </span>
                <span className="theme_switcher__option-check" aria-hidden="true">
                  {isActive ? 'Active' : 'Apply'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
