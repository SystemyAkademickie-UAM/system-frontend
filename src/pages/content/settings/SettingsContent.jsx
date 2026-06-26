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
import { SETTINGS_NICKNAME_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';

import { appHelpPath } from '../../../routes/pathRegistry.js';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import '../group-settings/GroupSettingsForm.css';
import './SettingsContent.css';

const languagesdictionary = { polish: 'polski', english: 'English', japanese: '日本語', kana: 'にほんご' };

const settingsLABEL = { polish: 'Ustawienia', english: 'Settings', japanese: '設定', kana: 'オプション' };
const avatarLABEL = { polish: 'Awatar', english: 'Avatar', japanese: 'プロフィール画像', kana: 'アバタ' };
const languageLABEL = { polish: 'Jezyk', english: 'Language', japanese: '言語', kana: 'げんご' };
const nicknameLABEL = { polish: 'Ksywka', english: 'Nickname', japanese: '名前', kana: 'ニックネーム' };
const helpcenter0LABEL = { polish: 'Centrum Pomocy', english: 'Help Center', japanese: 'ヘルプセンター', kana: 'ヘルプセンター' };
const helpcenter1LABEL = {
  polish: '- informacje, dokumentacja i wsparcie',
  english: '- information, documentation, and support',
  japanese: '- 情報、ドキュメント、サポート',
  kana: '- じょうほう、ドキュメント、サポート',
};
const showNicknameLABEL = {
  polish: 'Wyświetlaj ksywkę',
  english: 'Show nickname',
  japanese: 'ニックネームを表示',
  kana: 'ニックネームをひょうじ',
};
const showNicknameDescLABEL = {
  polish: 'Gdy wyłączone, w pasku nawigacji i opisie grupy widać imię i nazwisko zamiast ksywki.',
  english: 'When disabled, the navigation bar and group description show your legal name instead of nickname.',
  japanese: 'オフにすると、ナビバーとグループ説明にニックネームではなく氏名が表示されます。',
  kana: 'オフにすると、ナビバーとグループ説明にニックネームではなく氏名が表示されます。',
};
const savebuttonLABEL = { polish: 'Zapisz zmiany', english: 'Save changes', japanese: '変更を保存', kana: 'へんこうをほぞん' };
const unsavedTitleLABEL = {
  polish: 'Niezapisane zmiany',
  english: 'Unsaved changes',
  japanese: '未保存の変更',
  kana: 'みほぞんのへんこう',
};
const unsavedMessageLABEL = {
  polish: 'Masz niezapisane zmiany na tej stronie. Czy chcesz je zapisać przed opuszczeniem?',
  english: 'You have unsaved changes on this page. Do you want to save them before leaving?',
  japanese: 'このページに未保存の変更があります。離れる前に保存しますか？',
  kana: 'このページにみほぞんのへんこうがあります。離れるまえにほぞんしますか？',
};
const unsavedCancelLABEL = { polish: 'Anuluj', english: 'Cancel', japanese: 'キャンセル', kana: 'キャンセル' };
const unsavedDiscardLABEL = {
  polish: 'Odrzuć zmiany',
  english: 'Discard changes',
  japanese: '変更を破棄',
  kana: 'へんこうをはき',
};
const unsavedSaveLABEL = { polish: 'Zapisz', english: 'Save', japanese: '保存', kana: 'ほぞん' };

function readLanguageCookie() {
  const cookies = Object.fromEntries(
    document.cookie.split(';').map((entry) => {
      const [key, value] = entry.split('=');
      return [key.trim(), value];
    }),
  );

  return cookies.currentlanguage;
}

function resolveLanguageCode(displayLanguage) {
  if (displayLanguage === 'polski') {
    return 'polish';
  }
  if (displayLanguage === '日本語') {
    return 'japanese';
  }
  if (displayLanguage === 'にほんご') {
    return 'kana';
  }
  return 'english';
}

export default function SettingsContent() {
  const { refetchProfile } = useUserProfile();
  const { role } = useAppRole();
  const { showNickname, setShowNickname } = useLeaderDisplayPreferences();
  const { showSuccess, showError } = useToast();

  const [draftShowNickname, setDraftShowNickname] = useState(showNickname);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [nickname, setNickname] = useState('');
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [divlanguage, setDivlanguage] = useState('polski');
  const [language, setLanguage] = useState(() => readLanguageCookie() || 'polish');

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
        setDraftShowNickname(showNickname);
      }

      const currentLanguage = readLanguageCookie() || 'polish';
      setSavedSnapshot({
        nickname: profile.nickname || '',
        avatarId: loadedAvatarId,
        language: currentLanguage,
        ...(role === APP_ROLE.LECTURER ? { showNickname } : {}),
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nie udało się pobrać ustawień');
    } finally {
      setIsLoading(false);
    }
  }, [role, showNickname]);

  const persistSettings = useCallback(async () => {
    const selectedLanguage = resolveLanguageCode(divlanguage);

    document.cookie = `currentlanguage=${selectedLanguage};path=/`;
    setLanguage(selectedLanguage);

    setIsSaving(true);
    setErrorMessage('');

    const payload = {
      nickname: nickname.trim(),
    };

    if (selectedAvatarId) {
      payload.avatarId = selectedAvatarId;
    }

    const result = await updateProfile(payload);

    if (!result.ok) {
      setIsSaving(false);
      showError(result.error || 'Nie udało się zapisać ustawień');
      return false;
    }

    const trimmedNickname = result.profile?.nickname ?? nickname.trim();
    setNickname(trimmedNickname);

    await refetchProfile();

    if (role === APP_ROLE.LECTURER) {
      setShowNickname(draftShowNickname);
    }

    setSavedSnapshot({
      nickname: trimmedNickname,
      avatarId: selectedAvatarId,
      language: selectedLanguage,
      ...(role === APP_ROLE.LECTURER ? { showNickname: draftShowNickname } : {}),
    });

    setIsSaving(false);
    showSuccess('Zmiany zostały zapisane.');
    return true;
  }, [
    divlanguage,
    draftShowNickname,
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

    if (resolveLanguageCode(divlanguage) !== savedSnapshot.language) {
      return true;
    }

    if (role === APP_ROLE.LECTURER && draftShowNickname !== savedSnapshot.showNickname) {
      return true;
    }

    return false;
  }, [
    divlanguage,
    draftShowNickname,
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

  function onNicknamechange(stringvalue) {
    let nextValue = stringvalue;

    while (nextValue.length > SETTINGS_NICKNAME_MAX_LENGTH) {
      nextValue = nextValue.slice(0, -1);
    }

    setNickname(nextValue);
  }

  useEffect(() => {
    const cookieLanguage = readLanguageCookie();

    if (cookieLanguage) {
      setDivlanguage(languagesdictionary[cookieLanguage] || 'polski');
      setLanguage(cookieLanguage);
    } else {
      document.cookie = 'currentlanguage=polish;path=/';
      setDivlanguage('polski');
      setLanguage('polish');
    }

    loadSettings();
  }, [loadSettings]);

  return (
    <div className="app-page-layout">
      <SectionPageLayout
        className="page-unavailable settings-page group-settings-page"
        title={settingsLABEL[language]}
      >
        <div className="settings-page__body">
        {isLoading ? (
          <p className="settings-page__message page-unavailable__notice">Ładowanie ustawień…</p>
        ) : null}

        {!isLoading ? (
          <div className="group-settings-form group-settings-form--drive-layout">
            <section className="group-settings-form__panel" aria-labelledby="settings-avatar-title">
              <SettingsSectionHeader id="settings-avatar-title" title={avatarLABEL[language]} />
              <AvatarPicker
                avatars={avatars}
                value={selectedAvatarId}
                onChange={setSelectedAvatarId}
                disabled={isSaving}
                className="settings-page__avatar-picker"
              />
            </section>

            <Divider className="settings-page__divider" length="50%" />

            <section className="settings-page__preferences" aria-label="Preferencje konta">
              <SettingsSectionHeader title={nicknameLABEL[language]} id="settings-nickname-title" />
              <div className="settings-page__field group-settings-form__field">
                <label className="group-settings-form__label" htmlFor="settings-nickname">
                  {nicknameLABEL[language]}
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
                    <span className="group-settings-form__label">{showNicknameLABEL[language]}</span>
                  </label>
                  <p className="group-settings-form__hint">{showNicknameDescLABEL[language]}</p>
                </div>
              ) : null}

              <Divider className="settings-page__divider" length="50%" />

              <SettingsSectionHeader title={languageLABEL[language]} id="settings-language-title" />
              <div className="settings-page__field group-settings-form__field">
                <label className="group-settings-form__label" htmlFor="settings-language">
                  {languageLABEL[language]}
                </label>
                <select
                  id="settings-language"
                  className="group-settings-form__input"
                  value={divlanguage}
                  onChange={(event) => setDivlanguage(event.target.value)}
                  disabled={isSaving}
                >
                  {['polski', 'English', '日本語', 'にほんご'].map((languagechosen) => (
                    <option key={languagechosen} value={languagechosen}>{languagechosen}</option>
                  ))}
                </select>
              </div>
            </section>

            <Divider className="settings-page__divider" length="50%" />

            <div className="settings-page__footer">
              <p className="settings-page__help-text">
                <Link className="settings-page__help-link" to={appHelpPath()}>
                  {helpcenter0LABEL[language]}
                </Link>
                {' '}
                <span>{helpcenter1LABEL[language]}</span>
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
            {savebuttonLABEL[language]}
          </Button>
        ) : null}

        <Modal
          isOpen={isPromptOpen}
          onClose={dismissPrompt}
          title={unsavedTitleLABEL[language]}
          subtitle={unsavedMessageLABEL[language]}
          showFooter={false}
          className="settings-page__unsaved-modal"
        >
          <div className="settings-page__unsaved-actions">
            <Button type="button" variant="secondary" size="md" onClick={dismissPrompt}>
              {unsavedCancelLABEL[language]}
            </Button>
            <Button type="button" variant="secondary" size="md" onClick={discardChanges}>
              {unsavedDiscardLABEL[language]}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={saveAndContinue}
              disabled={isSaving}
            >
              {unsavedSaveLABEL[language]}
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
