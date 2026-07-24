'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { DropdownMenuItem } from '../ui/dropdown-menu';

export function ThemeToggleItem() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('erm-prototype-theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  };

  return (
    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toggle(); }}>
      {dark ? <Sun className="text-muted-foreground" /> : <Moon className="text-muted-foreground" />}
      Dark theme
      {dark && <span className="ml-auto text-xs">✓</span>}
    </DropdownMenuItem>
  );
}
