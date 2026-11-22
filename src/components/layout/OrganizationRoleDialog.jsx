/**
 * @file OrganizationRoleDialog.jsx
 * @description Komponent interfejsu użytkownika OrganizationRoleDialog.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useEffect, useState } from 'react';
import Modal from '../ui/Modal/Modal.jsx';
import { AUTH_LOGIN_CONTEXT_PATH } from '../../constants/authPaths.constants.js';
import { postJson } from '../../services/api-client.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import './OrganizationRoleDialog.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const ROLE_LABEL = {
  student: { polish: 'Osoba studiująca', english: 'Student' },
  lecturer: { polish: 'Osoba prowadząca', english: 'Lecturer' },
  administrator: { polish: 'Osoba administrująca', english: 'Administrator' },
  super: { polish: 'Osoba nadzorująca', english: 'Supervisor' },
};

const TITLE = {
  both: { polish: 'Wybierz organizację i rolę', english: 'Choose organization and role' },
  organization: { polish: 'Wybierz organizację', english: 'Choose organization' },
  role: { polish: 'Wybierz rolę', english: 'Choose role' },
};

const CHANGE_TITLE = {
  both: { polish: 'Zmień rolę lub organizację', english: 'Change role or organization' },
  organization: { polish: 'Zmień organizację', english: 'Change organization' },
  role: { polish: 'Zmień rolę', english: 'Change role' },
};

const SUBTITLE = {
  polish: 'Wybór zostanie zapamiętany przy następnym logowaniu.',
  english: 'This choice is remembered for the next login.',
};

const ORGANIZATION_FIELD = { polish: 'Organizacja', english: 'Organization' };
const ROLE_FIELD = { polish: 'Rola', english: 'Role' };
const CONFIRM_LABEL = { polish: 'Kontynuuj', english: 'Continue' };
const SAVE_ERROR = {
  polish: 'Nie udało się zapisać wyboru.',
  english: 'Could not save the choice.',
};
const MAINTENANCE_BLOCKED_ERROR = {
  polish: 'Nie można zmienić roli podczas trwania przerwy technicznej.',
  english: 'Cannot change role while technical maintenance mode is active.',
};

/**
 * @param {unknown} memberships
 * @returns {{ canChange: boolean, kind: 'both' | 'organization' | 'role' }}
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export function loginContextMenu(memberships) {
  const list = Array.isArray(memberships) ? memberships : [];
  const showOrganization = list.length > 1;
  const showRole = list.some((item) => Array.isArray(item.roles) && item.roles.length > 1);
  if (showOrganization && showRole) {
    return { canChange: true, kind: 'both' };
  }
  if (showOrganization) {
    return { canChange: true, kind: 'organization' };
  }
  if (showRole) {
    return { canChange: true, kind: 'role' };
  }
  return { canChange: false, kind: 'role' };
}

/**
 * @param {unknown} memberships
 * @param {'polish' | 'english'} language
 * @returns {string | null}
 */
export function loginContextMenuLabel(memberships, language) {
  const menu = loginContextMenu(memberships);
  if (!menu.canChange) {
    return null;
  }
  return CHANGE_TITLE[menu.kind][language];
}

function roleLabel(role, language) {
  const labels = ROLE_LABEL[role];
  if (!labels) {
    return role;
  }

return labels[language];
}

/**
 * Centered organization and role picker.
 * The organization control is hidden when the user belongs to one organization.
 * The role control is hidden when the selected organization has one role.
 */
