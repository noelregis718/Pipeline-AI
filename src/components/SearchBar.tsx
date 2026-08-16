'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/pokemon/${query.trim().toLowerCase()}`);
    }
  };

  return (
    <form className={styles.searchContainer} onSubmit={handleSearch}>
      <Search className={styles.icon} size={20} />
      <input
        type="text"
        className={styles.input}
        placeholder="Search Pokémon..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
}
