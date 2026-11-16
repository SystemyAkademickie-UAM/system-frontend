import {useState, useEffect} from 'react';
import {getApiBaseUrl} from '../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../../auth/browserIdStorage.js';
import {READLANGUAGECOOKIE} from '../../utils/LANGUAGECOOKIE.js';
import {publicIconPath} from '../../utils/publicAssetUrl.js';
import Button from '../../components/ui/Button/Button.jsx';
import {Divider} from '../../components/ui/index.js';

const theme = document.documentElement.getAttribute('data-theme');

var editicon;
if (theme == 'dark') {
  editicon = publicIconPath('edit-02-svgrepo-com.svg');
} else if (theme == 'light') {
  editicon = publicIconPath('edit-02-svgrepo-com-light.svg');
}
var deleteicon;
if (theme == 'dark') {
  deleteicon = publicIconPath('trash-01-svgrepo-com.svg');
} else if (theme == 'light') {
  deleteicon = publicIconPath('trash-01-svgrepo-com-light.svg');
}
var nextpageicon;
if (theme == 'dark') {
  nextpageicon = publicIconPath('chevron-right-svgrepo-com.svg');
} else if (theme == 'light') {
  nextpageicon = publicIconPath('chevron-right-svgrepo-com-light.svg');
}
var previouspageicon;
if (theme == 'dark') {
  previouspageicon = publicIconPath('chevron-left-svgrepo-com.svg');
} else if (theme == 'light') {
  previouspageicon = publicIconPath('chevron-left-svgrepo-com-light.svg');
}
var firstpageicon;
if (theme == 'dark') {
  firstpageicon = publicIconPath('chevron-left-double-svgrepo-com.svg');
} else if (theme == 'light') {
  firstpageicon = publicIconPath('chevron-left-double-svgrepo-com-light.svg');
}
var lastpageicon;
if (theme == 'dark') {
  lastpageicon = publicIconPath('chevron-right-double-svgrepo-com.svg');
} else if (theme == 'light') {
  lastpageicon = publicIconPath('chevron-right-double-svgrepo-com-light.svg');
}





const PAGESIZE = 10;

const BROADCASTSSECTION__TEXTLABEL = {
  polish: 'Masowe powiadomienia',
  english: 'Broadcasted messages'
};

const MAINTENANCESECTION__TEXTLABEL = {
  polish: 'Przerwa techniczna',
  english: 'Maintenance'
};

const NEWBROADCASTBUTTON__TEXTLABEL = {
  polish: 'Dodaj ogłoszenie',
  english: 'New broadcast'
};

const CREATEBROADCASTTITLE__TEXTLABEL = {
  polish: 'Stwórz ogłoszenie',
  english: 'Create a broadcast'
};

const EDITBROADCASTTITLE__TEXTLABEL = {
  polish: 'Edytuj ogłoszenie',
  english: 'Edit broadcast'
};

const TITLELABEL__TEXTLABEL = {
  polish: 'Tytuł ogłoszenia',
  english: 'Broadcast title'
};

const CONTENTLABEL__TEXTLABEL = {
  polish: 'Treść ogłoszenia',
  english: 'Broadcast content'
};

const TYPELABEL__TEXTLABEL = {
  polish: 'Typ ogłoszenia',
  english: 'Broadcast type'
};

const TYPEINFO__TEXTLABEL = {
  polish: 'Informacja',
  english: 'Information'
};

const TYPEWARNING__TEXTLABEL = {
  polish: 'Ostrzeżenie',
  english: 'Warning'
};

const TYPECRITICAL__TEXTLABEL = {
  polish: 'Krytyczne ostrzeżenie',
  english: 'Critical warning'
};

const RECIPIENTSLABEL__TEXTLABEL = {
  polish: 'Użytkownicy docelowi',
  english: 'Recipients'
};

const ROLEALL__TEXTLABEL = {
  polish: 'Wszyscy użytkownicy',
  english: 'All users'
};

const ROLESTUDENT__TEXTLABEL = {
  polish: 'Osoby studiujące',
  english: 'Students'
};

const ROLELECTURER__TEXTLABEL = {
  polish: 'Osoby prowadzące',
  english: 'Lecturers'
};

const ROLEADMIN__TEXTLABEL = {
  polish: 'Osoby administrujące',
  english: 'Administrators'
};

const EXPIRYLABEL__TEXTLABEL = {
  polish: 'Data wygaśnięcia',
  english: 'Expiry date'
};

const SAVEBUTTON__TEXTLABEL = {
  polish: 'Zapisz',
  english: 'Save'
};

const CANCELBUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel'
};

const MESSAGELABEL__TEXTLABEL = {
  polish: 'Wiadomość',
  english: 'Message'
};

