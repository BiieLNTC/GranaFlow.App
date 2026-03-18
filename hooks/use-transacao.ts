'use client';

import { useContext } from 'react';
import { TransacaoContext } from '@/contexts/transactions-context';

export function useTransacao() {
  const context = useContext(TransacaoContext);

  if (context === undefined) {
    throw new Error('useTransacao deve ser usado dentro de um TransacaoProvider');
  }

  return context;
}
