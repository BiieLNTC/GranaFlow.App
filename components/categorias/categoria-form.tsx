'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCategorias } from '@/hooks/use-categorias';
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

const categoriaSchema = z.object({
  id: z.number(),
  descricao: z.string({ message: "Campo Obrigatório!" }).min(2, 'Deve ter no mínimo 2 caracteres!').max(400, 'Nome muito longo'),
  finalidade: z.number({ message: "Campo Obrigatório!" }).min(1, "Campo Obrigatório!"),
  cor: z.string({ message: "Campo obrigatório!" }).regex(/^#([0-9A-Fa-f]{6})$/, "Cor inválida")
});

type CategoriaFormData = z.infer<typeof categoriaSchema>;

interface CategoriaFormProps {
  categoria?: Categoria;
  onSuccess?: () => void;
}

export function CategoriaForm({ categoria, onSuccess }: CategoriaFormProps) {
  
  const { createCategoria, updateCategoria } = useCategorias();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      id: categoria?.id ?? 0,
      descricao: categoria?.descricao ?? "",
      finalidade: categoria?.finalidade ?? 0,
      cor: categoria?.cor ?? "#000000"
    },
  });

  async function onSubmit(values: CategoriaFormData) {
    setIsSubmitting(true);
    try {
      if (categoria) {
        await updateCategoria(values);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await createCategoria(values);
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
          ) : categoria ? (
            'Atualizar'
          ) : (
            'Criar'
          )}
        </Button>
      </form>
    </Form>
  );
}
