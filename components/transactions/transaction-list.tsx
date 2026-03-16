'use client';

import { useEffect, useState } from 'react';
import { useTransactions } from '@/hooks/use-transactions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TransactionForm } from './transaction-form';
import { Trash2, Edit2, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Transacao } from '@/lib/types';
import { cn } from '@/lib/utils';

export function TransactionList() {
  const { transactions, isLoading, fetchTransactions, deleteTransaction } = useTransactions();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transacao | undefined>();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await deleteTransaction(id);
      toast.success('Transação deletada com sucesso!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar transação';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFormSuccess = () => {
    setIsOpen(false);
    setSelectedTransaction(undefined);
    fetchTransactions();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      {/* Header com botão de criar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Transações</h2>
          <p className="text-slate-600 text-sm mt-1">Registre suas receitas e despesas</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setSelectedTransaction(undefined)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedTransaction ? 'Editar Transação' : 'Nova Transação'}
              </DialogTitle>
              <DialogDescription>
                {selectedTransaction
                  ? 'Atualize os dados da transação'
                  : 'Registre uma nova transação'}
              </DialogDescription>
            </DialogHeader>
            <TransactionForm transaction={selectedTransaction} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de transações */}
      {isLoading ? (
        <Card className="border-slate-200">
          <CardContent className="py-8 text-center text-slate-400">
            Carregando transações...
          </CardContent>
        </Card>
      ) : transactions.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="py-8 text-center text-slate-400">
            Nenhuma transação registrada. Comece criando uma nova!
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>
              Total de {transactions.length} transações registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead>Tipo</TableHead>
                    <TableHead>Pessoa</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id} className="border-slate-200 hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.tipo === 'Receita' ? (
                            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={cn(
                              'font-medium',
                              transaction.tipo === 'Receita' ? 'text-emerald-600' : 'text-red-600'
                            )}
                          >
                            {transaction.tipo}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{transaction.pessoa?.nome || '-'}</TableCell>
                      <TableCell className="text-sm">
                        {transaction.categoria?.nome || '-'}
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {transaction.descricao}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span
                          className={
                            transaction.tipo === 'Receita'
                              ? 'text-emerald-600'
                              : 'text-red-600'
                          }
                        >
                          {transaction.tipo === 'Receita' ? '+' : '-'}
                          {formatCurrency(transaction.valor)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(transaction.dataTransacao)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setIsOpen(true);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={isDeleting === transaction.id}
                            onClick={() => handleDelete(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
