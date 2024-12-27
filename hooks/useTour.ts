import { useState, useCallback } from 'react';
import { ITour, ITourFilters, convertToApiParams } from '../types/Tour.types';
import { tourService } from '../services/tourService';

export const useTour = () => {
  const [tours, setTours] = useState<ITour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const getTours = async (limit: number = 6) => {
    setLoading(true);
    try {
      const filters: ITourFilters = {
        page: 1,
        limit
      };
      const response = await tourService.getTours(
        String(filters.page), 
        convertToApiParams(filters), 
        String(filters.limit)
      );
      
      if (response.status === 'success' && response.data) {
        setTours(response.data);
        setError(null);
      } else {
        setError(response.message || 'Không thể tải danh sách tour');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const getAllTours = async (filters?: ITourFilters, isLoadMore: boolean = false) => {
    if (!hasMore && isLoadMore) return;
    
    setLoading(true);
    try {
      const currentFilters: ITourFilters = {
        ...filters,
        page: isLoadMore ? page + 1 : 1,
        limit: 10
      };

      const response = await tourService.getTours(
        String(currentFilters.page),
        convertToApiParams(currentFilters),
        String(currentFilters.limit)
      );

      if (response.status === 'success' && response.data) {
        if (isLoadMore) {
          setTours(prev => [...prev, ...response.data]);
          setPage(prev => prev + 1);
        } else {
          setTours(response.data);
          setPage(1);
        }
        setHasMore(response.data.length === 10);
        setError(null);
      } else {
        setError(response.message || 'Không thể tải danh sách tour');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const resetTours = () => {
    setTours([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  };

  const searchTours = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await tourService.searchTours(searchTerm);
      
      if (response.status === 'success' && response.data) {
        setTours(response.data);
        setError(null);
      } else {
        setError(response.message || 'Không thể tìm kiếm tour');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return {
    tours,
    loading,
    error,
    hasMore,
    getTours,
    getAllTours,
    resetTours,
    searchTours
  };
}; 