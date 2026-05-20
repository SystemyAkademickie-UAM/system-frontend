import { PageHeader } from '../../../../components/ui/index.js';

export default function PostsHomePage() {
  return (
    <section aria-labelledby="posts-home-title">
      <PageHeader
        title="Wpisy"
        description="Zarządzaj wpisami w grupie."
      />
      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>
        Strona w budowie — wpisy grupy.
      </p>
    </section>
  );
}
