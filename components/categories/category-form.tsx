'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCategories } from '@/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Categoria } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categorySchema = z.object({
  descricao: z.string({ message: "Campo Obrigatório!" }).min(2, 'Deve ter no mínimo 2 caracteres!').max(400, 'Nome muito longo'),
  finalidade: z.number({ message: "Campo Obrigatório!" }),
  cor: z.string({message:"Campo Obrigatório!"})
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Categoria;
  onSuccess?: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const { createCategory, updateCategory } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      descricao: category?.descricao,
      finalidade: category?.finalidade,
      cor: category?.cor
    },
  });

  async function onSubmit(values: CategoryFormData) {
    setIsSubmitting(true);
    try {
      if (category) {
        await updateCategory(category.id, values);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await createCategory(values);
        toast.success('Categoria criada com sucesso!');
        form.reset();
      }
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar categoria';
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
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da Categoria</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Alimentação, Transporte..."
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
          name="finalidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Finalidade</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger className="w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue placeholder="Selecione a finalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Despesa</SelectItem>
                    <SelectItem value="2">Receita</SelectItem>
                    <SelectItem value="3">Ambas</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    {...field}
                    className="w-14 p-1 h-10"
                  />
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
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
          ) : category ? (
            'Atualizar'
          ) : (
            'Criar'
          )}
        </Button>
      </form>
    </Form>
  );
}
