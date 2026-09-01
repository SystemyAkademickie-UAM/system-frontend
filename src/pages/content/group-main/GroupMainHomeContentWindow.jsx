import { useState } from 'react';
import { PUBLIC_UI_ICONS } from '../../../constants/publicUiIcons.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const closeicon = PUBLIC_UI_ICONS.close;

const GROUPCREATEDTITLEWITHSUBJECT__TEXTLABEL = {
  polish: 'Grupa {groupname} dla przedmiotu {subjectname} została utworzona z powodzeniem przy użyciu szablonu.',
  english: 'Group {groupname} for the subject {subjectname} has been successfully created using the template.'
};

const GROUPCREATEDTITLE__TEXTLABEL = {
  polish: 'Grupa {groupname} została utworzona z powodzeniem przy użyciu szablonu.',
  english: 'Group {groupname} has been successfully created using the template.'
};

const GROUPCREATEDINFO1__TEXTLABEL = {
  polish: '• Na początku wszystkie importowane elementy składowe grupy są ukryte przed pozostałymi członkami grupy.',
  english: '• Initially, all imported group elements are hidden from other group members.'
};

const GROUPCREATEDINFO2__TEXTLABEL = {
  polish: '• W celu udostępnienia ukrytej zawartości do wglądu dla studentów, należy poszczególne elementy uczynić widocznymi.',
  english: '• To share hidden content with students, you need to make individual elements visible.'
};

const CONFIRMBUTTON__TEXTLABEL = {
  polish: 'Rozumiem',
  english: 'OK'
};

export default function GroupMainHomeContentWindow({popupclose, groupname, subjectname}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  function closepopupwindow() {
    if (popupclose) {
      popupclose();
    }
  }

  var firstline = '';

  if (subjectname != null && subjectname.length > 0) {
    firstline = GROUPCREATEDTITLEWITHSUBJECT__TEXTLABEL[LANGUAGE].replace('{groupname}', groupname).replace('{subjectname}', subjectname);
  } else {
    firstline = GROUPCREATEDTITLE__TEXTLABEL[LANGUAGE].replace('{groupname}', groupname);
  }

  var secondline = GROUPCREATEDINFO1__TEXTLABEL[LANGUAGE];
  var thirdline = GROUPCREATEDINFO2__TEXTLABEL[LANGUAGE];

  return (
    <div style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div onClick = {(event) => event.stopPropagation()} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '50%', height: '50%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <div onClick = {closepopupwindow} style = {{width: '5%', aspectRatio: '1 / 1', position: 'absolute', top: '2%', left: '94%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', zIndex: 1}}>
          <img src = {closeicon} style = {{width: '60%', height: '60%'}}/>
        </div>

        <div style = {{width: '90%', position: 'relative', left: '5%', display: 'flex', flexDirection: 'column', gap: '2vh', flex: 1, paddingTop: '10%', paddingBottom: '12%', justifyContent: 'center'}}>
          <div style = {{width: '100%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '2.5vh'}}><span>{firstline}</span></div>
          <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'left'}}><span>{secondline}</span></div>
          <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'left'}}><span>{thirdline}</span></div>
        </div>

        <div onClick = {closepopupwindow} style = {{backgroundColor: 'rgba(30, 204, 56)', width: '20%', height: '12%', position: 'absolute', bottom: '5%', right: '5%', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>{CONFIRMBUTTON__TEXTLABEL[LANGUAGE]}</div>

      </div>
    </div>
  )
}
