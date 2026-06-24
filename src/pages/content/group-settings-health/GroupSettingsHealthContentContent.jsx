import {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {getApiBaseUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../api-test/mock/browserIdStorage.js';

import GroupSettingsHealthContentWindow from './GroupSettingsHealthContentWindow.jsx';

import 'unicode-emoji-picker';

export default function App() {

  const {groupId} = useParams();
  const [errorMessage, setErrorMessage] = useState('');

  const [currenticon, setCurrenticon] = useState('❤️');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  const [livesname, setLivesname] = useState('');
  const [livesenabled, setLivesenabled] = useState(0);
  const [liveslimit, setLiveslimit] = useState('');
  const [livesstart, setLivesstart] = useState('99');
  const [livesshopenabled, setLivesshopenabled] = useState(0);

  const [livespopupopen, setLivespopupopen] = useState(0);



  function onPickerMounted(picker) {

    if (!picker) {
      return;
    }

    picker.addEventListener('emoji-pick', (event) => {
      setCurrenticon(event.detail.emoji);
      setIsPickerOpen(false);
    });
  }





  function onNumericinput(stringvalue, setterfunction) {

    let filtered = '';

    let i = 0;

    while (i < stringvalue.length) {

      let character = stringvalue[i];

      if (character == '0' || character == '1' || character == '2' || character == '3' || character == '4' || character == '5' || character == '6' || character == '7' || character == '8' || character == '9') {
        filtered = filtered + character;
      }

      i = i + 1;
    }

    setterfunction(filtered);
  }





  function changeliveslimitby(delta) {

    let currentvalue = Number(liveslimit);

    if (liveslimit == '' || isNaN(currentvalue)) {
      currentvalue = 0;
    }

    let newvalue = currentvalue + delta;

    if (newvalue < 0) {
      newvalue = 0;
    }

    setLiveslimit(String(newvalue));
  }





  function changelivesstartby(delta) {

    let currentvalue = Number(livesstart);

    if (livesstart == '' || isNaN(currentvalue)) {
      currentvalue = 99;
    }

    let newvalue = currentvalue + delta;

    if (newvalue < 0) {
      newvalue = 0;
    }

    setLivesstart(String(newvalue));
  }





  function togglesystemlives() {

    if (livesenabled == 0) {
      setLivesenabled(1);
    } else {
      setLivesenabled(0);
    }
  }





  function applylivesdata(data) {

    let labelvalue = data.livesLabel;

    if (labelvalue == null) {
      labelvalue = '';
    }

    setLivesname(labelvalue);

    let enabledvalue = 0;

    if (data.livesEnabled == true || data.livesEnabled == 1) {
      enabledvalue = 1;
    }

    setLivesenabled(enabledvalue);

    let maxvalue = data.livesMax;

    if (maxvalue == null) {
      maxvalue = '';
    } else {
      maxvalue = String(maxvalue);
    }

    setLiveslimit(maxvalue);

    setLivesstart('99');

    let shopvalue = 0;

    if (data.livesShopEnabled == true || data.livesShopEnabled == 1) {
      shopvalue = 1;
    }

    setLivesshopenabled(shopvalue);

    let iconvalue = data.livesIcon;

    if (iconvalue == null || iconvalue == '') {
      iconvalue = '❤️';
    }

    setCurrenticon(iconvalue);
  }





  async function onfetchlivessettings() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/lives-config';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/lives-config: ', response.status);
      console.log('GET /groups/' + groupId + '/lives-config: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/lives-config not JSON: ' + responsetext);
      }

      console.log('GET /groups/' + groupId + '/lives-config JSON:', data);

      applylivesdata(data);

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





  function resetlivessettings() {
    onfetchlivessettings();
  }





  async function saveliveschanges() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/lives-config';

      const payload = {
        livesEnabled: livesenabled == 1,
        livesIcon: currenticon,
        livesShopEnabled: livesshopenabled == 1
      };

      if (livesname.trim().length > 0) {
        payload.livesLabel = livesname.trim();
      }

      if (liveslimit != '') {
        payload.lives = Number(liveslimit);
      }

      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify(payload)
      });

      const responsetext = await response.text();

      console.log('PATCH /groups/' + groupId + '/lives-config: ', response.status);
      console.log('PATCH /groups/' + groupId + '/lives-config: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/lives-config not JSON: ' + responsetext);
      }

      console.log('PATCH /groups/' + groupId + '/lives-config JSON:', data);

      onfetchlivessettings();

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





  function showlivespopup() {
    setLivespopupopen(1);
  }





  function hidelivespopup() {
    setLivespopupopen(0);
  }





  function editlives() {
    console.log('ok');
  }





  useEffect(() => {
    onfetchlivessettings();
  }, []);



  return (
    <div>
      <div>
        <div style = {{width: '75vw', height: '100%', position: 'relative', top: '0%', left: '0%'}}>

          <div style = {{width: '98%', position: 'relative', top: '0%', left: '1%', display: 'flex', flexDirection: 'column', gap: '2vh', paddingBottom: '4vh'}}>



            <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '2vh', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2%', paddingRight: '2%'}}>

              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1vh'}}>
                <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}>Ikona żyć</div>
                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2vh'}}>
                  
                  <div onClick = {() => setIsPickerOpen(!isPickerOpen)} style = {{backgroundColor: 'rgb(40, 40, 52)', height: '14vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <div style = {{color: 'rgb(227, 224, 247)', fontSize: '48px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center'}}>{currenticon}</div>
                  </div>
                  
                  {isPickerOpen ? (
                    <div onClick = {() => setIsPickerOpen(false)} style = {{position: 'fixed', top: '0vh', left: '0vw', width: '100vw',  height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999}}>
                      <div onClick = {(event) => event.stopPropagation()} style = {{position: 'relative'}}><unicode-emoji-picker ref = {onPickerMounted} style = {{'--fill-color': 'rgb(40, 40, 52)', '--text-color': 'rgb(227, 224, 247)', '--title-bar-fill-color': 'rgb(40, 40, 52)', '--variations-fill-color': 'rgb(26, 26, 42)', '--variations-backdrop-fill-color': 'rgba(40, 40, 52, 0.75)'}}></unicode-emoji-picker></div>
                    </div>
                  ) : null}

                </div>
              </div>

              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Nazwa żyć</div>
                <input onChange = {(event) => setLivesname(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', width: '30%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', outline: 'none'}} value = {livesname} onFocus = {(event) => (event.target.style.border = '2px solid rgb(30, 204, 56)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></input>
              </div>

              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>System żyć</div>
                <div onClick = {() => togglesystemlives()} style = {{backgroundColor: livesenabled == 1 ? 'rgba(30, 204, 56)' : 'rgb(40, 40, 52)', width: '10vw', height: '5vh', position: 'relative', borderRadius: '8px', color: livesenabled == 1 ? 'rgb(0, 57, 21)' : 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>{livesenabled == 1 ? 'Wł.' : 'Wył.'}</div>
              </div>

              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Limit żyć</div>
                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%'}}>
                  <input type = "number" onInput = {(event) => onNumericinput(event.target.value, setLiveslimit)} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', width: '30%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', outline: 'none', textAlign: 'left', paddingRight: '1%'}} value = {liveslimit} onFocus = {(event) => (event.target.style.border = '2px solid rgb(30, 204, 56)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></input>

                </div>
              </div>

              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Startowa liczba żyć*</div>
                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%'}}>
                  <input type = "number" onInput = {(event) => onNumericinput(event.target.value, setLivesstart)} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', border: '2px solid rgba(0, 0, 0, 0)', width: '30%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', outline: 'none', textAlign: 'left', paddingRight: '1%'}} value = {livesstart} onFocus = {(event) => (event.target.style.border = '2px solid rgb(30, 204, 56)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></input>

                </div>
              </div>

              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%'}}>
                  <input type = "checkbox" checked = {livesshopenabled == 1} onChange = {() => {if (livesshopenabled == 0) {setLivesshopenabled(1);} else {setLivesshopenabled(0);}}} style = {{cursor: 'pointer'}}/>
                  <div style = {{color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center'}}>Możliwość kupowania żyć w sklepie</div>
                </div>
              </div>

              <div onClick = {() => editlives()} style = {{backgroundColor: 'rgba(30, 204, 56)', width: '10vw', position: 'relative', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Edytuj życie</div>

              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '2%', paddingTop: '1vh'}}>
                <div onClick = {() => showlivespopup()} style = {{backgroundColor: 'rgba(30, 204, 56)', width: '10vw', position: 'relative', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Zarządzanie</div>
                <div style = {{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%'}}>
                  <div onClick = {() => resetlivessettings()} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '10vw', position: 'relative', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Cofnij zmiany</div>
                  <div onClick = {() => saveliveschanges()} style = {{backgroundColor: 'rgba(30, 204, 56)', width: '10vw', position: 'relative', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Zapisz zmiany</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
      {livespopupopen == 1 ? (
        <GroupSettingsHealthContentWindow popupclose = {hidelivespopup} groupId = {groupId} liveslabel = {livesname} livesicon = {currenticon} livesstart = {livesstart} />
      ) : null}
    </div>
  )
}