const MAINTENANCEENDLABEL__TEXTLABEL = {
  polish: 'Koniec przerwy technicznej',
  english: 'End of the maintenance'
};

const MAINTENANCEONBUTTON__TEXTLABEL = {
  polish: 'Przerwa włączona',
  english: 'Maintenance on'
};

const MAINTENANCEOFFBUTTON__TEXTLABEL = {
  polish: 'Przerwa wyłączona',
  english: 'Maintenance off'
};

const SYSTEMSTATUSLABEL__TEXTLABEL = {
  polish: 'Status systemu',
  english: 'System status'
};

const SYSTEMENABLED__TEXTLABEL = {
  polish: 'Przerwa techniczna włączona',
  english: 'Maintenance enabled'
};

const SYSTEMDISABLED__TEXTLABEL = {
  polish: 'Przerwa techniczna wyłączona',
  english: 'Maintenance disabled'
};

const SYSTEMUPDATEDAT__TEXTLABEL = {
  polish: 'Ostatnia aktualizacja',
  english: 'Last update'
};

const SYSTEMSERVERTIME__TEXTLABEL = {
  polish: 'Czas serwera',
  english: 'Server time'
};

const MAINTENANCECONFIRMATIONTITLE__TEXTLABEL = {
  polish: 'Potwierdzenie',
  english: 'Confirmation'
};

const MAINTENANCEENABLECONFIRMATIONTEXT__TEXTLABEL = {
  polish: 'Czy na pewno włączyć tryb prac technicznych? Włączenie go uniemożliwi korzystanie z platformy osobom studiującym, osobom prowadzącym i osobom administrującym.',
  english: 'Are you sure you want to enable maintenance mode? Enabling it will not allow students, lecturers, and administrators to use the platform.'
};

const MAINTENANCEDISABLECONFIRMATIONTEXT__TEXTLABEL = {
  polish: 'Czy na pewno wyłączyć tryb prac technicznych?',
  english: 'Are you sure you want to disable maintenance mode?'
};

const MAINTENANCECONTROL__TEXTLABEL = {
  polish: 'Kontrola przerwy technicznej',
  english: 'Maintenance control'
};

const MAINTENANCESAVEERROR__TEXTLABEL = {
  polish: 'Nie udało się zapisać przerwy technicznej.',
  english: 'Failed to save maintenance mode.'
};

const BROADCASTDELETECONFIRMATIONTITLE__TEXTLABEL = {
  polish: 'Potwierdzenie usunięcia ogłoszenia',
  english: 'Broadcast deletion confirmation'
};

const BROADCASTDELETECONFIRMATIONTEXT__TEXTLABEL = {
  polish: 'Czy na pewno usunąć ogłoszenie: ',
  english: 'Are you sure you want to delete the broadcast message: '
};

const BROADCASTDELETECONFIRMATIONTEXTTEXT__TEXTLABEL = {
  polish: '? Tej operacji nie można cofnąć.',
  english: '? This operation cannot be undone.'
};

const NOBUTTON__TEXTLABEL = {
  polish: 'Nie',
  english: 'No'
};

const YESBUTTON__TEXTLABEL = {
  polish: 'Tak',
  english: 'Yes'
};

function preparedate(data) {
  if (data == null || data == '') {
    return '';
  }
  var date = new Date(data);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var monthtext = '' + month;
  var daytext = '' + day;
  if (month < 10) {
    monthtext = '0' + month;
  }
  if (day < 10) {
    daytext = '0' + day;
  }
  return year + '-' + monthtext + '-' + daytext;
}

function preparetime(data) {
  if (data == null || data == '') {
    return '';
  }
  var date = new Date(data);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var hourstext = '' + hours;
  var minutestext = '' + minutes;
  if (hours < 10) {
    hourstext = '0' + hours;
  }
  if (minutes < 10) {
    minutestext = '0' + minutes;
  }
  return hourstext + ':' + minutestext;
}

function concatenatedatetime(datevalue, timevalue) {
  if (datevalue == null || datevalue == '') {
    return null;
  }
  if (timevalue == null || timevalue == '') {
    timevalue = '00:00';
  }
  const parsed = new Date(datevalue + 'T' + timevalue);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString();
}

function concatenateexpiration(data) {
  if (data == null || data == '') {
    return '- - -';
  }
  return preparedate(data) + ' ' + preparetime(data);
}

