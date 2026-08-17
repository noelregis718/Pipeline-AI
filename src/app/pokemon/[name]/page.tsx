'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { Pokemon } from '../../../types/pokemon';
import { fetchPokemonDetails } from '../../../services/pokeapi';
import { formatPokemonId, capitalize } from '../../../utils/format';
import { useFavorites } from '../../../hooks/useFavorites';
import ThemeToggle from '../../../components/ThemeToggle';
import styles from './page.module.css';

export default function PokemonDetails() {
  const { name } = useParams() as { name: string };
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await fetchPokemonDetails(name);
        setPokemon(data);
      } catch (err) {
        setError('Pokémon not found. Try searching for another Pokémon.');
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      loadDetails();
    }
  }, [name]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
      if (pokemon) {
        if (e.key === 'ArrowRight') {
          router.push(`/pokemon/${pokemon.id + 1}`);
        } else if (e.key === 'ArrowLeft' && pokemon.id > 1) {
          router.push(`/pokemon/${pokemon.id - 1}`);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, pokemon]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="skeleton" style={{ height: '600px' }}></div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Oops!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>{error}</p>
        <Link href="/" className={styles.backBtn} style={{ justifyContent: 'center' }}>
          <ArrowLeft size={20} /> Back to Explorer
        </Link>
      </div>
    );
  }

  const primaryType = pokemon.types[0].type.name;
  const rawImage = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
  const image = rawImage ? rawImage.replace('raw.githubusercontent.com/PokeAPI/sprites/master', 'cdn.jsdelivr.net/gh/PokeAPI/sprites@master') : null;

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => router.back()} className={styles.backBtn} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 0 }}>
          <ArrowLeft size={20} /> Back
        </button>
        <ThemeToggle />
      </div>

      <div className={styles.card}>
        <div 
          className={styles.header}
          style={{ backgroundColor: `var(--type-${primaryType})`, color: 'white' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className={styles.id} style={{ marginBottom: 0 }}>{formatPokemonId(pokemon.id)}</div>
            {isLoaded && (
              <button 
                onClick={() => toggleFavorite(pokemon.name)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: isFavorite(pokemon.name) ? '#ef4444' : 'rgba(255,255,255,0.7)',
                  transition: 'transform 0.2s',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                aria-label="Toggle Favorite"
              >
                <Heart fill={isFavorite(pokemon.name) ? '#ef4444' : 'none'} size={32} />
              </button>
            )}
          </div>
          
          <div className={styles.imageWrapper} style={{ position: 'relative' }}>
            {image && (
              <Image 
                src={image}
                alt={pokemon.name}
                fill
                sizes="200px"
                className={styles.image}
                priority
                unoptimized={true}
              />
            )}
          </div>

          <h1 className={styles.name}>{capitalize(pokemon.name)}</h1>
          
          <div className={styles.types}>
            {pokemon.types.map((typeInfo) => (
              <span 
                key={typeInfo.type.name}
                className={styles.typeBadge}
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
              >
                {typeInfo.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Height</div>
              <div className={styles.statValue}>{pokemon.height / 10} m</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Weight</div>
              <div className={styles.statValue}>{pokemon.weight / 10} kg</div>
            </div>
          </div>

          <div className={styles.baseStats}>
            <h2 className={styles.sectionTitle}>Base Stats</h2>
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name} className={styles.statRow}>
                <div className={styles.statName}>
                  {stat.stat.name.replace('-', ' ')}
                </div>
                <div className={styles.statNumber}>{stat.base_stat}</div>
                <div className={styles.statBarBg}>
                  <div 
                    className={styles.statBarFill}
                    style={{ 
                      width: `${Math.min(100, (stat.base_stat / 255) * 100)}%`,
                      backgroundColor: `var(--type-${primaryType})`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className={styles.sectionTitle}>Abilities</h2>
            <div className={styles.abilities}>
              {pokemon.abilities.map((ability) => (
                <div key={ability.ability.name} className={styles.abilityBadge}>
                  {ability.ability.name.replace('-', ' ')}
                  {ability.is_hidden && ' (Hidden)'}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.movesSection}>
            <h2 className={styles.sectionTitle}>Moves</h2>
            <div className={styles.movesContainer}>
              {pokemon.moves.map((moveInfo) => (
                <div key={moveInfo.move.name} className={styles.moveBadge}>
                  {moveInfo.move.name.replace(/-/g, ' ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
