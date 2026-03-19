'use client';

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from 'react';
import { useTransacao } from '@/hooks/use-transacao';
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
import { TransacaoForm } from './transaction-form';
import { Trash2, Edit2, Plus, ArrowUpRight, ArrowDownLeft, CalendarIcon, Search } from 'lucide-react';
import { toast } from 'sonner';
import { TipoTransacao, Transacao } from '@/lib/types';
import { cn } from '@/lib/utils';
import PaginationBox from '../pagination-box/pagination-box';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Label } from "../ui/label";

export function TransactionList() {
  const { listTransacoes, isLoading, getListTransacao, deleteTransacao } = useTransacao();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transacao | undefined>();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const [dataInicialFiltro, setDataInicialFiltro] = useState(new Date())
  const [dataFinalFiltro, setDataFinalFiltro] = useState(new Date())

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const totalPages = Math.ceil(listTransacoes.length / pageSize) || 1
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    getListTransacao(dataInicialFiltro, dataFinalFiltro);
  }, [getListTransacao]);

  async function filtrarList() {
    if (dataInicialFiltro > dataFinalFiltro) {
      toast.error("A Data Inicial não pode ser maior que a Data Final")
      return;
    }

    getListTransacao(dataInicialFiltro, dataFinalFiltro)
  }

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return listTransacoes.slice(start, end);
  }, [listTransacoes, currentPage]);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await deleteTransacao(id);
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
    getListTransacao(dataInicialFiltro, dataFinalFiltro);
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
            <TransacaoForm transacao={selectedTransaction} onSuccess={handleFormSuccess} />
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
      ) : (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>
              Total de {listTransacoes.length} transações registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">

              <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Data Inicial</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full sm:w-auto justify-start text-left font-normal text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="truncate">{format(dataInicialFiltro, "dd/MM/yyyy", { locale: ptBR })}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataInicialFiltro}
                        onSelect={(date) => date && setDataInicialFiltro(date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Data Final</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full sm:w-auto justify-start text-left font-normal text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="truncate">{format(dataFinalFiltro, "dd/MM/yyyy", { locale: ptBR })}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataFinalFiltro}
                        onSelect={(date) => date && setDataFinalFiltro(date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div style={{ marginTop: '17px' }}>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => filtrarList()}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                </div>
              </div>

              {listTransacoes.length === 0 ? (
                <CardContent className="py-8 text-center text-slate-400">
                  Nenhuma transação registrada. Comece criando uma nova!
                </CardContent>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-center">Ações</TableHead>
                      <TableHead className="text-center">Data</TableHead>
                      <TableHead className="text-center">Tipo</TableHead>
                      <TableHead className="text-center">Pessoa</TableHead>
                      <TableHead className="text-center">Categoria</TableHead>
                      <TableHead className="text-center">Descrição</TableHead>
                      <TableHead className="text-center">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((transacao) => (
                      <TableRow key={transacao.id} className="border-slate-200 hover:bg-slate-50">
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedTransaction(transacao);
                                setIsOpen(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>

                            <ConfirmDialog
                              title="Excluir transação"
                              description={`Deseja excluir '${transacao.descricao}' da categoria '${transacao.nomeCategoria}' de ${formatDate(transacao.dataTransacao)}?`}
                              onConfirm={() => handleDelete(transacao.id)}
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isDeleting === transacao.id}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              }
                            />
                          </div>
                        </TableCell>

                        <TableCell className="text-sm text-center">
                          {formatDate(transacao.dataTransacao)}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 justify-center">
                            {transacao.tipo === TipoTransacao.Receita ? (
                              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4 text-red-600" />
                            )}
                            <span
                              className={cn(
                                'font-medium',
                                transacao.tipo === TipoTransacao.Receita ? 'text-emerald-600' : 'text-red-600'
                              )}
                            >
                              {transacao.tipo === TipoTransacao.Receita ? "Receita" : "Despesa"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-sm text-center">{transacao.nomePessoa || '-'}</TableCell>

                        <TableCell className="font-medium text-foreground text-center">
                          <span
                            className="px-3 py-1 rounded-full text-white text-sm font-medium"
                            style={{ backgroundColor: transacao.corCategoria }}
                          >
                            {transacao.nomeCategoria}
                          </span>
                        </TableCell>

                        <TableCell className="text-sm max-w-xs truncate text-center">
                          {transacao.descricao}
                        </TableCell>

                        <TableCell className="text-right font-medium text-center">
                          <span
                            className={
                              transacao.tipo === TipoTransacao.Receita
                                ? 'text-emerald-600'
                                : 'text-red-600'
                            }
                          >
                            {transacao.tipo === TipoTransacao.Receita ? '+' : '-'}
                            {formatCurrency(transacao.valor)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {listTransacoes.length > 0 && (
              <PaginationBox totalPages={totalPages || 1} currentPage={currentPage} onPagechange={handlePageChange} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