export default function BroadcastsContentContent() {

  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const [broadcasts, setBroadcasts] = useState([]);
  const [broadcaststotal, setBroadcaststotal] = useState(0);
  const [currentpageindex, setCurrentpageindex] = useState(0);

  const [maintenanceenabled, setMaintenanceenabled] = useState(0);
  const [maintenancemessage, setMaintenancemessage] = useState('');
  const [maintenanceenddate, setMaintenanceenddate] = useState('');
  const [maintenanceendtime, setMaintenanceendtime] = useState('');

  const [systemenabled, setSystemenabled] = useState(0);
  const [systemmessage, setSystemmessage] = useState('');
  const [systemestimatedend, setSystemestimatedend] = useState('');
  const [systemupdatedat, setSystemupdatedat] = useState('');
  const [systemservertime, setSystemservertime] = useState('');
  const [maintenanceconfirmationopen, setMaintenanceconfirmationopen] = useState(0);
  const [maintenancesaveerror, setMaintenancesaveerror] = useState('');
  const [broadcastdeleteconfirmationopen, setBroadcastdeleteconfirmationopen] = useState(0);
  const [broadcastdeleteconfirmationid, setBroadcastdeleteconfirmationid] = useState(0);
  const [broadcastdeleteconfirmationtitle, setBroadcastdeleteconfirmationtitle] = useState('');
  const [deletebroadcastlevel, setDeletebroadcastlevel] = useState('');
  const [deletebroadcasttargetrole, setDeletebroadcasttargetrole] = useState('');



  const [editoropen, setEditoropen] = useState(0);
  const [editormode, setEditormode] = useState(0);
  const [editorid, setEditorid] = useState(0);
  const [editortitle, setEditortitle] = useState('');
  const [editorcontent, setEditorcontent] = useState('');
  const [editorlevel, setEditorlevel] = useState('info');
  const [editorall, setEditorall] = useState(0);
  const [editorstudent, setEditorstudent] = useState(0);
  const [editorlecturer, setEditorlecturer] = useState(0);
  const [editoradmin, setEditoradmin] = useState(0);
  const [editorexpirydate, setEditorexpirydate] = useState('');
  const [editorexpirytime, setEditorexpirytime] = useState('');





  async function onFetchBroadcasts() {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const skip = currentpageindex * PAGESIZE;
      const url = base + '/admin/broadcasts?take=' + PAGESIZE + '&skip=' + skip;

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

      while (i < receiveddata.items.length) {

        receivedbroadcasts.push({
          id: receiveddata.items[i].id,
          title: receiveddata.items[i].title,
          content: receiveddata.items[i].content,
          level: receiveddata.items[i].level,
          targetRole: receiveddata.items[i].targetRole,
          expiresAt: receiveddata.items[i].expiresAt,
          createdAt: receiveddata.items[i].createdAt
        });

        i = i + 1;
      }

      setBroadcasts(receivedbroadcasts);
      setBroadcaststotal(receiveddata.total);

    } catch (error) {



    }
  }






  async function onFetchMaintenance() {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/admin/maintenance';

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

      if (receiveddata.enabled == true) {
        setMaintenanceenabled(1);
      } else {
        setMaintenanceenabled(0);
      }

      if (receiveddata.message == null) {
        setMaintenancemessage('');
      } else {
        setMaintenancemessage(receiveddata.message);
      }

      setMaintenanceenddate(preparedate(receiveddata.estimatedEndAt));
      setMaintenanceendtime(preparetime(receiveddata.estimatedEndAt));

    } catch (error) {



    }
  }





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

      if (!response.ok || receiveddata?.maintenance == null) {
        return;
      }

      if (receiveddata.maintenance.enabled == true) {
        setSystemenabled(1);
      } else {
        setSystemenabled(0);
      }

      if (receiveddata.maintenance.message == null) {
        setSystemmessage('');
      } else {
        setSystemmessage(receiveddata.maintenance.message);
      }

      if (receiveddata.maintenance.estimatedEndAt == null) {
        setSystemestimatedend('');
      } else {
        setSystemestimatedend(concatenateexpiration(receiveddata.maintenance.estimatedEndAt));
      }

      if (receiveddata.maintenance.updatedAt == null) {
        setSystemupdatedat('');
      } else {
        setSystemupdatedat(concatenateexpiration(receiveddata.maintenance.updatedAt));
      }

      if (receiveddata.serverTime == null) {
        setSystemservertime('');
      } else {
        setSystemservertime(concatenateexpiration(receiveddata.serverTime));
      }

    } catch (error) {



    }
  }

  async function onCreateBroadcast(title, content, level, targetRole, expiresAt) {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/admin/broadcasts';

      const bodydata = {
        title: title,
        content: content,
        level: level,
        targetRole: targetRole
      };

      if (expiresAt != null) {
        bodydata.expiresAt = expiresAt;
      }

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify(bodydata)
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





  async function onDeleteBroadcast(broadcastId) {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/admin/broadcasts/' + broadcastId;

      const response = await fetch(url, {
        method: 'DELETE',
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



      onFetchBroadcasts();

    } catch (error) {



    }
  }

  async function onSaveMaintenance(isEnabled, message, estimatedEndAt) {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/admin/maintenance';

      const bodydata = {
        isEnabled: isEnabled,
        message: message,
        estimatedEndAt: estimatedEndAt
      };

      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify(bodydata)
      });

      const responsetext = await response.text();



      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {

      }

      if (!response.ok) {
        const message = data && typeof data.message === 'string'
          ? data.message
          : MAINTENANCESAVEERROR__TEXTLABEL[LANGUAGE];
        setMaintenancesaveerror(message);
        return;
      }

      setMaintenancesaveerror('');
      onFetchMaintenance();
      onFetchSystemStatus();

    } catch (error) {
      setMaintenancesaveerror(MAINTENANCESAVEERROR__TEXTLABEL[LANGUAGE]);
    }
  }





  function openCreatorEditor() {
    setEditormode(0);
    setEditorid(0);
    setEditortitle('');
    setEditorcontent('');
    setEditorlevel('info');
    setEditorall(0);
    setEditorstudent(0);
    setEditorlecturer(0);
    setEditoradmin(0);
    setEditorexpirydate('');
    setEditorexpirytime('');
    setEditoropen(1);
  }



  function openEditorEditor(broadcast) {
    setEditormode(1);
    setEditorid(broadcast.id);
    setEditortitle(broadcast.title);
    setEditorcontent(broadcast.content);
    setEditorlevel(broadcast.level);
    setEditorall(0);
    setEditorstudent(0);
    setEditorlecturer(0);
    setEditoradmin(0);

    if (broadcast.targetRole == 'student') {
      setEditorstudent(1);
    } else if (broadcast.targetRole == 'lecturer') {
      setEditorlecturer(1);
    } else if (broadcast.targetRole == 'administrator') {
      setEditoradmin(1);
    } else if (broadcast.targetRole == 'all') {
      setEditorall(1);
    }

    setEditorexpirydate(preparedate(broadcast.expiresAt));
    setEditorexpirytime(preparetime(broadcast.expiresAt));
    setEditoropen(1);
  }





  function closeEditor() {
    setEditoropen(0);
  }


  async function onSaveEditor() {

    const expiresAt = concatenatedatetime(editorexpirydate, editorexpirytime);

    const roles = [];

    if (editorall == 1) {
      roles.push('all');
    }
    if (editorstudent == 1) {
      roles.push('student');
    }
    if (editorlecturer == 1) {
      roles.push('lecturer');
    }
    if (editoradmin == 1) {
      roles.push('administrator');
    }

    if (editormode == 1) {
      await onDeleteBroadcast(editorid);
    }

    let i = 0;

    while (i < roles.length) {
      await onCreateBroadcast(editortitle, editorcontent, editorlevel, roles[i], expiresAt);
      i = i + 1;
    }

    setEditoropen(0);
    onFetchBroadcasts();
  }


  function toggleeditorall() {
    if (editorall == 0) {
      setEditorall(1);
    } else {
      setEditorall(0);
    }

  }

  function toggleeditorstudent() {
    if (editorstudent == 0) {
      setEditorstudent(1);
    } else {
      setEditorstudent(0);
    }

  }

  function toggleeditorlecturer() {
    if (editorlecturer == 0) {
      setEditorlecturer(1);
    } else {
      setEditorlecturer(0);
    }

  }

  function toggleeditoradmin() {
    if (editoradmin == 0) {
      setEditoradmin(1);
    } else {
      setEditoradmin(0);
    }

  }




  function openMaintenanceConfirmation() {
    setMaintenanceconfirmationopen(1);
  }

  function closeMaintenanceConfirmation() {
    setMaintenanceconfirmationopen(0);
  }

  function confirmMaintenance() {
    setMaintenanceconfirmationopen(0);
    togglemaintenance();
  }




  function openBroadcastDeleteConfirmation(broadcast) {
    setBroadcastdeleteconfirmationid(broadcast.id);
    setBroadcastdeleteconfirmationtitle(broadcast.title);
    setDeletebroadcastlevel(broadcast.level);
    setDeletebroadcasttargetrole(broadcast.targetRole);
    setBroadcastdeleteconfirmationopen(1);
  }

  function closeBroadcastDeleteConfirmation() {
    setBroadcastdeleteconfirmationopen(0);
  }

  function confirmBroadcastDelete() {
    setBroadcastdeleteconfirmationopen(0);
    onDeleteBroadcast(broadcastdeleteconfirmationid);
  }



  function togglemaintenance() {

    var newenabled;

    if (maintenanceenabled == 0) {
      newenabled = true;
    } else {
      newenabled = false;
    }

    var estimatedEndAt = concatenatedatetime(maintenanceenddate, maintenanceendtime);

    onSaveMaintenance(newenabled, maintenancemessage, estimatedEndAt);
  }





  function onSaveMaintenanceClick() {

    var estimatedEndAt = concatenatedatetime(maintenanceenddate, maintenanceendtime);

    var maintenanceenabledtest;

    if (maintenanceenabled == 1) {
      maintenanceenabledtest = true;
    } else {
      maintenanceenabledtest = false;
    }
    onSaveMaintenance(maintenanceenabled == 1, maintenancemessage, estimatedEndAt);
  }





  function firstpage() {
    if (currentpageindex > 0) {
      setCurrentpageindex(0);
    }
  }

  function previouspage() {
    if (currentpageindex > 0) {
      setCurrentpageindex(currentpageindex - 1);
    }
  }

  function nextpage() {
    var lastpage = Math.ceil(broadcaststotal / PAGESIZE) - 1;
    if (lastpage < 0) {
      lastpage = 0;
    }
    if (currentpageindex < lastpage) {
      setCurrentpageindex(currentpageindex + 1);
    }
  }

  function lastpage() {
    var lastpageindex = Math.ceil(broadcaststotal / PAGESIZE) - 1;
    if (lastpageindex < 0) {
      lastpageindex = 0;
    }
    if (currentpageindex < lastpageindex) {
      setCurrentpageindex(lastpageindex);
    }
  }





  useEffect(() => {
    onFetchBroadcasts();
    onFetchMaintenance();
    onFetchSystemStatus();
  }, []);

  useEffect(() => {
    onFetchBroadcasts();
  }, [currentpageindex]);






  var currentpagenumber = currentpageindex + 1;
  var lastpageindex = Math.ceil(broadcaststotal / PAGESIZE) - 1;

  if (lastpageindex < 0) {
    lastpageindex = 0;
  }



  var editortitletext = CREATEBROADCASTTITLE__TEXTLABEL[LANGUAGE];

  if (editormode == 1) {
    editortitletext = EDITBROADCASTTITLE__TEXTLABEL[LANGUAGE];
  }

  var maintenancebuttontext = MAINTENANCEOFFBUTTON__TEXTLABEL[LANGUAGE];

  if (maintenanceenabled == 1) {
    maintenancebuttontext = MAINTENANCEONBUTTON__TEXTLABEL[LANGUAGE];
  }

  var systemenabledtext = SYSTEMDISABLED__TEXTLABEL[LANGUAGE];

  if (systemenabled == 1) {
    systemenabledtext = SYSTEMENABLED__TEXTLABEL[LANGUAGE];
  }

  var maintenanceconfirmationtext = MAINTENANCEENABLECONFIRMATIONTEXT__TEXTLABEL[LANGUAGE];

  if (maintenanceenabled == 1) {
    maintenanceconfirmationtext = MAINTENANCEDISABLECONFIRMATIONTEXT__TEXTLABEL[LANGUAGE];
  }



  return (
    <div>
      <div>
        <div style = {{width: '98%', height: '7%', position: 'absolute', top: '1vh', left: '1%', color: 'var(--text-primary)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>{BROADCASTSSECTION__TEXTLABEL[LANGUAGE]}</span></div>

        <div style = {{width: '98%', top: '9vh', position: 'absolute', left: '1%', display: 'flex', flexDirection: 'column', gap: '1vh', alignItems: 'center', paddingBottom: '1vh'}}>
          <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1vh', alignItems: 'center', paddingBottom: '1vh'}}>
            <div style = {{width: '98%', height: '10vh', position: 'relative', top: '2%', left: '1%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '2%'}}>
              <div onClick = {firstpage} style = {{backgroundColor: 'var(--bg-surface)', height: '40px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: currentpageindex > 0 ? 'pointer' : 'default', opacity: currentpageindex > 0 ? 1 : 0.5}}>
                <img src = {firstpageicon} style = {{width: '50%', height: '50%'}}/>
              </div>
              <div onClick = {previouspage} style = {{backgroundColor: 'var(--bg-surface)', height: '40px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: currentpageindex > 0 ? 'pointer' : 'default', opacity: currentpageindex > 0 ? 1 : 0.5}}>
                <img src = {previouspageicon} style = {{width: '50%', height: '50%'}}/>
              </div>
              <div style = {{backgroundColor: 'var(--bg-surface)', height: '40px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'var(--text-primary)', fontSize: '18px', fontWeight: 900}}><span>{currentpagenumber}</span></div>
              <div onClick = {nextpage} style = {{backgroundColor: 'var(--bg-surface)', height: '40px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: currentpageindex < lastpageindex ? 'pointer' : 'default', opacity: currentpageindex < lastpageindex ? 1 : 0.5}}>
                <img src = {nextpageicon} style = {{width: '50%', height: '50%'}}/>
              </div>
              <div onClick = {lastpage} style = {{backgroundColor: 'var(--bg-surface)', height: '40px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: currentpageindex < lastpageindex ? 'pointer' : 'default', opacity: currentpageindex < lastpageindex ? 1 : 0.5}}>
                <img src = {lastpageicon} style = {{width: '50%', height: '50%'}}/>
              </div>
            </div>
            {broadcasts.map((broadcast) => (

              <div key = {'broadcast' + broadcast.id} style = {{backgroundColor: 'var(--bg-surface)', width: '80%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%', borderLeft: '6px solid var(--color-accent)', borderRadius: '16px'}}>
                <div style = {{width: '90%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh', paddingLeft: '1%'}}>
                  <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style = {{width: '70%', position: 'relative', color: 'var(--text-primary)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{broadcast.title}</span></div>
                    <div style = {{width: '30%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-end'}}><span>{concatenateexpiration(broadcast.expiresAt)}</span></div>
                  </div>
                  <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%'}}>
                    <div style = {{backgroundColor: 'var(--color-accent-2)', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', borderRadius: '8px', paddingLeft: '1%', paddingRight: '1%'}}><span>{broadcast.level}</span></div>
                    <div style = {{backgroundColor: 'var(--color-accent-2)', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', borderRadius: '8px', paddingLeft: '1%', paddingRight: '1%', paddingTop: '0.25%', paddingBottom: '0.25%'}}><span>{broadcast.targetRole}</span></div>
                  </div>
                  <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start'}}><span style = {{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 4, overflow: 'hidden'}}>{broadcast.content}</span></div>
                </div>
                <div style = {{width: '10%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '5%', alignSelf: 'stretch'}}>
                  <div onClick = {() => openEditorEditor(broadcast)} style = {{width: '32px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img src = {editicon} style = {{width: '60%', height: '60%'}}/>
                  </div>
                  <div onClick = {() => openBroadcastDeleteConfirmation(broadcast)} style = {{width: '32px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>



                    <img src = {deleteicon} style = {{width: '60%', height: '60%'}}/>
                  </div>
                </div>
              </div>

            ))}

          </div>








          <div style = {{width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '1%', marginTop: '2vh'}}>
            <Button onClick = {openCreatorEditor} style = {{width: '15%', height: '5vh', marginBottom: '5vh'}} variant = "primary">{NEWBROADCASTBUTTON__TEXTLABEL[LANGUAGE]}</Button>
          </div>
          <Divider className="group-main-subpage__divider" />
          <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', marginTop: '0vh'}}><span>{MAINTENANCESECTION__TEXTLABEL[LANGUAGE]}</span></div>
          <div style = {{width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '1%', marginTop: '2vh'}}>
            <Button onClick = {openMaintenanceConfirmation} style = {{width: '20%', height: '5vh', color: maintenanceenabled === 1 ? '#000000' : '#ffffff', marginTop: '1vh'}} variant = "primary">{maintenancebuttontext}</Button>
            {maintenancesaveerror ? (
              <div role = "alert" style = {{color: 'var(--color-danger, #b42318)', marginTop: '1vh'}}>{maintenancesaveerror}</div>
            ) : null}


          </div>

          <div style = {{width: '98%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh', marginTop: '2vh'}}>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>{MESSAGELABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <textarea onChange = {(event) => setMaintenancemessage(event.target.value)} style = {{backgroundColor: 'var(--bg-elevated)', width: '50%', height: '12vh', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', paddingTop: '0.5%', paddingLeft: '1%', borderRadius: '8px', resize: 'none'}} value = {maintenancemessage} onFocus = {(event) => (event.target.style.border = '2px solid var(--color-accent)')} onBlur = {(event) => (event.target.style.border = '')}></textarea>
          </div>

          <div style = {{width: '98%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh', marginTop: '2vh'}}>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>{MAINTENANCEENDLABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
              <input type = "date" onChange = {(event) => setMaintenanceenddate(event.target.value)} style = {{backgroundColor: 'var(--bg-elevated)', width: '25%', height: '5vh', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', borderRadius: '8px', paddingLeft: '1%'}} value = {maintenanceenddate} onFocus = {(event) => (event.target.style.border = '2px solid var(--color-accent)')} onBlur = {(event) => (event.target.style.border = '')}/>
              <input type = "time" onChange = {(event) => setMaintenanceendtime(event.target.value)} style = {{backgroundColor: 'var(--bg-elevated)', width: '25%', height: '5vh', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', borderRadius: '8px', paddingLeft: '1%'}} value = {maintenanceendtime} onFocus = {(event) => (event.target.style.border = '2px solid var(--color-accent)')} onBlur = {(event) => (event.target.style.border = '')}/>
            </div>
          </div>

          <div style = {{width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '1%', marginTop: '2vh'}}>
            <Button onClick = {onSaveMaintenanceClick} style = {{width: '15%', height: '5vh'}} variant = "primary">{SAVEBUTTON__TEXTLABEL[LANGUAGE]}</Button>
          </div>

          <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '22px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', marginTop: '4vh'}}><span>{SYSTEMSTATUSLABEL__TEXTLABEL[LANGUAGE]}</span></div>
          <div style = {{backgroundColor: 'var(--bg-surface)', width: '98%', position: 'relative', borderRadius: '16px', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%', display: 'flex', flexDirection: 'column', gap: '1vh', marginBottom: '2vh'}}>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>{systemenabledtext}</span></div>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>{systemmessage}</span></div>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>{systemestimatedend}</span></div>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>{SYSTEMUPDATEDAT__TEXTLABEL[LANGUAGE]}: {systemupdatedat}</span></div>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>{SYSTEMSERVERTIME__TEXTLABEL[LANGUAGE]}: {systemservertime}</span></div>
          </div>




        </div>
      </div>



      {maintenanceconfirmationopen == 1 ? (
        <div onClick = {closeMaintenanceConfirmation} style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'var(--color-modal-backdrop)', backdropFilter: 'blur(4px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div onClick = {(event) => event.stopPropagation()} style = {{backgroundColor: 'var(--bg-surface)', width: '50%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2vw', paddingRight: '2vw'}}>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '24px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>{MAINTENANCECONTROL__TEXTLABEL[LANGUAGE]}</span></div>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '2vh'}}><span>{maintenanceconfirmationtext}</span></div>

            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2.5%', marginTop: '2vh'}}>
              <Button onClick = {closeMaintenanceConfirmation} style = {{width: '15%', height: '5vh'}} variant = "secondary">{NOBUTTON__TEXTLABEL[LANGUAGE]}</Button>
              <Button onClick = {confirmMaintenance} style = {{width: '15%', height: '5vh'}} variant = "primary">{YESBUTTON__TEXTLABEL[LANGUAGE]}</Button>
            </div>

          </div>
        </div>
      ) : null}




      {broadcastdeleteconfirmationopen == 1 ? (
        <div onClick = {closeBroadcastDeleteConfirmation} style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'var(--color-modal-backdrop)', backdropFilter: 'blur(4px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div onClick = {(event) => event.stopPropagation()} style = {{backgroundColor: 'var(--bg-surface)', width: '50%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2vw', paddingRight: '2vw'}}>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '24px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>{BROADCASTDELETECONFIRMATIONTITLE__TEXTLABEL[LANGUAGE]}</span></div>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '2vh'}}><span>{BROADCASTDELETECONFIRMATIONTEXT__TEXTLABEL[LANGUAGE]}<b>{broadcastdeleteconfirmationtitle} ({deletebroadcastlevel}, {deletebroadcasttargetrole})</b>{BROADCASTDELETECONFIRMATIONTEXTTEXT__TEXTLABEL[LANGUAGE]}</span></div>

            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2.5%', marginTop: '2vh'}}>
              <Button onClick = {closeBroadcastDeleteConfirmation} style = {{width: '15%', height: '5vh'}} variant = "secondary">{NOBUTTON__TEXTLABEL[LANGUAGE]}</Button>
              <Button onClick = {confirmBroadcastDelete} style = {{width: '15%', height: '5vh'}} variant = "primary">{YESBUTTON__TEXTLABEL[LANGUAGE]}</Button>
            </div>

          </div>
        </div>
      ) : null}





      {editoropen == 1 ? (
        <div onClick = {closeEditor} style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'var(--color-modal-backdrop)', backdropFilter: 'blur(4px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div onClick = {(event) => event.stopPropagation()} style = {{backgroundColor: 'var(--bg-surface)', width: '50%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', paddingTop: '1vh', paddingBottom: '2vh', paddingLeft: '2vw', paddingRight: '2vw'}}>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '24px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>{editortitletext}</span></div>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '2vh'}}><span>{TITLELABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <input onChange = {(event) => setEditortitle(event.target.value)} style = {{backgroundColor: 'var(--bg-elevated)', width: '100%', height: '5vh', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', borderRadius: '8px', paddingLeft: '1%', marginTop: '1vh'}} value = {editortitle} onFocus = {(event) => (event.target.style.border = '2px solid var(--accent)')} onBlur = {(event) => (event.target.style.border = '')}></input>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '2.5vh'}}><span>{CONTENTLABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <textarea onChange = {(event) => setEditorcontent(event.target.value)} style = {{backgroundColor: 'var(--bg-elevated)', width: '100%', height: '15vh', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', borderRadius: '8px', paddingTop: '0.5%', paddingLeft: '1%', marginTop: '1vh', resize: 'none'}} value = {editorcontent} onFocus = {(event) => (event.target.style.border = '2px solid var(--accent)')} onBlur = {(event) => (event.target.style.border = '')}></textarea>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '2.5vh'}}><span>{TYPELABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh', marginTop: '1vh'}}>
              <div onClick = {() => setEditorlevel('info')} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%', cursor: 'pointer'}}>
                <input type = "radio" checked = {editorlevel == 'info'} onChange = {() => setEditorlevel('info')} style = {{cursor: 'pointer'}}/>
                <div style = {{color: 'var(--text-primary)', fontSize: '14px', display: 'flex', fontWeight: 500}}><span>{TYPEINFO__TEXTLABEL[LANGUAGE]}</span></div>
              </div>
              <div onClick = {() => setEditorlevel('warning')} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%', cursor: 'pointer'}}>
                <input type = "radio" checked = {editorlevel == 'warning'} onChange = {() => setEditorlevel('warning')} style = {{cursor: 'pointer'}}/>
                <div style = {{color: 'var(--text-primary)', fontSize: '14px', display: 'flex', fontWeight: 500}}><span>{TYPEWARNING__TEXTLABEL[LANGUAGE]}</span></div>
              </div>
              <div onClick = {() => setEditorlevel('critical')} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%', cursor: 'pointer'}}>
                <input type = "radio" checked = {editorlevel == 'critical'} onChange = {() => setEditorlevel('critical')} style = {{cursor: 'pointer'}}/>
                <div style = {{color: 'var(--text-primary)', fontSize: '14px', display: 'flex', fontWeight: 500}}><span>{TYPECRITICAL__TEXTLABEL[LANGUAGE]}</span></div>
              </div>
            </div>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '2.5vh'}}><span>{RECIPIENTSLABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh', marginTop: '1vh'}}>
              <div onClick = {toggleeditorall} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%', cursor: 'pointer'}}>
                <input type = "checkbox" checked = {editorall == 1} onChange = {toggleeditorall} style = {{cursor: 'pointer'}}/>
                <div style = {{color: 'var(--text-primary)', fontSize: '14px', display: 'flex', fontWeight: 500}}><span>{ROLEALL__TEXTLABEL[LANGUAGE]}</span></div>
              </div>
              <div onClick = {toggleeditorstudent} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%', cursor: 'pointer'}}>
                <input type = "checkbox" checked = {editorstudent == 1} onChange = {toggleeditorstudent} style = {{cursor: 'pointer'}}/>
                <div style = {{color: 'var(--text-primary)', fontSize: '14px', display: 'flex', fontWeight: 500}}><span>{ROLESTUDENT__TEXTLABEL[LANGUAGE]}</span></div>
              </div>
              <div onClick = {toggleeditorlecturer} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%', cursor: 'pointer'}}>
                <input type = "checkbox" checked = {editorlecturer == 1} onChange = {toggleeditorlecturer} style = {{cursor: 'pointer'}}/>
                <div style = {{color: 'var(--text-primary)', fontSize: '14px', display: 'flex', fontWeight: 500}}><span>{ROLELECTURER__TEXTLABEL[LANGUAGE]}</span></div>
              </div>
              <div onClick = {toggleeditoradmin} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%', cursor: 'pointer'}}>
                <input type = "checkbox" checked = {editoradmin == 1} onChange = {toggleeditoradmin} style = {{cursor: 'pointer'}}/>
                <div style = {{color: 'var(--text-primary)', fontSize: '14px', display: 'flex', fontWeight: 500}}><span>{ROLEADMIN__TEXTLABEL[LANGUAGE]}</span></div>
              </div>
            </div>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '2.5vh'}}><span>{EXPIRYLABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh', marginTop: '1vh'}}>
              <input type = "date" onChange = {(event) => setEditorexpirydate(event.target.value)} style = {{backgroundColor: 'var(--bg-elevated)', width: '50%', height: '5vh', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', borderRadius: '8px', paddingLeft: '1%'}} value = {editorexpirydate} onFocus = {(event) => (event.target.style.border = '2px solid var(--color-accent)')} onBlur = {(event) => (event.target.style.border = '')}/>
              <input type = "time" onChange = {(event) => setEditorexpirytime(event.target.value)} style = {{backgroundColor: 'var(--bg-elevated)', width: '50%', height: '5vh', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', borderRadius: '8px', paddingLeft: '1%'}} value = {editorexpirytime} onFocus = {(event) => (event.target.style.border = '2px solid var(--color-accent)')} onBlur = {(event) => (event.target.style.border = '')}/>
            </div>

            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2.5%', marginTop: '2vh'}}>
              <Button onClick = {closeEditor} style = {{width: '15%', height: '5vh'}} variant = "secondary">{CANCELBUTTON__TEXTLABEL[LANGUAGE]}</Button>
              <Button onClick = {onSaveEditor} style = {{width: '15%', height: '5vh'}} variant = "primary">{SAVEBUTTON__TEXTLABEL[LANGUAGE]}</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
