'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Categoria, CreateCategoriaRequest } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';

interface CategoriesContextType {
  categories: Categoria[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (data: CreateCategoriaRequest) => Promise<Categoria>;
  updateCategory: (id: number, data: CreateCategoriaRequest) => Promise<Categoria>;
  deleteCategory: (id: number) => Promise<void>;
}

export const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Categoria[]>(API_ENDPOINTS.CATEGORIES);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar categorias';
      setError(errorMessage);
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: CreateCategoriaRequest) => {
    setError(null);
    try {
      const response = await apiClient.post<Categoria>(API_ENDPOINTS.CATEGORIES, data);
      setCategories((prev) => [...prev, response]);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar categoria';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateCategory = useCallback(async (id: number, data: CreateCategoriaRequest) => {
    setError(null);
    try {
      const response = await apiClient.put<Categoria>(API_ENDPOINTS.CATEGORY(id), data);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? response : cat))
      );
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar categoria';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    setError(null);
    try {
      await apiClient.delete(API_ENDPOINTS.CATEGORY(id));
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar categoria';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        isLoading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}
