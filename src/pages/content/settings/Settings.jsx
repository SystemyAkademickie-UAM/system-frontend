import { Link } from 'react-router-dom';
import { appHelpPath } from '../../../routes/pathRegistry.js';
import '../RouteContent.css';
//import './SettingsContent.css';

import { useState, useEffect } from 'react';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';
//import './ProfileContent.css';

export default function ProfileContent() {
  const [errorMessage, setErrorMessage] = useState('');

  const [nickname, setNickname] = useState('Nickname');


  const languagesdictionary = {polish: 'polski', english: 'English', japanese: '日本語', kana: 'にほんご'};
  const [divlanguage, setDivlanguage] = useState('polski');
  const [language, setLanguage] = useState(() => {
    let allcookies = document.cookie.split(';');
    let cookies = {};
    let i = 0;
    while (i < allcookies.length) {
      let cookie = allcookies[i].split('=');
      cookies[cookie[0].trim()] = cookie[1];
      i = i + 1;
    }
    return cookies['currentlanguage'];
  });

  async function onFetchStudent() {
    setErrorMessage('');
    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const url = base + '/groups/100001/student-profile';
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();
      console.log('GET /groups/100001/student-profile HTTP status: ', response.status);
      console.log('GET /groups/100001/student-profile raw body: ', responsetext);

      let data;
      try {
        data = JSON.parse(responsetext);
      } catch {
        throw new Error('/groups/100001/student-profile not JSON: ' + responsetext);
      }

      console.log('GET /groups/100001/student-profile JSON:', data);

      let receiveddata = data;

    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }

      setErrorMessage(message);
    }
  }



  function onNicknamechange(stringvalue) {
    while (stringvalue.length > 15) {
      stringvalue = stringvalue.slice(0, -1);
    }
    setNickname(stringvalue);
    console.log(stringvalue);
  }


  function languagechange(selectedlanguage) {
    setDivlanguage(selectedlanguage);

  }

  function savechanges() {
    let selectedlanguage = divlanguage;

    if (selectedlanguage == 'polski') {
      selectedlanguage = 'polish';
    } else if (selectedlanguage == '日本語') {
      selectedlanguage = 'japanese';
    } else if (selectedlanguage == 'にほんご') {
      selectedlanguage = 'kana';
    } else {
      selectedlanguage = 'english';
    }

    document.cookie = `currentlanguage=${selectedlanguage};path=/`;
    setLanguage(selectedlanguage);

    let allcookies = document.cookie.split(';');
    let i = 0;
    let cookies = {};
    while (i < allcookies.length) {
      let cookie = allcookies[i].split('=');
      cookies[cookie[0]] = cookie[1];
      i = i + 1;
    }
    console.log(cookies);
  }

  var settingsLABEL = {polish: 'Ustawienia', english: 'Settings', japanese: '設定', kana: 'オプション'};
  var avatarLABEL = {polish: 'Awatar', english: 'Avatar', japanese: 'プロフィール画像', kana: 'アバタ'};
  var languageLABEL = {polish: 'Jezyk', english: 'Language', japanese: '言語', kana: 'げんご'};
  var nicknameLABEL = {polish: 'Ksywka', english: 'Nickname', japanese: '名前', kana: 'ニックネーム'};
  var paneldescriptionLABEL = {polish: 'Panel pozwalający na zmianę awatara, języka oraz nicku.', english: 'Panel allowing you to change your avatar, language, and nickname.', japanese: 'アバター、言語、ニックネームを変更できるパネル', kana: 'アバター、げんご、ニックネームをへんこうできるパネル'};
  var helpcenter0LABEL = {polish: 'Centrum Pomocy', english: 'Help Center', japanese: 'ヘルプセンター', kana: 'ヘルプセンター'};
  var helpcenter1LABEL = {polish: '- informacje, dokumentacja i wsparcie', english: '- information, documentation, and support', japanese: '- 情報、ドキュメント、サポート', kana: '- じょうほう、ドキュメント、サポート'};
  var savebuttonLABEL = {polish: 'Zapisz zmiany', english: 'Save Changes', japanese: '変更を保存', kana: 'へんこうをほぞん'};

  useEffect(() => {
    let allcookies = document.cookie.split(';');
    let i = 0;
    let cookies = {};
    while (i < allcookies.length) {
      let cookie = allcookies[i].split('=');
      cookies[cookie[0]] = cookie[1];
      i = i + 1;
    }
    console.log(cookies);
    console.log(cookies.currentlanguage);

    if (cookies.currentlanguage) {
      setDivlanguage(languagesdictionary[cookies.currentlanguage]);
    } else {
      document.cookie = 'currentlanguage=polish;path=/';
      cookies.currentlanguage = 'polish';
      setDivlanguage('polski');
      setLanguage('polish');
    }

    onFetchStudent();
  }, []);

  return (
    <div className="profile-content">
      <div className="profile-content__inner">

        <div style = {{width: '98%', height: '7.5%', position: 'absolute', top: '1%', left: '1%', color: 'rgb(227, 224, 247)', fontSize: '42px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>{settingsLABEL[language]}</div>
        <div style = {{width: '98%', height: '5%', position: 'absolute', top: '8.5%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>{paneldescriptionLABEL[language]}</span></div>

        <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '98%', height: '30%', position: 'absolute', top: '16%', left: '1%', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '16px'}}>
          <div style = {{width: '100%', height: '30%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}>{avatarLABEL[language]}</div>
          <div style = {{width: '100%', height: '60%', position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '2.5%'}}>
            <div style = {{backgroundColor: 'rgb(255, 0, 255', height: '45%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', borderRadius: '50%'}}></div>
            <div style = {{backgroundColor: 'rgb(255, 0, 255', height: '90%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', borderRadius: '50%'}}></div>
            <div style = {{backgroundColor: 'rgb(255, 0, 255', height: '45%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', borderRadius: '50%'}}></div>
          </div>
        </div>

        <div style = {{width: '98%', height: '25%', position: 'absolute', top: '47.5%', left: '1%', display: 'flex', borderRadius: '16px'}}>

            <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '49%', height: '90%', position: 'relative', top: '5%', justifyContent: 'center', borderRadius: '16px'}}>
              <div style = {{backgroundColor: 'rgb(40, 40, 52)', width: '95%', height: '20%', position: 'relative', top: '15%', left: '2.5%', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2.5%', borderRadius: '16px'}}>{languageLABEL[language]}</div>
              <select style = {{backgroundColor: 'rgb(40, 40, 52)', width: '95%', height: '40%', position: 'relative', top: '25%', left: '2.5%', color: 'rgb(66, 243, 125)', fontSize: '18px', fontWeight: 900, paddingLeft: '2.5%', border: 'none', outline: 'none', borderRadius: '16px', cursor: 'pointer'}} value={divlanguage} onChange={(event) => {setDivlanguage(event.target.value); languagechange(event.target.value);}}> {['polski', 'English', '日本語', 'にほんご'].map((languagechosen) => (
                <option key = {languagechosen} value = {languagechosen}>{languagechosen}</option>
              ))}
              </select>
            </div>

            <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '49%', height: '90%', position: 'relative', top: '5%', left: '2%', justifyContent: 'center', borderRadius: '16px'}}>
              <div style = {{backgroundColor: 'rgb(40, 40, 52)', width: '95%', height: '20%', position: 'relative', top: '15%', left: '2.5%', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2.5%', borderRadius: '16px'}}>{nicknameLABEL[language]}</div>
              <input onChange = {(event) => onNicknamechange(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '95%', height: '40%', position: 'relative', top: '25%', left: '2.5%', color: 'rgb(187, 203, 185)', fontSize: '18px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '16px'}} value = {nickname} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = '')}></input>
            </div>

        </div>


        <div onClick = {savechanges} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '10%', height: '7%', position: 'absolute', top: '75.5%', left: '88%', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>{savebuttonLABEL[language]}</div>

        <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '85%', height: '10%', position: 'absolute', top: '74%', left: '1%', display: 'flex', borderRadius: '16px'}}>
          <div style = {{backgroundColor: 'rgb(40, 40, 52)', width: '98%', height: '60%', position: 'relative', top: '20%', left: '1%', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2.5%', borderRadius: '16px'}}><Link className = "settings-content__help-link" to = {appHelpPath()} style = {{color: 'rgb(66, 243, 125)'}}>{helpcenter0LABEL[language]}</Link> <span style = {{color: 'rgb(227, 224, 247)'}}>{helpcenter1LABEL[language]}</span></div>
        </div>



      </div>
      {errorMessage && <p className="profile-content__error">{errorMessage}</p>}

    </div>
  );
}



