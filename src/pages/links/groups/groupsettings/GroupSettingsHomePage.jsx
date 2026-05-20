import { PageHeader } from '../../../../components/ui/index.js';

export default function GroupSettingsHomePage() {
  return (
    <section aria-labelledby="group-settings-home-title">
      <PageHeader
        title="Kreator grupy"
        description="Konfiguruj ustawienia grupy."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — kreator grupy.
      </p>
    </section>
  );
}
