'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePessoa } from '@/hooks/use-pessoa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Pessoa } from '@/lib/types';

const pessoaSchema = z.object({
  id: z.number(),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200, 'Nome muito longo'),
  dataNascimento: z.string().refine((date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }, 'Data de nascimento inválida'),
});

type PersonFormData = z.infer<typeof pessoaSchema>;

interface PersonFormProps {
  pessoa?: Pessoa;
  onSuccess?: () => void;
}

export function PessoaForm({ pessoa, onSuccess }: PersonFormProps) {
  const { createPessoa, updatePessoa } = usePessoa();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PersonFormData>({
    resolver: zodResolver(pessoaSchema),
    defaultValues: {
      id: pessoa?.id || 0,
      nome: pessoa?.nome || '',
      dataNascimento: pessoa?.dataNascimento?.split('T')[0] || '',
    },
  });

  async function onSubmit(values: PersonFormData) {
    setIsSubmitting(true);
    try {
      if (pessoa) {
        await updatePessoa(pessoa.id, values);
        toast.success('Pessoa atualizada com sucesso!');
      } else {
        await createPessoa(values);
        toast.success('Pessoa criada com sucesso!');
        form.reset();
      }
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar pessoa';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome da pessoa"
                  {...field}
                  disabled={isSubmitting}
                  className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataNascimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  disabled={isSubmitting}
                  className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Salvando...
            </>
          ) : pessoa ? (
            'Atualizar'
          ) : (
            'Criar'
          )}
        </Button>
      </form>
    </Form>
  );
}
