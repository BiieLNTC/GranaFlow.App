'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Categoria, CreateCategoriaRequest } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';

interface CategoriaContextType {
  listCategorias: Categoria[];
  isLoading: boolean;
  error: string | null;
  getCategorias: () => Promise<void>;
  createCategoria: (data: CreateCategoriaRequest) => Promise<Categoria>;
  updateCategoria: (data: CreateCategoriaRequest) => Promise<Categoria>;
  deleteCategoria: (id: number) => Promise<void>;
}

export const CategoriaContext = createContext<CategoriaContextType | undefined>(undefined);

export function CategoriaProvider({ children }: { children: ReactNode }) {
  const [listCategorias, setListCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Categoria[]>(API_ENDPOINTS.CATEGORIES);
      setListCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar categorias';
      setError(errorMessage);
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategoria = useCallback(async (data: CreateCategoriaRequest) => {
    setError(null);
    try {
      const response = await apiClient.post<Categoria>(API_ENDPOINTS.CATEGORIES, data);
      setListCategorias((prev) => [...prev, response]);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar categoria';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateCategoria = useCallback(async (data: CreateCategoriaRequest) => {
    setError(null);
    try {
      const response = await apiClient.put<Categoria>(API_ENDPOINTS.CATEGORIES, data);
      setListCategorias((prev) =>
        prev.map((cat) => (cat.id === data.id ? response : cat))
      );
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar categoria';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteCategoria = useCallback(async (id: number) => {
    setError(null);
    try {
      await apiClient.delete(API_ENDPOINTS.CATEGORY(id));
      setListCategorias((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar categoria';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return (
    <CategoriaContext.Provider
      value={{
        listCategorias,
        isLoading,
        error,
        getCategorias,
        createCategoria,
        updateCategoria,
        deleteCategoria,
      }}
    >
      {children}
    </CategoriaContext.Provider>
  );
}
