'use client';

import { useEffect } from 'react';
import { useTransacao } from '@/hooks/use-transacao';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TipoTransacao } from '@/lib/types';

export function ExpensesChart() {
  const { listTransacoes, getListTransacao } = useTransacao();

  useEffect(() => {
    getListTransacao();
  }, [getListTransacao]);

  // Agrupar despesas por categoria
  const despesasPorCategoria = listTransacoes
    .filter((t) => t.tipo === TipoTransacao.Despesa)
    .reduce(
      (acc, t) => {
        const categoriaName = t.nomeCategoria || 'Sem categoria';
        const existente = acc.find((item) => item.name === categoriaName);

        if (existente) {
          existente.value += t.valor;
        } else {
          acc.push({
            name: categoriaName,
            value: Number(t.valor.toFixed(2)),
            cor: t.corCategoria
          });
        }

        return acc;
      },
      [] as { name: string; value: number; cor: string }[]
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
              {despesasPorCategoria.map((cat, index) => (
                <Cell key={`cell-${index}`} fill={cat.cor} />
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
