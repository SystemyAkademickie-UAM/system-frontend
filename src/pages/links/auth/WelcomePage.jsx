import { Navigate } from 'react-router-dom';
import { useSession } from '../../../context/SessionContext.jsx';
import { groupsListPath } from '../../../routes/pathRegistry.js';
import WelcomeContent from '../../content/auth/WelcomeContent.jsx';
import '../../../components/guards/RouteGuard.css';

export default function WelcomePage() {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="route-guard-loading" aria-busy="true" aria-label="Ładowanie...">
        <span className="route-guard-loading__spinner" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={groupsListPath()} replace />;
  }

  return <WelcomeContent />;
}
