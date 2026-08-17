'use client';

import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pokemon_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
    setIsLoaded(true);
  }, []);

  const toggleFavorite = (name: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(name) 
        ? prev.filter(f => f !== name)
        : [...prev, name];
        
      try {
        localStorage.setItem('pokemon_favorites', JSON.stringify(newFavorites));
      } catch (e) {
        console.error('Failed to save favorites', e);
      }
      return newFavorites;
    });
  };

  const isFavorite = (name: string) => favorites.includes(name);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
