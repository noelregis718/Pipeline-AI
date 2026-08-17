'use client';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Pokemon } from '../types/pokemon';
import { fetchPokemonDetails } from '../services/pokeapi';
import { capitalize } from '../utils/format';
import styles from './CompareModal.module.css';

interface CompareModalProps {
  names: string[];
  onClose: () => void;
}

export default function CompareModal({ names, onClose }: CompareModalProps) {
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null);
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (names.length !== 2) return;
    
    const loadBoth = async () => {
      setLoading(true);
      try {
        const [p1, p2] = await Promise.all([
          fetchPokemonDetails(names[0]),
          fetchPokemonDetails(names[1])
        ]);
        setPokemon1(p1);
        setPokemon2(p2);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadBoth();
  }, [names]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (names.length !== 2) return null;

  const getStat = (p: Pokemon, statName: string) => p.stats.find(s => s.stat.name === statName)?.base_stat || 0;

  const compareStat = (statName: string, label: string) => {
    const val1 = getStat(pokemon1!, statName);
    const val2 = getStat(pokemon2!, statName);
    const max = Math.max(val1, val2);
    
    return (
      <div className={styles.statRow} key={statName}>
        <div className={`${styles.statVal} ${val1 === max && val1 !== val2 ? styles.winner : ''}`}>{val1}</div>
        <div className={styles.statLabel}>{label}</div>
        <div className={`${styles.statVal} ${val2 === max && val1 !== val2 ? styles.winner : ''}`}>{val2}</div>
      </div>
    );
  };

  const getImage = (p: Pokemon) => {
    const raw = p.sprites.other['official-artwork'].front_default || p.sprites.front_default;
    return raw ? raw.replace('raw.githubusercontent.com/PokeAPI/sprites/master', 'cdn.jsdelivr.net/gh/PokeAPI/sprites@master') : '';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
        
        {loading || !pokemon1 || !pokemon2 ? (
          <div className={styles.loading}>Loading comparison...</div>
        ) : (
          <div className={styles.comparison}>
            <div className={styles.headers}>
              <div className={styles.headerItem}>
                <Image src={getImage(pokemon1)} alt={pokemon1.name} width={120} height={120} unoptimized />
                <h3 className={styles.pokeName} style={{ color: `var(--type-${pokemon1.types[0].type.name})` }}>{capitalize(pokemon1.name)}</h3>
              </div>
              <div className={styles.vs}>VS</div>
              <div className={styles.headerItem}>
                <Image src={getImage(pokemon2)} alt={pokemon2.name} width={120} height={120} unoptimized />
                <h3 className={styles.pokeName} style={{ color: `var(--type-${pokemon2.types[0].type.name})` }}>{capitalize(pokemon2.name)}</h3>
              </div>
            </div>

            <div className={styles.stats}>
              {compareStat('hp', 'HP')}
              {compareStat('attack', 'Attack')}
              {compareStat('defense', 'Defense')}
              {compareStat('special-attack', 'Sp. Atk')}
              {compareStat('special-defense', 'Sp. Def')}
              {compareStat('speed', 'Speed')}
            </div>
            
            <div className={styles.stats} style={{ marginTop: '24px' }}>
               <div className={styles.statRow}>
                 <div className={styles.statVal}>{pokemon1.height / 10}m</div>
                 <div className={styles.statLabel}>Height</div>
                 <div className={styles.statVal}>{pokemon2.height / 10}m</div>
               </div>
               <div className={styles.statRow}>
                 <div className={styles.statVal}>{pokemon1.weight / 10}kg</div>
                 <div className={styles.statLabel}>Weight</div>
                 <div className={styles.statVal}>{pokemon2.weight / 10}kg</div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
