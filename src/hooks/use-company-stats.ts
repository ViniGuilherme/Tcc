import { useState, useEffect, useCallback, useRef } from "react";
import { 
  getCompanyStats, 
  checkUserEligibility,
  type CompanyStats,
  type EligibilityResponse
} from "@/lib/services/ratings";

// Cache global para evitar requisições duplicadas
const statsCache = new Map<string, { data: CompanyStats; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useCompanyStats(companyId: string) {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const loadStats = useCallback(async () => {
    if (!companyId) return;

    // Verificar cache primeiro
    const cached = statsCache.get(companyId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setStats(cached.data);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getCompanyStats(companyId);
      
      // Salvar no cache
      statsCache.set(companyId, { data: response, timestamp: Date.now() });
      setStats(response);
    } catch (err: any) {
      console.error('Erro ao carregar estatísticas:', err);
      setError(err.message || 'Erro ao carregar estatísticas');
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const refreshStats = useCallback(() => {
    // Limpar cache para forçar nova requisição
    statsCache.delete(companyId);
    loadStats();
  }, [companyId, loadStats]);

  useEffect(() => {
    if (companyId) {
      // Debounce para evitar múltiplas requisições
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        loadStats();
      }, 300); // 300ms de debounce
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [companyId, loadStats]);

  return {
    stats,
    isLoading,
    error,
    refreshStats
  };
}

// Cache para elegibilidade
const eligibilityCache = new Map<string, { data: EligibilityResponse; timestamp: number }>();

export function useUserEligibility(companyId: string) {
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const checkEligibility = useCallback(async () => {
    if (!companyId) return;

    // Verificar cache primeiro
    const cached = eligibilityCache.get(companyId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Usando dados do cache de elegibilidade para empresa:', companyId);
      setEligibility(cached.data);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await checkUserEligibility(companyId);
      
      // Salvar no cache
      eligibilityCache.set(companyId, { data: response, timestamp: Date.now() });
      setEligibility(response);
    } catch (err: any) {
      console.error('Erro ao verificar elegibilidade:', err);
      setError(err.message || 'Erro ao verificar elegibilidade');
      setEligibility(null);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const refreshEligibility = useCallback(() => {
    // Limpar cache para forçar nova requisição
    eligibilityCache.delete(companyId);
    checkEligibility();
  }, [companyId, checkEligibility]);

  useEffect(() => {
    if (companyId) {
      // Debounce para evitar múltiplas requisições
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        checkEligibility();
      }, 300); // 300ms de debounce
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [companyId, checkEligibility]);

  return {
    eligibility,
    isLoading,
    error,
    refreshEligibility
  };
}
