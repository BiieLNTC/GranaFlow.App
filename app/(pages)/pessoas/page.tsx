import { ListPessoa } from '@/components/pessoa/pessoa-list';

export const metadata = {
  title: 'Pessoas - GranaFlow',
  description: 'Gerencie as pessoas nas suas transações',
};

export default function PeoplePage() {
  return (
    <div>
      <ListPessoa />
    </div>
  );
}
