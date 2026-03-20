'use client';

import { useAuth } from '@/hooks/use-auth';
import { DashboardSummary } from '@/components/dashboard/dashboard-summary';
import { TopDespesasChart } from '@/components/dashboard/top-despesas-chart';
import { ListTotaisPorPessoa } from '@/components/dashboard/list-totais-pessoa';
import { ListTotaisPorCategoria } from '@/components/dashboard/list-totais-categorias';
import { TopReceitasChart } from '@/components/dashboard/top-receitas-chart';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Search } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import DateFilter from '@/components/date-filter/date-filter';

export default function DashboardPage() {
  const { nameUser } = useAuth();

  const hoje = new Date()

  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)

  const [dataInicialFiltro, setDataInicialFiltro] = useState(primeiroDia);
  const [dataFinalFiltro, setDataFinalFiltro] = useState(ultimoDia);

  const [filtroAplicado, setFiltroAplicado] = useState({
    dataInicial: primeiroDia,
    dataFinal: ultimoDia,
  })

  function handleFilter(dataInicial: Date, dataFinal: Date) {
    setFiltroAplicado({ dataInicial, dataFinal })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Bem-vindo, {nameUser}!
        </h1>
        <p className="text-slate-600 mt-2">Aqui está seu resumo financeiro</p>
      </div>

      {/* Totais */}
      <DashboardSummary />

      <DateFilter onFilter={handleFilter} dataInicial={dataInicialFiltro} dataFinal={dataFinalFiltro} setDataInicial={setDataInicialFiltro} setDataFinal={setDataFinalFiltro} />

      {/*Totais por Pessoa*/}
      <ListTotaisPorPessoa filtro={filtroAplicado} />

      <ListTotaisPorCategoria filtro={filtroAplicado} />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopDespesasChart filtro={filtroAplicado} />
        <TopReceitasChart filtro={filtroAplicado} />
      </div>
    </div>
  );
}
