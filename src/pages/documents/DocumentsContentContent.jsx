import {useState, useEffect} from 'react';
import {getApiBaseUrl} from '../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../../auth/browserIdStorage.js';
import {READLANGUAGECOOKIE} from '../../utils/LANGUAGECOOKIE.js';
import {publicIconPath} from '../../utils/publicAssetUrl.js';
import {Button, useToast} from '../../components/ui/index.js';
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
var viewicon;
if (theme == 'dark') {
  viewicon = publicIconPath('file-04-svgrepo-com.svg');
} else if (theme == 'light') {
  viewicon = publicIconPath('file-04-svgrepo-com-light.svg');
}
var downloadicon;
if (theme == 'dark') {
  downloadicon = publicIconPath('file-download-03-svgrepo-com.svg');
} else if (theme == 'light') {
  downloadicon = publicIconPath('file-download-03-svgrepo-com-light.svg');
}
var addfileicon;
if (theme == 'dark') {
  addfileicon = publicIconPath('file-plus-03-svgrepo-com.svg');
} else if (theme == 'light') {
  addfileicon = publicIconPath('file-plus-03-svgrepo-com-light.svg');
}
var fileaddedicon;
if (theme == 'dark') {
  fileaddedicon = publicIconPath('file-check-03-svgrepo-com.svg');
} else if (theme == 'light') {
  fileaddedicon = publicIconPath('file-check-03-svgrepo-com-light.svg');
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

const DOCUMENTSSECTION__TEXTLABEL = {
  polish: 'Manager dokumentacji',
  english: 'Documentation manager'
};

const DOCUMENTSSECTIONDESCRIPTION__TEXTLABEL = {
  polish: 'Sekcja pozwalająca wgrywać i usuwać pliki PDF zawierające dokumentację prawną i regulaminy.',
  english: 'Section that allows uploading and deleting PDF files containing legal documentation and regulations.'
};

const DOCUMENTTERMSOFUSE__TEXTLABEL = {
  polish: 'Warunki użytkowania',
  english: 'Terms of use'
};

const DOCUMENTPRIVACYPOLICY__TEXTLABEL = {
  polish: 'Polityka prywatności',
  english: 'Privacy policy'
};

const DOCUMENTDOCUMENTATION__TEXTLABEL = {
  polish: 'Dokumentacja',
  english: 'Documentation'
};

const DOCUMENTNOTUPLOADED__TEXTLABEL = {
  polish: 'Dokument nie został przesłany',
  english: 'The document was not uploaded'
};

const EMPTYVALUE__TEXTLABEL = {
  polish: '- - -',
  english: '- - -'
};

const PDFFILELABEL__TEXTLABEL = {
  polish: 'Plik PDF (maksymalny rozmiar 20 MB)',
  english: 'PDF file (max. size 20 MB)'
};

const FILENAMELABEL__TEXTLABEL = {
  polish: 'Nazwa pliku',
  english: 'File name'
};

const FILESIZELABEL__TEXTLABEL = {
  polish: 'Rozmiar pliku',
  english: 'File size'
};

const FILEDATELABEL__TEXTLABEL = {
  polish: 'Data przesłania pliku',
  english: 'Date of upload'
};

const UPLOADBUTTON__TEXTLABEL = {
  polish: 'Dodaj',
  english: 'Upload'
};

const CANCELBUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel'
};

const DOCUMENTDELETECONFIRMATIONTITLE__TEXTLABEL = {
  polish: 'Potwierdzenie usunięcia',
  english: 'Deletion confirmation'
};

const DOCUMENTDELETECONFIRMATIONTEXT__TEXTLABEL = {
  polish: 'Proszę zatwierdzić usunięcie dokumentu. Operacji nie można cofnąć.',
  english: 'Please confirm deletion of the document file. The operation cannot be undone.'
};

const CONFIRMBUTTON__TEXTLABEL = {
  polish: 'Zatwierdź',
  english: 'Confirm'
};

