'use client';

import { useAuth } from '@/hooks/use-auth';
import { DashboardSummary } from '@/components/dashboard/dashboard-summary';
import { ExpensesChart } from '@/components/dashboard/expenses-chart';
import { ListTotaisPorPessoa } from '@/components/dashboard/list-totais-pessoa';

export default function DashboardPage() {
  const { nameUser } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {/* Bem-vindo, {user?.nome?.split(' ')[0]}! */}
          Bem-vindo, {nameUser}!
        </h1>
        <p className="text-slate-600 mt-2">Aqui está seu resumo financeiro</p>
      </div>

      {/* Totais */}
      <DashboardSummary />

      {/*Totais por Pessoa*/}
      <ListTotaisPorPessoa />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpensesChart />
      </div>
    </div>
  );
}
