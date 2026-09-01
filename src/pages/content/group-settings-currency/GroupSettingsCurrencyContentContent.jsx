import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import SettingsSectionHeader from '../../../components/layout/sectionPage/SettingsSectionHeader.jsx';
import GroupSettingsUnsavedModal from '../group-settings/GroupSettingsUnsavedModal.jsx';
import EmojiPickerField from '../../../components/ui/EmojiPickerField/EmojiPickerField.jsx';
import { Button, CharacterLimitedField, useToast } from '../../../components/ui/index.js';
import { useUnsavedChangesGuard } from '../../../hooks/useUnsavedChangesGuard.js';
import { DEFAULT_CURRENCY_SYMBOL } from '../../../constants/currency.constants.js';
import { CURRENCY_LABEL_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import { invalidateGroupCurrency } from '../../../services/groupCurrencyEvents.js';
import { fetchGroupCurrencyConfig, updateGroupCurrencyConfig } from '../../../services/groupCurrency.api.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import '../group-settings/GroupSettingsForm.css';

const LOADERRORMESSAGE__TEXTLABEL = {
  polish: 'Nie udało się pobrać ustawień waluty.',
  english: 'Failed to load currency settings.'
};

const SAVEERRORMESSAGE__TEXTLABEL = {
  polish: 'Nie udało się zapisać ustawień waluty.',
  english: 'Failed to save currency settings.'
};

const SUCCESSMESSAGE__TEXTLABEL = {
  polish: 'Zmiany zostały zapisane.',
  english: 'Changes have been saved.'
};

const PANELAriaLabel__TEXTLABEL = {
  polish: 'Waluta grupy',
  english: 'Group currency'
};

const SECTIONTITLE__TEXTLABEL = {
  polish: 'Waluta',
  english: 'Currency'
};

const LOADINGTEXT__TEXTLABEL = {
  polish: 'Ładowanie ustawień waluty…',
  english: 'Loading currency settings…'
};

const ICONFIELDLABEL__TEXTLABEL = {
  polish: 'Ikona waluty',
  english: 'Currency icon'
};

const ICONFIELDARIALABEL__TEXTLABEL = {
  polish: 'Wybierz ikonę waluty',
  english: 'Choose currency icon'
};

const NAMEFIELDLABEL__TEXTLABEL = {
  polish: 'Nazwa waluty',
  english: 'Currency name'
};

const SAVEBUTTON__TEXTLABEL = {
  polish: 'Zapisz zmiany',
  english: 'Save changes'
};

function buildSnapshot(currencyName, currencyIcon) {
  return {
    currencyName: currencyName.trim(),
    currencyIcon,
  };
}

export default function GroupSettingsCurrencyContentContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
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
        throw new Error(LOADERRORMESSAGE__TEXTLABEL[LANGUAGE]);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : LOADERRORMESSAGE__TEXTLABEL[LANGUAGE];
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
        throw new Error(SAVEERRORMESSAGE__TEXTLABEL[LANGUAGE]);
      }

      applyConfig(result.config);
      invalidateGroupCurrency(groupId);
      showSuccess(SUCCESSMESSAGE__TEXTLABEL[LANGUAGE]);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : SAVEERRORMESSAGE__TEXTLABEL[LANGUAGE];
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

    const current = buildSnapshot(currencyName, currencyIcon);
    return current.currencyName !== savedSnapshot.currencyName
      || current.currencyIcon !== savedSnapshot.currencyIcon;
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
    <div className="group-settings-form group-settings-form--drive-layout group-settings-form--currency">
      <section className="group-settings-form__panel" aria-label={PANELAriaLabel__TEXTLABEL[LANGUAGE]}>
        <SettingsSectionHeader title={SECTIONTITLE__TEXTLABEL[LANGUAGE]} id="group-currency-title" />

        {isLoading ? (
          <p className="group-settings-form__hint">{LOADINGTEXT__TEXTLABEL[LANGUAGE]}</p>
        ) : (
          <div className="group-settings-form__stack">
            <EmojiPickerField
              className="group-settings-form__field"
              label={ICONFIELDLABEL__TEXTLABEL[LANGUAGE]}
              value={currencyIcon}
              defaultEmoji={DEFAULT_CURRENCY_SYMBOL}
              onChange={setCurrencyIcon}
              ariaLabel={ICONFIELDARIALABEL__TEXTLABEL[LANGUAGE]}
            />

            <div className="group-settings-form__field">
              <label className="group-settings-form__label" htmlFor="group-currency-name">
                {NAMEFIELDLABEL__TEXTLABEL[LANGUAGE]}
              </label>
              <CharacterLimitedField value={currencyName} maxLength={CURRENCY_LABEL_MAX_LENGTH}>
                <input
                  id="group-currency-name"
                  className="group-settings-form__input"
                  value={currencyName}
                  maxLength={CURRENCY_LABEL_MAX_LENGTH}
                  onChange={(event) => setCurrencyName(event.target.value)}
                  disabled={isSaving}
                />
              </CharacterLimitedField>
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
          size="sm"
          className="group-settings-form__save-fab"
          onClick={persistSettings}
          disabled={isSaving}
        >
          {SAVEBUTTON__TEXTLABEL[LANGUAGE]}
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
