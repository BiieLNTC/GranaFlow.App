import { TransactionList } from '@/components/transactions/transaction-list';

export const metadata = {
  title: 'Transações - GranaFlow',
  description: 'Registre suas receitas e despesas',
};

export default function TransactionsPage() {
  return (
    <div>
      <TransactionList />
    </div>
  );
}
