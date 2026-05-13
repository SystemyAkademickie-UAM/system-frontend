import { useCallback, useState, useEffect } from 'react';
import { getApiBaseUrl, getSamlLoginUrl } from './constants/api.constants.js';

export default function App() {

  const [errorMessage, setErrorMessage] = useState('');
  const [groupnamevalue, setGroupnamevalue] = useState('');
  const [subjectnamevalue, setSubjectnamevalue] = useState('');
  const [groupnamevalueerror, setGroupnamevalueerror] = useState('');
  const [subjectnamevalueerror, setSubjectnamevalueerror] = useState('');
  const [groupdescriptionvalue, setGroupdescriptionvalue] = useState('');
  const [isVisible, setIsvisible] = useState(true);
  
  const [bannerFile, setBannerfile] = useState(null);
  const [bannerPreview, setBannerpreview] = useState(null);

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
  async function onSavegroupclick() {

    try {

      let datatopost = {
        group: {
          name: groupnamevalue,
          description: groupdescriptionvalue
        }
      };

      console.log(datatopost);

      setErrorMessage('');

      const base = getApiBaseUrl();
      const url = base + '/groups/new';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datatopost)
      });

      const data = await response.json();

      console.log(data);
      if (groupnamevalue.length < 1 && groupnamevalueerror == 'musi zawierac minimum 1 znak.') {//
        setGroupnamevalueerror('A nie mowilem?');//
      }//
    } catch (error) {

      const message = error.message;
      setErrorMessage(message);

    }
  }
  function onRemovebannerclick() {
    setBannerfile(null);
    setBannerpreview(null);
  }



  return isVisible ? (
    <main>
      <div>
        <div style = {{backgroundColor: 'rgb(40, 40, 52)', width: '98%', height: '98%', position: 'absolute', top: '1%', left: '1%', borderBottom: '4px solid rgb(66, 243, 125)', borderRadius: '16px'}}>
          <div style = {{backgroundColor: 'rgb(255, 0, 255, 0.2)', width: '49%', height: '10%', position: 'absolute', top: '3%', left: '1%', fontSize: '300%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style={{color: 'rgb(227, 224, 247)'}}>Kreator</span> <span style={{color: 'rgb(66, 243, 125)'}}>Grupy</span></div>
          <div style = {{backgroundColor: 'rgb(255, 0, 255, 0.2)', width: '98%', height: '5%', position: 'absolute', top: '13%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>W celu utworzenia nowej grupy prosze wprowadzic nazwe i opis.</span></div>
          <div onClick = {onTemplatesgalleryclick} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '10%', height: '7.5%', position: 'absolute', top: '3%', left: '89%', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '125%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Gotowy wzor</div>
          <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '98%', height: '40%', position: 'absolute', top: '20%', left: '1%', borderRadius: '16px'}}>
            <div style = {{backgroundColor: 'rgb(255, 0, 255, 0.2)', width: '98%', height: '15%', position: 'absolute', top: '5%', left: '1%', color: 'rgb(66, 243, 125)', fontSize: '150%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '0%'}}><span>Grupa</span></div>
            <div style = {{backgroundColor: 'rgb(255, 0, 255, 0.2)', width: '48.5%', height: '10%', position: 'absolute', top: '20%', left: '1%', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '0%'}}><span style={{color: 'rgb(187, 203, 185)'}}>Nazwa grupy</span> <span style={{color: 'rgb(153, 41, 42)'}}>{groupnamevalueerror}</span></div>
            <input onChange = {(event) => onGroupnamechange(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '48.5%', height: '20%', position: 'absolute', top: '35%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '16px'}} value = {groupnamevalue}></input>
            <div style = {{backgroundColor: 'rgb(255, 0, 255, 0.2)', width: '48.5%', height: '10%', position: 'absolute', top: '60%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '0%'}}><span style={{color: 'rgb(187, 203, 185)'}}>Nazwa przedmiotu</span> <span style={{color: 'rgb(153, 41, 42)'}}>{subjectnamevalueerror}</span></div>
            <input onChange = {(event) => onSubjectnamechange(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '48.5%', height: '20%', position: 'absolute', top: '75%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '16px'}} value = {subjectnamevalue}></input>
            <div style = {{backgroundColor: 'rgb(255, 0, 255, 0.2)', width: '48.5%', height: '10%', position: 'absolute', top: '20%', left: '50.5%', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '0%'}}><span style={{color: 'rgb(187, 203, 185)'}}>Baner grupy</span></div>
            <div onClick = {onUploadbannerclick} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '48.5%', height: '60%', position: 'absolute', top: '35%', left: '50.5%', color: 'rgb(66, 243, 125)', fontSize: '150%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', borderRadius: '16px', cursor: 'pointer', overflow: 'hidden'}}>
            {bannerPreview ? (<img src = {bannerPreview} alt = "Banner Preview" style = {{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }}/>) : ('Dodaj baner')}
            </div>
          </div>

          <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '23%', height: '10%', position: 'absolute', top: '87%', left: '76%', borderRadius: '16px'}}>
            <div onClick = {onSavegroupclick} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '42.5%', height: '75%', position: 'absolute', top: '12.5%', left: '52.5%', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '125%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Zapisz</div>
            <div onClick = {onRejectclick} style = {{backgroundColor: 'rgba(40, 40, 52)', width: '42.5%', height: '75%', position: 'absolute', top: '12.5%', left: '5%', borderRadius: '8px', color: 'rgb(187, 203, 185)', fontSize: '125%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Odrzuc</div>
          </div>
          <div style = {{backgroundColor: 'rgb(255, 0, 255, 0.2)', width: '96%', height: '5%', position: 'absolute', top: '60%', left: '2%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '0%'}}><span style={{color: 'rgb(187, 203, 185)'}}>Opis grupy</span> <span style={{color: 'rgb(153, 41, 42)'}}>{subjectnamevalueerror}</span></div>
        </div>
        <textarea onChange = {(event) => onGroupdescriptionchange(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '71.5%', height: '31%', position: 'absolute', top: '65%', left: '3%', color: 'rgb(187, 203, 185)', fontSize: '150%', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', paddingTop: '0.5%', paddingLeft: '1%', borderRadius: '16px', resize: 'none'}} value = {groupdescriptionvalue}></textarea>
      </div>
      <div onClick = {onRemovebannerclick} style = {{backgroundColor: 'rgba(26, 26, 42)', width: '10%', height: '7.5%', position: 'absolute', top: '65%', left: '87%', borderRadius: '8px', color: 'rgb(187, 203, 185)', fontSize: '125%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Usun baner</div>
    </main>
  ) : null;
}


