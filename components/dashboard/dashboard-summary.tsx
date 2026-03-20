'use client';

import { useEffect } from 'react';
import { useTransacao } from '@/hooks/use-transacao';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { TipoTransacao } from '@/lib/types';

export function DashboardSummary() {
  const { totaisTransacoes, getTotaisTransacao, isLoading } = useTransacao();

  useEffect(() => {
    getTotaisTransacao();
  }, [getTotaisTransacao]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (isLoading ?
    (
      <Card className="border-slate-200">
        <CardContent className="py-8 text-center text-slate-400">
          Carregando totais...
        </CardContent>
      </Card>
    )
    : (
      < div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
        {/* Saldo Total */}
        < Card className="border-slate-200" >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Saldo Total</CardTitle>
            {totaisTransacoes.saldoTotal >= 0 ? (

              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) :
              (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totaisTransacoes.saldoTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(totaisTransacoes.saldoTotal)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Todos os saldos combinados</p>
          </CardContent>
        </Card >

        {/* Receitas do Mês */}
        < Card className="border-slate-200" >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Receitas (Mês)</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totaisTransacoes.saldoReceitasMes)}</div>
            <p className="text-xs text-slate-500 mt-1">
              Este mês • {totaisTransacoes.totalReceitasMes} transações
            </p>
          </CardContent>
        </Card >

        {/* Despesas do Mês */}
        < Card className="border-slate-200" >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Despesas (Mês)</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totaisTransacoes.saldoDespesasMes)}</div>
            <p className="text-xs text-slate-500 mt-1">
              Este mês • {totaisTransacoes.totalDespesasMes} transações
            </p>
          </CardContent>
        </Card >
      </div >
    )
  );
}
