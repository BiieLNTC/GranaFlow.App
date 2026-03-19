import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import { useMemo, useCallback } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

type Props = {
    currentPage: number;
    totalPages: number;
    onPagechange: (page: number) => void;
};

export default function PaginationBox({
    currentPage,
    totalPages,
    onPagechange
}: Props) {
    const { startPage, endPage } = useMemo(() => {
        let startPage = 1;
        let endPage = totalPages;

        if (totalPages > 3) {
            if (currentPage <= 2) {
                startPage = 1;
                endPage = 3;
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 2;
                endPage = totalPages;
            } else {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
        }

        return { startPage, endPage };
    }, [currentPage, totalPages]);

    const handleChangePage = useCallback(
        (page: number) => {
            onPagechange(page);
        },
        [onPagechange]
    );

    const renderItems = useMemo(() => {
        const items = [];
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        aria-label={`Ir para a página ${i}`}
                        onClick={() => handleChangePage(i)}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return items;
    }, [startPage, endPage, currentPage, handleChangePage]);

    if (totalPages <= 1) return null;

    return (
        <div className="p-4">
            <Pagination>
                <PaginationContent>
                    {currentPage > 1 && (
                        <>
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => handleChangePage(1)}
                                    aria-label="Ir para a primeira página"
                                    size="default"
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handleChangePage(currentPage - 1)}
                                />
                            </PaginationItem>
                        </>
                    )}
                    {renderItems}
                    {currentPage < totalPages && (
                        <>
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handleChangePage(currentPage + 1)}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => handleChangePage(totalPages)}
                                    aria-label="Ir para a última página"
                                    size="default"
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
}
