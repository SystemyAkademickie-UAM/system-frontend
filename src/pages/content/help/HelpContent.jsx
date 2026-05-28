import '../RouteContent.css';

import { useState, useEffect } from 'react';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';
//import './ProfileContent.css';

export default function ProfileContent() {
  const [errorMessage, setErrorMessage] = useState('');



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
    return cookies['currentlanguage'] || 'polski';
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


  var helpLABEL = {polish: 'Centrum Pomocy', english: 'Help Center', japanese: 'ヘルプセンター', kana: 'ヘルプセンター'};
  var mailLABEL = {polish: 'Adres kontaktowy', english: 'Contact Address', japanese: '連絡先', kana: 'れんらくさき'};
  var numberLABEL = {polish: 'Infolinia', english: 'Hotline', japanese: 'ホットライン', kana: 'ほっとらいん'};

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



        <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '50%', height: '50%', position: 'absolute', top: '16%', left: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '16px'}}>
          <div style = {{width: '98%', height: '15%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '42px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', marginBottom: '5%', marginTop: '5%'}}>{helpLABEL[language]}</div>
          <div style = {{width: '98%', height: '10%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}>{mailLABEL[language]}</div>
          <a style = {{width: '98%', height: '10%', position: 'relative', color: 'rgb(66, 243, 125)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', marginBottom: '5%', textDecoration: 'none'}} href="mailto:kontakt@maq.projekt.pl">
            <div>kontakt@maq.projekt.pl</div>
          </a>
          <div style = {{width: '98%', height: '10%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}>{numberLABEL[language]}</div>
          <div style = {{width: '98%', height: '10%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}>555-maq-projekt</div>
          <div style = {{width: '98%', height: '10%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}>555-call-us</div>
        </div>









      </div>
      {errorMessage && <p className="profile-content__error">{errorMessage}</p>}

    </div>
  );
}




