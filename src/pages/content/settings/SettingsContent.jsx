import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';

import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { useLeaderDisplayPreferences } from '../../../hooks/useLeaderDisplayPreferences.js';
import { fetchAvatars, fetchProfile, updateProfile } from '../../../services/profile.api.js';
import { useToast } from '../../../components/ui/index.js';

import { appHelpPath } from '../../../routes/pathRegistry.js';



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

    <section className="settings-content" aria-labelledby="settings-title">

      <header className="settings-content__header">

        <h1 id="settings-title" className="settings-content__title">{settingsLABEL[language]}</h1>

        <p className="settings-content__description">{paneldescriptionLABEL[language]}</p>

      </header>



      {isLoading ? (

        <p className="settings-content__message">Ładowanie ustawień…</p>

      ) : null}



      {!isLoading ? (

        <>

          <div className="settings-content__panel settings-content__avatar-panel">

            <h2 className="settings-content__panel-title">{avatarLABEL[language]}</h2>

            <div className="settings-content__avatar-controls">

              <button type="button" className="settings-content__avatar-nav" onClick={previousicon} aria-label="Poprzedni awatar">

                <img src={lefticon} alt="" />

              </button>

              <div className="settings-content__avatar-preview">

                {selectedAvatar?.imageUrl ? (

                  <img src={selectedAvatar.imageUrl} alt="" />

                ) : null}

              </div>

              <button type="button" className="settings-content__avatar-nav" onClick={nexticon} aria-label="Następny awatar">

                <img src={righticon} alt="" />

              </button>

            </div>

          </div>



          <div className="settings-content__row">

            <div className="settings-content__panel">

              <div className="settings-content__field-label">{languageLABEL[language]}</div>

              <select

                className="settings-content__select"

                value={divlanguage}

                onChange={(event) => setDivlanguage(event.target.value)}

              >

                {['polski', 'English', '日本語', 'にほんご'].map((languagechosen) => (

                  <option key={languagechosen} value={languagechosen}>{languagechosen}</option>

                ))}

              </select>

            </div>



            <div className="settings-content__panel">

              <div className="settings-content__field-label">{nicknameLABEL[language]}</div>

              <input

                type="text"

                className="settings-content__input"

                value={nickname}

                maxLength={15}

                onChange={(event) => onNicknamechange(event.target.value)}

              />

            </div>

          </div>

          {role === APP_ROLE.LECTURER ? (
            <div className="settings-content__panel settings-content__panel--toggle">
              <label className="settings-content__toggle">
                <input
                  type="checkbox"
                  checked={showNickname}
                  onChange={(event) => setShowNickname(event.target.checked)}
                />
                <span className="settings-content__field-label">{showNicknameLABEL[language]}</span>
              </label>
              <p className="settings-content__toggle-description">{showNicknameDescLABEL[language]}</p>
            </div>
          ) : null}

          <div className="settings-content__footer">

            <div className="settings-content__help">

              <div className="settings-content__help-inner">

                <Link className="settings-content__help-link" to={appHelpPath()}>

                  {helpcenter0LABEL[language]}

                </Link>

                {' '}

                <span>{helpcenter1LABEL[language]}</span>

              </div>

            </div>

            <button

              type="button"

              className="settings-content__save-btn"

              onClick={savechanges}

              disabled={isSaving}

            >

              {isSaving ? 'Zapisywanie…' : savebuttonLABEL[language]}

            </button>

          </div>

        </>

      ) : null}



      {errorMessage ? <p className="settings-content__error" role="alert">{errorMessage}</p> : null}

    </section>

  );

}


