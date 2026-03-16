'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Pessoa, CreatePessoaRequest } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';

interface PeopleContextType {
  people: Pessoa[];
  isLoading: boolean;
  error: string | null;
  fetchPeople: () => Promise<void>;
  createPerson: (data: CreatePessoaRequest) => Promise<Pessoa>;
  updatePerson: (id: number, data: CreatePessoaRequest) => Promise<Pessoa>;
  deletePerson: (id: number) => Promise<void>;
}

export const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export function PeopleProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Pessoa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPeople = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Pessoa[]>(API_ENDPOINTS.PEOPLE);
      setPeople(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pessoas';
      setError(errorMessage);
      console.error('Erro ao buscar pessoas:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPerson = useCallback(async (data: CreatePessoaRequest) => {
    setError(null);
    try {
      const response = await apiClient.post<Pessoa>(API_ENDPOINTS.PEOPLE, data);
      setPeople((prev) => [...prev, response]);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pessoa';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updatePerson = useCallback(async (id: number, data: CreatePessoaRequest) => {
    setError(null);
    try {
      const response = await apiClient.put<Pessoa>(API_ENDPOINTS.PERSON(id), data);
      setPeople((prev) =>
        prev.map((person) => (person.id === id ? response : person))
      );
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar pessoa';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deletePerson = useCallback(async (id: number) => {
    setError(null);
    try {
      await apiClient.delete(API_ENDPOINTS.PERSON(id));
      setPeople((prev) => prev.filter((person) => person.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar pessoa';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return (
    <PeopleContext.Provider
      value={{
        people,
        isLoading,
        error,
        fetchPeople,
        createPerson,
        updatePerson,
        deletePerson,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
}
