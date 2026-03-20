'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Transacao, CreateTransacaoRequest, TotaisTransacoes, DEFAULT_TOTAIS_TRANSACOES, TotaisPessoa, TotaisCategoria, TopDespesas, TopReceitas } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';

interface TransacaoContextType {
  totaisTransacoes: TotaisTransacoes;
  listTransacoes: Transacao[];
  listTotaisPessoa: TotaisPessoa[];
  listTotaisCategoria: TotaisCategoria[];
  listTopDespesas: TopDespesas[];
  listTopReceitas: TopReceitas[];
  isLoading: boolean;
  error: string | null;
  getListTransacao: (dataInicial: Date, dataFinal: Date) => Promise<void>;
  getTotaisTransacao: () => Promise<void>;
  getTotaisPessoa: (dataInicial: Date, dataFinal: Date) => Promise<void>;
  getTotaisCategoria: (dataInicial: Date, dataFinal: Date) => Promise<void>;
  getTopDespesas: (dataInicial: Date, dataFinal: Date) => Promise<void>;
  getTopReceitas: (dataInicial: Date, dataFinal: Date) => Promise<void>;
  createTransacao: (data: CreateTransacaoRequest) => Promise<Transacao>;
  updateTransacao: (id: number, data: CreateTransacaoRequest) => Promise<Transacao>;
  deleteTransacao: (id: number) => Promise<void>;
}

export const TransacaoContext = createContext<TransacaoContextType | undefined>(undefined);

export function TransacaoProvider({ children }: { children: ReactNode }) {
  const [listTransacoes, setListTransacoes] = useState<Transacao[]>([]);
  const [totaisTransacoes, setTotaisTransacoes] = useState<TotaisTransacoes>(DEFAULT_TOTAIS_TRANSACOES)
  const [listTotaisPessoa, setListTotaisPessoa] = useState<TotaisPessoa[]>([])
  const [listTotaisCategoria, setlistTotaisCategoria] = useState<TotaisCategoria[]>([])
  const [listTopDespesas, setListTopDespesas] = useState<TopDespesas[]>([])
  const [listTopReceitas, setListTopReceitas] = useState<TopReceitas[]>([])

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getListTransacao = useCallback(async (dataInicial: Date, dataFinal: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Transacao[]>(API_ENDPOINTS.TRANSACTIONS,
        {
          params: {
            dataInicial: dataInicial.toLocaleDateString('sv-SE'),
            dataFinal: dataFinal.toLocaleDateString('sv-SE'),
          }
        }
      );

      setListTransacoes(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(errorMessage);
      console.error('Erro ao buscar transações:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTransacao = useCallback(async (data: CreateTransacaoRequest) => {
    setError(null);
    try {
      const response = await apiClient.post<Transacao>(API_ENDPOINTS.TRANSACTIONS, data);
      setListTransacoes((prev) => [...prev, response]);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar transação';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateTransacao = useCallback(
    async (id: number, data: CreateTransacaoRequest) => {
      setError(null);
      try {
        const response = await apiClient.put<Transacao>(API_ENDPOINTS.TRANSACTIONS, data);
        setListTransacoes((prev) =>
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

  const deleteTransacao = useCallback(async (id: number) => {
    setError(null);
    try {
      await apiClient.delete(API_ENDPOINTS.TRANSACTION(id));
      setListTransacoes((prev) => prev.filter((trans) => trans.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar transação';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getTotaisTransacao = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<TotaisTransacoes>(API_ENDPOINTS.ObterTotaisTransacoes);
      setTotaisTransacoes(data);
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(errorMessage);
      console.error('Erro ao buscar transações:', err);
    } finally {
      setIsLoading(false);
    }
  }, [])

  const getTotaisPessoa = useCallback(async (dataInicial: Date, dataFinal: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<TotaisPessoa[]>(API_ENDPOINTS.ObterTotaisPessoas,
        {
          params: {
            dataInicial: dataInicial.toLocaleDateString('sv-SE'),
            dataFinal: dataFinal.toLocaleDateString('sv-SE'),
          }
        }
      );
      setListTotaisPessoa(data);
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(errorMessage);
      console.error('Erro ao buscar transações:', err);
    } finally {
      setIsLoading(false);
    }
  }, [])

  const getTotaisCategoria = useCallback(async (dataInicial: Date, dataFinal: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<TotaisCategoria[]>(API_ENDPOINTS.ObterTotaisCategorias, {
        params: {
          dataInicial: dataInicial.toLocaleDateString('sv-SE'),
          dataFinal: dataFinal.toLocaleDateString('sv-SE'),
        }
      });
      setlistTotaisCategoria(data);
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(errorMessage);
      console.error('Erro ao buscar transações:', err);
    } finally {
      setIsLoading(false);
    }
  }, [])

  const getTopDespesas = useCallback(async (dataInicial: Date, dataFinal: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<TopDespesas[]>(API_ENDPOINTS.ObterTopDespesas,
        {
          params: {
            dataInicial: dataInicial.toLocaleDateString('sv-SE'),
            dataFinal: dataFinal.toLocaleDateString('sv-SE'),
          }
        }
      );
      setListTopDespesas(data);
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(errorMessage);
      console.error('Erro ao buscar transações:', err);
    } finally {
      setIsLoading(false);
    }
  }, [])

  const getTopReceitas = useCallback(async (dataInicial: Date, dataFinal: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<TopReceitas[]>(API_ENDPOINTS.ObterTopReceitas, {
        params: {
          dataInicial: dataInicial.toLocaleDateString('sv-SE'),
          dataFinal: dataFinal.toLocaleDateString('sv-SE'),
        }
      });
      setListTopReceitas(data);
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(errorMessage);
      console.error('Erro ao buscar transações:', err);
    } finally {
      setIsLoading(false);
    }
  }, [])

  return (
    <TransacaoContext.Provider
      value={{
        totaisTransacoes,
        listTransacoes,
        listTotaisPessoa,
        listTotaisCategoria,
        listTopDespesas,
        listTopReceitas,
        isLoading,
        error,
        getListTransacao,
        getTotaisTransacao,
        getTotaisPessoa,
        getTotaisCategoria,
        getTopDespesas,
        getTopReceitas,
        createTransacao,
        updateTransacao,
        deleteTransacao,
      }}
    >
      {children}
    </TransacaoContext.Provider>
  );
}
