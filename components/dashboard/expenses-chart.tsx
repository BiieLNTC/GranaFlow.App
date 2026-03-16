'use client';

import { useEffect } from 'react';
import { useTransactions } from '@/hooks/use-transactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = [
  '#10b981',
  '#06b6d4',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#14b8a6',
  '#6366f1',
];

export function ExpensesChart() {
  const { transactions, fetchTransactions } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Agrupar despesas por categoria
  const despesasPorCategoria = transactions
    .filter((t) => t.tipo === 'Despesa')
    .reduce(
      (acc, t) => {
        const categoriaName = t.categoria?.nome || 'Sem categoria';
        const existente = acc.find((item) => item.name === categoriaName);

        if (existente) {
          existente.value += t.valor;
        } else {
          acc.push({
            name: categoriaName,
            value: Number(t.valor.toFixed(2)),
          });
        }

        return acc;
      },
      [] as { name: string; value: number }[]
    )
    .sort((a, b) => b.value - a.value);

  if (despesasPorCategoria.length === 0) {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>Nenhuma despesa registrada</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-slate-400">
          <p>Adicione despesas para visualizar o gráfico</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Despesas por Categoria</CardTitle>
        <CardDescription>Distribuição de suas despesas</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={despesasPorCategoria}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: R$ ${entry.value.toFixed(2)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {despesasPorCategoria.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                `R$ ${Number(value).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
