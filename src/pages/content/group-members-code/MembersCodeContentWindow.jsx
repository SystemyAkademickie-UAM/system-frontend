import {useState, useEffect} from 'react';
import {getApiBaseUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../api-test/mock/browserIdStorage.js';
import {useToast} from '../../../components/ui/index.js';

export default function MembersCodeContentWindow({popupclose, groupId, editCodeId, onsaved}) {

  const [errorMessage, setErrorMessage] = useState('');
  const {showSuccess, showError} = useToast();

  const [inputcode, setInputcode] = useState('');
  const [hasexpires, setHasexpires] = useState(0);
  const [expiredate, setExpiredate] = useState('');
  const [expiretime, setExpiretime] = useState('23:59');
  const [hasmaxuses, setHasmaxuses] = useState(0);
  const [maxusesvalue, setMaxusesvalue] = useState('10');
  const [isactive, setIsactive] = useState(1);

  const [displaycode, setDisplaycode] = useState('');




  function cleardata() {
    setErrorMessage('');
    setInputcode('');
    setHasexpires(0);
    setExpiredate('');
    setExpiretime('23:59');
    setHasmaxuses(0);
    setMaxusesvalue('10');
    setIsactive(1);
    setDisplaycode('');
  }




  function closewindow() {
    cleardata();
    if (popupclose) {
      popupclose();
    }
  }




  function togglehasexpires() {
    if (hasexpires == 0) {
      setHasexpires(1);
    } else {
      setHasexpires(0);
    }
  }




  function togglehasmaxuses() {
    if (hasmaxuses == 0) {
      setHasmaxuses(1);
    } else {
      setHasmaxuses(0);
    }
  }




  function toggleisactive() {
    if (isactive == 0) {
      setIsactive(1);
    } else {
      setIsactive(0);
    }
  }




  function buildexpiresat() {
    if (hasexpires == 0) {
      return '';
    }

    if (expiredate == '') {
      return '';
    }

    var data = expiredate.split('-');

    var year = data[0];
    var month = data[1] - 1;
    var day = data[2];

    var time = expiretime.split(':');
    var hour = time[0];
    var minute = time[1];

    var date = new Date(year, month, day, hour, minute, 0, 0);

    return date.toISOString();
  }




  function fillfromreceiveddata(receiveddata) {
    setDisplaycode(receiveddata.code);

    if (receiveddata.expiresAt != null && receiveddata.expiresAt != '') {
      setHasexpires(1);
      var date = new Date(receiveddata.expiresAt);
      var monthnumber = date.getMonth() + 1;
      var monthstring = String(monthnumber);
      if (monthstring.length == 1) {
        monthstring = '0' + monthstring;
      }
      var daystring = String(date.getDate());
      if (daystring.length == 1) {
        daystring = '0' + daystring;
      }
      setExpiredate(date.getFullYear() + '-' + monthstring + '-' + daystring);
      var hourstring = String(date.getHours());
      if (hourstring.length == 1) {
        hourstring = '0' + hourstring;
      }
      var minutestring = String(date.getMinutes());
      if (minutestring.length == 1) {
        minutestring = '0' + minutestring;
      }
      setExpiretime(hourstring + ':' + minutestring);
    } else {
      setHasexpires(0);
      setExpiredate('');
      setExpiretime('23:59');
    }

    if (receiveddata.maxUses != null) {
      setHasmaxuses(1);
      setMaxusesvalue(String(receiveddata.maxUses));
    } else {
      setHasmaxuses(0);
      setMaxusesvalue('10');
    }

    if (receiveddata.isActive == true) {
      setIsactive(1);
    } else {
      setIsactive(0);
    }
  }




  async function onFetchOneCode() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/enrollment-codes/' + editCodeId;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/enrollment-codes/' + editCodeId + ': ', response.status);
      console.log('GET /groups/' + groupId + '/enrollment-codes/' + editCodeId + ': ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/enrollment-codes/' + editCodeId + ' not JSON: ' + responsetext);
      }

      console.log('GET one enrollment code JSON:', data);

      let receiveddata = data;

      fillfromreceiveddata(receiveddata);

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




  async function onCreateCode() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/enrollment-codes';

      const body = {};

      if (inputcode.trim() != '') {
        body.code = inputcode.trim();
      }

      if (hasexpires == 1) {
        const expiresatiso = buildexpiresat();
        if (expiresatiso != '') {
          body.expiresAt = expiresatiso;
        }
      }

      if (hasmaxuses == 1) {
        body.maxUses = Number(maxusesvalue);
      }

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify(body)
      });

      const responsetext = await response.text();

      console.log('POST /groups/' + groupId + '/enrollment-codes: ', response.status);
      console.log('POST /groups/' + groupId + '/enrollment-codes: ', responsetext);

      if (response.status < 200 || response.status >= 300) {
        setErrorMessage('Nie udało się wygenerować kodu (status ' + response.status + ')');
        return;
      }

      closewindow();

      if (onsaved) {
        onsaved();
      }
      showSuccess('Kod został utworzony.');

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




  async function onUpdateCode() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/enrollment-codes/' + editCodeId;

      const body = {};

      if (hasexpires == 1) {
        const expiresatiso = buildexpiresat();
        if (expiresatiso != '') {
          body.expiresAt = expiresatiso;
        }
      } else {
        body.expiresAt = null;
      }

      if (hasmaxuses == 1) {
        body.maxUses = Number(maxusesvalue);
      } else {
        body.maxUses = null;
      }

      if (isactive == 1) {
        body.isActive = true;
      } else {
        body.isActive = false;
      }

      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify(body)
      });

      const responsetext = await response.text();

      console.log('PATCH /groups/' + groupId + '/enrollment-codes/' + editCodeId + ': ', response.status);
      console.log('PATCH /groups/' + groupId + '/enrollment-codes/' + editCodeId + ': ', responsetext);

      if (response.status < 200 || response.status >= 300) {
        setErrorMessage('Nie udało się zmienić kodu (status ' + response.status + ')');
        return;
      }

      closewindow();

      if (onsaved) {
        onsaved();
      }
      showSuccess('Kod został zmieniony.');

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




  function onsaveclick() {
    if (editCodeId == 0) {
      onCreateCode();
    } else {
      onUpdateCode();
    }
  }




  useEffect(() => {
    if (editCodeId == 0) {
      cleardata();
    } else {
      onFetchOneCode();
    }
  }, [editCodeId]);




  var iseditmode = 0;
  var savetext = 'Generuj';
  var titletext = 'Generuj nowy kod dostępu';

  if (editCodeId != 0) {
    iseditmode = 1;
    savetext = 'Zmień';
    titletext = 'Edytuj kod dostępu';
  }




  return (
    <div onClick = {closewindow} style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)', zIndex: 9, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div onClick = {(event) => event.stopPropagation()} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '75%', height: '75%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <div style = {{width: '100%', height: '12%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '24px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '2%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{titletext}</span></div>

        <div style = {{width: '96%', position: 'relative', left: '2%', display: 'flex', flexDirection: 'column', gap: '1.5vh', overflowY: 'auto', flex: 1, paddingBottom: '2%', paddingTop: '1%'}}>

          {iseditmode == 1 ? (
            <div style = {{backgroundColor: 'rgb(41, 40, 57)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1.5%', paddingBottom: '1.5%', paddingLeft: '2%', paddingRight: '6%', borderRadius: '12px'}}>
              <div style = {{width: '45%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>Kod:</span></div>
              <div style = {{width: '100%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-end'}}><span>{displaycode}</span></div>
            </div>
          ) : (
            <div style = {{backgroundColor: 'rgb(41, 40, 57)', width: '100%', height: '10vh', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1.5%', paddingBottom: '1.5%', paddingLeft: '2%', paddingRight: '2%', borderRadius: '12px'}}>
              <div style = {{width: '45%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>Własny kod (opcjonalnie)</span></div>
              <div style = {{width: '55%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                <input value = {inputcode} onChange = {(event) => setInputcode(event.target.value.slice(0, 6))} placeholder = "losowy kod" style = {{width: '100%', backgroundColor: 'rgb(26, 26, 42)', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '16px', paddingTop: '1vh', paddingBottom: '1vh', paddingLeft: '2%', paddingRight: '2%', outline: 'none'}} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = '')}/>
              </div>
            </div>
          )}

          <div style = {{backgroundColor: 'rgb(41, 40, 57)', width: '100%', height: '10vh', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1.5%', paddingBottom: '1.5%', paddingLeft: '2%', paddingRight: '2%', borderRadius: '12px'}}>
            <div style = {{width: '45%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>Data wygaśnięcia</span></div>
            <div style = {{width: '55%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2%'}}>
              {hasexpires == 1 ? (
                <div style = {{width: '73%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2%'}}>
                  <input type = "date" value = {expiredate} onChange = {(event) => setExpiredate(event.target.value)} style = {{width: '55%', backgroundColor: 'rgb(26, 26, 42)', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '16px', paddingTop: '1vh', paddingBottom: '1vh', paddingLeft: '2%', paddingRight: '2%', outline: 'none'}} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = '')}/>
                  <input type = "time" value = {expiretime} onChange = {(event) => setExpiretime(event.target.value)} style = {{width: '40%', backgroundColor: 'rgb(26, 26, 42)', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '16px', paddingTop: '1vh', paddingBottom: '1vh', paddingLeft: '2%', paddingRight: '2%', outline: 'none'}} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = '')}/>
                </div>
              ) : null}
              <div onClick = {togglehasexpires} style = {{backgroundColor: hasexpires == 1 ? 'rgba(66, 243, 125)' : 'rgb(26, 26, 42)', width: '25%', height: '4vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: hasexpires == 1 ? 'rgb(0, 57, 21)' : 'rgb(227, 224, 247)', fontSize: '16px', fontWeight: 900, cursor: 'pointer'}}><span>{hasexpires == 1 ? 'Tak' : 'Brak'}</span></div>
            </div>
          </div>

          <div style = {{backgroundColor: 'rgb(41, 40, 57)', width: '100%', height: '10vh', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1.5%', paddingBottom: '1.5%', paddingLeft: '2%', paddingRight: '2%', borderRadius: '12px'}}>
            <div style = {{width: '45%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>Limit użyć</span></div>
            <div style = {{width: '55%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2%'}}>

              {hasmaxuses == 1 ? (
                <input type = "number" min = "1" value = {maxusesvalue} onChange = {(event) => setMaxusesvalue(event.target.value)} style = {{width: '73%', backgroundColor: 'rgb(26, 26, 42)', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '16px', paddingTop: '1vh', paddingBottom: '1vh', paddingLeft: '2%', paddingRight: '2%', outline: 'none'}} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = '')}/>
              ) : null}
              <div onClick = {togglehasmaxuses} style = {{backgroundColor: hasmaxuses == 1 ? 'rgba(66, 243, 125)' : 'rgb(26, 26, 42)', width: '25%', height: '4vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: hasmaxuses == 1 ? 'rgb(0, 57, 21)' : 'rgb(227, 224, 247)', fontSize: '16px', fontWeight: 900, cursor: 'pointer'}}><span>{hasmaxuses == 1 ? 'Tak' : 'Brak'}</span></div>
            </div>
          </div>

          {iseditmode == 1 ? (
            <div style = {{backgroundColor: 'rgb(41, 40, 57)', width: '100%', height: '10vh', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1.5%', paddingBottom: '1.5%', paddingLeft: '2%', paddingRight: '2%', borderRadius: '12px'}}>
              <div style = {{width: '45%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>Kod aktywny</span></div>
              <div style = {{width: '55%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                <div onClick = {toggleisactive} style = {{backgroundColor: isactive == 1 ? 'rgba(66, 243, 125)' : 'rgb(26, 26, 42)', width: '25%', height: '4vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: isactive == 1 ? 'rgb(0, 57, 21)' : 'rgb(227, 224, 247)', fontSize: '16px', fontWeight: 900, cursor: 'pointer'}}><span>{isactive == 1 ? 'Tak' : 'Nie'}</span></div>
              </div>
            </div>
          ) : null}

        </div>



        <div style = {{width: '96%', position: 'relative', left: '2%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2%', paddingBottom: '2%', paddingTop: '1%'}}>
          <div onClick = {closewindow} style = {{backgroundColor: 'rgb(128, 128, 128)', width: '20%', height: '5vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: 'rgb(26, 26, 42)', fontSize: '16px', fontWeight: 900, cursor: 'pointer'}}><span>Anuluj</span></div>
          <div onClick = {onsaveclick} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '20%', height: '5vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', fontWeight: 900, cursor: 'pointer'}}><span>{savetext}</span></div>
        </div>

      </div>
    </div>
  )
}
