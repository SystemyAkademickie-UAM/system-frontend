import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/index.js';
import { PUBLIC_UI_ICONS } from '../../../constants/publicUiIcons.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './GroupMainHomeContentWindow.css';

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

export default function GroupMainHomeContentWindow({ popupclose, groupname, subjectname }) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        if (popupclose) popupclose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [popupclose]);

  function closepopupwindow() {
    if (popupclose) {
      popupclose();
    }
  }

  const firstline = (subjectname != null && subjectname.length > 0)
    ? GROUPCREATEDTITLEWITHSUBJECT__TEXTLABEL[LANGUAGE].replace('{groupname}', groupname).replace('{subjectname}', subjectname)
    : GROUPCREATEDTITLE__TEXTLABEL[LANGUAGE].replace('{groupname}', groupname);

  const secondline = GROUPCREATEDINFO1__TEXTLABEL[LANGUAGE];
  const thirdline = GROUPCREATEDINFO2__TEXTLABEL[LANGUAGE];

  return (
    <div
      className="group-main-template-modal"
      onClick={closepopupwindow}
      role="presentation"
    >
      <div
        className="group-main-template-modal__dialog"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="group-main-template-modal__close"
          onClick={closepopupwindow}
          aria-label="Zamknij"
        >
          <img src={closeicon} alt="" className="group-main-template-modal__close-icon" />
        </button>

        <div className="group-main-template-modal__body">
          <p className="group-main-template-modal__title">{firstline}</p>
          <div className="group-main-template-modal__info-list">
            <p className="group-main-template-modal__info-item">{secondline}</p>
            <p className="group-main-template-modal__info-item">{thirdline}</p>
          </div>
        </div>

        <div className="group-main-template-modal__footer">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={closepopupwindow}
          >
            {CONFIRMBUTTON__TEXTLABEL[LANGUAGE]}
          </Button>
        </div>
      </div>
    </div>
  );
}
