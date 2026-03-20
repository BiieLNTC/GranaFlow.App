import { CalendarIcon, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns/format";
import { ptBR } from "date-fns/locale/pt-BR";
import { toast } from 'sonner';

type Props = {
    onFilter: (dataInicial: Date, dataFinal: Date) => void,
    dataInicial: Date,
    dataFinal: Date,
    setDataInicial: (date: Date) => void
    setDataFinal: (date: Date) => void
}

export default function DateFilter({ onFilter, dataInicial, dataFinal, setDataInicial, setDataFinal }: Props) {
    function filtrar() {
        if (dataInicial > dataFinal) {
            toast.error("A Data Inicial não pode ser maior que a Data Final")
            return;
        }

        onFilter(dataInicial, dataFinal)
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
            <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Data Inicial</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn("w-full sm:w-auto justify-start text-left font-normal text-muted-foreground")}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span className="truncate">{format(dataInicial, "dd/MM/yyyy", { locale: ptBR })}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={dataInicial}
                            onSelect={(date) => date && setDataInicial(date)}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Data Final</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn("w-full sm:w-auto justify-start text-left font-normal text-muted-foreground")}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span className="truncate">{format(dataFinal, "dd/MM/yyyy", { locale: ptBR })}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={dataFinal}
                            onSelect={(date) => date && setDataFinal(date)}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div style={{ marginTop: '17px' }}>
                <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => filtrar()}
                >
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                </Button>
            </div>
        </div>
    )
}