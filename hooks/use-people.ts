'use client';

import { useContext } from 'react';
import { PeopleContext } from '@/contexts/people-context';

export function usePeople() {
  const context = useContext(PeopleContext);

  if (context === undefined) {
    throw new Error('usePeople deve ser usado dentro de um PeopleProvider');
  }

  return context;
}
