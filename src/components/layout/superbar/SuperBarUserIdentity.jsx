import './SuperBar.css';

/** Nazwa i rola użytkownika (placeholdery — docelowo z API). */
export default function SuperBarUserIdentity({ displayName, roleLabel }) {
  return (
    <div className="super-bar-user-identity">
      <p className="super-bar-user-identity__name">{displayName}</p>
      <p className="super-bar-user-identity__role">{roleLabel}</p>
    </div>
  );
}