const DOCUMENTSAVINGSUCCESS__TEXTLABEL = {
  polish: 'Dokument został przesłany.',
  english: 'The document has been uploaded.'
};

const DOCUMENTDELETIONSUCCESS__TEXTLABEL = {
  polish: 'Dokument został usunięty.',
  english: 'The document has been deleted.'
};


const PATCHNOTESSECTION__TEXTLABEL = {
  polish: 'Historia zmian',
  english: 'Patch notes'
};

const PATCHNOTESSECTIONDESCRYPTION__TEXTLABEL = {
  polish: 'Moduł umożliwiający zarządzanie dokumentami historii zmian.',
  english: 'A module that allows managing the files that document changes in the system.'
};

const NEWPATCHNOTEBUTTON__TEXTLABEL = {
  polish: 'Dodaj dokument zmian',
  english: 'Add a patch note'
};

const CREATEPATCHNOTETITLE__TEXTLABEL = {
  polish: 'Dodaj dokument zmian',
  english: 'Add a patch note'
};


const TITLELABEL__TEXTLABEL = {
  polish: 'Tytuł',
  english: 'Title'
};

const VERSIONLABEL__TEXTLABEL = {
  polish: 'Wersja',
  english: 'Version'
};


const PATCHNOTEDELETECONFIRMATIONTITLE__TEXTLABEL = {
  polish: 'Potwierdzenie usunięcia',
  english: 'Deletion confirmation'
};

const PATCHNOTEDELETECONFIRMATIONTEXT__TEXTLABEL = {
  polish: 'Proszę zatwierdzić usunięcie dokumentu zmian. Operacji nie można cofnąć.',
  english: 'Please confirm deletion of the patch note file. The operation cannot be undone.'
};


const PATCHNOTESAVINGSUCCESS__TEXTLABEL = {
  polish: 'Dokument zmian został dodany.',
  english: 'The patch note has been uploaded.'
};

