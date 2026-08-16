import React from 'react';
import PokemonCard from './PokemonCard';
import styles from './PokemonGrid.module.css';

interface PokemonGridProps {
  pokemonNames: string[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export default function PokemonGrid({ 
  pokemonNames, 
  onLoadMore, 
  hasMore = false,
  loading = false
}: PokemonGridProps) {
  return (
    <div>
      <div className={styles.grid}>
        {pokemonNames.map((name) => (
          <PokemonCard key={name} name={name} />
        ))}
      </div>
      
      {hasMore && onLoadMore && (
        <div className={styles.loadMoreContainer}>
          <button 
            className={styles.loadMoreBtn} 
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Pokémon'}
          </button>
        </div>
      )}
    </div>
  );
}
