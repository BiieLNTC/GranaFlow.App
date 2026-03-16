'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Transacao, CreateTransacaoRequest } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';

interface TransactionsContextType {
  transactions: Transacao[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  createTransaction: (data: CreateTransacaoRequest) => Promise<Transacao>;
  updateTransaction: (id: number, data: CreateTransacaoRequest) => Promise<Transacao>;
  deleteTransaction: (id: number) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transacao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Transacao[]>(API_ENDPOINTS.TRANSACTIONS);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(errorMessage);
      console.error('Erro ao buscar transações:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTransaction = useCallback(async (data: CreateTransacaoRequest) => {
    setError(null);
    try {
      const response = await apiClient.post<Transacao>(API_ENDPOINTS.TRANSACTIONS, data);
      setTransactions((prev) => [...prev, response]);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar transação';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateTransaction = useCallback(
    async (id: number, data: CreateTransacaoRequest) => {
      setError(null);
      try {
        const response = await apiClient.put<Transacao>(API_ENDPOINTS.TRANSACTION(id), data);
        setTransactions((prev) =>
          prev.map((trans) => (trans.id === id ? response : trans))
        );
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar transação';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  const deleteTransaction = useCallback(async (id: number) => {
    setError(null);
    try {
      await apiClient.delete(API_ENDPOINTS.TRANSACTION(id));
      setTransactions((prev) => prev.filter((trans) => trans.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar transação';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        isLoading,
        error,
        fetchTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
