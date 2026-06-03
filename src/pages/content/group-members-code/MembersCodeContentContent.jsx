import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getApiBaseUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../api-test/mock/browserIdStorage.js';
import MembersCodeContentWindow from './MembersCodeContentWindow.jsx';
import {useToast} from '../../../components/ui/index.js';

import editicon from '../../../../public/assets/icons/edit-02-svgrepo-com.svg';
import deleteicon from '../../../../public/assets/icons/trash-01-svgrepo-com.svg';

export default function MembersCodeContent() {

  const {groupId} = useParams();
  const {showSuccess, showError} = useToast();


  const [errorMessage, setErrorMessage] = useState('');
  const [codes, setCodes] = useState([]);
  const [windowopen, setWindowopen] = useState(0);
  const [editCodeId, setEditCodeId] = useState(0);




  function formatexpiresat(value) {
    if (value == null || value == '') {
      return 'Brak';
    }

    var date = new Date(value);

    return date.toLocaleString('pl-PL');
  }




  function formatmaxuses(maxUses, useCount) {
    if (maxUses == null) {
      return useCount + ' / ∞';
    }

    return useCount + ' / ' + maxUses;
  }




  async function onFetchCodes() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/enrollment-codes';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/enrollment-codes: ', response.status);
      console.log('GET /groups/' + groupId + '/enrollment-codes: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/enrollment-codes not JSON: ' + responsetext);
      }

      console.log('GET /groups/' + groupId + '/enrollment-codes JSON:', data);

      let receiveddata = data;

      const receivedcodes = [];

      let i = 0;

      while (i < receiveddata.length) {

        receivedcodes.push({id: receiveddata[i].id, code: receiveddata[i].code, expiresAt: receiveddata[i].expiresAt, maxUses: receiveddata[i].maxUses, useCount: receiveddata[i].useCount, isActive: receiveddata[i].isActive});

        i = i + 1;
      }

      setCodes(receivedcodes);

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




  async function onDeleteCode(codeId) {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/enrollment-codes/' + codeId;

      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('DELETE /groups/' + groupId + '/enrollment-codes/' + codeId + ': ', response.status);
      console.log('DELETE /groups/' + groupId + '/enrollment-codes/' + codeId + ': ', responsetext);

      if (response.status < 200 || response.status >= 300) {
        setErrorMessage('Nie udało się usunąć kodu (status ' + response.status + ')');
        return;
      }
      showSuccess('Kod został usunięty.');
      onFetchCodes();

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




  function opengeneratewindow() {
    setEditCodeId(0);
    setWindowopen(1);
  }




  function openeditwindow(codeId) {
    setEditCodeId(codeId);
    setWindowopen(1);
  }




  function closewindow() {
    setWindowopen(0);
    setEditCodeId(0);
  }




  function onsaved() {
    onFetchCodes();
  }




  useEffect(() => {
    onFetchCodes();
  }, []);




  var allcodes = [];

  let i = 0;

  while (i < codes.length) {

    allcodes.push(codes[i]);

    i = i + 1;
  }




  return (
    <div>
      <div style = {{width: '98%', height: '7%', position: 'absolute', top: '10vh', left: '1%', color: 'rgb(227, 224, 247)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>




        <div onClick = {opengeneratewindow} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '20%', height: '5vh', position: 'absolute', top: '18vh', left: '40%', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}><span>Generuj nowy kod</span></div>

        <div style = {{width: '98%', top: '25vh', position: 'absolute', left: '1%', display: 'flex', flexDirection: 'column', gap: '1vh', alignItems: 'center', paddingBottom: '2vh'}}>

          <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%', borderRadius: '16px'}}>
            <div style = {{width: '20%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style={{marginLeft: '10%'}}>Kod</span></div>
            <div style = {{width: '20%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style={{marginLeft: '1%'}}>Wygaśnięcie</span></div>
            <div style = {{width: '20%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span style={{marginLeft: '3%'}}>Użycia</span></div>
            <div style = {{width: '20%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span style={{marginLeft: '3%'}}>Aktywny</span></div>
            <div style = {{width: '20%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span style={{marginLeft: '17%'}}>Operacje</span></div>
          </div>

          {allcodes.map((code) => (

            <div key = {'code' + code.id} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%', borderRadius: '16px', borderLeft: code.isActive == true ? '4px solid rgb(66, 243, 125)' : '4px solid rgb(243, 66, 125)'}}>
              <div style = {{width: '20%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{code.code}</span></div>
              <div style = {{width: '20%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{formatexpiresat(code.expiresAt)}</span></div>
              <div style = {{width: '20%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center'}}><span>{formatmaxuses(code.maxUses, code.useCount)}</span></div>
              <div style = {{width: '20%', position: 'relative', color: code.isActive == true ? 'rgb(66, 243, 125)' : 'rgb(243, 66, 125)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', }}><span>{code.isActive == true ? 'Tak' : 'Nie'}</span></div>
              <div style = {{width: '20%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '5%'}}>
                <div onClick = {() => openeditwindow(code.id)} style = {{width: '25%', aspectRatio: '1 / 1', position: 'relative', left: '5%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                  <img src = {editicon} style = {{width: '25%', height: '25%'}}/>
                </div>
                <div onClick = {() => onDeleteCode(code.id)} style = {{width: '25%', aspectRatio: '1 / 1', position: 'relative', left: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                  <img src = {deleteicon} style = {{width: '25%', height: '25%'}}/>
                </div>
              </div>
            </div>

          ))}

        </div>

      </div>
      {windowopen == 1 ? (
        <MembersCodeContentWindow popupclose = {closewindow} groupId = {groupId} editCodeId = {editCodeId} onsaved = {onsaved} />
      ) : null}
    </div>
  )
}
