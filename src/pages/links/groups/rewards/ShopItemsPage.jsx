import { PageHeader } from '../../../../components/ui/index.js';

export default function ShopItemsPage() {
  return (
    <section aria-labelledby="shop-items-title">
      <PageHeader
        title="Przedmioty sklepowe"
        description="Zarządzaj przedmiotami dostępnymi w sklepie."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — przedmioty sklepowe.
      </p>
    </section>
  );
}
