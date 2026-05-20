import { PageHeader } from '../../../../components/ui/index.js';

export default function ProfileLogPage() {
  return (
    <section aria-labelledby="profile-log-title">
      <PageHeader
        title="Aktywności"
        description="Historia Twoich aktywności w grupie."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — log aktywności użytkownika.
      </p>
    </section>
  );
}
