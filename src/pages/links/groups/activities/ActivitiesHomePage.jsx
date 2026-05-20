import { PageHeader } from '../../../../components/ui/index.js';

export default function ActivitiesHomePage() {
  return (
    <section aria-labelledby="activities-home-title">
      <PageHeader
        title="Etapy"
        description="Zarządzaj etapami i aktywnościami grupy."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — etapy i aktywności.
      </p>
    </section>
  );
}
