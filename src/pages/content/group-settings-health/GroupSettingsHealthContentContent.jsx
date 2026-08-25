import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import SettingsSectionHeader from '../../../components/layout/sectionPage/SettingsSectionHeader.jsx';
import GroupSettingsUnsavedModal from '../group-settings/GroupSettingsUnsavedModal.jsx';
import SettingsCheckboxField from '../group-settings/SettingsCheckboxField.jsx';
import EmojiPickerField from '../../../components/ui/EmojiPickerField/EmojiPickerField.jsx';
import { Button, CharacterLimitedField, Divider, InfoTooltip, useToast } from '../../../components/ui/index.js';
import { useUnsavedChangesGuard } from '../../../hooks/useUnsavedChangesGuard.js';
import { LIVES_LABEL_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import { DEFAULT_LIVES_LABEL, DEFAULT_LIVES_SYMBOL } from '../../../constants/lives.constants.js';
import { sanitizeWholeNumberInput } from '../../../utils/validation/rewardsNumericValidation.js';
import { fetchGroupLivesConfig, updateGroupLivesConfig } from '../../../services/groupLives.api.js';
import { fetchGroupShopItems } from '../../../services/shop.api.js';
import { invalidateGroupLives } from '../../../services/groupLivesEvents.js';
import { findExtraLifeShopItem } from '../../../utils/shop/extraLifeItem.js';
import ShopItemFormModal from '../group-shop/modals/ShopItemFormModal.jsx';
import GroupSettingsHealthContentWindow from './GroupSettingsHealthContentWindow.jsx';
import '../group-settings/GroupSettingsForm.css';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const LOADSETTINGSERROR__TEXTLABEL = {
  polish: 'Nie udało się pobrać ustawień systemu żyć.',
  english: 'Failed to load lives settings.'
};

const SAVESETTINGSERROR__TEXTLABEL = {
  polish: 'Nie udało się zapisać ustawień systemu żyć.',
  english: 'Failed to save lives settings.'
};

const SUCCESSMESSAGE__TEXTLABEL = {
  polish: 'Zmiany zostały zapisane.',
  english: 'Changes have been saved.'
};

const PANELAILABEL__TEXTLABEL = {
  polish: 'System żyć',
  english: 'Lives System'
};

const SECTIONHEADER__TEXTLABEL = {
  polish: 'System żyć',
  english: 'Lives System'
};

const LOADINGHINT__TEXTLABEL = {
  polish: 'Ładowanie ustawień systemu żyć…',
  english: 'Loading lives settings…'
};

const TOGGLELABEL__TEXTLABEL = {
  polish: 'Włącz system żyć',
  english: 'Enable lives system'
};

const TOGGLETOOLTIP__TEXTLABEL = {
  polish: 'Pozwala włączyć i wyłączyć system szans.',
  english: 'Allows enabling and disabling the lives system.'
};

const EMOJIPICKERLABEL__TEXTLABEL = {
  polish: 'Ikona żyć',
  english: 'Lives icon'
};

const EMOJIPICKERARIA__TEXTLABEL = {
  polish: 'Wybierz ikonę żyć',
  english: 'Choose lives icon'
};

const LIVESLABELLABEL__TEXTLABEL = {
  polish: 'Nazwa żyć*',
  english: 'Lives name*'
};

const LIVESLIMITLABEL__TEXTLABEL = {
  polish: 'Limit żyć*',
  english: 'Lives limit*'
};

const LIVESLIMITTOOLTIP__TEXTLABEL = {
  polish: 'Liczba szans posiadanych przez studenta nie może przekroczyć tej wartości.',
  english: 'The number of lives a student has cannot exceed this value.'
};

const LIVESSTARTLABEL__TEXTLABEL = {
  polish: 'Startowa liczba żyć*',
  english: 'Starting lives*'
};

const LIVESSTARTTOOLTIP__TEXTLABEL = {
  polish: 'Liczba szans, jaką student otrzymuje po dołączeniu do grupy.',
  english: 'The number of lives a student receives after joining the group.'
};

const SHOPTOGGLELABEL__TEXTLABEL = {
  polish: 'Możliwość kupowania żyć w sklepie',
  english: 'Ability to buy lives in the shop'
};

const SHOPTOGGLETTOOLTIP__TEXTLABEL = {
  polish: 'Umożliwia kupowanie szans w sklepie.',
  english: 'Allows buying lives in the shop.'
};

const EDITEXTRALIFEBUTTON__TEXTLABEL = {
  polish: 'Edytuj produkt: Dodatkowe życie',
  english: 'Edit item: Extra life'
};

const MANAGEBUTTON__TEXTLABEL = {
  polish: 'Zarządzanie życiami studentów',
  english: 'Manage student lives'
};

const SAVEBUTTON__TEXTLABEL = {
  polish: 'Zapisz zmiany',
  english: 'Save changes'
};

function buildSnapshot({
  livesIcon,
  livesLabel,
  livesEnabled,
  livesLimit,
  livesStart,
  livesShopEnabled,
}) {
  return {
    livesIcon,
    livesLabel: livesLabel.trim(),
    livesEnabled,
    livesLimit,
    livesStart,
    livesShopEnabled,
  };
}

function applyConfigToState(config, setters) {
  const {
    setLivesIcon,
    setLivesLabel,
    setLivesEnabled,
    setLivesLimit,
    setLivesStart,
    setLivesShopEnabled,
    setSavedSnapshot,
  } = setters;

  const livesIcon = config.livesIcon || DEFAULT_LIVES_SYMBOL;
  const livesLabel = config.livesLabel || DEFAULT_LIVES_LABEL;
  const livesEnabled = Boolean(config.livesEnabled);
  const livesLimit = config.livesMax == null ? '' : String(config.livesMax);
  const livesStart = config.startingLives == null ? '' : String(config.startingLives);
  const livesShopEnabled = Boolean(config.livesShopEnabled);

  setLivesIcon(livesIcon);
  setLivesLabel(livesLabel);
  setLivesEnabled(livesEnabled);
  setLivesLimit(livesLimit);
  setLivesStart(livesStart);
  setLivesShopEnabled(livesShopEnabled);
  setSavedSnapshot(buildSnapshot({
    livesIcon,
    livesLabel,
    livesEnabled,
    livesLimit,
    livesStart,
    livesShopEnabled,
  }));
}

export default function GroupSettingsHealthContentContent() {
  const { groupId } = useParams();
  const { showSuccess, showError } = useToast();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const [livesIcon, setLivesIcon] = useState(DEFAULT_LIVES_SYMBOL);
  const [livesLabel, setLivesLabel] = useState('');
  const [livesEnabled, setLivesEnabled] = useState(false);
  const [livesLimit, setLivesLimit] = useState('');
  const [livesStart, setLivesStart] = useState('');
  const [livesShopEnabled, setLivesShopEnabled] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isExtraLifeModalOpen, setIsExtraLifeModalOpen] = useState(false);
  const [extraLifeItemId, setExtraLifeItemId] = useState(null);

  const loadExtraLifeItem = useCallback(async () => {
    if (!groupId) {
      setExtraLifeItemId(null);
      return;
    }

    const result = await fetchGroupShopItems(groupId);
    if (!result.ok) {
      setExtraLifeItemId(null);
      return;
    }

    const extraLifeItem = findExtraLifeShopItem(result.items);
    setExtraLifeItemId(extraLifeItem?.id ?? null);
  }, [groupId]);

  const loadSettings = useCallback(async () => {
    if (!groupId) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await fetchGroupLivesConfig(groupId);
      if (!result.ok || !result.config) {
        throw new Error(LOADSETTINGSERROR__TEXTLABEL[LANGUAGE]);
      }

      applyConfigToState(result.config, {
        setLivesIcon,
        setLivesLabel,
        setLivesEnabled,
        setLivesLimit,
        setLivesStart,
        setLivesShopEnabled,
        setSavedSnapshot,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : LOADSETTINGSERROR__TEXTLABEL[LANGUAGE];
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }, [groupId, showError, LANGUAGE]);

  useEffect(() => {
    void loadSettings();
    void loadExtraLifeItem();
  }, [loadSettings, loadExtraLifeItem]);

  const persistSettings = useCallback(async () => {
    if (!groupId) {
      return false;
    }

    setIsSaving(true);
    setErrorMessage('');

    const payload = {
      livesEnabled,
      livesIcon,
      livesShopEnabled,
    };

    if (livesLabel.trim().length > 0) {
      payload.livesLabel = livesLabel.trim();
    }
    if (livesLimit !== '') {
      payload.lives = Number(livesLimit);
    }
    if (livesStart !== '') {
      payload.startingLives = Number(livesStart);
    }

    try {
      const result = await updateGroupLivesConfig(groupId, payload);
      if (!result.ok) {
        throw new Error(SAVESETTINGSERROR__TEXTLABEL[LANGUAGE]);
      }

      invalidateGroupLives(groupId);
      await loadSettings();
      showSuccess(SUCCESSMESSAGE__TEXTLABEL[LANGUAGE]);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : SAVESETTINGSERROR__TEXTLABEL[LANGUAGE];
      setErrorMessage(message);
      showError(message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    groupId,
    livesEnabled,
    livesIcon,
    livesLabel,
    livesLimit,
    livesShopEnabled,
    livesStart,
    loadSettings,
    showError,
    showSuccess,
    LANGUAGE,
  ]);

  const isDirty = useMemo(() => {
    if (!savedSnapshot || isLoading) {
      return false;
    }

    return JSON.stringify(buildSnapshot({
      livesIcon,
      livesLabel,
      livesEnabled,
      livesLimit,
      livesStart,
      livesShopEnabled,
    })) !== JSON.stringify(savedSnapshot);
  }, [
    isLoading,
    livesEnabled,
    livesIcon,
    livesLabel,
    livesLimit,
    livesShopEnabled,
    livesStart,
    savedSnapshot,
  ]);

  const {
    isPromptOpen,
    dismissPrompt,
    discardChanges,
    saveAndContinue,
  } = useUnsavedChangesGuard({
    when: isDirty,
    onSave: persistSettings,
  });

  const detailsSectionClassName = [
    'group-settings-form__stack',
    livesEnabled ? '' : 'group-settings-form__section--muted',
  ].filter(Boolean).join(' ');

  return (
    <div className="group-settings-form group-settings-form--drive-layout group-settings-form--lives">
      <section className="group-settings-form__panel" aria-label={PANELAILABEL__TEXTLABEL[LANGUAGE]}>
        <SettingsSectionHeader title={SECTIONHEADER__TEXTLABEL[LANGUAGE]} id="group-lives-title" />

        {isLoading ? (
          <p className="group-settings-form__hint">{LOADINGHINT__TEXTLABEL[LANGUAGE]}</p>
        ) : (
          <>
            <div className="group-settings-form__field">
              <SettingsCheckboxField
                id="group-lives-enabled"
                checked={livesEnabled}
                onChange={setLivesEnabled}
                disabled={isSaving}
              >
                {TOGGLELABEL__TEXTLABEL[LANGUAGE]}
                <InfoTooltip text={TOGGLETOOLTIP__TEXTLABEL[LANGUAGE]} />
              </SettingsCheckboxField>
            </div>

            <Divider className="group-settings-form__section-divider" />

            <div className={detailsSectionClassName}>
              <EmojiPickerField
                className="group-settings-form__field"
                label={EMOJIPICKERLABEL__TEXTLABEL[LANGUAGE]}
                value={livesIcon}
                defaultEmoji={DEFAULT_LIVES_SYMBOL}
                onChange={setLivesIcon}
                ariaLabel={EMOJIPICKERARIA__TEXTLABEL[LANGUAGE]}
              />

              <div className="group-settings-form__field">
                <label className="group-settings-form__label" htmlFor="group-lives-label">
                  {LIVESLABELLABEL__TEXTLABEL[LANGUAGE]}
                </label>
                <CharacterLimitedField value={livesLabel} maxLength={LIVES_LABEL_MAX_LENGTH}>
                  <input
                    id="group-lives-label"
                    className="group-settings-form__input"
                    value={livesLabel}
                    maxLength={LIVES_LABEL_MAX_LENGTH}
                    onChange={(event) => setLivesLabel(event.target.value)}
                    disabled={isSaving || !livesEnabled}
                  />
                </CharacterLimitedField>
              </div>

              <div className="group-settings-form__field group-settings-form__field--value">
                <label className="group-settings-form__label" htmlFor="group-lives-limit">
                  {LIVESLIMITLABEL__TEXTLABEL[LANGUAGE]}
                  <InfoTooltip text={LIVESLIMITTOOLTIP__TEXTLABEL[LANGUAGE]} />
                </label>
                <input
                  id="group-lives-limit"
                  className="group-settings-form__input group-settings-form__input--compact"
                  inputMode="numeric"
                  value={livesLimit}
                  onChange={(event) => setLivesLimit(sanitizeWholeNumberInput(event.target.value))}
                  disabled={isSaving || !livesEnabled}
                />
              </div>

              <div className="group-settings-form__field group-settings-form__field--value">
                <label className="group-settings-form__label" htmlFor="group-lives-start">
                  {LIVESSTARTLABEL__TEXTLABEL[LANGUAGE]}
                  <InfoTooltip text={LIVESSTARTTOOLTIP__TEXTLABEL[LANGUAGE]} />
                </label>
                <input
                  id="group-lives-start"
                  className="group-settings-form__input group-settings-form__input--compact"
                  inputMode="numeric"
                  value={livesStart}
                  onChange={(event) => setLivesStart(sanitizeWholeNumberInput(event.target.value))}
                  disabled={isSaving || !livesEnabled}
                />
              </div>

              <div className="group-settings-form__field">
                <SettingsCheckboxField
                  id="group-lives-shop-enabled"
                  checked={livesShopEnabled}
                  onChange={setLivesShopEnabled}
                  disabled={isSaving || !livesEnabled}
                >
                  {SHOPTOGGLELABEL__TEXTLABEL[LANGUAGE]}
                  <InfoTooltip text={SHOPTOGGLETTOOLTIP__TEXTLABEL[LANGUAGE]} />
                </SettingsCheckboxField>
              </div>

              <Divider className="group-settings-form__section-divider" />

              <div className="group-settings-form__field">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsExtraLifeModalOpen(true)}
                  disabled={!livesEnabled || !livesShopEnabled || !extraLifeItemId}
                >
                  {EDITEXTRALIFEBUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
              </div>

              <div className="group-settings-form__field">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsManageOpen(true)}
                  disabled={!livesEnabled}
                >
                  {MANAGEBUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
              </div>
            </div>
          </>
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

      {isManageOpen ? (
        <GroupSettingsHealthContentWindow
          popupclose={() => setIsManageOpen(false)}
          groupId={groupId}
          liveslabel={livesLabel}
          livesicon={livesIcon}
          livesstart={livesStart}
        />
      ) : null}

      {isExtraLifeModalOpen && extraLifeItemId ? (
        <ShopItemFormModal
          isOpen={isExtraLifeModalOpen}
          groupId={groupId}
          itemId={extraLifeItemId}
          onClose={() => setIsExtraLifeModalOpen(false)}
          onSaved={async () => {
            setIsExtraLifeModalOpen(false);
            await loadExtraLifeItem();
          }}
        />
      ) : null}
    </div>
  );
}
