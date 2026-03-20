import { ListTransacao } from '@/components/transacoes/transacao-list';

export const metadata = {
  title: 'Transações - GranaFlow',
  description: 'Registre suas receitas e despesas',
};

export default function TransactionsPage() {
  return (
    <div>
      <ListTransacao />
    </div>
  );
}
