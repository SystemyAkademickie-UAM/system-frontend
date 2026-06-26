import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import SettingsSectionHeader from '../../../components/layout/sectionPage/SettingsSectionHeader.jsx';
import GroupSettingsUnsavedModal from '../group-settings/GroupSettingsUnsavedModal.jsx';
import EmojiPickerField from '../../../components/ui/EmojiPickerField/EmojiPickerField.jsx';
import { Button, useToast } from '../../../components/ui/index.js';
import { useUnsavedChangesGuard } from '../../../hooks/useUnsavedChangesGuard.js';
import { DEFAULT_CURRENCY_SYMBOL } from '../../../constants/currency.constants.js';
import { invalidateGroupCurrency } from '../../../services/groupCurrencyEvents.js';
import { fetchGroupCurrencyConfig, updateGroupCurrencyConfig } from '../../../services/groupCurrency.api.js';
import '../group-settings/GroupSettingsForm.css';

function buildSnapshot(currencyName, currencyIcon) {
  return {
    currencyName: currencyName.trim(),
    currencyIcon,
  };
}

export default function GroupSettingsCurrencyContentContent() {
  const { groupId } = useParams();
  const { showSuccess, showError } = useToast();

  const [currencyName, setCurrencyName] = useState('');
  const [currencyIcon, setCurrencyIcon] = useState(DEFAULT_CURRENCY_SYMBOL);
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const applyConfig = useCallback((config) => {
    const name = config.currency ?? '';
    const icon = config.currencyEmoji || DEFAULT_CURRENCY_SYMBOL;
    setCurrencyName(name);
    setCurrencyIcon(icon);
    setSavedSnapshot(buildSnapshot(name, icon));
  }, []);

  const loadSettings = useCallback(async () => {
    if (!groupId) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await fetchGroupCurrencyConfig(groupId);
      if (result.ok && result.config) {
        applyConfig(result.config);
      } else {
        throw new Error('Nie udało się pobrać ustawień waluty.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nie udało się pobrać ustawień waluty.';
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }, [applyConfig, groupId, showError]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const persistSettings = useCallback(async () => {
    if (!groupId) {
      return false;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const result = await updateGroupCurrencyConfig(groupId, {
        currency: currencyName.trim(),
        currencyEmoji: currencyIcon,
      });

      if (!result.ok || !result.config) {
        throw new Error('Nie udało się zapisać ustawień waluty.');
      }

      applyConfig(result.config);
      invalidateGroupCurrency(groupId);
      showSuccess('Zmiany zostały zapisane.');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nie udało się zapisać ustawień waluty.';
      setErrorMessage(message);
      showError(message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [applyConfig, currencyIcon, currencyName, groupId, showError, showSuccess]);

  const isDirty = useMemo(() => {
    if (!savedSnapshot || isLoading) {
      return false;
    }

    return buildSnapshot(currencyName, currencyIcon).currencyName !== savedSnapshot.currencyName
      || buildSnapshot(currencyName, currencyIcon).currencyIcon !== savedSnapshot.currencyIcon;
  }, [currencyIcon, currencyName, isLoading, savedSnapshot]);

  const {
    isPromptOpen,
    dismissPrompt,
    discardChanges,
    saveAndContinue,
  } = useUnsavedChangesGuard({
    when: isDirty,
    onSave: persistSettings,
  });

  return (
    <div className="group-settings-form group-settings-form--drive-layout">
      <section className="group-settings-form__panel" aria-label="Waluta grupy">
        <SettingsSectionHeader title="Waluta" id="group-currency-title" />

        {isLoading ? (
          <p className="group-settings-form__hint">Ładowanie ustawień waluty…</p>
        ) : (
          <div className="group-settings-form__stack">
            <EmojiPickerField
              className="group-settings-form__field"
              label="Ikona waluty"
              value={currencyIcon}
              defaultEmoji={DEFAULT_CURRENCY_SYMBOL}
              onChange={setCurrencyIcon}
              ariaLabel="Wybierz ikonę waluty"
            />

            <div className="group-settings-form__field">
              <label className="group-settings-form__label" htmlFor="group-currency-name">
                Nazwa waluty
              </label>
              <input
                id="group-currency-name"
                className="group-settings-form__input"
                value={currencyName}
                onChange={(event) => setCurrencyName(event.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>
        )}
      </section>

      {errorMessage ? (
        <p className="group-settings-form__error" role="alert">{errorMessage}</p>
      ) : null}

      {!isLoading ? (
        <Button
          type="button"
          variant="primary"
          size="md"
          className="group-settings-form__save-fab"
          onClick={persistSettings}
          disabled={isSaving}
        >
          Zapisz zmiany
        </Button>
      ) : null}

      <GroupSettingsUnsavedModal
        isOpen={isPromptOpen}
        isSaving={isSaving}
        onClose={dismissPrompt}
        onDiscard={discardChanges}
        onSave={saveAndContinue}
      />
    </div>
  );
}
