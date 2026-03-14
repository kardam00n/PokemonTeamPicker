'use client';

import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

type Theme = 'dark' | 'light';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  // Sync state with whatever the no-flash script already applied
  useEffect(() => {
    const rawStored = localStorage.getItem('theme');
    const stored = (rawStored === 'light' || rawStored === 'dark') ? rawStored : null;
    const resolved: Theme = stored ?? getSystemTheme();
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    localStorage.setItem('theme', next);
  }

  const isLight = theme === 'light';

  return (
    <button
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
    >
      {/* Moon icon */}
      <span className={`${styles.icon} ${!isLight ? styles.iconActive : styles.iconInactive}`}>
        🌙
      </span>

      {/* Sliding track */}
      <span className={styles.track} aria-hidden="true">
        <span className={`${styles.thumb} ${isLight ? styles.thumbLight : ''}`} />
      </span>

      {/* Sun icon */}
      <span className={`${styles.icon} ${isLight ? styles.iconActive : styles.iconInactive}`}>
        ☀️
      </span>
    </button>
  );
}
