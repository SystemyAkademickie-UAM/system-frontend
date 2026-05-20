import { PageHeader } from '../../../../components/ui/index.js';

export default function MembersLogPage() {
  return (
    <section aria-labelledby="members-log-title">
      <PageHeader
        title="Log aktywności"
        description="Przeglądaj historię aktywności uczestników."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — log aktywności uczestników.
      </p>
    </section>
  );
}
