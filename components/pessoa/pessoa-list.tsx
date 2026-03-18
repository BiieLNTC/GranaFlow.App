'use client';

import { useEffect, useState } from 'react';
import { usePessoa } from '@/hooks/use-pessoa';
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
import { PessoaForm } from './pessoa-form';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Pessoa, calcularIdade } from '@/lib/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfirmDialog } from '../ui/confirm-dialog';

export function ListPessoa() {
  const { listPessoa, isLoading, getPessoa, deletePessoa } = usePessoa();
  const [isOpen, setIsOpen] = useState(false);
  const [pessoaSelectd, setPessoaSelectd] = useState<Pessoa | undefined>();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    getPessoa();
  }, [getPessoa]);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await deletePessoa(id);
      toast.success('Pessoa deletada com sucesso!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar pessoa';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFormSuccess = () => {
    setIsOpen(false);
    setPessoaSelectd(undefined);
    getPessoa();
  };

  return (
    <div className="space-y-4">
      {/* Header com botão de criar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pessoas</h2>
          <p className="text-slate-600 text-sm mt-1">Gerencie as pessoas nas suas transações</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setPessoaSelectd(undefined)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Pessoa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {pessoaSelectd ? 'Editar Pessoa' : 'Nova Pessoa'}
              </DialogTitle>
              <DialogDescription>
                {pessoaSelectd
                  ? 'Atualize os dados da pessoa'
                  : 'Crie uma nova pessoa para adicionar nas transações'}
              </DialogDescription>
            </DialogHeader>
            <PessoaForm pessoa={pessoaSelectd} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de pessoas */}
      {isLoading ? (
        <Card className="border-slate-200">
          <CardContent className="py-8 text-center text-slate-400">
            Carregando pessoas...
          </CardContent>
        </Card>
      ) : listPessoa.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="py-8 text-center text-slate-400">
            Nenhuma pessoa criada. Comece criando uma nova!
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200">
          <CardHeader>
            <CardDescription>
              Total de {listPessoa.length} pessoas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>

            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-30 text-center text-muted-foreground">Opções</TableHead>
                  <TableHead className="text-center text-muted-foreground">Nome</TableHead>
                  <TableHead className="text-center text-muted-foreground">Idade</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {listPessoa.slice(0, 10).map((pessoa) => (
                  <TableRow key={pessoa.id} className="border-border hover:bg-secondary/50">
                    {/* Opções */}
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPessoaSelectd(pessoa);
                            setIsOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4 text-slate-600" />
                        </Button>

                        <ConfirmDialog
                          title="Excluir pessoa"
                          description={`Deseja excluir ${pessoa.nome}?`}
                          onConfirm={() => handleDelete(pessoa.id)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isDeleting === pessoa.id}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-medium text-foreground">
                      {pessoa.nome}
                    </TableCell>

                    <TableCell className="text-center font-medium text-foreground">
                      {calcularIdade(pessoa.dataNascimento)}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
