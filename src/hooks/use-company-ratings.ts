import { useState, useEffect, useCallback, useRef } from "react";
import { 
  getCompanyRatings, 
  listCompanyRatings, 
  getCompanyStats, 
  checkUserEligibility,
  type Rating, 
  type GetRatingsParams,
  type CompanyStats,
  type EligibilityResponse
} from "@/lib/services/ratings";

// Cache para avaliações
const ratingsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos para avaliações

export function useCompanyRatings(companyId: string, params: Omit<GetRatingsParams, 'companyId'> = {}) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(params.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const loadRatings = useCallback(async (newParams?: Omit<GetRatingsParams, 'companyId'>) => {
    if (!companyId) return;

    const cacheKey = `${companyId}-${JSON.stringify({ ...params, ...newParams })}`;
    
    // Verificar cache primeiro
    const cached = ratingsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setRatings(cached.data.data || []);
      setTotal(cached.data.total || 0);
      setPage(cached.data.page || 1);
      setTotalPages(cached.data.totalPages || 0);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getCompanyRatings(companyId, { ...params, ...newParams });
      
      // Salvar no cache
      ratingsCache.set(cacheKey, { data: response, timestamp: Date.now() });
      
      setRatings(response.data || []);
      setTotal(response.total || 0);
      setPage(response.page || 1);
      setTotalPages(response.totalPages || 0);
    } catch (err: any) {
      console.error('Erro ao carregar avaliações:', err);
      setError(err.message || 'Erro ao carregar avaliações');
      setRatings([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, params]);

  const loadMoreRatings = async () => {
    if (page < totalPages) {
      try {
        setIsLoading(true);
        const response = await getCompanyRatings(companyId, { 
          ...params, 
          page: page + 1 
        });
        setRatings(prev => [...prev, ...(response.data || [])]);
        setPage(response.page || page);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar mais avaliações');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const refreshRatings = () => {
    loadRatings();
  };

  useEffect(() => {
    if (companyId) {
      // Debounce para evitar múltiplas requisições
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        loadRatings();
      }, 300); // 300ms de debounce
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [companyId, loadRatings]);

  return {
    ratings,
    isLoading,
    error,
    total,
    page,
    totalPages,
    loadMoreRatings,
    refreshRatings,
    hasMore: page < totalPages
  };
}

export function useAllCompanyRatings(params: { page?: number; limit?: number } = {}) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(params.page || 1);
  const [totalPages, setTotalPages] = useState(0);

  const loadRatings = async (newParams?: { page?: number; limit?: number }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await listCompanyRatings({ ...params, ...newParams });
      setRatings(response.data);
      setTotal(response.total);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message);
      setRatings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreRatings = async () => {
    if (page < totalPages) {
      try {
        setIsLoading(true);
        const response = await listCompanyRatings({ 
          ...params, 
          page: page + 1 
        });
        setRatings(prev => [...prev, ...response.data]);
        setPage(response.page);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const refreshRatings = () => {
    loadRatings();
  };

  useEffect(() => {
    loadRatings();
  }, []);

  return {
    ratings,
    isLoading,
    error,
    total,
    page,
    totalPages,
    loadMoreRatings,
    refreshRatings,
    hasMore: page < totalPages
  };
}
