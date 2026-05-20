import { PageHeader } from '../../../../components/ui/index.js';

export default function MembersHomePage() {
  return (
    <section aria-labelledby="members-home-title">
      <PageHeader
        title="Uczestnicy"
        description="Zarządzaj uczestnikami grupy."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — lista uczestników grupy.
      </p>
    </section>
  );
}
