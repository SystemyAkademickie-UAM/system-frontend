import {useState, useEffect} from 'react';
import {getApiBaseUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../../../auth/browserIdStorage.js';
import { PUBLIC_UI_ICONS } from '../../../constants/publicUiIcons.js';

const closeicon = PUBLIC_UI_ICONS.close;
const decreaseicon = PUBLIC_UI_ICONS.decrease;
const increaseicon = PUBLIC_UI_ICONS.increase;

export default function GroupSettingsHealthContentWindow({popupclose, groupId, liveslabel, livesicon, livesstart}) {

  const [errorMessage, setErrorMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [sortfield, setSortfield] = useState('nr');
  const [sortreverse, setSortreverse] = useState(0);
  const [nrtext, setNrtext] = useState('Nr ▼');
  const [nametext, setNametext] = useState('Imię i Nazwisko');
  const [nicknametext, setNicknametext] = useState('Nickname');



  async function onFetchStudents() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/students';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/students: ', response.status);
      console.log('GET /groups/' + groupId + '/students: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/students not JSON: ' + responsetext);
      }

      console.log('GET /groups/' + groupId + '/students JSON:', data);

      let receiveddata = data;

      const receivedstudents = [];

      let i = 0;

      while (i < receiveddata.length) {

        receivedstudents.push({accountId: receiveddata[i].accountId, name: receiveddata[i].name, surname: receiveddata[i].surname, nickname: receiveddata[i].nickname, lives: receiveddata[i].lives ?? 0, difference: 0});

        i = i + 1;
      }

      setStudents(receivedstudents);

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






  async function decreasehealth(accountId) {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/students/' + accountId + '/lives/decrement';

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify({})
      });

      const responsetext = await response.text();

      console.log('POST /groups/' + groupId + '/students/' + accountId + '/lives/decrement: ', response.status);
      console.log('POST /groups/' + groupId + '/students/' + accountId + '/lives/decrement: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/students/' + accountId + '/lives/decrement not JSON: ' + responsetext);
      }

      console.log('POST decrement JSON:', data);

      var livesvalue = data.lives;

      setStudents(function (prevStudents) {

        const newstudents = [];

        let i = 0;

        while (i < prevStudents.length) {

          if (prevStudents[i].accountId == accountId) {

            newstudents.push({accountId: prevStudents[i].accountId, name: prevStudents[i].name, surname: prevStudents[i].surname, nickname: prevStudents[i].nickname, lives: livesvalue, difference: prevStudents[i].difference - 1});

          } else {

            newstudents.push(prevStudents[i]);
          }

          i = i + 1;
        }

        return newstudents;
      });

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





  async function increasehealth(accountId) {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/students/' + accountId + '/lives/increment';

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify({})
      });

      const responsetext = await response.text();

      console.log('POST /groups/' + groupId + '/students/' + accountId + '/lives/increment: ', response.status);
      console.log('POST /groups/' + groupId + '/students/' + accountId + '/lives/increment: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/students/' + accountId + '/lives/increment not JSON: ' + responsetext);
      }

      console.log('POST increment JSON:', data);

      var livesvalue = data.lives;

      setStudents(function (prevStudents) {

        const newstudents = [];

        let i = 0;

        while (i < prevStudents.length) {

          if (prevStudents[i].accountId == accountId) {

            newstudents.push({accountId: prevStudents[i].accountId, name: prevStudents[i].name, surname: prevStudents[i].surname, nickname: prevStudents[i].nickname, lives: livesvalue, difference: prevStudents[i].difference + 1});

          } else {

            newstudents.push(prevStudents[i]);
          }

          i = i + 1;
        }

        return newstudents;
      });

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


  function hidelivespopup() {
    if (popupclose) {
      popupclose();
    }
  }


  function sortby(field) {

    if (sortfield == field) {

      if (sortreverse == 0) {
        setSortreverse(1);
      } else {
        setSortreverse(0);
      }

    } else {

      setSortfield(field);
      setSortreverse(0);
    }

  }



  useEffect(() => {
    onFetchStudents();
  }, []);

  useEffect(() => {
    if (sortfield == 'nr' && sortreverse == 0) {
      setNrtext('Nr ▼');
      setNametext('Imię i Nazwisko');
      setNicknametext('Nickname');
    } else if (sortfield == 'nr' && sortreverse == 1) {
      setNrtext('Nr ▲');
      setNametext('Imię i Nazwisko');
      setNicknametext('Nickname');
    } else if (sortfield == 'name' && sortreverse == 0) {
      setNrtext('Nr');
      setNametext('Imię i Nazwisko ▼');
      setNicknametext('Nickname');
    } else if (sortfield == 'name' && sortreverse == 1) {
      setNrtext('Nr');
      setNametext('Imię i Nazwisko ▲');
      setNicknametext('Nickname');
    } else if (sortfield == 'nickname' && sortreverse == 0) {
      setNrtext('Nr');
      setNametext('Imię i Nazwisko');
      setNicknametext('Nickname ▼');
    } else if (sortfield == 'nickname' && sortreverse == 1) {
      setNrtext('Nr');
      setNametext('Imię i Nazwisko');
      setNicknametext('Nickname ▲');
    }
  }, [sortfield, sortreverse]);



  var displaystudents = [];

  let i = 0;

  while (i < students.length) {

    displaystudents.push(students[i]);

    i = i + 1;
  }

  var swapped = 1;

  while (swapped == 1) {

    swapped = 0;

    i = 0;

    while (i < displaystudents.length - 1) {

      var shouldswap = 0;

      if (sortfield == 'nr') {

        if (sortreverse == 0 && displaystudents[i].accountId > displaystudents[i + 1].accountId) {
          shouldswap = 1;
        }

        if (sortreverse == 1 && displaystudents[i].accountId < displaystudents[i + 1].accountId) {
          shouldswap = 1;
        }

      } else if (sortfield == 'name') {

        var fullnamea = displaystudents[i].name + displaystudents[i].surname;
        var fullnameb = displaystudents[i + 1].name + displaystudents[i + 1].surname;

        if (sortreverse == 0 && fullnamea > fullnameb) {
          shouldswap = 1;
        }

        if (sortreverse == 1 && fullnamea < fullnameb) {
          shouldswap = 1;
        }

      } else if (sortfield == 'nickname') {

        if (sortreverse == 0 && displaystudents[i].nickname > displaystudents[i + 1].nickname) {
          shouldswap = 1;
        }

        if (sortreverse == 1 && displaystudents[i].nickname < displaystudents[i + 1].nickname) {
          shouldswap = 1;
        }

      }

      if (shouldswap == 1) {

        var temp = displaystudents[i];
        displaystudents[i] = displaystudents[i + 1];
        displaystudents[i + 1] = temp;
        swapped = 1;
      }

      i = i + 1;
    }

  }



  var titletext = liveslabel;

  if (titletext == null || titletext == '') {
    titletext = 'Życia';
  }



  return (
    <div onClick = {hidelivespopup} style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div onClick = {(event) => event.stopPropagation()} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '80%', height: '80%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <div onClick = {hidelivespopup} style = {{width: '5%', aspectRatio: '1 / 1', position: 'absolute', top: '2%', left: '94%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', zIndex: 1}}>
          <img src = {closeicon} style = {{width: '60%', height: '60%'}}/>
        </div>
        <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '3%', gap: '0.5vh'}}>
          <div style = {{width: '100%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1%'}}><span>{livesicon}</span><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{titletext}</span></div>
          <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>Panel pozwalający zwiększać i zmniejszać {liveslabel} uczestników.</span></div>
        </div>

        <div style = {{width: '96%', position: 'relative', left: '2%', display: 'flex', flexDirection: 'column', gap: '0.5vh', overflowY: 'auto', flex: 1, paddingBottom: '2%', paddingTop: '1%'}}>

          <div style = {{backgroundColor: 'rgb(41, 40, 57)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%', borderRadius: '16px'}}>
            <div onClick = {() => sortby('nr')} style = {{width: '10%', position: 'relative', color: sortfield == 'nr' ? 'rgb(30, 204, 56)' : 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer'}}><span>{nrtext}</span></div>
            <div onClick = {() => sortby('name')} style = {{width: '35%', position: 'relative', color: sortfield == 'name' ? 'rgb(30, 204, 56)' : 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer'}}><span>{nametext}</span></div>
            <div onClick = {() => sortby('nickname')} style = {{width: '35%', position: 'relative', color: sortfield == 'nickname' ? 'rgb(30, 204, 56)' : 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer'}}><span>{nicknametext}</span></div>
            <div style = {{width: '20%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>Operacje*</span></div>
          </div>



          {displaystudents.map((student) => (

            <div key = {'student' + student.accountId} style = {{backgroundColor: 'rgb(41, 40, 57)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%', borderRadius: '16px'}}>
              <div style = {{width: '10%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span>{student.accountId}</span></div>
              <div style = {{width: '35%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{student.name} {student.surname}</span></div>
              <div style = {{width: '35%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{student.nickname}</span></div>
              <div style = {{width: '20%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '0.5vh'}}>
                <div onClick = {() => decreasehealth(student.accountId)} style = {{backgroundColor: 'rgba(204, 30, 56, 0.5)', height: '5vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                  <img src = {decreaseicon} style = {{width: '55%', height: '55%'}}/>
                </div>
                <div style = {{backgroundColor: 'rgb(40, 40, 52)', height: '5vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'}}>
                  <div style = {{color: 'rgb(227, 224, 247)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span>{student.lives}</span></div>
                </div>
                <div onClick = {() => increasehealth(student.accountId)} style = {{backgroundColor: 'rgba(30, 204, 56, 0.5)', height: '5vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                  <img src = {increaseicon} style = {{width: '55%', height: '55%'}}/>
                </div>
                <div style = {{backgroundColor: 'rgb(40, 40, 52)', height: '5vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'}}>
                  {student.difference > 0 ? (
                    <div style = {{color: 'rgb(30, 204, 56)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span>{'+' + student.difference}</span></div>
                  ) : student.difference < 0 ? (
                    <div style = {{color: 'rgb(204, 30, 56)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span>{String(student.difference)}</span></div>
                  ) : null}
                </div>
              </div>
            </div>


          ))}


        </div>



      </div>
    </div>
  )
}
