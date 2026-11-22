/**
 * @file GroupMainEmptyNotice.jsx
 * @description Komponent interfejsu użytkownika GroupMainEmptyNotice.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { Link } from 'react-router-dom';

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function GroupMainEmptyNotice({ message, linkLabel, linkTo }) {
  return (
    <p className="group-main-home__empty-notice">
      {message}{' '}
      {linkLabel && linkTo ? (
        <Link className="group-main-home__empty-link" to={linkTo}>
          {linkLabel}
        </Link>
      ) : null}
    </p>
  );
}
