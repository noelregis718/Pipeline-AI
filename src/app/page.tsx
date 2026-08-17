'use client';

import { useEffect, useState } from 'react';
import { fetchPokemonList, fetchPokemonByType } from '../services/pokeapi';
import PokemonGrid from '../components/PokemonGrid';
import SearchBar from '../components/SearchBar';
import TypeFilter from '../components/TypeFilter';
import ThemeToggle from '../components/ThemeToggle';
import SortDropdown, { SortOption } from '../components/SortDropdown';
import CompareTray from '../components/CompareTray';
import CompareModal from '../components/CompareModal';
import pokemonStatsData from '../data/pokemon_stats.json';
import styles from './page.module.css';

const statsDB: Record<string, {hp?: number, attack?: number, speed?: number}> = pokemonStatsData;
const LIMIT = 20;

export default function Home() {
  const [pokemonNames, setPokemonNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);
  const [typeFilteredNames, setTypeFilteredNames] = useState<string[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [enterError, setEnterError] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('ID');
  const [visibleCount, setVisibleCount] = useState(LIMIT);
  const [compareQueue, setCompareQueue] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const toggleCompare = (name: string) => {
    setCompareQueue(prev => {
      if (prev.includes(name)) return prev.filter(n => n !== name);
      if (prev.length >= 2) return [prev[0], name];
      return [...prev, name];
    });
  };

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'c' && compareQueue.length === 2) {
        setIsCompareOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [compareQueue.length]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const allData = await fetchPokemonList(10000, 0);
        setAllPokemonNames(allData.results.map((p) => p.name));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchType = async () => {
      if (!selectedType) {
        setTypeFilteredNames(null);
        return;
      }
      setLoading(true);
      try {
        const data = await fetchPokemonByType(selectedType);
        setTypeFilteredNames(data.pokemon.map((p) => p.pokemon.name));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchType();
  }, [selectedType]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + LIMIT);
  };

  const handleSearchSubmit = () => {
    const filtered = allPokemonNames.filter(name => name.includes(searchQuery.toLowerCase().trim()));
    if (filtered.length === 0) {
      setEnterError(true);
    }
  };

  const processedNames = (() => {
    let list = typeFilteredNames !== null ? typeFilteredNames : allPokemonNames;
    
    if (searchQuery.trim().length > 0) {
      list = list.filter(name => name.includes(searchQuery.toLowerCase().trim()));
    }

    if (selectedSort === 'ID') {
      return list; // default order from API
    }

    const sorted = [...list];
    
    if (selectedSort === 'Name') {
      sorted.sort((a, b) => a.localeCompare(b));
    } else {
      sorted.sort((a, b) => {
        const statsA = statsDB[a] || { attack: 0, speed: 0, hp: 0 };
        const statsB = statsDB[b] || { attack: 0, speed: 0, hp: 0 };
        
        let valA = 0;
        let valB = 0;
        
        if (selectedSort === 'Attack') {
          valA = statsA.attack || 0;
          valB = statsB.attack || 0;
        } else if (selectedSort === 'Speed') {
          valA = statsA.speed || 0;
          valB = statsB.speed || 0;
        } else if (selectedSort === 'HP') {
          valA = statsA.hp || 0;
          valB = statsB.hp || 0;
        }
        
        return valB - valA;
      });
    }
    return sorted;
  })();

  const visibleNames = processedNames.slice(0, visibleCount);
  const currentHasMore = visibleCount < processedNames.length;

  return (
    <main className={styles.main}>
      <a href="#pokemon-grid" className={styles.skipLink}>Skip to Pokémon Grid</a>
      <div className="container">
        <div className={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 className={styles.title} style={{ marginBottom: 0 }}>Pokémon Explorer</h1>
            <ThemeToggle />
          </div>
          <div className={styles.controls}>
            <SearchBar 
              value={searchQuery} 
              onChange={(v) => { setSearchQuery(v); setEnterError(false); }} 
              onSubmit={handleSearchSubmit} 
            />
            <TypeFilter 
              selectedType={selectedType} 
              onTypeSelect={setSelectedType} 
            />
            <SortDropdown 
              selectedSort={selectedSort}
              onSortSelect={setSelectedSort}
            />
          </div>
        </div>

        {loading ? (
          <div className="skeleton" style={{ height: '500px', width: '100%' }}></div>
        ) : enterError ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '1.25rem' }}>
              Pokémon not found. Please check your spelling.
            </p>
          </div>
        ) : processedNames.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--text-primary)' }}>Oops!</h2>
            <p>Pokémon not found. Please check your spelling.</p>
          </div>
        ) : (
          <PokemonGrid 
            pokemonNames={visibleNames} 
            onLoadMore={handleLoadMore}
            hasMore={currentHasMore}
            loading={loadingMore}
            selectedSort={selectedSort}
            compareQueue={compareQueue}
            onToggleCompare={toggleCompare}
          />
        )}
      </div>

      <CompareTray 
        queue={compareQueue} 
        onRemove={toggleCompare} 
        onClear={() => setCompareQueue([])} 
        onCompare={() => setIsCompareOpen(true)} 
      />

      {isCompareOpen && (
        <CompareModal 
          names={compareQueue} 
          onClose={() => setIsCompareOpen(false)} 
        />
      )}
    </main>
  );
}
