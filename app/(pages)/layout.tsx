'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { CategoriaProvider } from '@/contexts/categoria-context';
import { PeopleProvider } from '@/contexts/pessoa-context';
import { TransacaoProvider } from '@/contexts/transacao-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <CategoriaProvider>
      <PeopleProvider>
        <TransacaoProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-0 lg:ml-64 min-h-screen bg-slate-50">
              <div className="p-4 md:p-8">
                {children}
              </div>
            </main>
          </div>
        </TransacaoProvider>
      </PeopleProvider>
    </CategoriaProvider>
  );
}
