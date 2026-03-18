'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Pessoa, CreatePessoaRequest } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';

interface PessoaContextType {
  listPessoa: Pessoa[];
  isLoading: boolean;
  error: string | null;
  getPessoa: () => Promise<void>;
  createPessoa: (data: CreatePessoaRequest) => Promise<Pessoa>;
  updatePessoa: (id: number, data: CreatePessoaRequest) => Promise<Pessoa>;
  deletePessoa: (id: number) => Promise<void>;
}

export const PessoaContext = createContext<PessoaContextType | undefined>(undefined);

export function PeopleProvider({ children }: { children: ReactNode }) {
  const [listPessoa, setListPessoa] = useState<Pessoa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPessoa = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Pessoa[]>(API_ENDPOINTS.PEOPLE);
      setListPessoa(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pessoas';
      setError(errorMessage);
      console.error('Erro ao buscar pessoas:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPessoa = useCallback(async (data: CreatePessoaRequest) => {
    setError(null);
    try {
      const response = await apiClient.post<Pessoa>(API_ENDPOINTS.PEOPLE, data);
      setListPessoa((prev) => [...prev, response]);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pessoa';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updatePessoa = useCallback(async (id: number, data: CreatePessoaRequest) => {
    setError(null);
    try {
      const response = await apiClient.put<Pessoa>(API_ENDPOINTS.PEOPLE, data);
      setListPessoa((prev) =>
        prev.map((person) => (person.id === id ? response : person))
      );
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar pessoa';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deletePessoa = useCallback(async (id: number) => {
    setError(null);
    try {
      await apiClient.delete(API_ENDPOINTS.PERSON(id));
      setListPessoa((prev) => prev.filter((person) => person.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar pessoa';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return (
    <PessoaContext.Provider
      value={{
        listPessoa,
        isLoading,
        error,
        getPessoa,
        createPessoa,
        updatePessoa,
        deletePessoa,
      }}
    >
      {children}
    </PessoaContext.Provider>
  );
}
