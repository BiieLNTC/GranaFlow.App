'use client';

import { useEffect, useState } from 'react';
import { useCategories } from '@/hooks/use-categories';
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
import { CategoryForm } from './category-form';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Categoria } from '@/lib/types';

export function CategoryList() {
  const { categories, isLoading, fetchCategories, deleteCategory } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | undefined>();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await deleteCategory(id);
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
    fetchCategories();
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
            <CategoryForm category={selectedCategory} onSuccess={handleFormSuccess} />
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
      ) : categories.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="py-8 text-center text-slate-400">
            Nenhuma categoria criada. Comece criando uma nova!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category.descricao}</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-slate-300"
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsOpen(true);
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  disabled={isDeleting === category.id}
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting === category.id ? 'Deletando...' : 'Deletar'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
