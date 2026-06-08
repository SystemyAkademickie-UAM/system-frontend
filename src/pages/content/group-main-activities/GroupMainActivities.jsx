import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getApiBaseUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../api-test/mock/browserIdStorage.js';
import {useAppRole} from '../../../context/AppRoleContext.jsx';
import {APP_ROLE} from '../../../navigation/shellTemplates.config.js';

import { PUBLIC_UI_ICONS } from '../../../constants/publicUiIcons.js';
import GroupMainActivitiesWindow from './GroupMainActivitiesWindow.jsx';

const arrowrighticon = PUBLIC_UI_ICONS.arrowRight;
const arrowlefticon = PUBLIC_UI_ICONS.arrowLeft;
const arrowcirclerighticon = PUBLIC_UI_ICONS.arrowCircleRight;
const editicon = PUBLIC_UI_ICONS.info;
const lefticon = PUBLIC_UI_ICONS.chevronLeft;
const leftlefticon = PUBLIC_UI_ICONS.chevronLeftDouble;
const righticon = PUBLIC_UI_ICONS.chevronRight;
const rightrighticon = PUBLIC_UI_ICONS.chevronRightDouble;
const unlockedicon = PUBLIC_UI_ICONS.unlocked;
const lockedicon = PUBLIC_UI_ICONS.locked;


