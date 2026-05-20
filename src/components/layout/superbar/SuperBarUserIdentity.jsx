import './SuperBar.css';

/** Nazwa i rola użytkownika — dane z sesji lub placeholdery. */
export default function SuperBarUserIdentity({ displayName, roleLabel, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="super-bar-user-identity super-bar-user-identity--loading">
        <span className="super-bar-user-identity__skeleton" aria-hidden="true" />
        <span className="super-bar-user-identity__skeleton super-bar-user-identity__skeleton--short" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="super-bar-user-identity">
      <p className="super-bar-user-identity__name">{displayName}</p>
      <p className="super-bar-user-identity__role">{roleLabel}</p>
    </div>
  );
}
