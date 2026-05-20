import { PageHeader } from '../../../../components/ui/index.js';

export default function RankingActivitiesPage() {
  return (
    <section aria-labelledby="ranking-activities-title">
      <PageHeader
        title="Ranking aktywności"
        description="Przeglądaj ranking według aktywności."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — ranking aktywności.
      </p>
    </section>
  );
}
