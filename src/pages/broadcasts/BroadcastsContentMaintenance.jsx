import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {getApiBaseUrl} from '../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../../auth/browserIdStorage.js';
import {useAppRole} from '../../context/AppRoleContext.jsx';
import {APP_ROLE} from '../../navigation/shellTemplates.config.js';
import {READLANGUAGECOOKIE} from '../../utils/LANGUAGECOOKIE.js';

const DEFAULTMESSAGE__TEXTLABEL = {
  polish: 'Trwają prace techniczne.',
  english: 'System is currently undergoing technical maintenance.'
};

export default function BroadcastsContentMaintenance() {

  const location = useLocation();
  const {role} = useAppRole();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);


  const [maintenanceon, setMaintenanceon] = useState(0);
  const [maintenancemessage, setMaintenancemessage] = useState('');





  async function onFetchSystemStatus() {



    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/system/status';

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

      if (receiveddata.maintenance.enabled == true) {
        setMaintenanceon(1);
      } else {
        setMaintenanceon(0);
      }

      if (receiveddata.maintenance.message == null || receiveddata.maintenance.message == '') {
        setMaintenancemessage(DEFAULTMESSAGE__TEXTLABEL[LANGUAGE]);
      } else {
        setMaintenancemessage(receiveddata.maintenance.message);
      }

    } catch (error) {


    }
  }





  useEffect(() => {
    onFetchSystemStatus();
  }, [location.pathname]);





  var issuperadmin = 0;

  if (role == APP_ROLE.SUPERADMIN) {
    issuperadmin = 1;
  }

  if (issuperadmin == 1) {
    return null;
  }

  if (maintenanceon == 0) {
    return null;
  }







  return (
    <div style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', zIndex: 999999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-surface)', overflow: 'hidden'}}>
      <div style = {{width: '100%', height: '100%', position: 'absolute', top: '0%', left: '0%', backgroundImage: "url('/images/welcome-moon-base.png')", backgroundSize: 'cover'}}></div>
      <div style = {{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-25vh)'}}>
        <div style = {{position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '1vw'}}>
          <img src = "/images/maq-logo.png" style = {{height: '128px'}}/>
          <div style = {{color: 'var(--color-bg-app)', fontSize: '128px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span>A</span></div>
          <div style = {{color: 'var(--accent)', fontSize: '128px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span>Q</span></div>
        </div>
        <div style = {{width: '80%', position: 'relative', color: 'var(--color-bg-app)', fontSize: '18px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '2.5vh'}}><span>{maintenancemessage}</span></div>

      </div>
    </div>
  )
}
