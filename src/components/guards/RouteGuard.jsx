import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../../context/SessionContext.jsx';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import { groupsListPath, loginPath } from '../../routes/pathRegistry.js';
import './RouteGuard.css';

/**
 * Strażnik tras — sprawdza uwierzytelnienie i uprawnienia roli.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children — chroniony komponent
 * @param {boolean} [props.requireAuth=true] — czy wymagane zalogowanie
 * @param {string[]} [props.allowedRoles] — dozwolone role (puste = wszystkie zalogowane)
 * @param {string} [props.redirectTo] — gdzie przekierować przy braku dostępu
 */
export default function RouteGuard({
  children,
  requireAuth = true,
  allowedRoles,
  redirectTo,
}) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useSession();
  const { role } = useAppRole();

  if (isLoading) {
    return (
      <div className="route-guard-loading" aria-busy="true" aria-label="Ładowanie...">
        <span className="route-guard-loading__spinner" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo || loginPath()} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.includes(role);
    if (!hasAccess) {
      const fallback = redirectTo ?? (isAuthenticated ? groupsListPath() : loginPath());
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
}
