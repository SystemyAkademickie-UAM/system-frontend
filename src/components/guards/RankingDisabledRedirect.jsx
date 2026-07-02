import { Navigate } from 'react-router-dom';
import { useOptionalGroupId } from '../../hooks/useOptionalGroupId.js';
import { groupMainPath, homePath } from '../../routes/pathRegistry.js';

/** Przekierowanie z wyłączonej sekcji /ranking do ekranu głównego grupy. */
export default function RankingDisabledRedirect() {
  const groupId = useOptionalGroupId();

  return (
    <Navigate
      to={groupId ? groupMainPath(groupId) : homePath()}
      replace
    />
  );
}
