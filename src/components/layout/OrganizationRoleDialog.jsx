import { useEffect, useState } from 'react';
import Modal from '../ui/Modal/Modal.jsx';
import { AUTH_LOGIN_CONTEXT_PATH } from '../../constants/authPaths.constants.js';
import { postJson } from '../../services/api-client.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import './OrganizationRoleDialog.css';

const ROLE_LABEL = {
  student: { polish: 'Osoba studiująca', english: 'Student' },
  lecturer: { polish: 'Osoba prowadząca', english: 'Lecturer' },
  administrator: { polish: 'Osoba administrująca', english: 'Administrator' },
  super: { polish: 'Nadrzędna osoba administrująca', english: 'Superadmin' },
};

const TITLE = {
  both: { polish: 'Wybierz organizację i rolę', english: 'Choose organization and role' },
  organization: { polish: 'Wybierz organizację', english: 'Choose organization' },
  role: { polish: 'Wybierz rolę', english: 'Choose role' },
};

const CHANGE_TITLE = {
  both: { polish: 'Zmień organizację i rolę', english: 'Change organization and role' },
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

/**
 * @param {unknown} memberships
 * @returns {{ canChange: boolean, kind: 'both' | 'organization' | 'role' }}
 */
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

  const selectedOrganization = (Array.isArray(memberships) ? memberships : []).find(
    (item) => item.organizationId === selectedOrganizationId,
  ) ?? null;
  const showOrganization = Array.isArray(memberships) && memberships.length > 1;
  const showRole = (selectedOrganization?.roles?.length ?? 0) > 1;
  const menu = loginContextMenu(memberships);
  const titleSource = required ? TITLE : CHANGE_TITLE;
  const title = titleSource[menu.kind][LANGUAGE];

  const handleOrganizationChange = (event) => {
    const nextId = Number(event.target.value);
    const nextOrganization = memberships.find((item) => item.organizationId === nextId);
    setSelectedOrganizationId(nextId);
    setSelectedRole((current) => (
      nextOrganization?.roles?.includes(current) ? current : nextOrganization?.roles?.[0] ?? null
    ));
    setError(null);
  };

  const handleConfirm = async () => {
    if (selectedOrganizationId === null || !selectedRole || isSaving) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const result = await postJson(AUTH_LOGIN_CONTEXT_PATH, {
        organizationId: selectedOrganizationId,
        role: selectedRole,
      });
      if (!result.ok) {
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={required ? () => {} : onClose}
      dismissible={!required}
      title={title}
      subtitle={SUBTITLE[LANGUAGE]}
      size="md"
      confirmLabel={CONFIRM_LABEL[LANGUAGE]}
      confirmDisabled={isSaving || selectedOrganizationId === null || !selectedRole}
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
              {memberships.map((item) => (
                <option key={item.organizationId} value={item.organizationId}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {showRole ? (
          <div className="organization-role-dialog__field">
            <label className="organization-role-dialog__label" htmlFor="login-context-role">
              {ROLE_FIELD[LANGUAGE]}
            </label>
            <select
              id="login-context-role"
              className="organization-role-dialog__select"
              value={selectedRole ?? ''}
              onChange={(event) => {
                setSelectedRole(event.target.value);
                setError(null);
              }}
            >
              {(selectedOrganization?.roles ?? []).map((itemRole) => (
                <option key={itemRole} value={itemRole}>
                  {roleLabel(itemRole, LANGUAGE)}
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
