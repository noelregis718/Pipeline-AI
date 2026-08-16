'use client';

import { useEffect, useState } from 'react';
import { fetchTypes } from '../services/pokeapi';
import styles from './TypeFilter.module.css';

interface TypeFilterProps {
  selectedType: string | null;
  onTypeSelect: (type: string | null) => void;
}

export default function TypeFilter({ selectedType, onTypeSelect }: TypeFilterProps) {
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchTypes();
        // Filter out some non-pokemon types returned by the API
        const validTypes = data.results
          .map(t => t.name)
          .filter(t => t !== 'unknown' && t !== 'shadow');
        setTypes(validTypes);
      } catch (error) {
        console.error(error);
      }
    };
    loadTypes();
  }, []);

  return (
    <div className={styles.container}>
      <button 
        className={`${styles.typeBtn} ${selectedType === null ? styles.active : ''}`}
        style={selectedType === null ? { backgroundColor: 'var(--text-primary)' } : {}}
        onClick={() => onTypeSelect(null)}
      >
        All
      </button>
      
      {types.map(type => (
        <button
          key={type}
          className={`${styles.typeBtn} ${selectedType === type ? styles.active : ''}`}
          style={selectedType === type ? { backgroundColor: `var(--type-${type})` } : {}}
          onClick={() => onTypeSelect(type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
