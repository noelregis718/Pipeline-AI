import { Pokemon, PokemonListResponse, TypeListResponse, PokemonByTypeResponse } from '../types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
  const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  return response.json();
};

export const fetchPokemonDetails = async (nameOrId: string | number): Promise<Pokemon> => {
  const response = await fetch(`${API_BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Pokemon not found');
    }
    throw new Error('Failed to fetch Pokemon details');
  }
  return response.json();
};

export const fetchTypes = async (): Promise<TypeListResponse> => {
  const response = await fetch(`${API_BASE_URL}/type?limit=50`);
  if (!response.ok) {
    throw new Error('Failed to fetch types');
  }
  return response.json();
};

export const fetchPokemonByType = async (type: string): Promise<PokemonByTypeResponse> => {
  const response = await fetch(`${API_BASE_URL}/type/${type}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon by type');
  }
  return response.json();
};

// Helper function to extract ID from URL
export const extractIdFromUrl = (url: string): number => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};