export default function GroupMainActivities() {

  const {groupId} = useParams();
  const {role} = useAppRole();
  const [errorMessage, setErrorMessage] = useState('');

  const [stages, setStages] = useState([]);
  const [currentstageindex, setCurrentstageindex] = useState(0);
  const [whichfirst, setWhichfirst] = useState(0);
  const [completedids, setCompletedids] = useState([]);
  const [windowopen, setWindowopen] = useState(0);
  const [selectedactivityid, setSelectedactivityid] = useState(0);
  const [selectedactivityname, setSelectedactivityname] = useState('');


  async function onFetchStages() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/stages';

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify({
          method: 'retrieve',
          groupId: groupId
        })
      });

      const responsetext = await response.text();

      console.log('POST /stages retrieve: ', response.status);
      console.log('POST /stages retrieve: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/stages retrieve not JSON: ' + responsetext);
      }

      console.log('POST /stages retrieve JSON:', data);

      let receiveddata = data;

      const receivedstages = [];

      let i = 0;

      while (i < receiveddata.stages.length) {

        receivedstages.push({id: receiveddata.stages[i].id, name: receiveddata.stages[i].name, activities: []});

        i = i + 1;
      }

      setStages(receivedstages);

      i = 0;

      while (i < receivedstages.length) {

        onFetchActivities(receivedstages[i].id);

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





  async function onFetchActivities(stageId) {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/activities';

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify({
          method: 'retrieve',
          stageId: stageId
        })
      });

      const responsetext = await response.text();

      console.log('POST /activities: ', response.status);
      console.log('POST /activities: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/activities not JSON: ' + responsetext);
      }

      console.log('POST /activities JSON:', data);

      let receiveddata = data;

      setStages(function (prevStages) {

        const newstages = [];

        let i = 0;

        while (i < prevStages.length) {

          if (prevStages[i].id == stageId) {

            const newactivities = [];

            let j = 0;

            while (j < receiveddata.activities.length) {

              newactivities.push({id: receiveddata.activities[j].id, name: receiveddata.activities[j].name, description0: receiveddata.activities[j].storyDescription, description1: receiveddata.activities[j].educationalDescription, reward: receiveddata.activities[j].currency, unlocked: 1});

              j = j + 1;
            }

            newstages.push({id: prevStages[i].id, name: prevStages[i].name, activities: newactivities});

          } else {

            newstages.push(prevStages[i]);
          }

          i = i + 1;
        }

        return newstages;
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





  async function onFetchStudentProfile() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/student-profile';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/student-profile: ', response.status);
      console.log('GET /groups/' + groupId + '/student-profile: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/student-profile not JSON: ' + responsetext);
      }

      console.log('GET /groups/' + groupId + '/student-profile JSON:', data);

      let receiveddata = data;

      if (receiveddata.completedActivities) {

        const newcompletedids = [];

        let i = 0;

        while (i < receiveddata.completedActivities.length) {

          newcompletedids.push(receiveddata.completedActivities[i].id);

          i = i + 1;
        }

        setCompletedids(newcompletedids);
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





  function assign(activityId) {

    var activitynamevalue = '';

    if (stages.length > 0 && currentstageindex < stages.length) {

      let i = 0;

      while (i < stages[currentstageindex].activities.length) {

        if (stages[currentstageindex].activities[i].id == activityId) {
          activitynamevalue = stages[currentstageindex].activities[i].name;
        }

        i = i + 1;
      }

    }

    setSelectedactivityid(activityId);
    setSelectedactivityname(activitynamevalue);
    setWindowopen(1);
  }




  function closewindow() {
    setWindowopen(0);
  }





  function firststage() {
    if (currentstageindex > 0) {
      setCurrentstageindex(0);
    }
  }





  function previousstage() {
    if (currentstageindex > 0) {
      setCurrentstageindex(currentstageindex - 1);
    }
  }





  function nextstage() {
    if (currentstageindex < stages.length - 1) {
      setCurrentstageindex(currentstageindex + 1);
    }
  }





  function laststage() {
    if (currentstageindex < stages.length - 1) {
      setCurrentstageindex(stages.length - 1);
    }
  }





  function togglewhichfirst() {
    if (whichfirst == 0) {
      setWhichfirst(1);
    } else {
      setWhichfirst(0);
    }
  }





  useEffect(() => {
    onFetchStages();
  }, []);

  useEffect(() => {
    if (role == APP_ROLE.STUDENT) {
      onFetchStudentProfile();
    }
  }, [role]);





  var currentstagename = '';
  var activities = [];
  var totalactivities = 0;
  var totalrewards = 0;
  var completedcount = 99;
  var earnedrewards = 99;
  var completedactivities = [];
  var incompleteactivities = [];
  var displayactivities = [];
  var whichfirstlabel = 'Ukończone na początku';
  var isstudent = 0;
  var islecturer = 0;
  var atfirststage = 1;
  var atlaststage = 1;
  var currentpagenumber = 0;

  if (role == APP_ROLE.STUDENT) {
    isstudent = 1;
  }

  if (role == APP_ROLE.LECTURER) {
    islecturer = 1;
  }

  if (whichfirst == 1) {
    whichfirstlabel = 'Ukończone na końcu';
  }

  if (stages.length > 0 && currentstageindex < stages.length) {

    currentstagename = stages[currentstageindex].name;
    activities = stages[currentstageindex].activities;
    totalactivities = activities.length;
    currentpagenumber = currentstageindex + 1;

    if (currentstageindex > 0) {
      atfirststage = 0;
    }

    if (currentstageindex < stages.length - 1) {
      atlaststage = 0;
    }

    var i = 0;

    while (i < activities.length) {

      totalrewards = totalrewards + activities[i].reward;

      i = i + 1;
    }

    if (isstudent == 1) {

      completedcount = 0;
      earnedrewards = 0;

      i = 0;

      while (i < activities.length) {

        var iscompleted = 0;

        var j = 0;

        while (j < completedids.length) {

          if (completedids[j] == activities[i].id) {
            iscompleted = 1;
          }

          j = j + 1;
        }

        if (iscompleted == 1) {
          completedcount = completedcount + 1;
          earnedrewards = earnedrewards + activities[i].reward;
          completedactivities.push({id: activities[i].id, name: activities[i].name, description0: activities[i].description0, description1: activities[i].description1, reward: activities[i].reward, unlocked: 1, bordercolour: 'rgb(66, 243, 125)'});
        } else {
          incompleteactivities.push({id: activities[i].id, name: activities[i].name, description0: activities[i].description0, description1: activities[i].description1, reward: activities[i].reward, unlocked: 0, bordercolour: 'rgb(128, 128, 128)'});
        }

        i = i + 1;
      }



      if (whichfirst == 0) {

        i = 0;

        while (i < completedactivities.length) {
          displayactivities.push(completedactivities[i]);
          i = i + 1;
        }

        i = 0;

        while (i < incompleteactivities.length) {
          displayactivities.push(incompleteactivities[i]);
          i = i + 1;
        }

      } else {

        i = 0;

        while (i < incompleteactivities.length) {
          displayactivities.push(incompleteactivities[i]);
          i = i + 1;
        }

        i = 0;

        while (i < completedactivities.length) {
          displayactivities.push(completedactivities[i]);
          i = i + 1;
        }

      }

    } else {

      i = 0;

      while (i < activities.length) {
        displayactivities.push({id: activities[i].id, name: activities[i].name, description0: activities[i].description0, description1: activities[i].description1, reward: activities[i].reward, bordercolour: 'rgb(66, 243, 125)'});
        i = i + 1;
      }

    }

  }





  return (
    <div>
      <div style = {{width: '96%', height: '7%', position: 'absolute', top: '44vh', left: '3%', color: 'rgb(227, 224, 247)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <div style = {{width: '100%', height: '7%', position: 'absolute', top: '1vh', left: '-1%', color: 'rgb(227, 224, 247)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{currentstagename}</span></div>
        <div style = {{width: '49%', height: '5%', position: 'absolute', top: '5vh', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>{isstudent == 1 ? (<span>{completedcount} / {totalactivities} aktywności ukończonych</span>) : (<span>{totalactivities} aktywności</span>)}</div>
        <div style = {{width: '49%', height: '5%', position: 'absolute', top: '5vh', left: '50%', color: 'rgb(187, 203, 185)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-end', paddingRight: '1%'}}>{isstudent == 1 ? (<span>Zdobyto: {earnedrewards} / {totalrewards}</span>) : (<span>{totalrewards} możliwych do zdobycia</span>)}</div>


        <div style = {{width: '98%', top: '9vh', position: 'absolute', left: '0%', display: 'flex', flexDirection: 'column', gap: '1vh', alignItems: 'center', paddingBottom: '1vh'}}>
        <div style = {{width: '100%', top: '1%', position: 'relative', left: '0%', display: 'flex', flexDirection: 'column', gap: '1vh', alignItems: 'center', paddingBottom: '1vh'}}>


          {displayactivities.map((activity) => (

            <div key = {'activity' + activity.id} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%', borderLeft: '4px solid ' + activity.bordercolour, borderRadius: '16px'}}>
              {islecturer == 1 ? (
                <img src = {arrowcirclerighticon} style = {{width: '4%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}/>
              ) : (
                <img src = {activity.unlocked == 1 ? unlockedicon : lockedicon} style = {{width: '4%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}/>
              )}
              <div style = {{width: '85%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh', paddingLeft: '2%'}}>
                <div style = {{width: '100%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{activity.name}</span></div>
                <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden'}}>{activity.description0}</span></div>
                <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden'}}>{activity.description1}</span></div>
              </div>
              {islecturer == 1 ? (
                <div style = {{width: '10%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '5%'}}>
                  <div onClick = {() => assign(activity.id)} style = {{width: '50%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img src = {editicon} style = {{width: '30%', height: '25%'}}/>
                  </div>
                  <div style = {{width: '45%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>{activity.reward}</span></div>
                </div>
              ) : (
                <div style = {{width: '10%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>{activity.reward}</span></div>
              )}
            </div>

          ))}


        </div>

        <div style = {{width: '100%', height: '10vh', position: 'relative', top: '2%', left: '0%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '2%'}}>
          <div onClick = {atfirststage == 0 ? firststage : undefined} style = {{backgroundColor: 'rgb(26, 26, 42)', height: '70%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: atfirststage == 0 ? 'pointer' : 'default', opacity: atfirststage == 0 ? 1 : 0.5}}>
            <img src = {leftlefticon} style = {{width: '50%', height: '50%'}}/>
          </div>
          <div onClick = {atfirststage == 0 ? previousstage : undefined} style = {{backgroundColor: 'rgb(26, 26, 42)', height: '70%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: atfirststage == 0 ? 'pointer' : 'default', opacity: atfirststage == 0 ? 1 : 0.5}}>
            <img src = {lefticon} style = {{width: '50%', height: '50%'}}/>
          </div>
          <div style = {{backgroundColor: 'rgb(26, 26, 42)', height: '70%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'rgb(227, 224, 247)', fontSize: '18px', fontWeight: 900}}><span>{currentpagenumber}</span></div>
          <div onClick = {atlaststage == 0 ? nextstage : undefined} style = {{backgroundColor: 'rgb(26, 26, 42)', height: '70%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: atlaststage == 0 ? 'pointer' : 'default', opacity: atlaststage == 0 ? 1 : 0.5}}>
            <img src = {righticon} style = {{width: '40%', height: '40%'}}/>
          </div>
          <div onClick = {atlaststage == 0 ? laststage : undefined} style = {{backgroundColor: 'rgb(26, 26, 42)', height: '70%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: atlaststage == 0 ? 'pointer' : 'default', opacity: atlaststage == 0 ? 1 : 0.5}}>
            <img src = {rightrighticon} style = {{width: '50%', height: '50%'}}/>
          </div>
        </div>

        {isstudent == 1 ? (
          <div onClick = {togglewhichfirst} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '20%', height: '5vh', position: 'relative', top: '2%', left: '39%', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}><span>{whichfirstlabel}</span></div>
        ) : null}

</div>
      </div>

      {windowopen == 1 ? (
        <GroupMainActivitiesWindow popupclose = {closewindow} groupId = {groupId} stagename = {currentstagename} activityname = {selectedactivityname} activityid = {selectedactivityid} />
      ) : null}
    </div>
  )
}


