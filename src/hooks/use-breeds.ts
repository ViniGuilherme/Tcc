import { useState, useEffect } from "react";
import { getBreeds, searchBreeds, type Breed, type GetBreedsParams } from "@/lib/services/breeds";

export function useBreeds(params: GetBreedsParams = {}) {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBreeds = async (newParams?: GetBreedsParams) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getBreeds({ ...params, ...newParams });
      setBreeds(response.data);
    } catch (err: any) {
      setError(err.message);
      setBreeds([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBreeds();
  }, []);

  return {
    breeds,
    isLoading,
    error,
    loadBreeds,
    refetch: () => loadBreeds()
  };
}

export function useBreedSearch() {
  const [searchResults, setSearchResults] = useState<Breed[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchBreeds(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
  };

  return {
    searchResults,
    isSearching,
    search,
    clearSearch
  };
}
