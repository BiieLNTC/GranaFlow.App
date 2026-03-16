'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Spinner } from '@/components/ui/spinner';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Se autenticado, redireciona para dashboard
        router.replace('/dashboard');
      } else {
        // Se não autenticado, redireciona para login
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar loading enquanto verifica autenticação
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-emerald-50">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8 text-emerald-600" />
        <p className="text-slate-600">Carregando...</p>
      </div>
    </div>
  );
}
