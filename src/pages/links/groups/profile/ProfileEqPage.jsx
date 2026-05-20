import { PageHeader } from '../../../../components/ui/index.js';

export default function ProfileEqPage() {
  return (
    <section aria-labelledby="profile-eq-title">
      <PageHeader
        title="Ekwipunek"
        description="Twoje przedmioty i wyposażenie."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — ekwipunek użytkownika.
      </p>
    </section>
  );
}
