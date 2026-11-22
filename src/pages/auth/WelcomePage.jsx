/**
 * @file WelcomePage.jsx
 * @description Główny komponent widoku strony dla obszaru WelcomePage.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { Navigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext.jsx';
import { groupsListPath } from '../../routes/pathRegistry.js';
import WelcomeContent from './WelcomeContent.jsx';
import '../../components/guards/RouteGuard.css';

// === GŁÓWNY KOMPONENT WIDOKU ===
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

// === RENDEROWANIE WIDOKU ===
  return <WelcomeContent />;
}
