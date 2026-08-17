'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Swords } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import { fetchPokemonDetails } from '../services/pokeapi';
import { formatPokemonId, capitalize } from '../utils/format';
import { useFavorites } from '../hooks/useFavorites';
import { SortOption } from './SortDropdown';
import { announce } from './AriaAnnouncer';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  name: string;
  selectedSort?: SortOption;
  isComparing?: boolean;
  onToggleCompare?: () => void;
}

export default function PokemonCard({ name, selectedSort, isComparing, onToggleCompare }: PokemonCardProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();

  useEffect(() => {
    let isMounted = true;
    const loadPokemon = async () => {
      try {
        const data = await fetchPokemonDetails(name);
        if (isMounted) {
          setPokemon(data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) setLoading(false);
      }
    };
    loadPokemon();
    return () => { isMounted = false; };
  }, [name]);

  if (loading || !pokemon) {
    return <div className={`${styles.card} ${styles.skeletonCard} skeleton`}></div>;
  }

  const primaryType = pokemon.types[0].type.name;
  const rawImage = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
  const image = rawImage ? rawImage.replace('raw.githubusercontent.com/PokeAPI/sprites/master', 'cdn.jsdelivr.net/gh/PokeAPI/sprites@master') : null;

  return (
    <Link
      href={`/pokemon/${pokemon.name}`}
      className={styles.card}
      style={{ color: `var(--type-${primaryType})` }}
    >
      <div className={styles.cardBackground}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', position: 'relative', zIndex: 10, width: '100%' }}>
        <div className={styles.id} style={{ marginBottom: 0 }}>{formatPokemonId(pokemon.id)}</div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCompare();
                announce(isComparing ? `${capitalize(pokemon.name)} removed from compare list` : `${capitalize(pokemon.name)} added to compare list`);
              }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: isComparing ? '#3b82f6' : 'var(--text-secondary)',
                transition: 'transform 0.2s, color 0.2s',
                padding: '4px'
              }}
              aria-label="Toggle Compare"
            >
              <Swords size={22} />
            </button>
          )}

          {isLoaded && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(pokemon.name);
                announce(isFavorite(pokemon.name) ? `${capitalize(pokemon.name)} removed from favorites` : `${capitalize(pokemon.name)} added to favorites`);
              }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: isFavorite(pokemon.name) ? '#ef4444' : 'var(--text-secondary)',
                transition: 'transform 0.2s, color 0.2s',
                transform: 'scale(1)',
                padding: '4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              aria-label="Toggle Favorite"
            >
              <Heart fill={isFavorite(pokemon.name) ? '#ef4444' : 'none'} size={24} />
            </button>
          )}
        </div>
      </div>

      <div className={styles.imageContainer} style={{ position: 'relative' }}>
        {image && (
          <Image
            src={image}
            alt={pokemon.name}
            fill
            sizes="120px"
            className={styles.image}
            priority={pokemon.id <= 20}
            unoptimized={true}
          />
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px', zIndex: 10, position: 'relative' }}>
        <h2 className={styles.name} style={{ color: 'var(--text-primary)', marginBottom: 0 }}>
          {capitalize(pokemon.name)}
        </h2>
        {selectedSort && ['Attack', 'Speed', 'HP'].includes(selectedSort) && (
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: 800, 
            padding: '2px 8px', 
            borderRadius: '12px', 
            backgroundColor: `var(--type-${primaryType})`, 
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {selectedSort.substring(0,3).toUpperCase()} {pokemon.stats.find(s => s.stat.name === selectedSort.toLowerCase())?.base_stat || 0}
          </span>
        )}
      </div>

      <div className={styles.types}>
        {pokemon.types.map((typeInfo) => (
          <span
            key={typeInfo.type.name}
            className={styles.typeBadge}
            style={{ backgroundColor: `var(--type-${typeInfo.type.name})` }}
          >
            {typeInfo.type.name}
          </span>
        ))}
      </div>
    </Link>
  );
}
