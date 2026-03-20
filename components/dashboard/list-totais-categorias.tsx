'use client';

import { useTransacao } from "@/hooks/use-transacao";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { useEffect, useMemo, useState } from "react";
import PaginationBox from "../pagination-box/pagination-box";

type Props = {
    filtro: {
        dataInicial: Date
        dataFinal: Date
    }
}

export function ListTotaisPorCategoria({ filtro }: Props) {
    const { listTotaisCategoria, getTotaisCategoria, isLoading } = useTransacao();

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(5)
    const totalPages = Math.ceil(listTotaisCategoria.length / pageSize) || 1
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return listTotaisCategoria.slice(start, end);
    }, [listTotaisCategoria, currentPage]);

    useEffect(() => {
        getTotaisCategoria(filtro.dataInicial, filtro.dataFinal)
    }, [filtro])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(value);
    };

    const totais = useMemo(() => {
        return listTotaisCategoria.reduce(
            (acc, curr) => {
                acc.receitas += curr.receitas;
                acc.despesas += curr.despesas;
                acc.saldo += curr.saldo;
                return acc;
            },
            { receitas: 0, despesas: 0, saldo: 0 }
        );
    }, [listTotaisCategoria]);

    return (
        isLoading ?
            (
                <Card className="border-slate-200">
                    <CardContent className="py-8 text-center text-slate-400">
                        Carregando totais por pessoa...
                    </CardContent>
                </Card>
            ) : listTotaisCategoria.length === 0 ? (

                <Card className="border-slate-200">
                    <CardHeader>
                        <CardTitle>Totais por Categoria</CardTitle>
                        <CardDescription>Nenhuma despesa registrada</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center text-slate-400">
                        <p>Adicione transações para visualizar a listagem.</p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-slate-200">
                    <CardHeader>
                        <CardTitle>Totais por Categoria</CardTitle>
                        <CardDescription>Totais detalhados por categoria</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center text-slate-400">
                        <Table className="border-border">
                            <TableHeader>
                                <TableRow className="border-border hover:bg-secondary/50">
                                    <TableHead className="text-center text-muted-foreground">Descrição</TableHead>
                                    <TableHead className="text-center text-muted-foreground">Despesa</TableHead>
                                    <TableHead className="text-center text-muted-foreground">Receita</TableHead>
                                    <TableHead className="text-center text-right text-muted-foreground">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.map((categoria) => (
                                    <TableRow key={categoria.descricao}>
                                        <TableCell className="text-center font-medium text-foreground">
                                            <span
                                                className="px-3 py-1 rounded-full text-white text-sm font-medium"
                                                style={{ backgroundColor: categoria.cor }}
                                            >
                                                {categoria.descricao}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-foreground">{formatCurrency(categoria.despesas)}</TableCell>
                                        <TableCell className="text-center font-medium text-foreground">{formatCurrency(categoria.receitas)}</TableCell>
                                        <TableCell className="text-right font-medium text-foreground">{formatCurrency(categoria.saldo)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className="font-bold text-foreground">Total</TableCell>
                                    <TableCell className="text-center font-bold text-foreground">{formatCurrency(totais.despesas)}</TableCell>
                                    <TableCell className="text-center font-bold text-foreground">{formatCurrency(totais.receitas)}</TableCell>
                                    <TableCell className={`text-right font-bold ${totais.saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {formatCurrency(totais.saldo)}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>


                    {listTotaisCategoria.length > 0 && (
                        <PaginationBox totalPages={totalPages || 1} currentPage={currentPage} onPagechange={handlePageChange} />
                    )}
                </Card>
            )
    )
}