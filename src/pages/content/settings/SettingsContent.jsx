import { Link } from 'react-router-dom';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { useLeaderDisplayPreferences } from '../../../hooks/useLeaderDisplayPreferences.js';
import { useUnsavedChangesGuard } from '../../../hooks/useUnsavedChangesGuard.js';
import { Divider, CharacterLimitedField, Button, Modal, useToast } from '../../../components/ui/index.js';
import SettingsSectionHeader from '../../../components/layout/sectionPage/SettingsSectionHeader.jsx';
import AvatarPicker from '../../../components/ui/AvatarPicker/AvatarPicker.jsx';
import { fetchAvatars, fetchProfile, updateProfile } from '../../../services/profile.api.js';
import {
  THEME_OPTIONS,
  applyTheme,
  getSavedTheme,
} from '../../../services/themeService.js';
import { getRememberMe, setRememberMe } from '../../../services/rememberMeService.js';
import { SETTINGS_NICKNAME_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';

import { appHelpPath } from '../../../routes/pathRegistry.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import '../group-settings/GroupSettingsForm.css';
import './SettingsContent.css';

const LANGUAGESDICTIONARY = { polish: 'polski', english: 'English' };

const SETTINGSLABELTEXT = {
  polish: 'Ustawienia',
  english: 'Settings',
  japanese: '設定',
  kana: 'オプション',
};
const AVATARLABELTEXT = {
  polish: 'Awatar',
  english: 'Avatar',
  japanese: 'プロフィール画像',
  kana: 'アバタ'
};
const LANGUAGELABELTEXT = {
  polish: 'Jezyk',
  english: 'LANGUAGE',
  japanese: '言語',
  kana: 'げんご'
};
const THEMELABELTEXT = {
  polish: 'Motyw',
  english: 'Theme',
  japanese: 'テーマ',
  kana: 'テーマ'
};
const NICKNAMELABELTEXT = {
  polish: 'Ksywka',
  english: 'Nickname',
  japanese: '名前',
  kana: 'ニックネーム'
};
const HELPCENTER0LABELTEXT = {
  polish: 'Centrum Pomocy',
  english: 'Help Center',
  japanese: 'ヘルプセンター',
  kana: 'ヘルプセンター'
};
const HELPCENTER1LABELTEXT = {
  polish: '- informacje, dokumentacja i wsparcie',
  english: '- information, documentation, and support',
  japanese: '- 情報、ドキュメント、サポート',
  kana: '- じょうほう、ドキュメント、サポート',
};
const SHOWNICKNAMELABELTEXT = {
  polish: 'Wyświetlaj ksywkę',
  english: 'Show nickname',
  japanese: 'ニックネームを表示',
  kana: 'ニックネームをひょうじ',
};
const SHOWNICKNAMEDESCRIPTIONLABELTEXT = {
  polish: 'Ksywka staje się widoczna dla innych użytkowników (wyświetlana jest dodatkowo obok imienia i nazwiska).',
  english: 'Your nickname becomes visible to other users (it is displayed alongside your first and last name).',
  japanese: 'ニックネームが他の利用者にも表示されるようになります（氏名の横に追加で表示されます）。',
  kana: 'ニックネームがほかの利用者にも表示されるようになります（氏名の横に追加で表示されます）。',
};
const REMEMBERMELABELTEXT = {
  polish: 'Zapamiętaj mnie',
  english: 'Remember me',
  japanese: 'ログイン状態を保持',
  kana: 'ログインじょうたいをほじ',
};
const REMEMBERMEDESCRIPTIONLABELTEXT = {
  polish: 'Automatycznie loguj i utrzymuj aktywną sesję na tym urządzeniu.',
  english: 'Automatically log in and maintain active session on this device.',
  japanese: 'この端末で自動的にログインしセッションを維持します。',
  kana: 'この端末でじどうてきにログインしセッションをいじします。',
};
const SAVEBUTTONLABELTEXT = {
  polish: 'Zapisz zmiany',
  english: 'Save changes',
  japanese: '変更を保存',
  kana: 'へんこうをほぞn'
};
const UNSAVEDCHANGESLABELTEXT = {
  polish: 'Niezapisane zmiany',
  english: 'Unsaved changes',
  japanese: '未保存の変更',
  kana: 'みほぞんのへんこう',
};
const UNSAVEDMESSAGESLABELTEXT = {
  polish: 'Masz niezapisane zmiany na tej stronie. Czy chcesz je zapisać przed opuszczeniem?',
  english: 'You have unsaved changes on this page. Do you want to save them before leaving?',
  japanese: 'このページに未保存の変更があります。離れる前に保存しますか？',
  kana: 'このページにみほぞんのへんこうがあります。離れるまえにほぞんしますか？',
};
const UNSAVEDCANCELLABELTEXT = {
  polish: 'Anuluj',
  english: 'Cancel',
  japanese: 'キャンセル',
  kana: 'キャンセル'
};
const UNSAVEDDISCARDLABELTEXT = {
  polish: 'Odrzuć zmiany',
  english: 'Discard changes',
  japanese: '変更を破棄',
  kana: 'へんこうをはき',
};
const UNSAVEDSAVELABELTEXT = {
  polish: 'Zapisz',
  english: 'Save',
  japanese: '保存',
  kana: 'ほぞん'
};

const EMPTYNICKNAMEERRORTEXT = {
  polish: 'Podaj ksywkę, aby zapisać zmiany.',
  english: 'Enter a nickname before saving your changes.',
};

function resolveProfileSaveErrorMessage(error, language) {
  if (!error) {
    return null;
  }

  const normalized = Array.isArray(error) ? error.join(' ') : String(error);
  const lower = normalized.toLowerCase();

  if (
    lower.includes('pusty')
    || lower.includes('empty')
    || lower === 'forbidden'
    || lower.includes('nickname must not be empty')
  ) {
    return EMPTYNICKNAMEERRORTEXT[language] ?? EMPTYNICKNAMEERRORTEXT.polish;
  }

  return normalized;
}

function RESOLVELANGUAGECODE(displayLANGUAGE) {
  if (displayLANGUAGE === 'polski') {
    return 'polish';
  }
  if (displayLANGUAGE === 'English') {
    return 'english';
  }
  return 'english';
}

export default function SettingsContent() {
  const { refetchProfile } = useUserProfile();
  const { role } = useAppRole();
  const { setShowNickname } = useLeaderDisplayPreferences();
  const { showSuccess, showError } = useToast();

  const [draftShowNickname, setDraftShowNickname] = useState(true);
  const [draftRememberMe, setDraftRememberMe] = useState(() => getRememberMe());
  const [draftTheme, setDraftTheme] = useState(() => getSavedTheme());
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [nickname, setNickname] = useState('');
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [DIVLANGUAGE, SETDIVLANGUAGE] = useState('polski');
  const [LANGUAGE, SETLANGUAGE] = useState(() => READLANGUAGECOOKIE() || 'polish');

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [profile, avatarList] = await Promise.all([
        fetchProfile(),
        fetchAvatars(),
      ]);

      if (!profile) {
        throw new Error('Nie udało się pobrać profilu użytkownika');
      }

      setNickname(profile.nickname || '');
      setAvatars(avatarList);

      const avatarIndex = avatarList.findIndex((avatar) => avatar.id === profile.avatarId);
      const loadedAvatarId = avatarIndex >= 0 ? profile.avatarId : avatarList[0]?.id ?? null;
      setSelectedAvatarId(loadedAvatarId);

      if (role === APP_ROLE.LECTURER) {
        const loadedShowNickname = profile.showNickname !== false;
        setDraftShowNickname(loadedShowNickname);
      }

      const CURRENTLANGUAGE = READLANGUAGECOOKIE() || 'polish';
      const CURRENTTHEME = getSavedTheme();
      const CURRENTREMEMBERME = getRememberMe();
      setDraftTheme(CURRENTTHEME);
      setDraftRememberMe(CURRENTREMEMBERME);

      setSavedSnapshot({
        nickname: profile.nickname || '',
        avatarId: loadedAvatarId,
        LANGUAGE: CURRENTLANGUAGE,
        theme: CURRENTTHEME,
        rememberMe: CURRENTREMEMBERME,
        ...(role === APP_ROLE.LECTURER ? { showNickname: profile.showNickname !== false } : {}),
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nie udało się pobrać ustawień');
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  const persistSettings = useCallback(async () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      const message = EMPTYNICKNAMEERRORTEXT[LANGUAGE] ?? EMPTYNICKNAMEERRORTEXT.polish;
      setErrorMessage(message);
      showError(message);
      return false;
    }

    const SELECTEDLANGUAGE = RESOLVELANGUAGECODE(DIVLANGUAGE);

    document.cookie = `CURRENTLANGUAGE=${SELECTEDLANGUAGE};path=/`;
    SETLANGUAGE(SELECTEDLANGUAGE);

    setIsSaving(true);
    setErrorMessage('');

    const payload = {
      nickname: trimmedNickname,
    };

    if (selectedAvatarId) {
      payload.avatarId = selectedAvatarId;
    }

    if (role === APP_ROLE.LECTURER) {
      payload.showNickname = draftShowNickname;
    }

    const result = await updateProfile(payload);

    if (!result.ok) {
      setIsSaving(false);
      const message = resolveProfileSaveErrorMessage(result.error, LANGUAGE)
        || 'Nie udało się zapisać ustawień';
      setErrorMessage(message);
      showError(message);
      return false;
    }

    const savedNickname = result.profile?.nickname ?? trimmedNickname;
    setNickname(savedNickname);

    // Zastosuj i zapisz motyw oraz preferencję zapamiętania sesji
    applyTheme(draftTheme);
    setRememberMe(draftRememberMe);

    await refetchProfile();

    if (role === APP_ROLE.LECTURER) {
      const savedShowNickname = result.profile?.showNickname !== false;
      setDraftShowNickname(savedShowNickname);
      setShowNickname(savedShowNickname);
    }

    setSavedSnapshot({
      nickname: savedNickname,
      avatarId: selectedAvatarId,
      LANGUAGE: SELECTEDLANGUAGE,
      theme: draftTheme,
      rememberMe: draftRememberMe,
      ...(role === APP_ROLE.LECTURER ? { showNickname: result.profile?.showNickname !== false } : {}),
    });

    setIsSaving(false);
    showSuccess('Zmiany zostały zapisane.');
    return true;
  }, [
    DIVLANGUAGE,
    LANGUAGE,
    draftRememberMe,
    draftShowNickname,
    draftTheme,
    nickname,
    refetchProfile,
    role,
    selectedAvatarId,
    setShowNickname,
    showError,
    showSuccess,
  ]);

  const isDirty = useMemo(() => {
    if (!savedSnapshot || isLoading) {
      return false;
    }

    if (nickname.trim() !== savedSnapshot.nickname) {
      return true;
    }

    if (selectedAvatarId !== savedSnapshot.avatarId) {
      return true;
    }

    if (RESOLVELANGUAGECODE(DIVLANGUAGE) !== savedSnapshot.LANGUAGE) {
      return true;
    }

    if (draftTheme !== savedSnapshot.theme) {
      return true;
    }

    if (draftRememberMe !== savedSnapshot.rememberMe) {
      return true;
    }

    if (role === APP_ROLE.LECTURER && draftShowNickname !== savedSnapshot.showNickname) {
      return true;
    }

    return false;
  }, [
    DIVLANGUAGE,
    draftRememberMe,
    draftShowNickname,
    draftTheme,
    isLoading,
    nickname,
    role,
    savedSnapshot,
    selectedAvatarId,
  ]);

  const {
    isPromptOpen,
    dismissPrompt,
    discardChanges,
    saveAndContinue,
  } = useUnsavedChangesGuard({
    when: isDirty && !isSaving,
    onSave: persistSettings,
  });

  const handleDiscard = useCallback(() => {
    if (savedSnapshot?.theme) {
      setDraftTheme(savedSnapshot.theme);
      applyTheme(savedSnapshot.theme);
    }
    if (savedSnapshot?.rememberMe !== undefined) {
      setDraftRememberMe(savedSnapshot.rememberMe);
    }
    discardChanges();
  }, [discardChanges, savedSnapshot?.rememberMe, savedSnapshot?.theme]);

  function onNicknamechange(stringvalue) {
    let nextValue = stringvalue;

    while (nextValue.length > SETTINGS_NICKNAME_MAX_LENGTH) {
      nextValue = nextValue.slice(0, -1);
    }

    setNickname(nextValue);
  }

  useEffect(() => {
    const COOKIELANGUAGE = READLANGUAGECOOKIE();

    if (COOKIELANGUAGE) {
      SETDIVLANGUAGE(LANGUAGESDICTIONARY[COOKIELANGUAGE] || 'polski');
      SETLANGUAGE(COOKIELANGUAGE);
    } else {
      document.cookie = 'CURRENTLANGUAGE=polish;path=/';
      SETDIVLANGUAGE('polski');
      SETLANGUAGE('polish');
    }

    loadSettings();
  }, [loadSettings]);

  return (
    <div className="app-page-layout">
      <SectionPageLayout
        className="page-unavailable settings-page group-settings-page"
        title={SETTINGSLABELTEXT[LANGUAGE]}
      >
        <div className="settings-page__body">
        {isLoading ? (
          <p className="settings-page__message page-unavailable__notice">Ładowanie ustawień…</p>
        ) : null}

        {!isLoading ? (
          <div className="group-settings-form group-settings-form--drive-layout">
            <section className="group-settings-form__panel" aria-labelledby="settings-avatar-title">
              <SettingsSectionHeader id="settings-avatar-title" title={AVATARLABELTEXT[LANGUAGE]} />
              <AvatarPicker
                avatars={avatars}
                value={selectedAvatarId}
                onChange={setSelectedAvatarId}
                disabled={isSaving}
                className="settings-page__avatar-picker"
                LANGUAGE={LANGUAGE}
              />
            </section>

            <Divider className="settings-page__divider" length="50%" />

            <section className="settings-page__preferences" aria-label="Preferencje konta">
              <SettingsSectionHeader title={NICKNAMELABELTEXT[LANGUAGE]} id="settings-nickname-title" />
              <div className="settings-page__field group-settings-form__field">
                <label className="group-settings-form__label" htmlFor="settings-nickname">
                  {NICKNAMELABELTEXT[LANGUAGE]}
                </label>
                <CharacterLimitedField value={nickname} maxLength={SETTINGS_NICKNAME_MAX_LENGTH}>
                  <input
                    id="settings-nickname"
                    type="text"
                    className="group-settings-form__input"
                    value={nickname}
                    maxLength={SETTINGS_NICKNAME_MAX_LENGTH}
                    onChange={(event) => onNicknamechange(event.target.value)}
                    disabled={isSaving}
                  />
                </CharacterLimitedField>
              </div>

              {role === APP_ROLE.LECTURER ? (
                <div className="settings-page__field settings-page__field--toggle">
                  <label className="settings-page__toggle">
                    <input
                      type="checkbox"
                      checked={draftShowNickname}
                      onChange={(event) => setDraftShowNickname(event.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="group-settings-form__label">{SHOWNICKNAMELABELTEXT[LANGUAGE]}</span>
                  </label>
                  <p className="group-settings-form__hint">{SHOWNICKNAMEDESCRIPTIONLABELTEXT[LANGUAGE]}</p>
                </div>
              ) : null}

              <div className="settings-page__field settings-page__field--toggle">
                <label className="settings-page__toggle">
                  <input
                    type="checkbox"
                    checked={draftRememberMe}
                    onChange={(event) => setDraftRememberMe(event.target.checked)}
                    disabled={isSaving}
                  />
                  <span className="group-settings-form__label">{REMEMBERMELABELTEXT[LANGUAGE]}</span>
                </label>
                <p className="group-settings-form__hint">{REMEMBERMEDESCRIPTIONLABELTEXT[LANGUAGE]}</p>
              </div>

              <Divider className="settings-page__divider" length="50%" />

              <SettingsSectionHeader title={THEMELABELTEXT[LANGUAGE]} id="settings-theme-title" />
              <div className="settings-page__theme-radio-group" role="radiogroup" aria-labelledby="settings-theme-title">
                {THEME_OPTIONS.map((option) => {
                  const isSelected = draftTheme === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`settings-page__theme-radio-option ${isSelected ? 'settings-page__theme-radio-option--selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => {
                          setDraftTheme(option.id);
                          applyTheme(option.id);
                        }}
                        disabled={isSaving}
                        className="settings-page__theme-radio-input"
                      />
                      <span className="settings-page__theme-radio-label">{option.label}</span>
                    </label>
                  );
                })}
              </div>

              <Divider className="settings-page__divider" length="50%" />

              <SettingsSectionHeader title={LANGUAGELABELTEXT[LANGUAGE]} id="settings-LANGUAGE-title" />
              <div className="settings-page__field group-settings-form__field">
                <label className="group-settings-form__label" htmlFor="settings-LANGUAGE">
                  {LANGUAGELABELTEXT[LANGUAGE]}
                </label>
                <select
                  id="settings-LANGUAGE"
                  className="group-settings-form__input"
                  value={DIVLANGUAGE}
                  onChange={(event) => SETDIVLANGUAGE(event.target.value)}
                  disabled={isSaving}
                >
                  {['polski', 'English'].map((LANGUAGEchosen) => (
                    <option key={LANGUAGEchosen} value={LANGUAGEchosen}>{LANGUAGEchosen}</option>
                  ))}
                </select>
              </div>
            </section>

            <Divider className="settings-page__divider" length="50%" />

            <div className="settings-page__footer">
              <p className="settings-page__help-text">
                <Link className="settings-page__help-link" to={appHelpPath()}>
                  {HELPCENTER0LABELTEXT[LANGUAGE]}
                </Link>
                {' '}
                <span>{HELPCENTER1LABELTEXT[LANGUAGE]}</span>
              </p>
            </div>
          </div>
        ) : null}

        {!isLoading ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            className="settings-page__save-fab"
            onClick={persistSettings}
            disabled={isSaving}
          >
            {SAVEBUTTONLABELTEXT[LANGUAGE]}
          </Button>
        ) : null}

        <Modal
          isOpen={isPromptOpen}
          onClose={dismissPrompt}
          title={UNSAVEDCHANGESLABELTEXT[LANGUAGE]}
          subtitle={UNSAVEDMESSAGESLABELTEXT[LANGUAGE]}
          showFooter={false}
          className="settings-page__unsaved-modal"
        >
          <div className="settings-page__unsaved-actions">
            <Button type="button" variant="secondary" size="md" onClick={dismissPrompt}>
              {UNSAVEDCANCELLABELTEXT[LANGUAGE]}
            </Button>
            <Button type="button" variant="secondary" size="md" onClick={handleDiscard}>
              {UNSAVEDDISCARDLABELTEXT[LANGUAGE]}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={saveAndContinue}
              disabled={isSaving}
            >
              {UNSAVEDSAVELABELTEXT[LANGUAGE]}
            </Button>
          </div>
        </Modal>

        {errorMessage ? (
          <p className="group-settings-form__error" role="alert">{errorMessage}</p>
        ) : null}
        </div>
      </SectionPageLayout>
    </div>
  );
}
