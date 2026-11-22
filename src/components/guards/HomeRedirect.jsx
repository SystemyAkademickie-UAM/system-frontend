/**
 * @file HomeRedirect.jsx
 * @description Komponent interfejsu użytkownika HomeRedirect.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext.jsx';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../navigation/shellTemplates.config.js';
import {
  fetchRegistrationStatus,
  isRegistrationComplete,
} from '../../services/registrationStatus.api.js';
import {
  adminHomePath,
  groupsListPath,
  maintenancePath,
  organizationsPath,
  registerPath,
  welcomePath,
} from '../../routes/pathRegistry.js';
import {
  fetchMaintenanceStatus,
  isCachedMaintenanceActive,
} from '../../services/maintenance.api.js';
import './RouteGuard.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const REGISTRATION_STATE = {
  PENDING: 'pending',
  COMPLETE: 'complete',
  INCOMPLETE: 'incomplete',
  ANONYMOUS: 'anonymous',
};

/**
 * Session-aware entry route for `/`.
 * Anonymous → `/welcome`; authenticated + incomplete registration → `/login`; else → `/groups`.
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function HomeRedirect() {
  const { isAuthenticated, isLoading } = useSession();
  const { role } = useAppRole();
  const [registrationState, setRegistrationState] = useState(REGISTRATION_STATE.PENDING);
  const [isMaintenance, setIsMaintenance] = useState(
    role !== APP_ROLE.SUPERADMIN && isCachedMaintenanceActive(),
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    let cancelled = false;

    async function checkMaintenanceAndState() {
      if (role !== APP_ROLE.SUPERADMIN) {
        const mStatus = await fetchMaintenanceStatus();
        if (cancelled) return;
        if (mStatus?.enabled) {
          setIsMaintenance(true);
          return;
        }
      }

      if (!isAuthenticated) {
        setRegistrationState(REGISTRATION_STATE.ANONYMOUS);
        return;
      }

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
    void checkMaintenanceAndState();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, role]);

  if (isMaintenance && role !== APP_ROLE.SUPERADMIN) {
    return <Navigate to={maintenancePath()} replace />;
  }

  if (isLoading || (isAuthenticated && registrationState === REGISTRATION_STATE.PENDING)) {
    return (
      <div className="route-guard-loading" aria-busy="true" aria-label="Ładowanie...">
        <span className="route-guard-loading__spinner" />
      </div>
    );
  }

  if (!isAuthenticated || registrationState === REGISTRATION_STATE.ANONYMOUS) {
    return <Navigate to={welcomePath()} replace />;
  }

  if (registrationState === REGISTRATION_STATE.INCOMPLETE) {
    return <Navigate to={registerPath()} replace />;
  }

// === RENDEROWANIE WIDOKU ===
  if (role === APP_ROLE.SUPERADMIN) {
    return <Navigate to={organizationsPath()} replace />;
  }
  if (role === APP_ROLE.ADMIN) {
    return <Navigate to={adminHomePath()} replace />;
  }
  return <Navigate to={groupsListPath()} replace />;
}
