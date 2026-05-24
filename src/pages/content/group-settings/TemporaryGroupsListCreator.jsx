import { useState } from 'react';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';
//import Button from '../../../components/ui/Button/Button.jsx';

export default function App({popupclose}) {

  const [errorMessage, setErrorMessage] = useState('');
  const [groupnamevalue, setGroupnamevalue] = useState('');
  const [subjectnamevalue, setSubjectnamevalue] = useState('');
  const [groupnamevalueerror, setGroupnamevalueerror] = useState('');
  const [subjectnamevalueerror, setSubjectnamevalueerror] = useState('');
  const [groupdescriptionvalue, setGroupdescriptionvalue] = useState('');
  const [isVisible, setIsvisible] = useState(true);

  const [bannerfile, setBannerfile] = useState(null);
  const [bannerpreview, setBannerpreview] = useState(null);

  function onGroupnamechange(stringvalue) {
    if (stringvalue.length > 15) {
      setGroupnamevalueerror('nie moze przekroczyc 15 znakow.');
    } else if (stringvalue.length < 1) {
      setGroupnamevalueerror('musi zawierac minimum 1 znak.');
    } else {
      setGroupnamevalueerror('');
    }
    while (stringvalue.length > 15) {
      stringvalue = stringvalue.slice(0, -1);
    }
    setGroupnamevalue(stringvalue);
    console.log(stringvalue);
  }
  function onSubjectnamechange(stringvalue) {
    if (stringvalue.length > 15) {
      setSubjectnamevalueerror('nie moze przekroczyc 15 znakow.');
    } else {
      setSubjectnamevalueerror('');
    }
    while (stringvalue.length > 15) {
      stringvalue = stringvalue.slice(0, -1);
    }
    setSubjectnamevalue(stringvalue);
    console.log(stringvalue);
  }
  function onGroupdescriptionchange(stringvalue) {

    setGroupdescriptionvalue(stringvalue);
    console.log(stringvalue);
  }
  function onTemplatesgalleryclick() {
    // Here (will) be codes to open Templates Gallery.
  }
  function onRejectclick() {
    setGroupnamevalue('');
    setSubjectnamevalue('');
    setGroupdescriptionvalue('');
    setBannerfile(null);
    setBannerpreview(null);
    setGroupnamevalueerror('');
    setSubjectnamevalueerror('');
    setErrorMessage('');
    setIsvisible(false);
    console.log(popupclose);
    if (popupclose) {
      popupclose();
    }
  }
  function onUploadbannerclick() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      let file = event.target.files[0];
      if (file) {
        setBannerfile(file);
        let reader = new FileReader();
        reader.onload = () => {
          setBannerpreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }
  async function onTryFetchGroupsList() {
    console.log('GET /groups.');
    try {
      let base = getApiBaseUrl();
      let browserid = getOrCreateBrowserId();
      let url = base + '/groups';
      let response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });
      let responsetext = await response.text();
      console.log('GET /groups HTTP:', response.status);
      console.log('GET /groups:', responsetext);
      try {
        let data = JSON.parse(responsetext);
        console.log('GET /groups JSON:', data);
      } catch {
        console.log('GET /groups not JSON.');
      }
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      console.log('GET /groups error:', message);
    }
  }

  async function uploadBannerToDrive(url, browserid) {
    console.log('POST /drive.', {
      browserId: browserid,
      fileName: bannerfile.name,
      fileSize: bannerfile.size
    });

    let formdata = new FormData();
    let drivejson = {
      drive: {
        method: 'post',
        driveRef: '',
        size: bannerfile.size
      }
    };
    formdata.append('json', JSON.stringify(drivejson));
    formdata.append('banner', bannerfile, bannerfile.name);
    console.log('JSON:', drivejson);

    let driveurl = url + '/drive';
    let driveresponse = await fetch(driveurl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-Browser-ID': browserid
      },
      body: formdata
    });

    let drivetest = await driveresponse.text();
    console.log('POST /drive:', driveresponse.status);
    console.log('POST /drive:', drivetest);

    let drivedata;
    try {
      drivedata = JSON.parse(drivetest);
    } catch {
      throw new Error('/drive not JSON: ' + drivetest);
    }
    console.log('POST /drive JSON:', drivedata);

    if (!driveresponse.ok || drivedata.status == 403) {
      throw new Error('Error.');
    }

    if (typeof drivedata.driveRef != 'string' || drivedata.driveRef.trim() == '') {
      throw new Error('Error driveRef.');
    }

    return drivedata.driveRef.trim();
  }

  async function onSavegroupclick() {
    if (groupnamevalue.length < 1) {
      setGroupnamevalueerror('musi zawierac minimum 1 znak.');
      return;
    }

    setErrorMessage('');

    try {
      let base = getApiBaseUrl();
      let browserid = getOrCreateBrowserId();

      let imageref = null;
      if (bannerfile) {
        imageref = await uploadBannerToDrive(base, browserid);
      }

      let datatopost = {
        group: {
          name: groupnamevalue,
          description: groupdescriptionvalue
        }
      };
      if (imageref) {
        datatopost.group.imageRef = imageref;
      }

      console.log('POST /groups/new');
      console.log('X-Browser-ID:', browserid);
      console.log('JSON:', datatopost);

      let url = base + '/groups/new';
      let response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify(datatopost)
      });

      let responsetext = await response.text();
      console.log('POST /groups/new HTTP status:', response.status);
      console.log('POST /groups/new raw body:', responsetext);

      let data;
      try {
        data = JSON.parse(responsetext);
      } catch {
        throw new Error('/groups/new not JSON: ' + responsetext);
      }
      console.log('POST /groups/new JSON:', data);

      if (!response.ok) {
        throw new Error('Error ' + response.status + ': ' + responsetext);
      }

      if (data.group == 1) {
        console.log('Error (group: 1).');
        setErrorMessage('Error (group: 1).');
        return;
      }
      if (data.group == 0) {
        console.log('Error (group: 0).');
        setErrorMessage('Error (group: 0).');
        return;
      }

      console.log('POST success:', data.group);
      console.log('API:', data.status);

      await onTryFetchGroupsList();

      onRejectclick();
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
  function onRemovebannerclick() {
    setBannerfile(null);
    setBannerpreview(null);
  }



  return isVisible ? (
    <main>
      <div style = {{backgroundColor: 'rgb(40, 40, 52)', width: '83%', height: '75%', position: 'absolute', top: '42%', left: '16%', borderRadius: '16px'}}>
        <div style = {{backgroundColor: 'rgb(40, 40, 52)', width: '98%', height: '98%', position: 'absolute', top: '1%', left: '1%', borderRadius: '16px'}}>
          <div style = {{width: '49%', height: '10%', position: 'absolute', top: '3%', left: '1%', fontSize: '42px', display: 'flex', color: 'rgb(227, 224, 247)', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Kreator Grupy</div>
          <div style = {{width: '98%', height: '5%', position: 'absolute', top: '13%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>W celu utworzenia nowej grupy prosze wprowadzic nazwe i opis.</span></div>
          <div onClick = {onTemplatesgalleryclick} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '10%', height: '7.5%', position: 'absolute', top: '3%', left: '89%', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Gotowy wzor</div>
          <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '98%', height: '40%', position: 'absolute', top: '20%', left: '1%', borderRadius: '16px'}}>
            <div style = {{width: '98%', height: '15%', position: 'absolute', top: '5%', left: '1%', color: 'rgb(227, 224, 247)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '0%'}}><span>Grupa</span></div>
            <div style = {{width: '48.5%', height: '10%', position: 'absolute', top: '20%', left: '1%', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '0%'}}><span style={{color: 'rgb(187, 203, 185)'}}>Nazwa grupy</span> <span style={{color: 'rgb(153, 41, 42)'}}>{groupnamevalueerror}</span></div>
            <input onChange = {(event) => onGroupnamechange(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '48.5%', height: '20%', position: 'absolute', top: '35%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '16px'}} value = {groupnamevalue} onFocus={(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur={(event) => (event.target.style.border = '')}></input>
            <div style = {{width: '48.5%', height: '10%', position: 'absolute', top: '60%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '0%'}}><span style={{color: 'rgb(187, 203, 185)'}}>Nazwa przedmiotu</span> <span style={{color: 'rgb(153, 41, 42)'}}>{subjectnamevalueerror}</span></div>
            <input onChange = {(event) => onSubjectnamechange(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '48.5%', height: '20%', position: 'absolute', top: '75%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '16px'}} value = {subjectnamevalue} onFocus={(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur={(event) => (event.target.style.border = '')}></input>
            <div style = {{width: '48.5%', height: '10%', position: 'absolute', top: '20%', left: '50.5%', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '0%'}}><span style={{color: 'rgb(187, 203, 185)'}}>Baner grupy</span></div>
            <div onClick = {onUploadbannerclick} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '48.5%', height: '60%', position: 'absolute', top: '35%', left: '50.5%', color: 'rgb(66, 243, 125)', fontSize: '28px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', borderRadius: '16px', cursor: 'pointer', overflow: 'hidden'}}>
            {bannerpreview ? (<img src = {bannerpreview} alt = "Banner Preview" style = {{width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }}/>) : ('Dodaj baner')}
            </div>
          </div>

          <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '23%', height: '10%', position: 'absolute', top: '87%', left: '76%', borderRadius: '16px'}}>
            <div onClick = {onSavegroupclick} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '42.5%', height: '75%', position: 'absolute', top: '12.5%', left: '52.5%', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Zapisz</div>
            <div onClick = {onRejectclick} style = {{backgroundColor: 'rgba(40, 40, 52)', width: '42.5%', height: '75%', position: 'absolute', top: '12.5%', left: '5%', borderRadius: '8px', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Odrzuc</div>
          </div>
          <div style = {{width: '96%', height: '5%', position: 'absolute', top: '60%', left: '2%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '0%'}}><span style={{color: 'rgb(187, 203, 185)'}}>Opis grupy</span> <span style={{color: 'rgb(153, 41, 42)'}}>{subjectnamevalueerror}</span></div>
          {errorMessage ? (
            <div style = {{width: '96%', height: '4%', position: 'absolute', top: '92%', left: '2%', color: 'rgb(255, 120, 120)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>{errorMessage}</div>
          ) : null}
        </div>
        <textarea onChange = {(event) => onGroupdescriptionchange(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '71.5%', height: '31%', position: 'absolute', top: '65%', left: '3%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', paddingTop: '0.5%', paddingLeft: '1%', borderRadius: '16px', resize: 'none'}} value = {groupdescriptionvalue} onFocus={(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur={(event) => (event.target.style.border = '')}></textarea>
      </div>
      <div onClick = {onRemovebannerclick} style = {{backgroundColor: 'rgba(26, 26, 42)', width: '10%', height: '7.5%', position: 'absolute', top: '90%', left: '87%', borderRadius: '8px', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Usun baner</div>
    </main>
  ) : null;
}


