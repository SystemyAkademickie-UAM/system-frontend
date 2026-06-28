import { Navigate, Outlet, useParams } from 'react-router-dom';
import { groupMainPath } from '../../routes/pathRegistry.js';
import { useGroupPreview } from '../../hooks/groups/useGroupPreview.js';

/**
 * Restricts Game Master management routes to the group owner only.
 * Guest lecturers (enrolled via code) are redirected to the group home screen.
 */
export default function GroupOwnerGuard() {
  const { groupId } = useParams();
  const { group, isOwner, isLoading, errorMessage } = useGroupPreview(groupId);

  if (isLoading) {
    return <p className="group-access-guard__loading" role="status">Sprawdzanie uprawnień do grupy…</p>;
  }

  if (!group || errorMessage || !isOwner) {
    return <Navigate to={groupMainPath(groupId)} replace />;
  }

  return <Outlet />;
}
