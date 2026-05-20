import { PageHeader } from '../../../../components/ui/index.js';

export default function GroupSettingsHealthPage() {
  return (
    <section aria-labelledby="group-settings-health-title">
      <PageHeader
        title="System żyć"
        description="Konfiguruj system żyć w grupie."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — ustawienia systemu żyć.
      </p>
    </section>
  );
}
