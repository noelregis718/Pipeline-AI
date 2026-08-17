'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './TypeFilter.module.css';

export type SortOption = 'ID' | 'Name' | 'Attack' | 'Speed' | 'HP';

interface SortDropdownProps {
  selectedSort: SortOption;
  onSortSelect: (sort: SortOption) => void;
}

export default function SortDropdown({ selectedSort, onSortSelect }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const options: SortOption[] = ['ID', 'Name', 'Attack', 'Speed', 'HP'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={containerRef}>
      <button 
        className={styles.dropdownButton} 
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>Sort: {selectedSort}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map(option => (
            <button
              key={option}
              className={`${styles.typeBtn} ${selectedSort === option ? styles.active : ''}`}
              style={selectedSort === option ? { backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', borderColor: 'transparent' } : {}}
              onClick={() => { onSortSelect(option); setIsOpen(false); }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
