/**
 * @file OrganizationFormModal.jsx
 * @description Modal formularza tworzenia i edycji organizacji dla roli nadzorcy.
 */

import { useEffect, useState, useMemo } from 'react';
import Modal from '../../components/ui/Modal/Modal.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import { useToast } from '../../components/ui/Toast/Toast.jsx';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import { createOrganization, updateOrganization } from '../../services/organizations.api.js';

const ACCOUNT_LIMIT_COPY = {
  polish: {
    label: 'Limit kont',
    placeholder: 'np. 200',
    invalid: 'Podaj limit kont jako liczbę całkowitą od 1.',
  },
  english: {
    label: 'Account limit',
    placeholder: 'e.g. 200',
    invalid: 'Enter the account limit as a whole number from 1.',
  },
};

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
  accountLimit: '',
  storageQuotaMb: 100,
};

/**
 * Komponent pomocniczy renderujący ikonkę informacyjną z dymkiem wyjaśniającym pojęcie.
 */
function HelpTooltip({ text }) {
  return (
    <span className="org-form__tooltip-wrap">
      <button
        type="button"
        className="org-form__tooltip-trigger"
        aria-label="Informacja o polu"
        tabIndex={0}
      >
        ?
      </button>
      <span className="org-form__tooltip-bubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}

export default function OrganizationFormModal({ isOpen, onClose, organization, onSaved }) {
  const { showSuccess, showError } = useToast();
  const language = READLANGUAGECOOKIE();
  const accountLimitCopy = ACCOUNT_LIMIT_COPY[language] ?? ACCOUNT_LIMIT_COPY.polish;
  const isEdit = Boolean(organization);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Sekcje opcjonalne domyślnie zwinięte przy tworzeniu nowej organizacji
  const [isRepOpen, setIsRepOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  useEffect(() => {
    if (organization) {
      const hasRep = Boolean(
        organization.representative?.fullName ||
        organization.representative?.email ||
        organization.representative?.phone
      );
      const hasAddr = Boolean(
        organization.address?.town ||
        organization.address?.street ||
        organization.address?.building ||
        organization.address?.postalCode
      );

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
        accountLimit: organization.accountLimit != null ? String(organization.accountLimit) : '',
        storageQuotaMb:
          organization.storageQuotaMb ??
          (organization.storageQuotaBytes ? Math.round(organization.storageQuotaBytes / (1024 * 1024)) : 100),
      });
      setIsRepOpen(hasRep);
      setIsAddressOpen(hasAddr);
    } else {
      setForm(INITIAL_FORM);
      setIsRepOpen(false);
      setIsAddressOpen(false);
    }
  }, [organization, isOpen]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Walidacja czy wymagane pola zostały wypełnione
  const isFormValid = useMemo(() => {
    if (!form.name.trim()) return false;
    if (!form.domain.trim()) return false;

    if (form.loginMethod === 'saml' && !isEdit) {
      const hasMetadata = Boolean(form.metadataUrl.trim());
      const hasManual = Boolean(
        form.entityId.trim() &&
        form.ssoLoginUrl.trim() &&
        form.certificatePem.trim()
      );
      if (!hasMetadata && !hasManual) return false;
    }

    if (form.representativeEmail.trim() && !form.representativeEmail.includes('@')) {
      return false;
    }

    return true;
  }, [form, isEdit]);

  function validate() {
    if (!form.name.trim()) return 'Podaj nazwę organizacji.';
    if (!form.domain.trim()) return 'Podaj domenę organizacji.';

    const quota = Number(form.storageQuotaMb);
    if (!Number.isFinite(quota) || quota < 1 || quota > 5120) {
      return 'Przydzielona przestrzeń dyskowa musi wynosić od 1 do 5120 MB (maks. 5 GB).';
    }

    if (form.loginMethod === 'saml' && !isEdit) {
      const hasMetadata = Boolean(form.metadataUrl.trim());
      const hasManual = Boolean(form.entityId.trim() && form.ssoLoginUrl.trim() && form.certificatePem.trim());
      if (!hasMetadata && !hasManual) {
        return 'Dla logowania SAML wymagany jest URL metadanych lub komplet: Entity ID, SSO Login URL i Certyfikat PEM.';
      }
    }

    if (form.representativeEmail.trim() && !form.representativeEmail.includes('@')) {
      return 'Podaj poprawny adres e-mail osoby reprezentującej.';
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
          accountLimit: Number(form.accountLimit),
          representative: {
            fullName: form.representativeFullName.trim() || organization.representative?.fullName || 'Administrator',
            email: form.representativeEmail.trim() || organization.representative?.email || `admin@${form.domain.trim().toLowerCase()}`,
            phone: form.representativePhone.trim() || null,
          },
          address: {
            town: form.addressTown.trim() || organization.address?.town || '-',
            street: form.addressStreet.trim() || organization.address?.street || '-',
            building: form.addressBuilding.trim() || null,
            postalCode: form.addressPostalCode.trim() || null,
            country: form.addressCountry.trim() || 'PL',
          },
          storageQuotaMb: Number(form.storageQuotaMb) || 100,
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
          accountLimit: form.accountLimit ? Number(form.accountLimit) : 200,
        };

        if (form.representativeFullName.trim() || form.representativeEmail.trim() || form.representativePhone.trim()) {
          createPayload.representative = {
            fullName: form.representativeFullName.trim() || 'Administrator',
            email: form.representativeEmail.trim() || `admin@${createPayload.domain}`,
            phone: form.representativePhone.trim() || undefined,
          };
        }

        if (form.addressTown.trim() || form.addressStreet.trim() || form.addressBuilding.trim() || form.addressPostalCode.trim()) {
          createPayload.address = {
            town: form.addressTown.trim() || '-',
            street: form.addressStreet.trim() || '-',
            building: form.addressBuilding.trim() || undefined,
            postalCode: form.addressPostalCode.trim() || undefined,
            country: form.addressCountry.trim() || 'PL',
          };
        }

        createPayload.storageQuotaMb = Number(form.storageQuotaMb) || 100;

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
      subtitle={isEdit ? `ID: ${organization.id} - ${organization.name}` : undefined}
      size="lg"
      showFooter={false}
    >
      <form className="org-form" onSubmit={handleSubmit}>
        {/* 1. Dane podstawowe - zawsze widoczne i wymagane */}
        <fieldset className="org-form__fieldset">
          <legend className="org-form__legend">Dane podstawowe</legend>
          <div className="org-form__row">
            <TextField
              id="org-name"
              label={
                <span>
                  Nazwa organizacji <span className="org-form__required">*</span>
                </span>
              }
              placeholder="np. Uniwersytet im. Adama Mickiewicza"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            <TextField
              id="org-domain"
              label={
                <span>
                  Domena internetowa <span className="org-form__required">*</span>
                  <HelpTooltip text="Unikalna domena internetowa przypisana do instytucji (np. amu.edu.pl). Służy m.in. do rozpoznawania organizacji podczas logowania." />
                </span>
              }
              placeholder="np. amu.edu.pl lub localhost"
              value={form.domain}
              onChange={(e) => handleChange('domain', e.target.value)}
              required
            />
          </div>

          <div className="org-form__row">
            <TextField
              id="org-storage-quota"
              type="number"
              label="Przydzielona przestrzeń dyskowa (MB)"
              placeholder="100"
              value={form.storageQuotaMb}
              onChange={(e) => handleChange('storageQuotaMb', e.target.value)}
              min={1}
              max={5120}
              required
            />
          </div>

          <div className="org-form__row">
            <div className="org-form__field">
              <label className="org-form__label" htmlFor="org-login-method">
                Metoda uwierzytelniania <span className="org-form__required">*</span>
                <HelpTooltip text="Wybierz sposób logowania użytkowników: bezpieczny link e-mail (Magic Link) albo centralne logowanie instytucjonalne (SAML 2.0 / federacja SSO)." />
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
            <TextField
              id="org-account-limit"
              label={accountLimitCopy.label}
              placeholder={accountLimitCopy.placeholder}
              type="number"
              value={form.accountLimit}
              onChange={(event) => handleChange('accountLimit', event.target.value)}
              required
            />

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

        {/* 2. Konfiguracja SAML 2.0 - pojawia się zaraz po Danych podstawowych po wyborze SAML 2.0 */}
        {form.loginMethod === 'saml' ? (
          <fieldset className="org-form__fieldset">
            <legend className="org-form__legend">
              Konfiguracja SAML 2.0 (IdP) <span className="org-form__required">*</span>
              <HelpTooltip text="IdP (Identity Provider) to dostawca tożsamości uczelni/organizacji, który uwierzytelnia użytkowników przez protokół SAML 2.0." />
            </legend>
            <div className="org-form__row">
              <TextField
                id="org-saml-metadata"
                label={
                  <span>
                    URL metadanych IdP {!form.entityId.trim() && <span className="org-form__required">*</span>}
                    <HelpTooltip text="Bezpośredni link do pliku XML z metadanymi dostawcy tożsamości. Jeśli go podasz, system pobierze konfigurację automatycznie." />
                  </span>
                }
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
                    label={
                      <span>
                        Entity ID IdP <span className="org-form__required">*</span>
                        <HelpTooltip text="Unikalny identyfikator URI dostawcy tożsamości (np. https://sso.amu.edu.pl/idp)." />
                      </span>
                    }
                    placeholder="https://sso.amu.edu.pl/idp"
                    value={form.entityId}
                    onChange={(e) => handleChange('entityId', e.target.value)}
                  />
                  <TextField
                    id="org-saml-login"
                    label={
                      <span>
                        SSO Login URL <span className="org-form__required">*</span>
                        <HelpTooltip text="Adres URL usługi logowania jednokrotnego (Single Sign-On Service), na który kierowany jest użytkownik w celu uwierzytelnienia." />
                      </span>
                    }
                    placeholder="https://sso.amu.edu.pl/saml2/idp/SSOService.php"
                    value={form.ssoLoginUrl}
                    onChange={(e) => handleChange('ssoLoginUrl', e.target.value)}
                  />
                </div>
                <div className="org-form__row">
                  <TextField
                    id="org-saml-cert"
                    label={
                      <span>
                        Certyfikat IdP (PEM) <span className="org-form__required">*</span>
                        <HelpTooltip text="Klucz publiczny certyfikatu X.509 dostawcy tożsamości w formacie PEM (zaczynający się od -----BEGIN CERTIFICATE-----)." />
                      </span>
                    }
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

        {/* 3. Osoba reprezentująca / kontakt - sekcja opcjonalna, domyślnie zwinięta */}
        <div className={`org-form__collapsible ${isRepOpen ? 'org-form__collapsible--open' : ''}`}>
          <button
            type="button"
            className="org-form__collapsible-toggle"
            onClick={() => setIsRepOpen((prev) => !prev)}
            aria-expanded={isRepOpen}
          >
            <span className="org-form__collapsible-title">Osoba reprezentująca / kontakt (opcjonalnie)</span>
            <span className="org-form__collapsible-indicator" aria-hidden="true">
              {isRepOpen ? '▲' : '▼'}
            </span>
          </button>
          {isRepOpen ? (
            <div className="org-form__collapsible-body">
              <div className="org-form__row">
                <TextField
                  id="org-rep-name"
                  label="Imię i nazwisko"
                  placeholder="np. Jan Kowalski"
                  value={form.representativeFullName}
                  onChange={(e) => handleChange('representativeFullName', e.target.value)}
                />
                <TextField
                  id="org-rep-email"
                  type="email"
                  label="Adres e-mail"
                  placeholder="np. j.kowalski@amu.edu.pl"
                  value={form.representativeEmail}
                  onChange={(e) => handleChange('representativeEmail', e.target.value)}
                />
              </div>
              <div className="org-form__row">
                <TextField
                  id="org-rep-phone"
                  label="Telefon kontaktowy"
                  placeholder="np. +48 61 829 4000"
                  value={form.representativePhone}
                  onChange={(e) => handleChange('representativePhone', e.target.value)}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* 4. Adres siedziby - sekcja opcjonalna, domyślnie zwinięta */}
        <div className={`org-form__collapsible ${isAddressOpen ? 'org-form__collapsible--open' : ''}`}>
          <button
            type="button"
            className="org-form__collapsible-toggle"
            onClick={() => setIsAddressOpen((prev) => !prev)}
            aria-expanded={isAddressOpen}
          >
            <span className="org-form__collapsible-title">Adres siedziby (opcjonalnie)</span>
            <span className="org-form__collapsible-indicator" aria-hidden="true">
              {isAddressOpen ? '▲' : '▼'}
            </span>
          </button>
          {isAddressOpen ? (
            <div className="org-form__collapsible-body">
              <div className="org-form__row">
                <TextField
                  id="org-addr-town"
                  label="Miejscowość"
                  placeholder="np. Poznań"
                  value={form.addressTown}
                  onChange={(e) => handleChange('addressTown', e.target.value)}
                />
                <TextField
                  id="org-addr-street"
                  label="Ulica"
                  placeholder="np. ul. Wieniawskiego"
                  value={form.addressStreet}
                  onChange={(e) => handleChange('addressStreet', e.target.value)}
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
                  label={
                    <span>
                      Kraj (kod ISO)
                      <HelpTooltip text="Dwuliterowy międzynarodowy kod kraju w standardzie ISO 3166-1 alpha-2, np. PL dla Polski." />
                    </span>
                  }
                  placeholder="PL"
                  value={form.addressCountry}
                  onChange={(e) => handleChange('addressCountry', e.target.value)}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="org-form__actions">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Anuluj
          </Button>
          <Button type="submit" disabled={submitting || !isFormValid}>
            {submitting ? 'Zapisywanie...' : isEdit ? 'Zapisz zmiany' : 'Utwórz organizację'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
