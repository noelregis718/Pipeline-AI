'use client';

import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSlash = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleSlash);
    return () => window.removeEventListener('keydown', handleSlash);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  return (
    <form className={styles.searchContainer} onSubmit={handleSearch}>
      <Search className={styles.icon} size={20} />
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder="Search Pokémon..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
}
