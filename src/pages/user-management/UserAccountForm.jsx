/**
 * @file UserAccountForm.jsx
 * @description Formularz tworzenia i edycji konta użytkownika w organizacji (używany w modalu).
 */

import Button from '../../components/ui/Button/Button.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import {
  ACCOUNT_ROLE_ADMINISTRATOR,
  ACCOUNT_ROLE_LECTURER,
  ACCOUNT_ROLE_STUDENT,
  ORGANIZATION_ACCOUNT_EMAIL_MAX_LENGTH,
  ORGANIZATION_ACCOUNT_NAME_MAX_LENGTH,
} from '../../constants/organizationAdmin.constants.js';

export default function UserAccountForm({
  mode,
  form,
  copy,
  emailOrganization,
  onChange,
  onSave,
  onSaveAnother,
  onGrantRole,
  onRemove,
  onSendLink,
  onExit,
  canManageAdministrators = false,
}) {
  const currentRole = form.role;
  const showRemove = canManageAdministrators || currentRole !== ACCOUNT_ROLE_ADMINISTRATOR;

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

      {mode === 'create' ? (
        <div className="user-management__role">
          <label className="org-form__label" htmlFor="account-role">
            {copy.role} <span className="org-form__required">*</span>
          </label>
          <select
            id="account-role"
            className="org-form__select"
            value={form.role}
            onChange={(event) => onChange('role', event.target.value)}
          >
            <option value={ACCOUNT_ROLE_STUDENT}>{copy.student}</option>
            <option value={ACCOUNT_ROLE_LECTURER}>{copy.lecturer}</option>
            {canManageAdministrators ? (
              <option value={ACCOUNT_ROLE_ADMINISTRATOR}>{copy.administrator}</option>
            ) : null}
          </select>
        </div>
      ) : (
        <div className="user-management__role-display">
          <span className="user-management__role-label">{copy.role}:</span>
          <strong>
            {currentRole === ACCOUNT_ROLE_STUDENT && copy.student}
            {currentRole === ACCOUNT_ROLE_LECTURER && copy.lecturer}
            {currentRole === ACCOUNT_ROLE_ADMINISTRATOR && copy.administrator}
            {currentRole === 'super' && (copy.superadmin ?? 'Osoba nadzorująca')}
          </strong>
        </div>
      )}

      {mode === 'edit' ? (
        <div className="user-management__grant-roles">
          <span className="user-management__grant-title">Nadaj dodatkową rolę tej osobie:</span>
          <div className="user-management__grant-buttons">
            {currentRole !== ACCOUNT_ROLE_STUDENT ? (
              <Button size="sm" variant="secondary" onClick={() => onGrantRole(ACCOUNT_ROLE_STUDENT)}>
                + {copy.student}
              </Button>
            ) : null}
            {currentRole !== ACCOUNT_ROLE_LECTURER ? (
              <Button size="sm" variant="secondary" onClick={() => onGrantRole(ACCOUNT_ROLE_LECTURER)}>
                + {copy.lecturer}
              </Button>
            ) : null}
            {canManageAdministrators && currentRole !== ACCOUNT_ROLE_ADMINISTRATOR ? (
              <Button size="sm" variant="secondary" onClick={() => onGrantRole(ACCOUNT_ROLE_ADMINISTRATOR)}>
                + {copy.administrator}
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

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