export default function OrganizationRoleDialog({
  isOpen,
  required = false,
  memberships = [],
  organizationId = null,
  role = null,
  onClose,
  onSaved,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const list = Array.isArray(memberships) ? memberships : [];
    const initialOrganization = list.find(
      (item) => item.organizationId === Number(organizationId),
    ) ?? list[0] ?? null;
    const initialRole = initialOrganization?.roles?.includes(role)
      ? role
      : initialOrganization?.roles?.[0] ?? null;
    setSelectedOrganizationId(initialOrganization?.organizationId ?? null);
    setSelectedRole(initialRole);
    setError(null);
    setIsSaving(false);
  }, [isOpen, memberships, organizationId, role]);

  const list = Array.isArray(memberships) ? memberships : [];

  // All unique available roles across user memberships
  const allAvailableRoles = Array.from(
    new Set(list.flatMap((item) => (Array.isArray(item.roles) ? item.roles : [])))
  );

  // Organizations that offer the currently selected role
  const orgsForSelectedRole = list.filter((item) =>
    Array.isArray(item.roles) && item.roles.includes(selectedRole)
  );

  const selectedOrganization = orgsForSelectedRole.find(
    (item) => item.organizationId === selectedOrganizationId,
  ) ?? orgsForSelectedRole[0] ?? list.find(
    (item) => item.organizationId === selectedOrganizationId,
  ) ?? null;

  const isSuperSelected = selectedRole === 'super';

  // Role control is shown when user has more than 1 role across memberships
  const showRole = allAvailableRoles.length > 1;

  // Organization control is hidden ONLY when 'super' is selected.
  // For all other roles, organization selector is shown whenever user belongs to at least one organization
  const showOrganization = !isSuperSelected && (orgsForSelectedRole.length > 0 || list.length > 0);

  const availableOrgs = orgsForSelectedRole.length > 0 ? orgsForSelectedRole : list;

  const menu = loginContextMenu(memberships);
  const titleSource = required ? TITLE : CHANGE_TITLE;
  const title = titleSource[menu.kind][LANGUAGE];

  const handleRoleChange = (event) => {
    const nextRole = event.target.value;
    setSelectedRole(nextRole);
    setError(null);

    // If super, auto-select the organization holding 'super' (usually internal org 1)
    if (nextRole === 'super') {
      const superOrg = list.find((item) => item.roles?.includes('super')) ?? list[0];
      if (superOrg) {
        setSelectedOrganizationId(superOrg.organizationId);
      }
    } else {
      // Find matching orgs that support the new role
      const nextOrgs = list.filter((item) => Array.isArray(item.roles) && item.roles.includes(nextRole));
      const currentOrgHasRole = nextOrgs.some((item) => item.organizationId === selectedOrganizationId);
      if (!currentOrgHasRole) {
        const nextOrg = nextOrgs[0] ?? list[0];
        if (nextOrg) {
          setSelectedOrganizationId(nextOrg.organizationId);
        }
      }
    }
  };

  const handleOrganizationChange = (event) => {
    const nextId = Number(event.target.value);
    setSelectedOrganizationId(nextId);
    setError(null);
  };

  const effectiveOrganizationId = isSuperSelected
    ? (list.find((item) => item.roles?.includes('super'))?.organizationId ?? selectedOrganizationId)
    : selectedOrganizationId;

  const handleConfirm = async () => {
    if (effectiveOrganizationId === null || !selectedRole || isSaving) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const result = await postJson(AUTH_LOGIN_CONTEXT_PATH, {
        organizationId: effectiveOrganizationId,
        role: selectedRole,
      });
      if (!result.ok) {
        if (result.data?.error === 'MAINTENANCE_ROLE_SWITCH_BLOCKED' || result.status === 409) {
          setError(MAINTENANCE_BLOCKED_ERROR[LANGUAGE]);
          return;
        }
        setError(SAVE_ERROR[LANGUAGE]);
        return;
      }
      await onSaved();
    } catch {
      setError(SAVE_ERROR[LANGUAGE]);
    } finally {
      setIsSaving(false);
    }
  };

// === RENDEROWANIE WIDOKU ===
  return (
    <Modal
      isOpen={isOpen}
      onClose={required ? () => {} : onClose}
      dismissible={!required}
      title={title}
      size="md"
      confirmLabel={CONFIRM_LABEL[LANGUAGE]}
      confirmDisabled={isSaving || effectiveOrganizationId === null || !selectedRole}
      onConfirm={() => {
        void handleConfirm();
      }}
    >
      <form
        className="organization-role-dialog"
        onSubmit={(event) => {
          event.preventDefault();
          void handleConfirm();
        }}
      >
        {showRole ? (
          <div className="organization-role-dialog__field">
            <label className="organization-role-dialog__label" htmlFor="login-context-role">
              {ROLE_FIELD[LANGUAGE]}
            </label>
            <select
              id="login-context-role"
              className="organization-role-dialog__select"
              value={selectedRole ?? ''}
              onChange={handleRoleChange}
            >
              {allAvailableRoles.map((itemRole) => (
                <option key={itemRole} value={itemRole}>
                  {roleLabel(itemRole, LANGUAGE)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {showOrganization ? (
          <div className="organization-role-dialog__field">
            <label className="organization-role-dialog__label" htmlFor="login-context-organization">
              {ORGANIZATION_FIELD[LANGUAGE]}
            </label>
            <select
              id="login-context-organization"
              className="organization-role-dialog__select"
              value={selectedOrganizationId ?? ''}
              onChange={handleOrganizationChange}
            >
              {availableOrgs.map((item) => (
                <option key={item.organizationId} value={item.organizationId}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {error ? (
          <p className="organization-role-dialog__error" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </Modal>
  );
}
