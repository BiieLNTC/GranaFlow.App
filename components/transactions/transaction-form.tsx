'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransacao } from '@/hooks/use-transacao';
import { useCategorias } from '@/hooks/use-categorias';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { TipoTransacao, Transacao, ehMenorDeIdade } from '@/lib/types';
import { AlertCircle } from 'lucide-react';

const transacaoSchema = z.object({
  id: z.number(),
  categoriaId: z.string().min(1, "Campo Obrigatório!").refine((val) => !isNaN(Number(val)), 'Categoria inválida'),
  pessoaId: z.string().min(1, "Campo Obrigatório!").refine((val) => !isNaN(Number(val)), 'Pessoa inválida'),
  dataTransacao: z.string().min(1, "Campo obrigatório!").refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
  descricao: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres').max(400),
  tipo: z.nativeEnum(TipoTransacao),
  valor: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valor deve ser maior que 0'),
});

type TransacaoFormData = z.infer<typeof transacaoSchema>;

interface TransacaoFormProps {
  transacao?: Transacao;
  onSuccess?: () => void;
}

export function TransacaoForm({ transacao, onSuccess }: TransacaoFormProps) {
  const { createTransacao, updateTransacao } = useTransacao();
  const { listCategorias, getCategorias } = useCategorias();
  const { listPessoa, getPessoa } = usePessoa();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPersonIsMenor, setSelectedPersonIsMenor] = useState(false);

  const form = useForm<TransacaoFormData>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: {
      id: transacao?.id || 0,
      categoriaId: transacao?.categoriaId?.toString() || '',
      pessoaId: transacao?.pessoaId?.toString() || '',
      dataTransacao: transacao?.dataTransacao?.split('T')[0] || new Date().toISOString().split('T')[0],
      descricao: transacao?.descricao || '',
      tipo: transacao?.tipo || TipoTransacao.Despesa,
      valor: transacao?.valor?.toString() || '',
    },
  });

  // Carregar categorias e pessoas
  useEffect(() => {
    getCategorias();
    getPessoa();
  }, [getCategorias, getPessoa]);

  // Verificar se pessoa selecionada é menor de idade
  const pessoaId = form.watch('pessoaId');
  useEffect(() => {
    if (pessoaId) {
      const selectedPerson = listPessoa.find((f) => f.id === Number(pessoaId));
      if (selectedPerson) {
        const isMenor = ehMenorDeIdade(selectedPerson.dataNascimento);
        setSelectedPersonIsMenor(isMenor);

        // Se é menor, força o tipo para Despesa
        if (isMenor && form.getValues('tipo') === TipoTransacao.Receita) {
          form.setValue('tipo', TipoTransacao.Despesa);
        }
      }
    }
  }, [pessoaId, listPessoa, form]);

  const tipo = form.watch("tipo");

  const categoriasFiltradas = listCategorias.filter(c => {
    if (tipo === TipoTransacao.Despesa) {
      return c.finalidade === 1 || c.finalidade === 3;
    }

    if (tipo === TipoTransacao.Receita) {
      return c.finalidade === 2 || c.finalidade === 3;
    }

    return true;
  });

  async function onSubmit(values: TransacaoFormData) {
    // Validação final: menor não pode ter Receita
    if (selectedPersonIsMenor && values.tipo === TipoTransacao.Receita) {
      toast.error('Pessoas menores de idade não podem registrar receitas');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id: values.id,
        categoriaId: Number(values.categoriaId),
        pessoaId: Number(values.pessoaId),
        dataTransacao: values.dataTransacao,
        descricao: values.descricao,
        tipo: values.tipo === TipoTransacao.Despesa ? 1 : 2,
        valor: Number(values.valor),
      };

      if (transacao) {
        await updateTransacao(transacao.id, payload);
        toast.success('Transação atualizada com sucesso!');
      } else {
        await createTransacao(payload);
        toast.success('Transação criada com sucesso!');
        form.reset();
      }
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar transação';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Alerta para menores de idade */}
        {selectedPersonIsMenor && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Pessoas menores de idade podem registrar apenas despesas. Receitas estão desabilitadas.
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="pessoaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pessoa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full border-slate-300 focus:border-emerald-500">
                    <SelectValue placeholder="Selecione uma pessoa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {listPessoa.map((pessoa) => (
                    <SelectItem key={pessoa.id} value={pessoa.id.toString()}>
                      {pessoa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger
                    className="w-full border-slate-300 focus:border-emerald-500"
                    disabled={selectedPersonIsMenor}
                  >
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2" disabled={selectedPersonIsMenor}>
                    Receita {selectedPersonIsMenor && '(Desabilitado)'}
                  </SelectItem>
                  <SelectItem value="1">Despesa</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoriaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full border-slate-300 focus:border-emerald-500">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriasFiltradas.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0,00"
                  step="0.01"
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
          name="dataTransacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
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

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição da transação..."
                  {...field}
                  disabled={isSubmitting}
                  className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                  rows={3}
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
          ) : transacao ? (
            'Atualizar'
          ) : (
            'Criar'
          )}
        </Button>
      </form>
    </Form>
  );
}
