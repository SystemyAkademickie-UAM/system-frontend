import { PageHeader } from '../../../../components/ui/index.js';

export default function RewardsHomePage() {
  return (
    <section aria-labelledby="rewards-home-title">
      <PageHeader
        title="Rangi"
        description="Zarządzaj systemem rang w grupie."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — rangi (systemy nagród).
      </p>
    </section>
  );
}
