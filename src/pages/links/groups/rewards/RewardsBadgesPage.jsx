import { PageHeader } from '../../../../components/ui/index.js';

export default function RewardsBadgesPage() {
  return (
    <section aria-labelledby="rewards-badges-title">
      <PageHeader
        title="Odznaki"
        description="Zarządzaj odznakami w grupie."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — odznaki (systemy nagród).
      </p>
    </section>
  );
}