const PATCHNOTEDELETIONSUCCESS__TEXTLABEL = {
  polish: 'Dokument zmian został usunięty.',
  english: 'The patch note has been deleted.'
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

function concatenateexpiration(data) {
  if (data == null || data == '') {
    return '- - -';
  }
  return preparedate(data) + ' ' + preparetime(data);
}

function preparefilesize(bytes) {
  if (bytes == null) {
    return '- - -';
  }
  var kilobytes = Math.floor(bytes / 1024);
  if (kilobytes < 1) {
    return bytes + ' B';
  } else {
    return kilobytes + ' kB';
  }
}

function preparedocumentname(key, language) {
  if (key == 'termsOfUse') {
    return DOCUMENTTERMSOFUSE__TEXTLABEL[language];
  }
  if (key == 'privacyPolicy') {
    return DOCUMENTPRIVACYPOLICY__TEXTLABEL[language];
  }
  if (key == 'documentation') {
    return DOCUMENTDOCUMENTATION__TEXTLABEL[language];
  }
}

export default function DocumentsContentContent() {
  const {showSuccess, showError} = useToast();

  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const [documents, setDocuments] = useState([]);

  const [documentdeleteconfirmationopen, setDocumentdeleteconfirmationopen] = useState(0);
  const [documentdeleteconfirmationkey, setDocumentdeleteconfirmationkey] = useState('');



  const [editoropen, setEditoropen] = useState(0);
  const [editorkey, setEditorkey] = useState('');
  const [editortitletext, setEditortitletext] = useState('');
  const [editorfile, setEditorfile] = useState(null);
  const [editorfilechosen, setEditorfilechosen] = useState(0);
  const [editorfilename, setEditorfilename] = useState('');
  const [editorfilesize, setEditorfilesize] = useState('');
  const [editorfiledate, setEditorfiledate] = useState('');


  const [patchnotes, setPatchnotes] = useState([]);
  const [patchnotestotal, setPatchnotestotal] = useState(0);
  const [currentpageindex, setCurrentpageindex] = useState(0);

  const [patchnotedeleteconfirmationopen, setPatchnotedeleteconfirmationopen] = useState(0);
  const [patchnotedeleteconfirmationid, setPatchnotedeleteconfirmationid] = useState(0);



  const [editorpatchnoteopen, setEditorpatchnoteopen] = useState(0);
  const [editorpatchnotetitle, setEditorpatchnotetitle] = useState('');
  const [editorpatchnoteversion, setEditorpatchnoteversion] = useState('');
  const [editorpatchnotefile, setEditorpatchnotefile] = useState(null);
  const [editorpatchnotefilechosen, setEditorpatchnotefilechosen] = useState(0);



  async function onFetchDocuments() {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/admin/documents';

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

      const receiveddocuments = [];

      let i = 0;

      while (i < receiveddata.items.length) {

        receiveddocuments.push({
          key: receiveddata.items[i].key,
          isUploaded: receiveddata.items[i].isUploaded,
          originalFilename: receiveddata.items[i].originalFilename,
          fileSizeBytes: receiveddata.items[i].fileSizeBytes,
          uploadedAt: receiveddata.items[i].uploadedAt
        });

        i = i + 1;
      }

      setDocuments(receiveddocuments);

    } catch (error) {



    }
  }






  async function onFetchDocument(documentkey) {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/admin/documents/' + documentkey;

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

      if (receiveddata.isUploaded == true) {
        setEditorfilechosen(1);

        if (receiveddata.originalFilename == null) {
          setEditorfilename('');
        } else {
          setEditorfilename(receiveddata.originalFilename);
        }

        setEditorfilesize(preparefilesize(receiveddata.fileSizeBytes));
        setEditorfiledate(concatenateexpiration(receiveddata.uploadedAt));
      } else {
        setEditorfilechosen(0);
        setEditorfilename(DOCUMENTNOTUPLOADED__TEXTLABEL[LANGUAGE]);
        setEditorfilesize(EMPTYVALUE__TEXTLABEL[LANGUAGE]);
        setEditorfiledate(EMPTYVALUE__TEXTLABEL[LANGUAGE]);
      }

    } catch (error) {



    }
  }






  async function onUploadDocument(documentkey, file) {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/admin/documents/' + documentkey;

      const formdata = new FormData();
      formdata.append('file', file);

      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'X-Browser-ID': browserid
        },
        body: formdata
      });

      const responsetext = await response.text();



      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {

      }
      if (response.ok) {
        showSuccess(DOCUMENTSAVINGSUCCESS__TEXTLABEL[LANGUAGE]);
      }


    } catch (error) {



    }
  }





  async function onDeleteDocument(documentkey, toast) {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/admin/documents/' + documentkey;

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
      if (response.ok && toast == 1) {
        showSuccess(DOCUMENTDELETIONSUCCESS__TEXTLABEL[LANGUAGE]);
      }


      onFetchDocuments();

    } catch (error) {



    }
  }



  async function openEditorEditor(documentitem) {
    setEditorkey(documentitem.key);
    setEditortitletext(preparedocumentname(documentitem.key, LANGUAGE));
    setEditorfile(null);
    setEditorfilechosen(0);
    setEditorfilename('');
    setEditorfilesize('');
    setEditorfiledate('');
    setEditoropen(1);

    var fileinput = document.getElementById('documentfileinput');
    if (fileinput != null) {
      fileinput.value = '';
    }

    await onFetchDocument(documentitem.key);
  }




  function closeEditor() {
    setEditoropen(0);
  }


  function openfilepickerdocument() {
    var fileinput = document.getElementById('documentfileinput');
    if (fileinput != null) {
      fileinput.click();
    }
  }


  function onFileChosen(chosen) {
    var files = chosen.target.files;
    if (files == null) {
      return;
    } else if (files.length == 0) {
      return;
    } else {

      var file = files[0];
      setEditorfile(file);
      setEditorfilechosen(1);
    }
  }


  async function onSaveEditor() {

    await onUploadDocument(editorkey, editorfile);

    setEditoropen(0);
    onFetchDocuments();
  }




  function openDocumentFile(documentitem) {
    const base = getApiBaseUrl();
    window.open(base + '/documents/' + documentitem.key + '/file', '_blank');
  }


  function downloadDocumentFile(documentitem) {
    const base = getApiBaseUrl();
    window.open(base + '/documents/' + documentitem.key + '/file?download=1', '_blank');
  }




  function openDocumentDeleteConfirmation(documentitem) {
    setDocumentdeleteconfirmationkey(documentitem.key);
    setDocumentdeleteconfirmationopen(1);
  }

  function closeDocumentDeleteConfirmation() {
    setDocumentdeleteconfirmationopen(0);
  }

  function confirmDocumentDelete() {
    setDocumentdeleteconfirmationopen(0);
    onDeleteDocument(documentdeleteconfirmationkey, 1);
  }






  async function onFetchPatchNotes() {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const skip = currentpageindex * PAGESIZE;
      const url = base + '/admin/patch-notes?take=' + PAGESIZE + '&skip=' + skip;

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

      const receivedpatchnotes = [];

      let i = 0;

      while (i < receiveddata.items.length) {

        var versionvalue = receiveddata.items[i].version;
        if (versionvalue == null) {
          versionvalue = '';
        }

        receivedpatchnotes.push({
          id: receiveddata.items[i].id,
          title: receiveddata.items[i].title,
          version: versionvalue,
          originalFilename: receiveddata.items[i].originalFilename,
          fileSizeBytes: receiveddata.items[i].fileSizeBytes,
          createdAt: receiveddata.items[i].createdAt
        });

        i = i + 1;
      }

      setPatchnotes(receivedpatchnotes);
      setPatchnotestotal(receiveddata.total);

    } catch (error) {



    }
  }






  async function onCreatePatchNote(file, title, version) {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/admin/patch-notes';

      const formdata = new FormData();
      formdata.append('file', file);
      if (title != null && title != '') {
        formdata.append('title', title);
      }
      if (version != null && version != '') {
        formdata.append('version', version);
      }

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Browser-ID': browserid
        },
        body: formdata
      });

      const responsetext = await response.text();



      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {

      }
      if (response.ok) {
        showSuccess(PATCHNOTESAVINGSUCCESS__TEXTLABEL[LANGUAGE]);
      }


    } catch (error) {



    }
  }





  async function onDeletePatchNote(patchNoteId, toast) {


    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/admin/patch-notes/' + patchNoteId;

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
      if (response.ok && toast == 1) {
        showSuccess(PATCHNOTEDELETIONSUCCESS__TEXTLABEL[LANGUAGE]);
      }


      onFetchPatchNotes();

    } catch (error) {



    }
  }



  function openCreatorEditorpatchnote() {
    setEditorpatchnotetitle('');
    setEditorpatchnoteversion('');
    setEditorpatchnotefile(null);
    setEditorpatchnotefilechosen(0);
    setEditorpatchnoteopen(1);

    var fileinput = document.getElementById('patchnotefileinput');
    if (fileinput != null) {
      fileinput.value = '';
    }
  }




  function closeEditorpatchnote() {
    setEditorpatchnoteopen(0);
  }


  function openfilepickerpatchnote() {
    var fileinput = document.getElementById('patchnotefileinput');
    if (fileinput != null) {
      fileinput.click();
    }
  }


  function onFileChosenpatchnote(chosen) {
    var files = chosen.target.files;
    if (files == null) {
      return;
    }
    if (files.length == 0) {
      return;
    }

    var file = files[0];
    setEditorpatchnotefile(file);
    setEditorpatchnotefilechosen(1);

    var filename = file.name;
    var lower = filename.toLowerCase();

    if (lower.length >= 4) {
      var ending = lower.substring(lower.length - 4);
      if (ending == '.pdf') {
        filename = filename.substring(0, filename.length - 4);
      }
    }

    setEditorpatchnotetitle(filename);
  }


  async function onSaveEditorpatchnote() {

    await onCreatePatchNote(editorpatchnotefile, editorpatchnotetitle, editorpatchnoteversion);

    setEditorpatchnoteopen(0);
    onFetchPatchNotes();
  }




  function openPatchNoteFile(patchnote) {
    const base = getApiBaseUrl();
    window.open(base + '/patch-notes/' + patchnote.id + '/file', '_blank');
  }


  function downloadPatchNoteFile(patchnote) {
    const base = getApiBaseUrl();
    window.open(base + '/patch-notes/' + patchnote.id + '/file?download=1', '_blank');
  }




  function openPatchNoteDeleteConfirmation(patchnote) {
    setPatchnotedeleteconfirmationid(patchnote.id);
    setPatchnotedeleteconfirmationopen(1);
  }

  function closePatchNoteDeleteConfirmation() {
    setPatchnotedeleteconfirmationopen(0);
  }

  function confirmPatchNoteDelete() {
    setPatchnotedeleteconfirmationopen(0);
    onDeletePatchNote(patchnotedeleteconfirmationid, 1);
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
    var lastpage = Math.ceil(patchnotestotal / PAGESIZE) - 1;
    if (lastpage < 0) {
      lastpage = 0;
    }
    if (currentpageindex < lastpage) {
      setCurrentpageindex(currentpageindex + 1);
    }
  }

  function lastpage() {
    var lastpageindex = Math.ceil(patchnotestotal / PAGESIZE) - 1;
    if (lastpageindex < 0) {
      lastpageindex = 0;
    }
    if (currentpageindex < lastpageindex) {
      setCurrentpageindex(lastpageindex);
    }
  }









  useEffect(() => {
    onFetchDocuments();
  }, []);

  useEffect(() => {
    onFetchPatchNotes();
  }, []);

  useEffect(() => {
    onFetchPatchNotes();
  }, [currentpageindex]);




  var editorfileicon = addfileicon;

  if (editorfilechosen == 1) {
    editorfileicon = fileaddedicon;
  }

  var currentpagenumber = currentpageindex + 1;
  var lastpageindex = Math.ceil(patchnotestotal / PAGESIZE) - 1;

  if (lastpageindex < 0) {
    lastpageindex = 0;
  }



  var editorpatchnotefileicon = addfileicon;

  if (editorpatchnotefilechosen == 1) {
    editorpatchnotefileicon = fileaddedicon;
  }



  return (
    <div>
      <div>
        <div style = {{width: '98%', height: '7%', position: 'absolute', top: '1vh', left: '1%', color: 'var(--text-primary)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>{DOCUMENTSSECTION__TEXTLABEL[LANGUAGE]}</span></div>
        <div style = {{width: '98%', height: '7%', position: 'absolute', top: '8vh', left: '1%', color: 'var(--text-primary)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>{DOCUMENTSSECTIONDESCRIPTION__TEXTLABEL[LANGUAGE]}</span></div>

        <div style = {{width: '98%', top: '19vh', position: 'absolute', left: '1%', display: 'flex', flexDirection: 'column', gap: '1vh', alignItems: 'center', paddingBottom: '1vh'}}>
          <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1vh', alignItems: 'center', paddingBottom: '1vh'}}>
            {documents.map((documentitem) => {


              return (

              <div key = {'document' + documentitem.key} style = {{backgroundColor: 'var(--bg-surface)', width: '80%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%', borderLeft: '6px solid var(--color-accent)', borderRadius: '16px'}}>
                <div style = {{width: '85%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh', paddingLeft: '1%'}}>
                  <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style = {{width: '70%', position: 'relative', color: 'var(--text-primary)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{preparedocumentname(documentitem.key, LANGUAGE)}</span></div>
                    <div style = {{width: '30%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-end', marginRight: '2%'}}><span>{documentitem.isUploaded == true ? concatenateexpiration(documentitem.uploadedAt) : EMPTYVALUE__TEXTLABEL[LANGUAGE]}</span></div>
                  </div>
                  <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%'}}>
                    <div style = {{backgroundColor: 'var(--color-accent-2)', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', borderRadius: '8px', paddingLeft: '1%', paddingRight: '1%'}}><span>{documentitem.isUploaded == true ? preparefilesize(documentitem.fileSizeBytes) : DOCUMENTNOTUPLOADED__TEXTLABEL[LANGUAGE]}</span></div>
                  </div>
                </div>
                <div style = {{width: '15%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '5%', alignSelf: 'stretch'}}>
                  <div onClick = {() => openDocumentFile(documentitem)} style = {{width: '32px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img src = {viewicon} style = {{width: '60%', height: '60%'}}/>
                  </div>
                  <div onClick = {() => downloadDocumentFile(documentitem)} style = {{width: '32px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img src = {downloadicon} style = {{width: '60%', height: '60%'}}/>
                  </div>
                  <div onClick = {() => openEditorEditor(documentitem)} style = {{width: '32px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img src = {editicon} style = {{width: '60%', height: '60%'}}/>
                  </div>
                  <div onClick = {() => openDocumentDeleteConfirmation(documentitem)} style = {{width: '32px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>



                    <img src = {deleteicon} style = {{width: '60%', height: '60%'}}/>
                  </div>
                </div>
              </div>

              );

            })}

          </div>




        </div>
      </div>



      {documentdeleteconfirmationopen == 1 ? (
        <div onClick = {closeDocumentDeleteConfirmation} style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'var(--color-modal-backdrop)', backdropFilter: 'blur(4px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div onClick = {(event) => event.stopPropagation()} style = {{backgroundColor: 'var(--bg-surface)', width: '50%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2vw', paddingRight: '2vw'}}>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '24px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>{DOCUMENTDELETECONFIRMATIONTITLE__TEXTLABEL[LANGUAGE]}</span></div>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '2vh'}}><span>{DOCUMENTDELETECONFIRMATIONTEXT__TEXTLABEL[LANGUAGE]}</span></div>

            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2.5%', marginTop: '2vh'}}>
              <Button onClick = {closeDocumentDeleteConfirmation} style = {{width: '15%', height: '5vh'}} variant = "secondary">{CANCELBUTTON__TEXTLABEL[LANGUAGE]}</Button>
              <Button onClick = {confirmDocumentDelete} style = {{width: '15%', height: '5vh'}} variant = "primary">{CONFIRMBUTTON__TEXTLABEL[LANGUAGE]}</Button>
            </div>

          </div>
        </div>
      ) : null}




      {editoropen == 1 ? (
        <div onClick = {closeEditor} style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'var(--color-modal-backdrop)', backdropFilter: 'blur(4px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div onClick = {(event) => event.stopPropagation()} style = {{backgroundColor: 'var(--bg-surface)', width: '50%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', paddingTop: '1vh', paddingBottom: '2vh', paddingLeft: '2vw', paddingRight: '2vw'}}>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '24px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>{editortitletext}</span></div>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '2vh'}}><span>{PDFFILELABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <div onClick = {openfilepickerdocument} style = {{width: '64px', height: '64px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2vh', cursor: 'pointer'}}>
              <img src = {editorfileicon} style = {{width: '100%', height: '100%'}}/>
            </div>
            <input id = "documentfileinput" type = "file" accept = "application/pdf,.pdf" onChange = {onFileChosen} style = {{display: 'none'}}/>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '2.5vh'}}><span>{FILENAMELABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '1vh'}}><span>{editorfilename}</span></div>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '2.5vh'}}><span>{FILESIZELABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '1vh'}}><span>{editorfilesize}</span></div>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '2.5vh'}}><span>{FILEDATELABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '1vh'}}><span>{editorfiledate}</span></div>

            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2.5%', marginTop: '2vh'}}>
              <Button onClick = {closeEditor} style = {{width: '15%', height: '5vh'}} variant = "secondary">{CANCELBUTTON__TEXTLABEL[LANGUAGE]}</Button>
              <Button onClick = {onSaveEditor} style = {{width: '15%', height: '5vh'}} variant = "primary">{UPLOADBUTTON__TEXTLABEL[LANGUAGE]}</Button>
            </div>
          </div>
        </div>
      ) : null}







      <div style = {{width: '96%', height: '7%', position: 'absolute', top: '56vh', left: '1%', color: 'var(--text-primary)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><Divider className="group-main-subpage__divider" /></div>

      <div>
        <div style = {{width: '98%', height: '7%', position: 'absolute', top: '62vh', left: '1%', color: 'var(--text-primary)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>{PATCHNOTESSECTION__TEXTLABEL[LANGUAGE]}</span></div>
        <div style = {{width: '98%', height: '7%', position: 'absolute', top: '68vh', left: '1%', color: 'var(--text-primary)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>{PATCHNOTESSECTIONDESCRYPTION__TEXTLABEL[LANGUAGE]}</span></div>

        <div style = {{width: '98%', top: '73vh', position: 'absolute', left: '1%', display: 'flex', flexDirection: 'column', gap: '1vh', alignItems: 'center', paddingBottom: '1vh'}}>
          <div style = {{width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '1%', marginTop: '2vh'}}>
            <Button onClick = {openCreatorEditorpatchnote} style = {{width: '15%', height: '5vh', marginBottom: '2vh'}} variant = "primary">{NEWPATCHNOTEBUTTON__TEXTLABEL[LANGUAGE]}</Button>
          </div>

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
            {patchnotes.map((patchnote) => (

              <div key = {'patchnote' + patchnote.id} style = {{backgroundColor: 'var(--bg-surface)', width: '80%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%', borderLeft: '6px solid var(--color-accent)', borderRadius: '16px'}}>
                <div style = {{width: '90%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh', paddingLeft: '1%'}}>
                  <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style = {{width: '70%', position: 'relative', color: 'var(--text-primary)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{patchnote.title}</span></div>
                    <div style = {{width: '30%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-end', marginRight: '2%'}}><span>{concatenateexpiration(patchnote.createdAt)}</span></div>
                  </div>
                  <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%'}}>
                    <div style = {{backgroundColor: 'var(--color-accent-2)', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', borderRadius: '8px', paddingLeft: '1%', paddingRight: '1%'}}><span>{patchnote.version}</span></div>
                  </div>
                </div>
                <div style = {{width: '10%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '5%', alignSelf: 'stretch'}}>
                  <div onClick = {() => openPatchNoteFile(patchnote)} style = {{width: '32px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img src = {viewicon} style = {{width: '60%', height: '60%'}}/>
                  </div>
                  <div onClick = {() => downloadPatchNoteFile(patchnote)} style = {{width: '32px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img src = {downloadicon} style = {{width: '60%', height: '60%'}}/>
                  </div>
                  <div onClick = {() => openPatchNoteDeleteConfirmation(patchnote)} style = {{width: '32px', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>



                    <img src = {deleteicon} style = {{width: '60%', height: '60%'}}/>
                  </div>
                </div>
              </div>

            ))}

          </div>




        </div>
      </div>



      {patchnotedeleteconfirmationopen == 1 ? (
        <div onClick = {closePatchNoteDeleteConfirmation} style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'var(--color-modal-backdrop)', backdropFilter: 'blur(4px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div onClick = {(event) => event.stopPropagation()} style = {{backgroundColor: 'var(--bg-surface)', width: '50%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2vw', paddingRight: '2vw'}}>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '24px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>{PATCHNOTEDELETECONFIRMATIONTITLE__TEXTLABEL[LANGUAGE]}</span></div>


            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '2vh'}}><span>{PATCHNOTEDELETECONFIRMATIONTEXT__TEXTLABEL[LANGUAGE]}</span></div>

            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2.5%', marginTop: '2vh'}}>
              <Button onClick = {closePatchNoteDeleteConfirmation} style = {{width: '15%', height: '5vh'}} variant = "secondary">{CANCELBUTTON__TEXTLABEL[LANGUAGE]}</Button>
              <Button onClick = {confirmPatchNoteDelete} style = {{width: '15%', height: '5vh'}} variant = "primary">{CONFIRMBUTTON__TEXTLABEL[LANGUAGE]}</Button>
            </div>

          </div>

        </div>
      ) : null}




      {editorpatchnoteopen == 1 ? (
        <div onClick = {closeEditorpatchnote} style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'var(--color-modal-backdrop)', backdropFilter: 'blur(4px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div onClick = {(event) => event.stopPropagation()} style = {{backgroundColor: 'var(--bg-surface)', width: '50%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', paddingTop: '1vh', paddingBottom: '2vh', paddingLeft: '2vw', paddingRight: '2vw'}}>
            <div style = {{width: '100%', position: 'relative', color: 'var(--text-primary)', fontSize: '24px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>{CREATEPATCHNOTETITLE__TEXTLABEL[LANGUAGE]}</span></div>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '2vh'}}><span>{PDFFILELABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <div onClick = {openfilepickerpatchnote} style = {{width: '64px', height: '64px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2vh', cursor: 'pointer'}}>
              <img src = {editorpatchnotefileicon} style = {{width: '100%', height: '100%'}}/>
            </div>
            <input id = "patchnotefileinput" type = "file" accept = "application/pdf,.pdf" onChange = {onFileChosenpatchnote} style = {{display: 'none'}}/>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '2.5vh'}}><span>{TITLELABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <input onChange = {(event) => setEditorpatchnotetitle(event.target.value)} style = {{backgroundColor: 'var(--bg-elevated)', width: '50%', height: '5vh', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', borderRadius: '8px', paddingLeft: '1%', marginTop: '1vh'}} value = {editorpatchnotetitle} onFocus = {(event) => (event.target.style.border = '2px solid var(--accent)')} onBlur = {(event) => (event.target.style.border = '')}></input>

            <div style = {{width: '100%', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', marginTop: '2.5vh'}}><span>{VERSIONLABEL__TEXTLABEL[LANGUAGE]}</span></div>
            <input onChange = {(event) => setEditorpatchnoteversion(event.target.value)} style = {{backgroundColor: 'var(--bg-elevated)', width: '25%', height: '5vh', position: 'relative', color: 'var(--text-secondary)', fontSize: '14px', borderRadius: '8px', paddingLeft: '1%', marginTop: '1vh'}} value = {editorpatchnoteversion} onFocus = {(event) => (event.target.style.border = '2px solid var(--accent)')} onBlur = {(event) => (event.target.style.border = '')}></input>

            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2.5%', marginTop: '2vh'}}>
              <Button onClick = {closeEditorpatchnote} style = {{width: '15%', height: '5vh'}} variant = "secondary">{CANCELBUTTON__TEXTLABEL[LANGUAGE]}</Button>
              <Button onClick = {onSaveEditorpatchnote} style = {{width: '15%', height: '5vh'}} variant = "primary">{UPLOADBUTTON__TEXTLABEL[LANGUAGE]}</Button>
            </div>
          </div>
        </div>
      ) : null}













    </div>
  )
}
