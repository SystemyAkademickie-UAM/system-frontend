import { PageHeader } from '../../../../components/ui/index.js';

export default function GroupMainRanksPage() {
  return (
    <section aria-labelledby="main-ranks-title">
      <PageHeader
        title="Rangi"
        description="Przeglądaj rangi dostępne w grupie."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — rangi grupy.
      </p>
    </section>
  );
}
