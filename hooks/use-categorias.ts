'use client';

import { useContext } from 'react';
import { CategoriaContext } from '@/contexts/categories-context';

export function useCategorias() {
  const context = useContext(CategoriaContext);

  if (context === undefined) {
    throw new Error('useCategories deve ser usado dentro de um CategoriaProvider');
  }

  return context;
}
