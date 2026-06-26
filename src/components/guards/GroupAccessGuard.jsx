import { Navigate, Outlet, useParams } from 'react-router-dom';
import { groupRootPath } from '../../routes/pathRegistry.js';
import { useGroupPreview } from '../../hooks/groups/useGroupPreview.js';

/**
 * Blokuje dostęp do podstron grupy bez uprawnień (właściciel / zapisany student).
 * Przekierowuje na landing `/groups/:groupId` z formularzem kodu lub komunikatem.
 */
export default function GroupAccessGuard() {
  const { groupId } = useParams();
  const { group, hasAccess, isLoading, errorMessage } = useGroupPreview(groupId);

  if (isLoading) {
    return <p className="group-access-guard__loading" role="status">Sprawdzanie dostępu do grupy…</p>;
  }

  if (!group || errorMessage) {
    return <Navigate to={groupRootPath(groupId)} replace />;
  }

  if (!hasAccess) {
    return <Navigate to={groupRootPath(groupId)} replace />;
  }

  return <Outlet />;
}
