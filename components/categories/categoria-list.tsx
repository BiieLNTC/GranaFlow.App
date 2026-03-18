'use client';

import { useEffect, useState } from 'react';
import { useCategorias } from '@/hooks/use-categorias';
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
import { CategoryForm } from './categoria-form';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Categoria } from '@/lib/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfirmDialog } from '../ui/confirm-dialog';

export function ListCategoria() {
  const { listCategorias, isLoading, getCategorias, deleteCategoria } = useCategorias();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | undefined>();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    getCategorias();
  }, [getCategorias]);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await deleteCategoria(id);
      toast.success('Categoria deletada com sucesso!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar categoria';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFormSuccess = () => {
    setIsOpen(false);
    setSelectedCategory(undefined);
    getCategorias();
  };

  return (
    <div className="space-y-4">
      {/* Header com botão de criar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Categorias</h2>
          <p className="text-slate-600 text-sm mt-1">Gerencie suas categorias de gastos</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setSelectedCategory(undefined)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
              <DialogDescription>
                {selectedCategory
                  ? 'Atualize os dados da categoria'
                  : 'Crie uma nova categoria para suas transações'}
              </DialogDescription>
            </DialogHeader>
            <CategoryForm categoria={selectedCategory} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de categorias */}
      {isLoading ? (
        <Card className="border-slate-200">
          <CardContent className="py-8 text-center text-slate-400">
            Carregando categorias...
          </CardContent>
        </Card>
      ) : listCategorias.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="py-8 text-center text-slate-400">
            Nenhuma categoria criada. Comece criando uma nova!
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200">
          <CardHeader>
            <CardDescription>
              Total de {listCategorias.length} pessoas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>

            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-30 text-center text-muted-foreground">Opções</TableHead>
                  <TableHead className="text-center text-muted-foreground">Descrição</TableHead>
                  <TableHead className="text-center text-muted-foreground">Finalidade</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {listCategorias.slice(0, 10).map((categoria) => (
                  <TableRow key={categoria.id} className="border-border hover:bg-secondary/50">
                    {/* Opções */}
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCategory(categoria);
                            setIsOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4 text-slate-600" />
                        </Button>

                        <ConfirmDialog
                          title="Excluir categoria"
                          description={`Deseja excluir ${categoria.descricao}?`}
                          onConfirm={() => handleDelete(categoria.id)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isDeleting === categoria.id}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          }
                        />

                      </div>
                    </TableCell>

                    {/* Descrição com tag */}
                    <TableCell className="text-center font-medium text-foreground">
                      <span
                        className="px-3 py-1 rounded-full text-white text-sm font-medium"
                        style={{ backgroundColor: categoria.cor }}
                      >
                        {categoria.descricao}
                      </span>
                    </TableCell>

                    <TableCell className="text-center font-medium text-foreground">
                      <span>
                        {categoria.finalidade == 1 ? "Despesa" : categoria.finalidade == 2 ? ("Receita") : "Ambas"}
                      </span>
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
