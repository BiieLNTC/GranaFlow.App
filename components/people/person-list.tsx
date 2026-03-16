'use client';

import { useEffect, useState } from 'react';
import { usePeople } from '@/hooks/use-people';
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
import { PersonForm } from './person-form';
import { Trash2, Edit2, Plus, Cake } from 'lucide-react';
import { toast } from 'sonner';
import { Pessoa, calcularIdade } from '@/lib/types';

export function PersonList() {
  const { people, isLoading, fetchPeople, deletePerson } = usePeople();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Pessoa | undefined>();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await deletePerson(id);
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
    setSelectedPerson(undefined);
    fetchPeople();
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
              onClick={() => setSelectedPerson(undefined)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Pessoa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedPerson ? 'Editar Pessoa' : 'Nova Pessoa'}
              </DialogTitle>
              <DialogDescription>
                {selectedPerson
                  ? 'Atualize os dados da pessoa'
                  : 'Crie uma nova pessoa para adicionar nas transações'}
              </DialogDescription>
            </DialogHeader>
            <PersonForm person={selectedPerson} onSuccess={handleFormSuccess} />
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
      ) : people.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="py-8 text-center text-slate-400">
            Nenhuma pessoa criada. Comece criando uma nova!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((person) => {
            const idade = calcularIdade(person.dataNascimento);
            const isMenor = idade < 18;

            return (
              <Card
                key={person.id}
                className={`border-slate-200 hover:shadow-md transition-shadow ${
                  isMenor ? 'border-l-4 border-l-amber-500' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{person.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Cake size={16} />
                    {idade} anos
                    {isMenor && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Menor</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-300"
                    onClick={() => {
                      setSelectedPerson(person);
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
                    disabled={isDeleting === person.id}
                    onClick={() => handleDelete(person.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting === person.id ? 'Deletando...' : 'Deletar'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
