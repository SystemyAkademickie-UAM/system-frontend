import { PageHeader } from '../../../../components/ui/index.js';

export default function GroupMainActivitiesPage() {
  return (
    <section aria-labelledby="main-activities-title">
      <PageHeader
        title="Lista aktywności"
        description="Przeglądaj dostępne aktywności w grupie."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — lista aktywności studenta.
      </p>
    </section>
  );
}
