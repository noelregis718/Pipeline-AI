'use client';

import { useEffect, useState } from 'react';
import { fetchPokemonList, fetchPokemonByType } from '../services/pokeapi';
import PokemonGrid from '../components/PokemonGrid';
import SearchBar from '../components/SearchBar';
import TypeFilter from '../components/TypeFilter';
import styles from './page.module.css';

const LIMIT = 20;

export default function Home() {
  const [pokemonNames, setPokemonNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const loadInitialPokemon = async () => {
    setLoading(true);
    try {
      if (selectedType) {
        const data = await fetchPokemonByType(selectedType);
        setPokemonNames(data.pokemon.map((p) => p.pokemon.name));
        setHasMore(false); // Disable pagination when filtering by type
      } else {
        const data = await fetchPokemonList(LIMIT, 0);
        setPokemonNames(data.results.map((p) => p.name));
        setOffset(LIMIT);
        setHasMore(!!data.next);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialPokemon();
  }, [selectedType]);

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const data = await fetchPokemonList(LIMIT, offset);
      setPokemonNames((prev) => [...prev, ...data.results.map((p) => p.name)]);
      setOffset(offset + LIMIT);
      setHasMore(!!data.next);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Pokémon Explorer</h1>
          <div className={styles.controls}>
            <SearchBar />
            <TypeFilter 
              selectedType={selectedType} 
              onTypeSelect={setSelectedType} 
            />
          </div>
        </div>

        {loading ? (
          <div className="skeleton" style={{ height: '500px', width: '100%' }}></div>
        ) : (
          <PokemonGrid 
            pokemonNames={pokemonNames} 
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loadingMore}
          />
        )}
      </div>
    </main>
  );
}
