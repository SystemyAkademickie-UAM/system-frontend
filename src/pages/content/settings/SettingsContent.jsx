import { Link } from 'react-router-dom';

import { useCallback, useEffect, useState } from 'react';

import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { useLeaderDisplayPreferences } from '../../../hooks/useLeaderDisplayPreferences.js';
import { useDebouncedAutoSave } from '../../../hooks/useDebouncedAutoSave.js';
import { fetchAvatars, fetchProfile, updateProfile } from '../../../services/profile.api.js';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { Divider, CharacterLimitedField, useToast } from '../../../components/ui/index.js';
import { SETTINGS_NICKNAME_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';

import { appHelpPath } from '../../../routes/pathRegistry.js';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import '../group-settings/GroupSettingsForm.css';

import { publicIconPath } from '../../../utils/publicAssetUrl.js';

const lefticon = publicIconPath('arrow-left-svgrepo-com.svg');
const righticon = publicIconPath('arrow-right-svgrepo-com.svg');

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
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
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
      setSelectedAvatarIndex(avatarIndex >= 0 ? avatarIndex : 0);

      if (role === APP_ROLE.LECTURER) {
        setDraftShowNickname(showNickname);
      }
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

    const selectedAvatar = avatars[selectedAvatarIndex];
    const payload = {
      nickname: nickname.trim(),
    };

    if (selectedAvatar?.id) {
      payload.avatarId = selectedAvatar.id;
    }

    const result = await updateProfile(payload);

    if (!result.ok) {
      setIsSaving(false);
      showError(result.error || 'Nie udało się zapisać ustawień');
      return;
    }

    if (result.profile?.nickname) {
      setNickname(result.profile.nickname);
    }

    await refetchProfile();

    if (role === APP_ROLE.LECTURER) {
      setShowNickname(draftShowNickname);
    }

    setIsSaving(false);
    showSuccess('Zmiany zostały zapisane.');
  }, [
    avatars,
    divlanguage,
    draftShowNickname,
    nickname,
    refetchProfile,
    role,
    selectedAvatarIndex,
    setShowNickname,
    showError,
    showSuccess,
  ]);

  useDebouncedAutoSave({
    enabled: !isLoading && !isSaving,
    values: [nickname, selectedAvatarIndex, divlanguage, draftShowNickname],
    onSave: persistSettings,
  });

  function previousicon() {
    if (avatars.length === 0) return;

    setSelectedAvatarIndex((current) => (
      current <= 0 ? avatars.length - 1 : current - 1
    ));
  }

  function nexticon() {
    if (avatars.length === 0) return;

    setSelectedAvatarIndex((current) => (
      current >= avatars.length - 1 ? 0 : current + 1
    ));
  }

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

  const selectedAvatar = avatars[selectedAvatarIndex] ?? null;

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
              <h2 id="settings-avatar-title" className="group-settings-form__panel-title">
                {avatarLABEL[language]}
              </h2>
              <div className="settings-page__avatar-controls">
                <button type="button" className="settings-page__avatar-nav" onClick={previousicon} aria-label="Poprzedni awatar" disabled={isSaving}>
                  <img src={lefticon} alt="" />
                </button>
                <div className="settings-page__avatar-preview">
                  {selectedAvatar?.imageUrl ? (
                    <img
                      src={selectedAvatar.imageUrl}
                      alt=""
                      className={getAvatarImageClassName(selectedAvatar.imageUrl)}
                    />
                  ) : null}
                </div>
                <button type="button" className="settings-page__avatar-nav" onClick={nexticon} aria-label="Następny awatar" disabled={isSaving}>
                  <img src={righticon} alt="" />
                </button>
              </div>
            </section>

            <Divider className="settings-page__divider" length="50%" />

            <section className="settings-page__preferences" aria-label="Preferencje konta">
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

        {errorMessage ? (
          <p className="group-settings-form__error" role="alert">{errorMessage}</p>
        ) : null}
        </div>
      </SectionPageLayout>
    </div>
  );
}
