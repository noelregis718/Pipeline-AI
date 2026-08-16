'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pokemon } from '../types/pokemon';
import { fetchPokemonDetails } from '../services/pokeapi';
import { formatPokemonId, capitalize } from '../utils/format';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  name: string;
}

export default function PokemonCard({ name }: PokemonCardProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

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
  const image = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  return (
    <Link 
      href={`/pokemon/${pokemon.name}`} 
      className={styles.card} 
      style={{ color: `var(--type-${primaryType})` }}
    >
      <div className={styles.cardBackground}></div>
      <div className={styles.id}>{formatPokemonId(pokemon.id)}</div>
      
      <div className={styles.imageContainer}>
        {image && (
          <Image 
            src={image} 
            alt={pokemon.name}
            fill
            sizes="120px"
            className={styles.image}
            priority={pokemon.id <= 20}
          />
        )}
      </div>
      
      <h2 className={styles.name} style={{ color: 'var(--text-primary)' }}>
        {capitalize(pokemon.name)}
      </h2>
      
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
