import { PageHeader } from '../../../../components/ui/index.js';

export default function RankingHomePage() {
  return (
    <section aria-labelledby="ranking-home-title">
      <PageHeader
        title="Twoje informacje"
        description="Twoja pozycja i statystyki w grupie."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — Twoje informacje rankingowe.
      </p>
    </section>
  );
}
