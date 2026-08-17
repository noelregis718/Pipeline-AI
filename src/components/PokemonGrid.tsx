import React from 'react';
import PokemonCard from './PokemonCard';
import { SortOption } from './SortDropdown';
import styles from './PokemonGrid.module.css';

interface PokemonGridProps {
  pokemonNames: string[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  selectedSort?: SortOption;
  compareQueue?: string[];
  onToggleCompare?: (name: string) => void;
}

export default function PokemonGrid({ 
  pokemonNames, 
  onLoadMore, 
  hasMore = false,
  loading = false,
  selectedSort,
  compareQueue = [],
  onToggleCompare
}: PokemonGridProps) {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const grid = e.currentTarget.parentElement;
    if (!grid) return;
    const cards = Array.from(grid.children) as HTMLElement[];
    
    let nextIndex = -1;
    if (e.key === 'ArrowRight') {
      nextIndex = index + 1;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = index - 1;
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const currentRect = cards[index].getBoundingClientRect();
      if (e.key === 'ArrowDown') {
        nextIndex = cards.findIndex((c, i) => i > index && c.getBoundingClientRect().top > currentRect.bottom - 10 && Math.abs(c.getBoundingClientRect().left - currentRect.left) < 50);
      } else {
        for (let i = index - 1; i >= 0; i--) {
          if (cards[i].getBoundingClientRect().bottom < currentRect.top + 10 && Math.abs(cards[i].getBoundingClientRect().left - currentRect.left) < 50) {
            nextIndex = i; break;
          }
        }
      }
    }
    
    if (nextIndex >= 0 && nextIndex < cards.length) {
      e.preventDefault();
      const link = cards[nextIndex].querySelector('a');
      link?.focus();
    }
  };

  return (
    <div>
      <div id="pokemon-grid" className={styles.grid}>
        {pokemonNames.map((name, index) => (
          <div key={name} onKeyDown={(e) => handleKeyDown(e, index)}>
            <PokemonCard 
            key={name} 
            name={name} 
            selectedSort={selectedSort} 
            isComparing={compareQueue.includes(name)}
            onToggleCompare={onToggleCompare ? () => onToggleCompare(name) : undefined}
          />
          </div>
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
