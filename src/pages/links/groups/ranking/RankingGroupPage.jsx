import { PageHeader } from '../../../../components/ui/index.js';

export default function RankingGroupPage() {
  return (
    <section aria-labelledby="ranking-group-title">
      <PageHeader
        title="Ranking grupy"
        description="Przeglądaj ranking wszystkich uczestników."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — ranking grupy.
      </p>
    </section>
  );
}
