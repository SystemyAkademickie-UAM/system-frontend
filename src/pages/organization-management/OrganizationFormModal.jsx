/**
 * @file OrganizationFormModal.jsx
 * @description Modal formularza tworzenia i edycji organizacji dla roli nadzorcy.
 */

import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal/Modal.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import { useToast } from '../../components/ui/Toast/Toast.jsx';
import { createOrganization, updateOrganization } from '../../services/organizations.api.js';

const INITIAL_FORM = {
  name: '',
  domain: '',
  loginMethod: 'email',
  isActive: true,
  representativeFullName: '',
  representativeEmail: '',
  representativePhone: '',
  addressTown: '',
  addressStreet: '',
  addressBuilding: '',
  addressPostalCode: '',
  addressCountry: 'PL',
  metadataUrl: '',
  entityId: '',
  ssoLoginUrl: '',
  ssoLogoutUrl: '',
  certificatePem: '',
};

export default function OrganizationFormModal({ isOpen, onClose, organization, onSaved }) {
  const { showSuccess, showError } = useToast();
  const isEdit = Boolean(organization);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (organization) {
      setForm({
        name: organization.name ?? '',
        domain: organization.domain ?? '',
        loginMethod: organization.loginMethod ?? 'email',
        isActive: organization.isActive ?? true,
        representativeFullName: organization.representative?.fullName ?? '',
        representativeEmail: organization.representative?.email ?? '',
        representativePhone: organization.representative?.phone ?? '',
        addressTown: organization.address?.town ?? '',
        addressStreet: organization.address?.street ?? '',
        addressBuilding: organization.address?.building ?? '',
        addressPostalCode: organization.address?.postalCode ?? '',
        addressCountry: organization.address?.country ?? 'PL',
        metadataUrl: organization.metadataUrl ?? '',
        entityId: organization.entityId ?? '',
        ssoLoginUrl: organization.ssoLoginUrl ?? '',
        ssoLogoutUrl: organization.ssoLogoutUrl ?? '',
        certificatePem: '',
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [organization, isOpen]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    if (!form.name.trim()) return 'Podaj nazwę organizacji.';
    if (!form.domain.trim()) return 'Podaj domenę organizacji.';
    if (!form.representativeFullName.trim()) return 'Podaj imię i nazwisko osoby reprezentującej.';
    if (!form.representativeEmail.trim() || !form.representativeEmail.includes('@')) {
      return 'Podaj poprawny adres e-mail osoby reprezentującej.';
    }
    if (!form.addressTown.trim()) return 'Podaj miejscowość siedziby.';
    if (!form.addressStreet.trim()) return 'Podaj ulicę siedziby.';

    if (form.loginMethod === 'saml' && !isEdit) {
      const hasMetadata = Boolean(form.metadataUrl.trim());
      const hasManual = Boolean(form.entityId.trim() && form.ssoLoginUrl.trim() && form.certificatePem.trim());
      if (!hasMetadata && !hasManual) {
        return 'Dla logowania SAML wymagany jest URL metadanych lub komplet: Entity ID, SSO Login URL i Certyfikat PEM.';
      }
    }
    return null;
  }

  async function handleSubmit(event) {
    if (event) event.preventDefault();
    const errorMsg = validate();
    if (errorMsg) {
      showError(errorMsg);
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        const updatePayload = {
          name: form.name.trim(),
          domain: form.domain.trim().toLowerCase(),
          isActive: form.isActive,
          representative: {
            fullName: form.representativeFullName.trim(),
            email: form.representativeEmail.trim(),
            phone: form.representativePhone.trim() || null,
          },
          address: {
            town: form.addressTown.trim(),
            street: form.addressStreet.trim(),
            building: form.addressBuilding.trim() || null,
            postalCode: form.addressPostalCode.trim() || null,
            country: form.addressCountry.trim() || 'PL',
          },
        };

        if (form.metadataUrl.trim()) updatePayload.metadataUrl = form.metadataUrl.trim();
        if (form.entityId.trim()) updatePayload.entityId = form.entityId.trim();
        if (form.ssoLoginUrl.trim()) updatePayload.ssoLoginUrl = form.ssoLoginUrl.trim();
        if (form.ssoLogoutUrl.trim()) updatePayload.ssoLogoutUrl = form.ssoLogoutUrl.trim();

        await updateOrganization(organization.id, updatePayload);
        showSuccess('Organizacja została zaktualizowana.');
      } else {
        const createPayload = {
          name: form.name.trim(),
          domain: form.domain.trim().toLowerCase(),
          loginMethod: form.loginMethod,
          representative: {
            fullName: form.representativeFullName.trim(),
            email: form.representativeEmail.trim(),
            phone: form.representativePhone.trim() || undefined,
          },
          address: {
            town: form.addressTown.trim(),
            street: form.addressStreet.trim(),
            building: form.addressBuilding.trim() || undefined,
            postalCode: form.addressPostalCode.trim() || undefined,
            country: form.addressCountry.trim() || 'PL',
          },
        };

        if (form.loginMethod === 'saml') {
          if (form.metadataUrl.trim()) {
            createPayload.metadataUrl = form.metadataUrl.trim();
          } else {
            createPayload.entityId = form.entityId.trim();
            createPayload.ssoLoginUrl = form.ssoLoginUrl.trim();
            createPayload.certificatePem = form.certificatePem.trim();
            if (form.ssoLogoutUrl.trim()) createPayload.ssoLogoutUrl = form.ssoLogoutUrl.trim();
          }
        }

        await createOrganization(createPayload);
        showSuccess('Organizacja została pomyślnie utworzona.');
      }

      onSaved();
      onClose();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Nie udało się zapisać organizacji.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edycja organizacji' : 'Nowa organizacja'}
      subtitle={isEdit ? `ID: ${organization.id} - ${organization.name}` : 'Wprowadź dane nowej organizacji w systemie'}
      size="lg"
      showFooter={false}
    >
      <form className="org-form" onSubmit={handleSubmit}>
        <fieldset className="org-form__fieldset">
          <legend className="org-form__legend">Dane podstawowe</legend>
          <div className="org-form__row">
            <TextField
              id="org-name"
              label="Nazwa organizacji"
              placeholder="np. Uniwersytet im. Adama Mickiewicza"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            <TextField
              id="org-domain"
              label="Domena internetowa"
              placeholder="np. amu.edu.pl lub localhost"
              value={form.domain}
              onChange={(e) => handleChange('domain', e.target.value)}
              required
            />
          </div>

          <div className="org-form__row">
            <div className="org-form__field">
              <label className="org-form__label" htmlFor="org-login-method">
                Metoda uwierzytelniania
              </label>
              <select
                id="org-login-method"
                className="org-form__select"
                value={form.loginMethod}
                onChange={(e) => handleChange('loginMethod', e.target.value)}
                disabled={isEdit}
              >
                <option value="email">Adres e-mail (Magic Link)</option>
                <option value="saml">SAML 2.0 (Federacja SSO)</option>
              </select>
            </div>

            {isEdit ? (
              <div className="org-form__field org-form__field--checkbox">
                <label className="org-form__checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                  />
                  <span>Organizacja aktywna</span>
                </label>
              </div>
            ) : null}
          </div>
        </fieldset>

        <fieldset className="org-form__fieldset">
          <legend className="org-form__legend">Osoba reprezentująca / kontakt</legend>
          <div className="org-form__row">
            <TextField
              id="org-rep-name"
              label="Imię i nazwisko"
              placeholder="np. Jan Kowalski"
              value={form.representativeFullName}
              onChange={(e) => handleChange('representativeFullName', e.target.value)}
              required
            />
            <TextField
              id="org-rep-email"
              type="email"
              label="Adres e-mail"
              placeholder="np. j.kowalski@amu.edu.pl"
              value={form.representativeEmail}
              onChange={(e) => handleChange('representativeEmail', e.target.value)}
              required
            />
          </div>
          <div className="org-form__row">
            <TextField
              id="org-rep-phone"
              label="Telefon kontaktowy (opcjonalnie)"
              placeholder="np. +48 61 829 4000"
              value={form.representativePhone}
              onChange={(e) => handleChange('representativePhone', e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="org-form__fieldset">
          <legend className="org-form__legend">Adres siedziby</legend>
          <div className="org-form__row">
            <TextField
              id="org-addr-town"
              label="Miejscowość"
              placeholder="np. Poznań"
              value={form.addressTown}
              onChange={(e) => handleChange('addressTown', e.target.value)}
              required
            />
            <TextField
              id="org-addr-street"
              label="Ulica"
              placeholder="np. ul. Wieniawskiego"
              value={form.addressStreet}
              onChange={(e) => handleChange('addressStreet', e.target.value)}
              required
            />
          </div>
          <div className="org-form__row">
            <TextField
              id="org-addr-building"
              label="Nr budynku / lokalu"
              placeholder="np. 1"
              value={form.addressBuilding}
              onChange={(e) => handleChange('addressBuilding', e.target.value)}
            />
            <TextField
              id="org-addr-postal"
              label="Kod pocztowy"
              placeholder="np. 61-712"
              value={form.addressPostalCode}
              onChange={(e) => handleChange('addressPostalCode', e.target.value)}
            />
            <TextField
              id="org-addr-country"
              label="Kraj (kod ISO)"
              placeholder="PL"
              value={form.addressCountry}
              onChange={(e) => handleChange('addressCountry', e.target.value)}
            />
          </div>
        </fieldset>

        {form.loginMethod === 'saml' ? (
          <fieldset className="org-form__fieldset">
            <legend className="org-form__legend">Konfiguracja SAML 2.0 (IdP)</legend>
            <div className="org-form__row">
              <TextField
                id="org-saml-metadata"
                label="URL metadanych IdP"
                placeholder="https://sso.amu.edu.pl/simplesaml/saml2/idp/metadata.php"
                value={form.metadataUrl}
                onChange={(e) => handleChange('metadataUrl', e.target.value)}
              />
            </div>
            {!isEdit && !form.metadataUrl.trim() ? (
              <>
                <div className="org-form__row">
                  <TextField
                    id="org-saml-entity"
                    label="Entity ID IdP"
                    placeholder="https://sso.amu.edu.pl/idp"
                    value={form.entityId}
                    onChange={(e) => handleChange('entityId', e.target.value)}
                  />
                  <TextField
                    id="org-saml-login"
                    label="SSO Login URL"
                    placeholder="https://sso.amu.edu.pl/saml2/idp/SSOService.php"
                    value={form.ssoLoginUrl}
                    onChange={(e) => handleChange('ssoLoginUrl', e.target.value)}
                  />
                </div>
                <div className="org-form__row">
                  <TextField
                    id="org-saml-cert"
                    label="Certyfikat IdP (PEM)"
                    placeholder="-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----"
                    multiline
                    rows={4}
                    value={form.certificatePem}
                    onChange={(e) => handleChange('certificatePem', e.target.value)}
                  />
                </div>
              </>
            ) : null}
          </fieldset>
        ) : null}

        <div className="org-form__actions">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Anuluj
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Zapisywanie...' : isEdit ? 'Zapisz zmiany' : 'Utwórz organizację'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

