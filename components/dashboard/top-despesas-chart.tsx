'use client';

import { useEffect } from 'react';
import { useTransacao } from '@/hooks/use-transacao';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function TopDespesasChart() {
  const { listTopDespesas, getTopDespesas } = useTransacao();

  useEffect(() => {
    getTopDespesas();
  }, [getTopDespesas]);

  if (listTopDespesas.length === 0) {
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
        <CardDescription>Top {listTopDespesas.length} Despesas</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={listTopDespesas}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.nomeCategoria}: R$ ${entry.valor.toFixed(2)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="valor"
              nameKey="nomeCategoria"
            >
              {listTopDespesas.map((cat, index) => (
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
