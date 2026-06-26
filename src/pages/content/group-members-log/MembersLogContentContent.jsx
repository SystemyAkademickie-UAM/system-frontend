import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getApiBaseUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../api-test/mock/browserIdStorage.js';

import arrowrighticon from '../../../../public/assets/icons/chevron-right-svgrepo-com.svg';
import arrowlefticon from '../../../../public/assets/icons/chevron-left-svgrepo-com.svg';
import firstpageicon from '../../../../public/assets/icons/chevron-left-double-svgrepo-com.svg';
import lastpageicon from '../../../../public/assets/icons/chevron-right-double-svgrepo-com.svg';

export default function App() {

  const {groupId} = useParams();
  const [errorMessage, setErrorMessage] = useState('');

  const [logitems, setLogitems] = useState([]);
  const [studentnames, setStudentnames] = useState({});
  const [studentnicknames, setStudentnicknames] = useState({});
  const [currentpage, setCurrentpage] = useState(0);
  const [hasnextpage, setHasnextpage] = useState(0);
  const [pagesize] = useState(10);



  function formatrelativetime(datestring) {

    var now = new Date();
    var eventdate = new Date(datestring);

    if (isNaN(eventdate.getTime())) {
      return datestring;
    }

    var differencemiliseconds = now.getTime() - eventdate.getTime();
    var differenceseconds = Math.floor(differencemiliseconds / 1000);

    if (differenceseconds < 0) {
      return datestring;
    }

    var differenceminutes = Math.floor(differenceseconds / 60);
    var differencehours = Math.floor(differenceseconds / 3600);
    var differencedays = Math.floor(differenceseconds / 86400);
    var differenceweeks = Math.floor(differencedays / 7);
    var differencemonths = Math.floor(differencedays / 30);
    var differenceyears = Math.floor(differencedays / 365);

    if (differenceyears > 10) {
      return datestring;
    } else if (differenceyears == 10) {
      return '10 lat temu';
    } else if (differenceyears == 9) {
      return '9 lat temu';
    } else if (differenceyears == 8) {
      return '8 lat temu';
    } else if (differenceyears == 7) {
      return '7 lat temu';
    } else if (differenceyears == 6) {
      return '6 lat temu';
    } else if (differenceyears == 5) {
      return '5 lat temu';
    } else if (differenceyears == 4) {
      return '4 lata temu';
    } else if (differenceyears == 3) {
      return '3 lata temu';
    } else if (differenceyears == 2) {
      return '2 lata temu';
    } else if (differenceyears == 1) {
      return 'rok temu';
    } else if (differencemonths == 12) {
      return '12 miesięcy temu';
    } else if (differencemonths == 11) {
      return '11 miesięcy temu';
    } else if (differencemonths == 10) {
      return '10 miesięcy temu';
    } else if (differencemonths == 9) {
      return '9 miesięcy temu';
    } else if (differencemonths == 8) {
      return '8 miesięcy temu';
    } else if (differencemonths == 7) {
      return '7 miesięcy temu';
    } else if (differencemonths == 6) {
      return '6 miesięcy temu';
    } else if (differencemonths == 5) {
      return '5 miesięcy temu';
    } else if (differencemonths == 4) {
      return '4 miesiące temu';
    } else if (differencemonths == 3) {
      return '3 miesiące temu';
    } else if (differencemonths == 2) {
      return '2 miesiące temu';
    } else if (differencemonths == 1) {
      return 'miesiąc temu';
    } else if (differenceweeks == 4) {
      return '4 tygodnie temu';
    } else if (differenceweeks == 3) {
      return '3 tygodnie temu';
    } else if (differenceweeks == 2) {
      return '2 tygodnie temu';
    } else if (differenceweeks == 1) {
      return 'tydzień temu';
    } else if (differencedays == 6) {
      return '6 dni temu';
    } else if (differencedays == 5) {
      return '5 dni temu';
    } else if (differencedays == 4) {
      return '4 dni temu';
    } else if (differencedays == 3) {
      return '3 dni temu';
    } else if (differencedays == 2) {
      return '2 dni temu';
    } else if (differencedays == 1) {
      return 'dzień temu';
    } else if (differencehours == 23) {
      return '23 godziny temu';
    } else if (differencehours == 22) {
      return '22 godziny temu';
    } else if (differencehours == 21) {
      return '21 godzin temu';
    } else if (differencehours == 20) {
      return '20 godzin temu';
    } else if (differencehours == 19) {
      return '19 godzin temu';
    } else if (differencehours == 18) {
      return '18 godzin temu';
    } else if (differencehours == 17) {
      return '17 godzin temu';
    } else if (differencehours == 16) {
      return '16 godzin temu';
    } else if (differencehours == 15) {
      return '15 godzin temu';
    } else if (differencehours == 14) {
      return '14 godzin temu';
    } else if (differencehours == 13) {
      return '13 godzin temu';
    } else if (differencehours == 12) {
      return '12 godzin temu';
    } else if (differencehours == 11) {
      return '11 godzin temu';
    } else if (differencehours == 10) {
      return '10 godzin temu';
    } else if (differencehours == 9) {
      return '9 godzin temu';
    } else if (differencehours == 8) {
      return '8 godzin temu';
    } else if (differencehours == 7) {
      return '7 godzin temu';
    } else if (differencehours == 6) {
      return '6 godzin temu';
    } else if (differencehours == 5) {
      return '5 godzin temu';
    } else if (differencehours == 4) {
      return '4 godziny temu';
    } else if (differencehours == 3) {
      return '3 godziny temu';
    } else if (differencehours == 2) {
      return '2 godziny temu';
    } else if (differencehours == 1) {
      return '1 godzinę temu';
    } else if (differenceminutes == 59) {
      return '59 minut temu';
    } else if (differenceminutes == 58) {
      return '58 minut temu';
    } else if (differenceminutes == 57) {
      return '57 minut temu';
    } else if (differenceminutes == 56) {
      return '56 minut temu';
    } else if (differenceminutes == 55) {
      return '55 minut temu';
    } else if (differenceminutes == 54) {
      return '54 minuty temu';
    } else if (differenceminutes == 53) {
      return '53 minuty temu';
    } else if (differenceminutes == 52) {
      return '52 minuty temu';
    } else if (differenceminutes == 51) {
      return '51 minut temu';
    } else if (differenceminutes == 50) {
      return '50 minut temu';
    } else if (differenceminutes == 49) {
      return '49 minut temu';
    } else if (differenceminutes == 48) {
      return '48 minut temu';
    } else if (differenceminutes == 47) {
      return '47 minut temu';
    } else if (differenceminutes == 46) {
      return '46 minut temu';
    } else if (differenceminutes == 45) {
      return '45 minut temu';
    } else if (differenceminutes == 44) {
      return '44 minuty temu';
    } else if (differenceminutes == 43) {
      return '43 minuty temu';
    } else if (differenceminutes == 42) {
      return '42 minuty temu';
    } else if (differenceminutes == 41) {
      return '41 minut temu';
    } else if (differenceminutes == 40) {
      return '40 minut temu';
    } else if (differenceminutes == 39) {
      return '39 minut temu';
    } else if (differenceminutes == 38) {
      return '38 minut temu';
    } else if (differenceminutes == 37) {
      return '37 minut temu';
    } else if (differenceminutes == 36) {
      return '36 minut temu';
    } else if (differenceminutes == 35) {
      return '35 minut temu';
    } else if (differenceminutes == 34) {
      return '34 minuty temu';
    } else if (differenceminutes == 33) {
      return '33 minuty temu';
    } else if (differenceminutes == 32) {
      return '32 minuty temu';
    } else if (differenceminutes == 31) {
      return '31 minut temu';
    } else if (differenceminutes == 30) {
      return '30 minut temu';
    } else if (differenceminutes == 29) {
      return '29 minut temu';
    } else if (differenceminutes == 28) {
      return '28 minut temu';
    } else if (differenceminutes == 27) {
      return '27 minut temu';
    } else if (differenceminutes == 26) {
      return '26 minut temu';
    } else if (differenceminutes == 25) {
      return '25 minut temu';
    } else if (differenceminutes == 24) {
      return '24 minuty temu';
    } else if (differenceminutes == 23) {
      return '23 minuty temu';
    } else if (differenceminutes == 22) {
      return '22 minuty temu';
    } else if (differenceminutes == 21) {
      return '21 minut temu';
    } else if (differenceminutes == 20) {
      return '20 minut temu';
    } else if (differenceminutes == 19) {
      return '19 minut temu';
    } else if (differenceminutes == 18) {
      return '18 minut temu';
    } else if (differenceminutes == 17) {
      return '17 minut temu';
    } else if (differenceminutes == 16) {
      return '16 minut temu';
    } else if (differenceminutes == 15) {
      return '15 minut temu';
    } else if (differenceminutes == 14) {
      return '14 minut temu';
    } else if (differenceminutes == 13) {
      return '13 minut temu';
    } else if (differenceminutes == 12) {
      return '12 minut temu';
    } else if (differenceminutes == 11) {
      return '11 minut temu';
    } else if (differenceminutes == 10) {
      return '10 minut temu';
    } else if (differenceminutes == 9) {
      return '9 minut temu';
    } else if (differenceminutes == 8) {
      return '8 minut temu';
    } else if (differenceminutes == 7) {
      return '7 minut temu';
    } else if (differenceminutes == 6) {
      return '6 minut temu';
    } else if (differenceminutes == 5) {
      return '5 minut temu';
    } else if (differenceminutes == 4) {
      return '4 minuty temu';
    } else if (differenceminutes == 3) {
      return '3 minuty temu';
    } else if (differenceminutes == 2) {
      return '2 minuty temu';
    } else if (differenceminutes == 1) {
      return 'minutę temu';
    } else {
      return 'przed chwilą';
    }

  }





  function gettypelabel(typevalue) {

    if (typevalue == 'SHOP_PURCHASE') {
      return 'Zakupiono przedmiot';
    } else if (typevalue == 'STAGE_COMPLETED') {
      return 'Ukończono etap';
    } else if (typevalue == 'ITEM_USED') {
      return 'Użyto przedmiot';
    } else if (typevalue == 'RANK_UP') {
      return 'Awans';
    } else if (typevalue == 'BADGE_EARNED') {
      return 'Zdobyto odznakę';
    } else if (typevalue == 'CURRENCY_ADDED') {
      return 'Zdobyto walutę';
    } else if (typevalue == 'LIVES_CHANGED') {
      return 'Zmiana szans';
    } else if (typevalue == 'OTHER') {
      return 'Inne';
    } else {
      return typevalue;
    }

  }





  function gettypecolour(typevalue) {

    if (typevalue == 'SHOP_PURCHASE') {
      return 'rgb(0, 128, 0)';
    } else if (typevalue == 'STAGE_COMPLETED') {
      return 'rgb(0, 128, 64)';
    } else if (typevalue == 'ITEM_USED') {
      return 'rgb(0, 0, 128)';
    } else if (typevalue == 'RANK_UP') {
      return 'rgb(128, 128, 0)';
    } else if (typevalue == 'BADGE_EARNED') {
      return 'rgb(128, 0, 128)';
    } else if (typevalue == 'CURRENCY_ADDED') {
      return 'rgb(0, 128, 128)';
    } else if (typevalue == 'LIVES_CHANGED') {
      return 'rgb(0, 64, 128)';
    } else {
      return 'rgb(0, 64, 64)';
    }

  }





  function getstudentlabel(accountId) {

    if (studentnames[accountId] != null) {
      return studentnames[accountId];
    } else {
      return 'Uczestnik #' + accountId;
    }

  }





  function buildlogentry(item) {
  let read;
  if (item.isRead != null && item.isRead != undefined) {
    read = item.isRead;
  } else {
    read = false;
  }

    var entry = {
      id: item.id,
      type: item.type,
      date: item.date,
      value: item.value,
      accountId: item.accountId,
      isRead: read,
      timetext: formatrelativetime(item.date),
      typelabel: gettypelabel(item.type),
      typecolour: gettypecolour(item.type),
      studentlabel: getstudentlabel(item.accountId),
      studentnickname: getstudentnickname(item.accountId),
      title: '',
      description: ''
    };

    if (item.value != null && item.value != '') {
      entry.title = item.value;
      entry.description = entry.typelabel + ' • ' + entry.studentlabel;
    } else {
      entry.title = entry.typelabel;
      entry.description = entry.studentlabel;
    }

    return entry;

  }





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

      if (data == null) {
        data = [];
      }

      var newnames = {};
      var newnicknames = {};

      let i = 0;

      while (i < data.length) {

        newnames[data[i].accountId] = data[i].name + ' ' + data[i].surname;
        newnicknames[data[i].accountId] = data[i].nickname;

        i = i + 1;
      }

      setStudentnames(newnames);
      setStudentnicknames(newnicknames);

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


  function getstudentnickname(accountId) {

    if (studentnicknames[accountId] != null) {
      return studentnicknames[accountId];
    } else {
      return 'ID: ' + accountId;
    }

  }


  async function onFetchBacklog() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      var skipvalue = currentpage * pagesize;

      const url = base + '/groups/' + groupId + '/backlog?take=' + pagesize + '&skip=' + skipvalue;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/backlog: ', response.status);
      console.log('GET /groups/' + groupId + '/backlog: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/backlog not JSON: ' + responsetext);
      }

      console.log('GET /groups/' + groupId + '/backlog JSON:', data);

      if (data == null) {
        data = [];
      }

      const receiveditems = [];

      let i = 0;

      while (i < data.length) {

        receiveditems.push(buildlogentry(data[i]));

        i = i + 1;
      }

      setLogitems(receiveditems);

      if (data.length >= pagesize) {
        setHasnextpage(1);
      } else {
        setHasnextpage(0);
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





  async function markasread(logid) {

    console.log(logid);

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/backlog/' + logid + '/read';

      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify({})
      });

      const responsetext = await response.text();

      console.log('PATCH /groups/' + groupId + '/backlog/' + logid + '/read*: ', response.status);
      console.log('PATCH /groups/' + groupId + '/backlog/' + logid + '/read*: ', responsetext);

    } catch (error) {

      let message;

      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }

      setErrorMessage(message);
    }
    await onFetchBacklog();


  }





  function firstpage() {
    if (currentpage > 0) {
      setCurrentpage(0);
    }
  }





  function previouspage() {
    if (currentpage > 0) {
      setCurrentpage(currentpage - 1);
    }
  }





  function nextpage() {
    if (hasnextpage == 1) {
      setCurrentpage(currentpage + 1);
    }
  }





  function lastpage() {
    if (hasnextpage == 1) {
      setCurrentpage(currentpage + 1);
    }
  }





  useEffect(() => {
    onFetchStudents();
  }, []);

  useEffect(() => {
    onFetchBacklog();
  }, [currentpage]);



  var atfirstpage = 1;
  var atlastpage = 1;
  var currentpagenumber = currentpage + 1;

  if (currentpage > 0) {
    atfirstpage = 0;
  }

  if (hasnextpage == 1) {
    atlastpage = 0;
  }



  return (
    <div>
      <div>
        <div style = {{width: '75vw', height: '100%', position: 'relative', top: '0%', left: '0%'}}>

          <div style = {{width: '98%', position: 'relative', top: '0%', left: '1%', display: 'flex', flexDirection: 'column', gap: '2vh', paddingBottom: '4vh'}}>


            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5vh'}}>

              {logitems.length == 0 ? (
                <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', borderRadius: '16px', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '3vh', paddingBottom: '3vh', paddingLeft: '2%', paddingRight: '2%'}}><span>Brak wpisów w dzienniku.</span></div>
              ) : null}

              {logitems.map((logitem) => (

                !logitem.isRead ? (

                  <div key = {'logunread' + logitem.id} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', borderLeft: '6px solid rgb(26, 26, 42)', borderRadius: '16px', paddingLeft: '2%', paddingRight: '2%', paddingTop: '1.5vh', paddingBottom: '1.5vh', gap: '2%'}}>

                    <div style = {{width: '50%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                      <div style = {{color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden'}}>{logitem.title}</span></div>
                      <div style = {{color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden'}}>{getstudentlabel(logitem.accountId)}</span></div>
                    </div>
                    <div style = {{width: '15%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '12px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>{getstudentnickname(logitem.accountId)}</span></div>
                    <div style = {{width: '15%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '12px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>{logitem.typelabel}</span></div>

                    <div style = {{width: '15%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 100, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>• {logitem.timetext}</span></div>
                    <div onClick = {() => markasread(logitem.id)} style = {{backgroundColor: 'rgba(30, 204, 56)', width: '12%', position: 'relative', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh', flexShrink: 0}}>Przeczytaj</div>
                  </div>

                ) : (

                  <div key = {'logread' + logitem.id} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', borderLeft: '6px solid ' + logitem.typecolour, borderRadius: '16px', paddingLeft: '2%', paddingRight: '2%', paddingTop: '1.5vh', paddingBottom: '1.5vh', gap: '2%'}}>

                    <div style = {{width: '50%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                      <div style = {{color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden'}}>{logitem.title}</span></div>
                      <div style = {{color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden'}}>{getstudentlabel(logitem.accountId)}</span></div>
                    </div>
                    <div style = {{width: '15%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '12px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>{getstudentnickname(logitem.accountId)}</span></div>
                    <div style = {{width: '15%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '12px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>{logitem.typelabel}</span></div>
                    <div style = {{width: '20%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 100, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>• {logitem.timetext}</span></div>
                  </div>

                )

              ))}

            </div>

            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '1%', paddingTop: '2vh'}}>
              <div onClick = {atfirstpage == 0 ? firstpage : undefined} style = {{backgroundColor: 'rgb(26, 26, 42)', height: '5vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: atfirstpage == 0 ? 'pointer' : 'default', opacity: atfirstpage == 0 ? 1 : 0.5}}>
                <img src = {firstpageicon} style = {{width: '50%', height: '50%'}}/>
              </div>
              <div onClick = {atfirstpage == 0 ? previouspage : undefined} style = {{backgroundColor: 'rgb(26, 26, 42)', height: '5vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: atfirstpage == 0 ? 'pointer' : 'default', opacity: atfirstpage == 0 ? 1 : 0.5}}>
                <img src = {arrowlefticon} style = {{width: '50%', height: '50%'}}/>
              </div>
              <div style = {{backgroundColor: 'rgb(26, 26, 42)', height: '5vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'rgb(227, 224, 247)', fontSize: '18px', fontWeight: 900}}><span>{currentpagenumber}</span></div>
              <div onClick = {atlastpage == 0 ? nextpage : undefined} style = {{backgroundColor: 'rgb(26, 26, 42)', height: '5vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: atlastpage == 0 ? 'pointer' : 'default', opacity: atlastpage == 0 ? 1 : 0.5}}>
                <img src = {arrowrighticon} style = {{width: '50%', height: '50%'}}/>
              </div>
              <div onClick = {atlastpage == 0 ? lastpage : undefined} style = {{backgroundColor: 'rgb(26, 26, 42)', height: '5vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: atlastpage == 0 ? 'pointer' : 'default', opacity: atlastpage == 0 ? 1 : 0.5}}>
                <img src = {lastpageicon} style = {{width: '50%', height: '50%'}}/>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}
