import { PersonList } from '@/components/people/person-list';

export const metadata = {
  title: 'Pessoas - GranaFlow',
  description: 'Gerencie as pessoas nas suas transações',
};

export default function PeoplePage() {
  return (
    <div>
      <PersonList />
    </div>
  );
}
