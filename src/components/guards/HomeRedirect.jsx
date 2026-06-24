import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext.jsx';
import {
  fetchRegistrationStatus,
  isRegistrationComplete,
} from '../../services/registrationStatus.api.js';
import { groupsListPath, loginPath, registerPath } from '../../routes/pathRegistry.js';
import './RouteGuard.css';

const REGISTRATION_STATE = {
  PENDING: 'pending',
  COMPLETE: 'complete',
  INCOMPLETE: 'incomplete',
  ANONYMOUS: 'anonymous',
};

/**
 * Session-aware entry route for `/`.
 * Anonymous → `/login`; authenticated + incomplete registration → `/login`; else → `/groups`.
 */
export default function HomeRedirect() {
  const { isAuthenticated, isLoading } = useSession();
  const [registrationState, setRegistrationState] = useState(REGISTRATION_STATE.PENDING);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      setRegistrationState(REGISTRATION_STATE.ANONYMOUS);
      return;
    }

    let cancelled = false;

    async function resolveRegistrationState() {
      const status = await fetchRegistrationStatus();
      if (cancelled) {
        return;
      }
      setRegistrationState(
        isRegistrationComplete(status)
          ? REGISTRATION_STATE.COMPLETE
          : REGISTRATION_STATE.INCOMPLETE,
      );
    }

    setRegistrationState(REGISTRATION_STATE.PENDING);
    void resolveRegistrationState();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading]);

  if (isLoading || (isAuthenticated && registrationState === REGISTRATION_STATE.PENDING)) {
    return (
      <div className="route-guard-loading" aria-busy="true" aria-label="Ładowanie...">
        <span className="route-guard-loading__spinner" />
      </div>
    );
  }

  if (!isAuthenticated || registrationState === REGISTRATION_STATE.ANONYMOUS) {
    return <Navigate to={loginPath()} replace />;
  }

  if (registrationState === REGISTRATION_STATE.INCOMPLETE) {
    return <Navigate to={registerPath()} replace />;
  }

  return <Navigate to={groupsListPath()} replace />;
}
