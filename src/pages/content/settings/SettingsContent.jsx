import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';

import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { useLeaderDisplayPreferences } from '../../../hooks/useLeaderDisplayPreferences.js';
import { fetchAvatars, fetchProfile, updateProfile } from '../../../services/profile.api.js';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { Button, PageHeader, useToast } from '../../../components/ui/index.js';

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

const paneldescriptionLABEL = {

  polish: 'Panel pozwalający na zmianę awatara, języka oraz nicku.',

  english: 'Panel allowing you to change your avatar, language, and nickname.',

  japanese: 'アバター、言語、ニックネームを変更できるパネル',

  kana: 'アバター、げんご、ニックネームをへんこうできるパネル',

};

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

const savebuttonLABEL = {
  polish: 'Zapisz zmiany',
  english: 'Save Changes',
  japanese: '変更を保存',
  kana: 'へんこうをほぞん',
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



export default function SettingsContent() {
  const { refetchProfile } = useUserProfile();
  const { role } = useAppRole();
  const { showNickname, setShowNickname } = useLeaderDisplayPreferences();
  const { showSuccess, showError } = useToast();

  const [draftShowNickname, setDraftShowNickname] = useState(showNickname);

  const [errorMessage, setErrorMessage] = useState('');

  const [saveMessage, setSaveMessage] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [nickname, setNickname] = useState('');

  const [avatars, setAvatars] = useState([]);

  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);

  const [divlanguage, setDivlanguage] = useState('polski');

  const [language, setLanguage] = useState(() => readLanguageCookie() || 'polish');



  async function loadSettings() {

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

  }



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

    while (nextValue.length > 15) {

      nextValue = nextValue.slice(0, -1);

    }

    setNickname(nextValue);

  }



  async function savechanges() {

    let selectedlanguage = divlanguage;



    if (selectedlanguage === 'polski') {

      selectedlanguage = 'polish';

    } else if (selectedlanguage === '日本語') {

      selectedlanguage = 'japanese';

    } else if (selectedlanguage === 'にほんご') {

      selectedlanguage = 'kana';

    } else {

      selectedlanguage = 'english';

    }



    document.cookie = `currentlanguage=${selectedlanguage};path=/`;

    setLanguage(selectedlanguage);



    setIsSaving(true);

    setErrorMessage('');

    setSaveMessage('');



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

  }, []);



  const selectedAvatar = avatars[selectedAvatarIndex] ?? null;



  return (
    <div className="app-page-layout">
      <section className="page-unavailable members-page settings-page group-settings-page" aria-labelledby="settings-title">
        <PageHeader
          title={settingsLABEL[language]}
          description={paneldescriptionLABEL[language]}
        />

        <div className="settings-page__body">
        {isLoading ? (
          <p className="settings-page__message">Ładowanie ustawień…</p>
        ) : null}

        {!isLoading ? (
          <div className="group-settings-form">
            <section className="group-settings-form__panel" aria-labelledby="settings-avatar-title">
              <h2 id="settings-avatar-title" className="group-settings-form__panel-title">
                {avatarLABEL[language]}
              </h2>
              <div className="settings-page__avatar-controls">
                <button type="button" className="settings-page__avatar-nav" onClick={previousicon} aria-label="Poprzedni awatar">
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
                <button type="button" className="settings-page__avatar-nav" onClick={nexticon} aria-label="Następny awatar">
                  <img src={righticon} alt="" />
                </button>
              </div>
            </section>

            <div className="group-settings-form__grid">
              <div className="group-settings-form__field">
                <label className="group-settings-form__label" htmlFor="settings-language">
                  {languageLABEL[language]}
                </label>
                <select
                  id="settings-language"
                  className="group-settings-form__input"
                  value={divlanguage}
                  onChange={(event) => setDivlanguage(event.target.value)}
                >
                  {['polski', 'English', '日本語', 'にほんご'].map((languagechosen) => (
                    <option key={languagechosen} value={languagechosen}>{languagechosen}</option>
                  ))}
                </select>
              </div>

              <div className="group-settings-form__field">
                <label className="group-settings-form__label" htmlFor="settings-nickname">
                  {nicknameLABEL[language]}
                </label>
                <input
                  id="settings-nickname"
                  type="text"
                  className="group-settings-form__input"
                  value={nickname}
                  maxLength={15}
                  onChange={(event) => onNicknamechange(event.target.value)}
                />
              </div>
            </div>

            {role === APP_ROLE.LECTURER ? (
              <section className="group-settings-form__panel">
                <label className="settings-page__toggle">
                  <input
                    type="checkbox"
                    checked={draftShowNickname}
                    onChange={(event) => setDraftShowNickname(event.target.checked)}
                  />
                  <span className="group-settings-form__label">{showNicknameLABEL[language]}</span>
                </label>
                <p className="group-settings-form__hint">{showNicknameDescLABEL[language]}</p>
              </section>
            ) : null}

            <div className="settings-page__footer">
              <p className="settings-page__help-text">
                <Link className="settings-page__help-link" to={appHelpPath()}>
                  {helpcenter0LABEL[language]}
                </Link>
                {' '}
                <span>{helpcenter1LABEL[language]}</span>
              </p>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={savechanges}
                disabled={isSaving}
              >
                {isSaving ? 'Zapisywanie…' : savebuttonLABEL[language]}
              </Button>
            </div>
          </div>
        ) : null}

        {errorMessage ? (
          <p className="group-settings-form__error" role="alert">{errorMessage}</p>
        ) : null}
        </div>
      </section>
    </div>
  );

}


