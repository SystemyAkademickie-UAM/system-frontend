import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {getApiBaseUrl} from '../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../../auth/browserIdStorage.js';
import {READLANGUAGECOOKIE} from '../../utils/LANGUAGECOOKIE.js';
import {publicIconPath} from '../../utils/publicAssetUrl.js';
import Button from '../../components/ui/Button/Button.jsx';

const infoicon = publicIconPath('annotation-info-svgrepo-com.svg');
const warningicon = publicIconPath('annotation-alert-svgrepo-com.svg');
const criticalicon = publicIconPath('annotation-x-svgrepo-com.svg');

const BROADCASTTITLE__TEXTLABEL = {
  polish: 'Ogłoszenie',
  english: 'Broadcast'
};

const OKBUTTON__TEXTLABEL = {
  polish: 'OK',
  english: 'OK'
};

const DONOTSHOWAGAIN__TEXTLABEL = {
  polish: 'Nie wyświetlaj ponownie',
  english: 'Do not show again'
};

export default function BroadcastsContentWindow() {

  const location = useLocation();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const [queue, setQueue] = useState([]);
  const [donotshowagain, setDonotshowagain] = useState(0);
  const [windowopen, setWindowopen] = useState(0);





  async function onFetchBroadcasts() {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/broadcasts/me';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();



      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {


      }


      let receiveddata = data;

      const receivedbroadcasts = [];

      let i = 0;

      while (i < receiveddata.length) {

        receivedbroadcasts.push({
          id: receiveddata[i].id,
          title: receiveddata[i].title,
          content: receiveddata[i].content,
          level: receiveddata[i].level,
          expiresAt: receiveddata[i].expiresAt,
          createdAt: receiveddata[i].createdAt
        });

        i = i + 1;
      }

      setQueue(receivedbroadcasts);

      if (receivedbroadcasts.length > 0) {
        setWindowopen(1);
        setDonotshowagain(0);
      } else {
        setWindowopen(0);
      }

    } catch (error) {


    }
  }





  async function readbroadcast(broadcastId) {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/broadcasts/' + broadcastId + '/read';

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();


      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {

      }



    } catch (error) {

    }
  }





  function toggledonotshowagain() {
    if (donotshowagain == 0) {
      setDonotshowagain(1);
    } else {
      setDonotshowagain(0);
    }
  }





  async function clickok() {

    if (queue.length > 0) {

      if (donotshowagain == 1) {
        await readbroadcast(queue[0].id);
      }

      const newqueue = [];

      let i = 1;

      while (i < queue.length) {
        newqueue.push(queue[i]);
        i = i + 1;
      }

      setQueue(newqueue);
      setDonotshowagain(0);

      if (newqueue.length == 0) {
        setWindowopen(0);
      }

    } else {
      setWindowopen(0);
    }
  }





  useEffect(() => {
    onFetchBroadcasts();
  }, [location.pathname]);





  var currentbroadcast = null;
  var bordercolour = 'rgb(0, 0, 0)';
  var levelicon = infoicon;

  if (queue.length > 0) {
    currentbroadcast = queue[0];
  }

  if (currentbroadcast != null) {

    if (currentbroadcast.level == 'info') {
      bordercolour = 'rgb(0, 128, 0)';
      levelicon = infoicon;
    } else if (currentbroadcast.level == 'warning') {
      bordercolour = 'rgb(128, 128, 0)';
      levelicon = warningicon;
    } else if (currentbroadcast.level == 'critical') {
      bordercolour = 'rgb(128, 0, 0)';
      levelicon = criticalicon;
    }

  }





  if (windowopen == 0) {
    return null;
  }

  if (currentbroadcast == null) {
    return null;
  }





  return (
    <div style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'var(--color-modal-backdrop)', backdropFilter: 'blur(4px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style = {{backgroundColor: 'var(--bg-surface)', width: '100%', maxWidth: '580px', position: 'relative', borderRadius: '16px', border: '6px solid ' + bordercolour, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2.5vw', paddingRight: '2.5vw'}}>

        <div style = {{width: '64px', height: '64px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src = {levelicon} style = {{width: '100%', height: '100%'}}/>
        </div>
        <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '20px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '2vh'}}><span>{BROADCASTTITLE__TEXTLABEL[LANGUAGE]}</span></div>
        <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '2vh'}}><span>{currentbroadcast.title}</span></div>
        <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '2vh'}}><span>{currentbroadcast.content}</span></div>
        <div onClick = {toggledonotshowagain} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '0.5vw', marginTop: '2.5vh', cursor: 'pointer'}}>
          <input type = "checkbox" checked = {donotshowagain == 1} onChange = {toggledonotshowagain} style = {{width: '18px', height: '18px', cursor: 'pointer'}}/>
          <div style = {{color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center'}}><span>{DONOTSHOWAGAIN__TEXTLABEL[LANGUAGE]}</span></div>
        </div>
        <Button onClick = {clickok} style = {{width: '20%', height: '20%', marginTop: '2.5vh'}} variant = "primary">{OKBUTTON__TEXTLABEL[LANGUAGE]}</Button>

      </div>
    </div>
  )
}
