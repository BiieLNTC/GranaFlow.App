'use client';

import { useEffect } from 'react';
import { useTransactions } from '@/hooks/use-transactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';

export function DashboardSummary() {
  const { transactions, fetchTransactions, isLoading } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Calcular totais
  const totalReceitas = transactions
    .filter((t) => t.tipo === 'Receita')
    .reduce((sum, t) => sum + t.valor, 0);

  const totalDespesas = transactions
    .filter((t) => t.tipo === 'Despesa')
    .reduce((sum, t) => sum + t.valor, 0);

  const saldoTotal = totalReceitas - totalDespesas;

  // Calcular do mês atual
  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  const transacoesMesAtual = transactions.filter((t) => {
    const data = new Date(t.dataTransacao);
    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
  });

  const totalReceitasMes = transacoesMesAtual
    .filter((t) => t.tipo === 'Receita')
    .reduce((sum, t) => sum + t.valor, 0);

  const totalDespesasMes = transacoesMesAtual
    .filter((t) => t.tipo === 'Despesa')
    .reduce((sum, t) => sum + t.valor, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Saldo Total */}
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Saldo Total</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${saldoTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatCurrency(saldoTotal)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Todos os saldos combinados</p>
        </CardContent>
      </Card>

      {/* Receitas do Mês */}
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Receitas (Mês)</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalReceitasMes)}</div>
          <p className="text-xs text-slate-500 mt-1">
            Este mês • {transacoesMesAtual.filter((t) => t.tipo === 'Receita').length} transações
          </p>
        </CardContent>
      </Card>

      {/* Despesas do Mês */}
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Despesas (Mês)</CardTitle>
          <ArrowDownLeft className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDespesasMes)}</div>
          <p className="text-xs text-slate-500 mt-1">
            Este mês • {transacoesMesAtual.filter((t) => t.tipo === 'Despesa').length} transações
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
