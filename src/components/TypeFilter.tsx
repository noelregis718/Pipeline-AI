'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchTypes } from '../services/pokeapi';
import styles from './TypeFilter.module.css';

interface TypeFilterProps {
  selectedType: string | null;
  onTypeSelect: (type: string | null) => void;
}

export default function TypeFilter({ selectedType, onTypeSelect }: TypeFilterProps) {
  const [types, setTypes] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchTypes();
        const validTypes = data.results
          .map(t => t.name)
          .filter(t => t !== 'unknown' && t !== 'shadow');
        setTypes(validTypes);
      } catch (error) {
        console.error(error);
      }
    };
    loadTypes();

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
        <span>Filter: {selectedType ? selectedType : 'All'}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button 
            className={`${styles.typeBtn} ${selectedType === null ? styles.active : ''}`}
            onClick={() => { onTypeSelect(null); setIsOpen(false); }}
            style={selectedType === null ? { backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' } : {}}
          >
            All
          </button>
          
          {types.map(type => (
            <button
              key={type}
              className={`${styles.typeBtn} ${selectedType === type ? styles.active : ''}`}
              style={selectedType === type ? { backgroundColor: `var(--type-${type})`, color: 'white', borderColor: 'transparent' } : {}}
              onClick={() => { onTypeSelect(type); setIsOpen(false); }}
            >
              {type}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
