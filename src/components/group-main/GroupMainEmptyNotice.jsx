import { Link } from 'react-router-dom';

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
