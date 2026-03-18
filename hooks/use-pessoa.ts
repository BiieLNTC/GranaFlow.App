'use client';

import { useContext } from 'react';
import { PessoaContext } from '@/contexts/people-context';

export function usePessoa() {
  const context = useContext(PessoaContext);

  if (context === undefined) {
    throw new Error('usePessoa deve ser usado dentro de um PessoaProvider');
  }

  return context;
}
