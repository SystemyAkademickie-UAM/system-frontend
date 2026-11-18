/**
 * @file OrganizationAdminsModal.jsx
 * @description Modal przypisywania i zarządzania administratorami organizacji.
 */

import { useCallback, useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal/Modal.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner.jsx';
import { useToast } from '../../components/ui/Toast/Toast.jsx';
import {
  grantOrganizationAdministrator,
  listOrganizationAdministrators,
  revokeOrganizationAdministrator,
} from '../../services/organizations.api.js';

export default function OrganizationAdminsModal({ isOpen, onClose, organization, onAdminListChanged }) {
  const { showSuccess, showError } = useToast();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [granting, setGranting] = useState(false);
  const [revokingId, setRevokingId] = useState(null);

  const loadAdmins = useCallback(async () => {
    if (!organization) return;
    setLoading(true);
    try {
      const data = await listOrganizationAdministrators(organization.id);
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Nie udało się pobrać listy administratorów.');
    } finally {
      setLoading(false);
    }
  }, [organization, showError]);

  useEffect(() => {
    if (isOpen && organization) {
      setEmailInput('');
      loadAdmins();
    }
  }, [isOpen, organization, loadAdmins]);

  async function handleGrant(event) {
    if (event) event.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showError('Podaj prawidłowy adres e-mail użytkownika.');
      return;
    }

    setGranting(true);
    try {
      await grantOrganizationAdministrator(organization.id, cleanEmail);
      showSuccess(`Rola administratora została przypisana użytkownikowi ${cleanEmail}.`);
      setEmailInput('');
      await loadAdmins();
      if (onAdminListChanged) onAdminListChanged();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Nie udało się przypisać administratora.');
    } finally {
      setGranting(false);
    }
  }

  async function handleRevoke(admin) {
    const confirmRevoke = window.confirm(
      `Czy na pewno chcesz odebrać uprawnienia administratora użytkownikowi ${admin.name} ${admin.surname} (${admin.email})?`
    );
    if (!confirmRevoke) return;

    setRevokingId(admin.accountId);
    try {
      await revokeOrganizationAdministrator(organization.id, admin.accountId);
      showSuccess('Uprawnienia administratora zostały odebrane.');
      await loadAdmins();
      if (onAdminListChanged) onAdminListChanged();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Nie udało się odebrać uprawnień.');
    } finally {
      setRevokingId(null);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Administratorzy organizacji"
      subtitle={organization ? `${organization.name} (ID: ${organization.id})` : ''}
      size="md"
      showFooter={false}
    >
      <div className="org-admins-modal">
        <form className="org-admins-modal__form" onSubmit={handleGrant}>
          <div className="org-admins-modal__input-row">
            <TextField
              id="admin-email-input"
              label="Adres e-mail użytkownika"
              placeholder="np. jan.kowalski@amu.edu.pl"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              disabled={granting}
            />
            <Button type="submit" disabled={granting || !emailInput.trim()}>
              {granting ? 'Przypisywanie...' : 'Przypisz administratora'}
            </Button>
          </div>
          <p className="org-admins-modal__hint">
            Wskaż istniejącego w systemie użytkownika, który ma zarządzać tą organizacją.
          </p>
        </form>

        <div className="org-admins-modal__list-container">
          <h4 className="org-admins-modal__list-title">
            Przypisane osoby ({admins.length})
          </h4>

          {loading ? (
            <div className="org-admins-modal__loading">
              <LoadingSpinner size="sm" />
              <span>Wczytywanie administratorów...</span>
            </div>
          ) : admins.length === 0 ? (
            <div className="org-admins-modal__empty">
              Brak przypisanych administratorów dla tej organizacji.
            </div>
          ) : (
            <ul className="org-admins-modal__list">
              {admins.map((admin) => (
                <li key={admin.accountId} className="org-admins-modal__item">
                  <div className="org-admins-modal__item-info">
                    <span className="org-admins-modal__item-name">
                      {admin.name} {admin.surname}
                      {admin.nickname ? ` (${admin.nickname})` : ''}
                    </span>
                    <span className="org-admins-modal__item-email">{admin.email}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={revokingId === admin.accountId}
                    onClick={() => handleRevoke(admin)}
                  >
                    {revokingId === admin.accountId ? 'Odbieranie...' : 'Odbierz uprawnienia'}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="org-admins-modal__footer">
          <Button variant="ghost" onClick={onClose}>
            Zamknij
          </Button>
        </div>
      </div>
    </Modal>
  );
}
