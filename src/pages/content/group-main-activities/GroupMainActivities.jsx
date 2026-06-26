import {useState, useEffect, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {getApiBaseUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../../../auth/browserIdStorage.js';
import {useAppRole} from '../../../context/AppRoleContext.jsx';
import {APP_ROLE} from '../../../navigation/shellTemplates.config.js';

import { Button } from '../../../components/ui/index.js';
import { PUBLIC_UI_ICONS } from '../../../constants/publicUiIcons.js';
import GroupMainSubpageHeader from '../group-main/shared/GroupMainSubpageHeader.jsx';
import GroupMainEmptyNotice from '../../../components/group-main/GroupMainEmptyNotice.jsx';
import { useGroupMainEmptyLink } from '../../../hooks/group-main/useGroupMainEmptyLink.js';
import '../group-main/GroupMainHomeContent.css';
import GroupMainActivitiesWindow from './GroupMainActivitiesWindow.jsx';
import '../group-main/shared/groupMainSubpageHeader.css';
import './GroupMainActivities.css';

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
  const emptyLink = useGroupMainEmptyLink('activities', groupId);
  const [errorMessage, setErrorMessage] = useState('');

  const [stages, setStages] = useState([]);
  const [hasLoadedStages, setHasLoadedStages] = useState(false);
  const [currentstageindex, setCurrentstageindex] = useState(0);
  const [whichfirst, setWhichfirst] = useState(0);
  const [completedids, setCompletedids] = useState([]);
  const [windowopen, setWindowopen] = useState(0);
  const [selectedactivityid, setSelectedactivityid] = useState(0);
  const [selectedactivityname, setSelectedactivityname] = useState('');


  const onFetchStages = useCallback(async () => {
    if (!groupId) return;

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
          groupId: Number(groupId),
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

      const receivedstages = (data?.stages ?? []).map((stage) => ({
          id: stage.id,
          name: stage.name,
          activities: [],
        }));

      setStages(receivedstages);

      receivedstages.forEach((stage) => {
        onFetchActivities(stage.id);
      });

      setHasLoadedStages(true);

    } catch (error) {

      let message;

      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }

      setErrorMessage(message);
      setHasLoadedStages(true);
    }
  }, [groupId]);





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

            const activitiesList = receiveddata?.activities ?? [];

            while (j < activitiesList.length) {

              newactivities.push({id: activitiesList[j].id, name: activitiesList[j].name, description0: activitiesList[j].storyDescription, description1: activitiesList[j].educationalDescription, reward: activitiesList[j].currency, unlocked: 1});

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
  }, [onFetchStages]);

  useEffect(() => {
    if (!groupId || role !== APP_ROLE.STUDENT) return;
    onFetchStudentProfile();
  }, [groupId, role]);





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
    <section className="group-main-activities" aria-label="Aktywności">
      <GroupMainSubpageHeader
        eyebrow="Kampania"
        title="Aktywności"
      />

      {errorMessage ? (
        <p className="group-main-posts__error" role="alert">{errorMessage}</p>
      ) : null}

      {!hasLoadedStages ? (
        <p className="group-main-home__message">Ładowanie aktywności…</p>
      ) : stages.length === 0 ? (
        <GroupMainEmptyNotice
          message={emptyLink.message}
          linkLabel={emptyLink.linkLabel}
          linkTo={emptyLink.linkTo}
        />
      ) : (
      <div className="group-main-activities__stage">
        <header className="group-main-activities__stage-header">
          <h2 className="group-main-activities__stage-name">{currentstagename}</h2>
          <div className="group-main-activities__stage-stats">
            <span>
              {isstudent === 1
                ? `${completedcount} / ${totalactivities} aktywności ukończonych`
                : `${totalactivities} aktywności`}
            </span>
            <span>
              {isstudent === 1
                ? `Zdobyto: ${earnedrewards} / ${totalrewards}`
                : `${totalrewards} możliwych do zdobycia`}
            </span>
          </div>
        </header>

        <div className="group-main-activities__list">
          {displayactivities.map((activity) => (
            <article
              key={`activity${activity.id}`}
              className="group-main-activities__item"
              style={{ borderLeftColor: activity.bordercolour }}
            >
              <img
                className="group-main-activities__item-icon"
                src={islecturer === 1 ? arrowcirclerighticon : (activity.unlocked === 1 ? unlockedicon : lockedicon)}
                alt=""
              />
              <div className="group-main-activities__item-body">
                <h3 className="group-main-activities__item-name">{activity.name}</h3>
                <p className="group-main-activities__item-desc">{activity.description0}</p>
                <p className="group-main-activities__item-desc">{activity.description1}</p>
              </div>
              {islecturer === 1 ? (
                <div className="group-main-activities__item-actions">
                  <button
                    type="button"
                    className="group-main-activities__assign-btn"
                    onClick={() => assign(activity.id)}
                    aria-label="Przypisz aktywność"
                  >
                    <img src={editicon} alt="" />
                  </button>
                  <span className="group-main-activities__item-reward">{activity.reward}</span>
                </div>
              ) : (
                <span className="group-main-activities__item-reward">{activity.reward}</span>
              )}
            </article>
          ))}
        </div>

        <div className="group-main-activities__pagination">
          <button
            type="button"
            className="group-main-activities__page-btn"
            onClick={atfirststage === 0 ? firststage : undefined}
            disabled={atfirststage !== 0}
            aria-label="Pierwszy etap"
          >
            <img src={leftlefticon} alt="" />
          </button>
          <button
            type="button"
            className="group-main-activities__page-btn"
            onClick={atfirststage === 0 ? previousstage : undefined}
            disabled={atfirststage !== 0}
            aria-label="Poprzedni etap"
          >
            <img src={lefticon} alt="" />
          </button>
          <span className="group-main-activities__page-number">{currentpagenumber}</span>
          <button
            type="button"
            className="group-main-activities__page-btn"
            onClick={atlaststage === 0 ? nextstage : undefined}
            disabled={atlaststage !== 0}
            aria-label="Następny etap"
          >
            <img src={righticon} alt="" />
          </button>
          <button
            type="button"
            className="group-main-activities__page-btn"
            onClick={atlaststage === 0 ? laststage : undefined}
            disabled={atlaststage !== 0}
            aria-label="Ostatni etap"
          >
            <img src={rightrighticon} alt="" />
          </button>
        </div>

        {isstudent === 1 ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            className="group-main-activities__sort-toggle"
            onClick={togglewhichfirst}
          >
            {whichfirstlabel}
          </Button>
        ) : null}
      </div>
      )}

      {windowopen === 1 ? (
        <GroupMainActivitiesWindow
          popupclose={closewindow}
          groupId={groupId}
          stagename={currentstagename}
          activityname={selectedactivityname}
          activityid={selectedactivityid}
        />
      ) : null}
    </section>
  );
}
