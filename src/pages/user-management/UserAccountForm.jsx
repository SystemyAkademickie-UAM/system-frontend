import Button from '../../components/ui/Button/Button.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import {
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
  onGrant,
  onRemove,
  onSendLink,
  onExit,
}) {
  const otherRole = form.role === ACCOUNT_ROLE_STUDENT || form.role === ACCOUNT_ROLE_LECTURER;
  return (
    <form className="user-management__form" onSubmit={(event) => event.preventDefault()}>
      {mode === 'create' ? (
        <TextField
          id="account-email"
          label={copy.email}
          value={form.email}
          maxLength={ORGANIZATION_ACCOUNT_EMAIL_MAX_LENGTH}
          required
          onChange={(event) => onChange('email', event.target.value)}
        />
      ) : null}
      <TextField
        id="account-name"
        label={copy.name}
        value={form.name}
        maxLength={ORGANIZATION_ACCOUNT_NAME_MAX_LENGTH}
        required
        onChange={(event) => onChange('name', event.target.value)}
      />
      <TextField
        id="account-surname"
        label={copy.surname}
        value={form.surname}
        maxLength={ORGANIZATION_ACCOUNT_NAME_MAX_LENGTH}
        required
        onChange={(event) => onChange('surname', event.target.value)}
      />
      <TextField
        id="account-nickname"
        label={copy.nickname}
        value={form.nickname}
        maxLength={ORGANIZATION_ACCOUNT_NAME_MAX_LENGTH}
        onChange={(event) => onChange('nickname', event.target.value)}
      />
      {mode === 'create' ? (
        <label className="user-management__role" htmlFor="account-role">
          {copy.role}
          <select id="account-role" value={form.role} onChange={(event) => onChange('role', event.target.value)}>
            <option value={ACCOUNT_ROLE_STUDENT}>{copy.student}</option>
            <option value={ACCOUNT_ROLE_LECTURER}>{copy.lecturer}</option>
          </select>
        </label>
      ) : <p>{copy.roleLabel}</p>}
      <div className="user-management__toolbar">
        <Button onClick={onSave}>{copy.save}</Button>
        {mode === 'create' ? <Button variant="secondary" onClick={onSaveAnother}>{copy.saveAnother}</Button> : null}
        {mode === 'edit' && otherRole ? <Button variant="secondary" onClick={onGrant}>{copy.grant}</Button> : null}
        {mode === 'edit' ? <Button variant="danger" onClick={onRemove}>{copy.remove}</Button> : null}
        {mode === 'edit' && emailOrganization ? <Button variant="secondary" onClick={onSendLink}>{copy.link}</Button> : null}
        <Button variant="ghost" onClick={onExit}>{copy.exit}</Button>
      </div>
    </form>
  );
}
