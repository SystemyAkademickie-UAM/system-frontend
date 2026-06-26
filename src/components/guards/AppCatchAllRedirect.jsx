import { Navigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext.jsx';
import { groupsListPath, welcomePath } from '../../routes/pathRegistry.js';
import './RouteGuard.css';

export default function AppCatchAllRedirect() {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="route-guard-loading" aria-busy="true" aria-label="Ładowanie...">
        <span className="route-guard-loading__spinner" />
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? groupsListPath() : welcomePath()} replace />;
}
