'use client';

import { useContext } from 'react';
import { CategoriesContext } from '@/contexts/categories-context';

export function useCategories() {
  const context = useContext(CategoriesContext);

  if (context === undefined) {
    throw new Error('useCategories deve ser usado dentro de um CategoriesProvider');
  }

  return context;
}
