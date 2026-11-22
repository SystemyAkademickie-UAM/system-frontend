/**
 * @file UserAccountForm.jsx
 * @description Formularz tworzenia i edycji konta użytkownika w organizacji z pionową listą ról.
 */

import Button from '../../components/ui/Button/Button.jsx';
import Checkbox from '../../components/ui/Checkbox/Checkbox.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import {
  ACCOUNT_ROLE_ADMINISTRATOR,
  ACCOUNT_ROLE_LECTURER,
  ACCOUNT_ROLE_STUDENT,
  ACCOUNT_ROLE_SUPER,
  ORGANIZATION_ACCOUNT_EMAIL_MAX_LENGTH,
  ORGANIZATION_ACCOUNT_NAME_MAX_LENGTH,
} from '../../constants/organizationAdmin.constants.js';

/**
 * @param {{
 *   mode: 'create' | 'edit',
 *   form: {
 *     email?: string,
 *     name?: string,
 *     surname?: string,
 *     nickname?: string,
 *     role?: string,
 *     roles?: string[],
 *   },
 *   copy: Record<string, string>,
 *   emailOrganization?: boolean,
 *   allowSuper?: boolean,
 *   onChange: (key: string, value: any) => void,
 *   onSave: () => void,
 *   onSaveAnother?: () => void,
 *   onRemove?: () => void,
 *   onSendLink?: () => void,
 *   onExit: () => void,
 * }} props
 */
export default function UserAccountForm({
  mode,
  form,
  copy,
  emailOrganization,
  allowSuper = false,
  onChange,
  onSave,
  onSaveAnother,
  onRemove,
  onSendLink,
  onExit,
  canManageAdministrators = false,
}) {
  const selectedRoles = Array.isArray(form.roles)
    ? form.roles
    : (form.role ? [form.role] : [ACCOUNT_ROLE_STUDENT]);

  const handleRoleToggle = (roleValue, isChecked) => {
    let nextRoles = [...selectedRoles];
    if (isChecked) {
      if (!nextRoles.includes(roleValue)) {
        nextRoles.push(roleValue);
      }
    } else {
      nextRoles = nextRoles.filter((r) => r !== roleValue);
    }
    onChange('roles', nextRoles);
    if (nextRoles.length > 0) {
      onChange('role', nextRoles[0]);
    }
  };

  const roleOptions = [
    ...(allowSuper || selectedRoles.includes(ACCOUNT_ROLE_SUPER)
      ? [{ value: ACCOUNT_ROLE_SUPER, label: copy.superadmin ?? 'Osoba nadzorująca' }]
      : []),
    ...(canManageAdministrators || selectedRoles.includes(ACCOUNT_ROLE_ADMINISTRATOR)
      ? [{ value: ACCOUNT_ROLE_ADMINISTRATOR, label: copy.administrator }]
      : []),
    { value: ACCOUNT_ROLE_LECTURER, label: copy.lecturer },
    { value: ACCOUNT_ROLE_STUDENT, label: copy.student },
  ];

  const showRemove = canManageAdministrators || !selectedRoles.includes(ACCOUNT_ROLE_ADMINISTRATOR);

  return (
    <form className="user-management__form-modal" onSubmit={(event) => event.preventDefault()}>
      {mode === 'create' ? (
        <TextField
          id="account-email"
          label={
            <span>
              {copy.email} <span className="org-form__required">*</span>
            </span>
          }
          value={form.email}
          maxLength={ORGANIZATION_ACCOUNT_EMAIL_MAX_LENGTH}
          required
          onChange={(event) => onChange('email', event.target.value)}
        />
      ) : null}

      <TextField
        id="account-name"
        label={
          <span>
            {copy.name} <span className="org-form__required">*</span>
          </span>
        }
        value={form.name}
        maxLength={ORGANIZATION_ACCOUNT_NAME_MAX_LENGTH}
        required
        onChange={(event) => onChange('name', event.target.value)}
      />

      <TextField
        id="account-surname"
        label={
          <span>
            {copy.surname} <span className="org-form__required">*</span>
          </span>
        }
        value={form.surname}
        maxLength={ORGANIZATION_ACCOUNT_NAME_MAX_LENGTH}
        required
        onChange={(event) => onChange('surname', event.target.value)}
      />

      <TextField
        id="account-nickname"
        label={
          <span>
            {copy.nickname} <span className="org-form__required">*</span>
          </span>
        }
        value={form.nickname}
        maxLength={ORGANIZATION_ACCOUNT_NAME_MAX_LENGTH}
        required
        onChange={(event) => onChange('nickname', event.target.value)}
      />

      <div className="user-management__roles-section">
        <label className="org-form__label">
          {copy.role} <span className="org-form__required">*</span>
        </label>
        <div className="user-management__roles-list" role="group" aria-label={copy.role}>
          {roleOptions.map((roleOpt) => (
            <Checkbox
              key={roleOpt.value}
              id={`account-role-${roleOpt.value}`}
              name="account-roles"
              checked={selectedRoles.includes(roleOpt.value)}
              onChange={(checked) => handleRoleToggle(roleOpt.value, checked)}
              label={roleOpt.label}
              variant="danger"
            />
          ))}
        </div>
        {selectedRoles.length === 0 ? (
          <span className="user-management__role-error" role="alert">
            {copy.atLeastOneRoleRequired}
          </span>
        ) : null}
      </div>

      <div className="user-management__modal-actions">
        <Button variant="ghost" onClick={onExit}>
          {copy.exit}
        </Button>
        {mode === 'edit' && showRemove ? (
          <Button variant="danger" onClick={onRemove}>
            {copy.remove}
          </Button>
        ) : null}
        {mode === 'edit' && emailOrganization ? (
          <Button variant="secondary" onClick={onSendLink}>
            {copy.link}
          </Button>
        ) : null}
        {mode === 'create' ? (
          <Button variant="secondary" onClick={onSaveAnother}>
            {copy.saveAnother}
          </Button>
        ) : null}
        <Button variant="primary" onClick={onSave}>
          {copy.save}
        </Button>
      </div>
    </form>
  );
}
