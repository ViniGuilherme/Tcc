import { useState, useEffect } from "react";
import { getCompanyRatings, listCompanyRatings, type Rating, type GetRatingsParams } from "@/lib/services/ratings";

export function useCompanyRatings(companyId: string, params: Omit<GetRatingsParams, 'companyId'> = {}) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(params.page || 1);
  const [totalPages, setTotalPages] = useState(0);

  const loadRatings = async (newParams?: Omit<GetRatingsParams, 'companyId'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getCompanyRatings(companyId, { ...params, ...newParams });
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
        const response = await getCompanyRatings(companyId, { 
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
    if (companyId) {
      loadRatings();
    }
  }, [companyId]);

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
