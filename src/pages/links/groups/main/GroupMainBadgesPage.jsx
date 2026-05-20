import { PageHeader } from '../../../../components/ui/index.js';

export default function GroupMainBadgesPage() {
  return (
    <section aria-labelledby="main-badges-title">
      <PageHeader
        title="Odznaki"
        description="Przeglądaj odznaki dostępne w grupie."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — odznaki grupy.
      </p>
    </section>
  );
}
