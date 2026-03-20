import { ListCategoria } from '@/components/categorias/categoria-list';

export const metadata = {
  title: 'Categorias - GranaFlow',
  description: 'Gerencie suas categorias de gastos',
};

export default function CategoriesPage() {
  return (
    <div>
      <ListCategoria />
    </div>
  );
}
