import { CategoryList } from '@/components/categories/category-list';

export const metadata = {
  title: 'Categorias - GranaFlow',
  description: 'Gerencie suas categorias de gastos',
};

export default function CategoriesPage() {
  return (
    <div>
      <CategoryList />
    </div>
  );
}
