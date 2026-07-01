import {useState, useEffect} from 'react';
import {getApiBaseUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../../../auth/browserIdStorage.js';
import {useToast} from '../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

import { PUBLIC_UI_ICONS } from '../../../constants/publicUiIcons.js';

const closeicon = PUBLIC_UI_ICONS.close;
const unlockedicon = PUBLIC_UI_ICONS.unlocked;
const lockedicon = PUBLIC_UI_ICONS.locked;

export default function GroupMainActivitiesWindow({popupclose, groupId, stagename, activityname, activityid}) {

  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [errorMessage, setErrorMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [sortfield, setSortfield] = useState('nr');
  const [sortreverse, setSortreverse] = useState(0);
  const [nrtext, setNrtext] = useState('Nr ▼');
  const [nametext, setNametext] = useState('Imię i Nazwisko');
  const [nicknametext, setNicknametext] = useState('Nickname');

  const {showSuccess, showError} = useToast();

  const NR__TEXTLABEL = {
    polish: 'Nr',
    english: 'No.',
  };

  const STUDENTNAME__TEXTLABEL = {
    polish: 'Imię i Nazwisko',
    english: 'Name',
  };

  const NICKNAME__TEXTLABEL = {
    polish: 'Nickname',
    english: 'Nickname',
  };

  const OPERATIONS__TEXTLABEL = {
    polish: 'Operacje',
    english: 'Operations',
  };

  const ASSIGNACTIVITY__TEXTLABEL = {
    polish: 'Przypisano aktywność.',
    english: 'Activity assigned.',
  };

  const REMOVEACTIVITY__TEXTLABEL = {
    polish: 'Usunięto aktywność.',
    english: 'Activity removed.',
  };


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

        receivedstudents.push({accountId: receiveddata[i].accountId, name: receiveddata[i].name, surname: receiveddata[i].surname, nickname: receiveddata[i].nickname, unlocked: 0});

        i = i + 1;
      }

      setStudents(receivedstudents);

      i = 0;

      while (i < receivedstudents.length) {

        onFetchStudentProgress(receivedstudents[i].accountId);

        i = i + 1;
      }

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





  async function onFetchStudentProgress(accountId) {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/students/' + accountId + '/progress';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/students/' + accountId + '/progress: ', response.status);
      console.log('GET /groups/' + groupId + '/students/' + accountId + '/progress: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/students/' + accountId + '/progress not JSON: ' + responsetext);
      }

      console.log('GET /groups/' + groupId + '/students/' + accountId + '/progress JSON:', data);

      let receiveddata = data;

      var unlocked = 0;

      let i = 0;
      while (i < receiveddata.stages.length) {
        let j = 0;
        while (j < receiveddata.stages[i].activities.length) {
          if (receiveddata.stages[i].activities[j].id == activityid) {
            if (receiveddata.stages[i].activities[j].isCompleted == true) {
              unlocked = 1;
            }

          }

          j = j + 1;
        }

        i = i + 1;
      }

      setStudents(function (prevStudents) {

        const newstudents = [];

        i = 0;

        while (i < prevStudents.length) {

          if (prevStudents[i].accountId == accountId) {

            newstudents.push({accountId: prevStudents[i].accountId, name: prevStudents[i].name, surname: prevStudents[i].surname, nickname: prevStudents[i].nickname, unlocked: unlocked});

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





  async function onToggleActivity(accountId) {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/students/' + accountId + '/activities/' + activityid + '/toggle';

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

      console.log('POST /groups/' + groupId + '/students/' + accountId + '/activities/' + activityid + '/toggle: ', response.status);
      console.log('POST /groups/' + groupId + '/students/' + accountId + '/activities/' + activityid + '/toggle: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/students/' + accountId + '/activities/' + activityid + '/toggle not JSON: ' + responsetext);
      }

      console.log('POST toggle JSON:', data);

      let receiveddata = data;

      var newunlocked = 0;

      if (receiveddata.isCompleted == true) {
        showSuccess(ASSIGNACTIVITY__TEXTLABEL[LANGUAGE]);
        newunlocked = 1;
      } else {
        showSuccess(REMOVEACTIVITY__TEXTLABEL[LANGUAGE]);
      }

      setStudents(function (prevStudents) {

        const newstudents = [];

        let i = 0;

        while (i < prevStudents.length) {

          if (prevStudents[i].accountId == accountId) {

            newstudents.push({accountId: prevStudents[i].accountId, name: prevStudents[i].name, surname: prevStudents[i].surname, nickname: prevStudents[i].nickname, unlocked: newunlocked});

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





  function closewindow() {
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
    onFetchStudents();
    if (sortfield == 'nr' && sortreverse == 0) {
      setNrtext(NR__TEXTLABEL[LANGUAGE] + ' ▼');
      setNametext(STUDENTNAME__TEXTLABEL[LANGUAGE]);
      setNicknametext(NICKNAME__TEXTLABEL[LANGUAGE]);
    } else if (sortfield == 'nr' && sortreverse == 1) {
      setNrtext(NR__TEXTLABEL[LANGUAGE] + ' ▲');
      setNametext(STUDENTNAME__TEXTLABEL[LANGUAGE]);
      setNicknametext(NICKNAME__TEXTLABEL[LANGUAGE]);
    } else if (sortfield == 'name' && sortreverse == 0) {
      setNrtext(NR__TEXTLABEL[LANGUAGE]);
      setNametext(STUDENTNAME__TEXTLABEL[LANGUAGE] + ' ▼');
      setNicknametext(NICKNAME__TEXTLABEL[LANGUAGE]);
    } else if (sortfield == 'name' && sortreverse == 1) {
      setNrtext(NR__TEXTLABEL[LANGUAGE]);
      setNametext(STUDENTNAME__TEXTLABEL[LANGUAGE] + ' ▲');
      setNicknametext(NICKNAME__TEXTLABEL[LANGUAGE]);
    } else if (sortfield == 'nickname' && sortreverse == 0) {
      setNrtext(NR__TEXTLABEL[LANGUAGE]);
      setNametext(STUDENTNAME__TEXTLABEL[LANGUAGE]);
      setNicknametext(NICKNAME__TEXTLABEL[LANGUAGE] + ' ▼');
    } else if (sortfield == 'nickname' && sortreverse == 1) {
      setNrtext(NR__TEXTLABEL[LANGUAGE]);
      setNametext(STUDENTNAME__TEXTLABEL[LANGUAGE]);
      setNicknametext(NICKNAME__TEXTLABEL[LANGUAGE] + ' ▲');
    }
  }, [sortfield, sortreverse, LANGUAGE]);



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





  return (
    <div onClick = {closewindow} style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)', zIndex: 9, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div onClick = {(event) => event.stopPropagation()} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '80%', height: '80%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <div onClick = {closewindow} style = {{width: '5%', aspectRatio: '1 / 1', position: 'absolute', top: '2%', left: '94%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', zIndex: 1}}>
          <img src = {closeicon} style = {{width: '60%', height: '60%'}}/>
        </div>
        <div style = {{width: '100%', height: '10%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '2%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{stagename}</span></div>
        <div style = {{width: '100%', height: '8%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{activityname}</span></div>

        <div style = {{width: '96%', position: 'relative', left: '2%', display: 'flex', flexDirection: 'column', gap: '0.5vh', overflowY: 'auto', flex: 1, paddingBottom: '2%'}}>

          <div style = {{backgroundColor: 'rgb(41, 40, 57)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%', borderRadius: '16px'}}>
            <div onClick = {() => sortby('nr')} style = {{width: '10%', position: 'relative', color: sortfield == 'nr' ? 'rgb(66, 243, 125)' : 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer'}}><span>{nrtext}</span></div>
            <div onClick = {() => sortby('name')} style = {{width: '35%', position: 'relative', color: sortfield == 'name' ? 'rgb(66, 243, 125)' : 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer'}}><span>{nametext}</span></div>
            <div onClick = {() => sortby('nickname')} style = {{width: '30%', position: 'relative', color: sortfield == 'nickname' ? 'rgb(66, 243, 125)' : 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer'}}><span>{nicknametext}</span></div>
            <div style = {{width: '25%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>{OPERATIONS__TEXTLABEL[LANGUAGE]}</span></div>
          </div>



          {displaystudents.map((student) => (

            <div key = {'student' + student.accountId} style = {{backgroundColor: 'rgb(41, 40, 57)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%', borderRadius: '16px'}}>
              <div style = {{width: '10%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span>{student.accountId}</span></div>
              <div style = {{width: '35%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{student.name} {student.surname}</span></div>
              <div style = {{width: '30%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{student.nickname}</span></div>
              <div style = {{width: '25%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div onClick = {() => onToggleActivity(student.accountId)} style = {{backgroundColor: student.unlocked == 1 ? 'rgba(66, 243, 125, 0.5)' : 'rgba(243, 66, 125, 0.5)', height: '5vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                  <img src = {student.unlocked == 1 ? unlockedicon : lockedicon} style = {{width: '50%', height: '50%'}}/>
                </div>
              </div>
            </div>

          ))}


        </div>


      </div>
    </div>
  )
}


