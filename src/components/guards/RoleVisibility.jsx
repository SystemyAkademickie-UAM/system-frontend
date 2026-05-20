import { useAppRole } from '../../context/AppRoleContext.jsx';

/**
 * Warunkowe wyświetlanie elementów na podstawie roli użytkownika.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children — zawartość do wyświetlenia
 * @param {string[]} [props.allowedRoles] — role które widzą zawartość (puste = wszyscy)
 * @param {string[]} [props.excludedRoles] — role które NIE widzą zawartości
 * @param {React.ReactNode} [props.fallback] — co wyświetlić gdy brak dostępu (domyślnie null)
 */
export default function RoleVisibility({
  children,
  allowedRoles,
  excludedRoles,
  fallback = null,
}) {
  const { role } = useAppRole();

  if (excludedRoles && excludedRoles.length > 0) {
    if (excludedRoles.includes(role)) {
      return fallback;
    }
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role)) {
      return fallback;
    }
  }

  return children;
}
