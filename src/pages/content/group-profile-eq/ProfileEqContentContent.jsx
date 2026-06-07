import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl, getSamlLoginUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';

import itemicon from '../../../../public/assets/icons/arrow-circle-right-svgrepo-com.svg';
import infoicon from '../../../../public/assets/icons/info-circle-svgrepo-com.svg';
import copyicon from '../../../../public/assets/icons/copy-01-svgrepo-com.svg';
import editicon from '../../../../public/assets/icons/edit-02-svgrepo-com.svg';
import deleteicon from '../../../../public/assets/icons/trash-01-svgrepo-com.svg';

export default function App() {

  const {groupId} = useParams();
  const [errorMessage, setErrorMessage] = useState('');

  const [stages, setStages] = useState([]);
  const [stagename, setStageName] = useState('');


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
          groupId: Number(groupId)
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

        receivedstages.push({id: receiveddata.stages[i].id, name: receiveddata.stages[i].name, activities: [], tempactivities: [], editmode: 0, open: 'none'});

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

              newactivities.push({id: receiveddata.activities[j].id, name: receiveddata.activities[j].name, description0: receiveddata.activities[j].storyDescription, description1: receiveddata.activities[j].educationalDescription, reward: receiveddata.activities[j].currency,  editmode: 0});

              j = j + 1;
            }

            newstages.push({id: prevStages[i].id, name: prevStages[i].name, activities: newactivities, tempactivities: prevStages[i].tempactivities, editmode: prevStages[i].editmode, open: prevStages[i].open});

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





  async function createstage(name) {

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
          method: 'post',
          groupId: Number(groupId),
          name: name
        })
      });

      const responsetext = await response.text();

      console.log('POST /stages post: ', response.status);
      console.log('POST /stages post: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/stages post not JSON: ' + responsetext);
      }

      console.log('POST /stages post JSON:', data);

      onFetchStages();

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





  async function createactivity(stageId, name, reward, description0, description1) {

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
          method: 'post',
          stageId: stageId,
          name: name,
          currency: reward,
          educationalDescription: description1,
          storyDescription: description0
        })
      });

      const responsetext = await response.text();

      console.log('POST /activities post: ', response.status);
      console.log('POST /activities post: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/activities post not JSON: ' + responsetext);
      }

      console.log('POST /activities post JSON:', data);

      onFetchActivities(stageId);

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





  async function updateactivity(activityId, name, reward, description0, description1) {

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
          method: 'modify',
          activityId: activityId,
          name: name,
          currency: Number(reward),
          educationalDescription: description1,
          storyDescription: description0
        })
      });

      const responsetext = await response.text();

      console.log('POST /activities modify: ', response.status);
      console.log('POST /activities modify: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/activities modify not JSON: ' + responsetext);
      }

      console.log('POST /activities modify JSON:', data);

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


  async function copystage(stageId) {
    setErrorMessage('');

    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      let copiedstage = null;

      let i = 0;
      while (i < stages.length) {

        if (stages[i].id == stageId) {
          copiedstage = stages[i];
        }

        i = i + 1;
      }



      const response = await fetch(base + '/stages', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify({
          method: 'post',
          groupId: Number(groupId),
          name: copiedstage.name
        })
      });

      const responsetext = await response.text();

      console.log('POST /stages: ', response.status);
      console.log('POST /stages: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/stages not JSON: ' + responsetext);
      }

      console.log('POST /stages JSON:', data);

      if (data.stage > 0) {

        let newstageid = data.stage;

        i = 0;
        while (i < copiedstage.activities.length) {

          await fetch(base + '/activities', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-Browser-ID': browserid
            },
            body: JSON.stringify({
              method: 'post',
              stageId: newstageid,
              name: copiedstage.activities[i].name,
              currency: copiedstage.activities[i].reward,
              educationalDescription: copiedstage.activities[i].description1,
              storyDescription: copiedstage.activities[i].description0
            })
          });

          i = i + 1;
        }

        onFetchStages();
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


  async function deletestage(stageId) {

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
          method: 'remove',
          stageId: stageId
        })
      });

      const responsetext = await response.text();

      console.log('POST /stages remove: ', response.status);
      console.log('POST /stages remove: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/stages remove not JSON: ' + responsetext);
      }

      console.log('POST /stages remove JSON:', data);

      onFetchStages();

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





  async function updatestage(stageId, name) {

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
          method: 'modify',
          stageId: stageId,
          name: name
        })
      });

      const responsetext = await response.text();

      console.log('POST /stages modify: ', response.status);
      console.log('POST /stages modify: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/stages modify not JSON: ' + responsetext);
      }

      console.log('POST /stages modify JSON:', data);

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





  function editstage(stageId) {

    let stagenamevalue = null;

    const newstages = [];

    let i = 0;

    while (i < stages.length) {

      if (stages[i].id == stageId) {

        let updatedstage = {id: stages[i].id, name: stages[i].name, activities: stages[i].activities, tempactivities: stages[i].tempactivities, editmode: stages[i].editmode, open: stages[i].open};

        if (stages[i].editmode == 0) {
          updatedstage.editmode = 1;
        } else if (stages[i].editmode == 1) {
          updatedstage.editmode = 0;
          stagenamevalue = stages[i].name;
        }

        newstages.push(updatedstage);

      } else {
        newstages.push(stages[i]);
      }

      i = i + 1;
    }

    setStages(newstages);

    if (stagenamevalue != null) {
      updatestage(stageId, stagenamevalue);
    }
  }





  function onStageChange(stageId, value) {

    const newstages = [];

    let i = 0;

    while (i < stages.length) {

      if (stages[i].id == stageId) {

        let updatedstage = {id: stages[i].id, name: stages[i].name, activities: stages[i].activities, tempactivities: stages[i].tempactivities, editmode: stages[i].editmode, open: stages[i].open};

        updatedstage.name = value;

        newstages.push(updatedstage);

      } else {
        newstages.push(stages[i]);
      }

      i = i + 1;
    }

    setStages(newstages);
  }





  function togglestage(stageId) {

    let newstages = [];

    let i = 0;
    while (i < stages.length) {

      if (stages[i].id == stageId) {

        let newstage = {
          id: stages[i].id,
          name: stages[i].name,
          activities: stages[i].activities,
          tempactivities: stages[i].tempactivities,
          editmode: stages[i].editmode,
          open: ''
        };

        if (stages[i].open == '') {
          newstage.open = 'none';
        } else {
          newstage.open = '';
        }

        newstages.push(newstage);
      } else {

        newstages.push(stages[i]);
      }
      i = i + 1;
    }

    setStages(newstages);
  }





  function addactivity(stageId) {

    const newstages = [];

    let i = 0;

    while (i < stages.length) {

      if (stages[i].id == stageId) {

        const newtemp = [];

        let j = 0;

        while (j < stages[i].tempactivities.length) {
          newtemp.push(stages[i].tempactivities[j]);
          j = j + 1;
        }

        const newactivity = {id: stages[i].tempactivities.length, name: '', description0: '', description1: '', reward: '', editmode: 2};

        newtemp.push(newactivity);

        newstages.push({id: stages[i].id, name: stages[i].name, activities: stages[i].activities, tempactivities: newtemp, editmode: stages[i].editmode, open: stages[i].open});

      } else {
        newstages.push(stages[i]);
      }

      i = i + 1;
    }

    setStages(newstages);
  }





  function editactivity(stageId, activityId, temporary = 0) {

    if (temporary == 0) {

      let activitytosave = null;

      const newstages = [];

      let i = 0;

      while (i < stages.length) {

        if (stages[i].id == stageId) {

          const newactivities = [];

          let j = 0;

          while (j < stages[i].activities.length) {

            if (stages[i].activities[j].id == activityId) {

              let updatedactivity = {id: stages[i].activities[j].id, name: stages[i].activities[j].name, description0: stages[i].activities[j].description0, description1: stages[i].activities[j].description1, reward: stages[i].activities[j].reward, editmode: stages[i].activities[j].editmode};

              if (stages[i].activities[j].editmode == 0) {
                updatedactivity.editmode = 1;
              } else if (stages[i].activities[j].editmode == 1) {
                updatedactivity.editmode = 0;
                activitytosave = updatedactivity;
              }

              newactivities.push(updatedactivity);

            } else {
              newactivities.push(stages[i].activities[j]);
            }

            j = j + 1;
          }

          newstages.push({id: stages[i].id, name: stages[i].name, activities: newactivities, tempactivities: stages[i].tempactivities, editmode: stages[i].editmode, open: stages[i].open});

        } else {
          newstages.push(stages[i]);
        }

        i = i + 1;
      }

      setStages(newstages);

      if (activitytosave != null) {
        updateactivity(activitytosave.id, activitytosave.name, activitytosave.reward, activitytosave.description0, activitytosave.description1);
      }

    } else {

      let movingactivity = null;

      const newstages = [];

      let i = 0;

      while (i < stages.length) {

        if (stages[i].id == stageId) {

          const newtemp = [];

          let j = 0;

          while (j < stages[i].tempactivities.length) {

            if (stages[i].tempactivities[j].id == activityId) {
              movingactivity = stages[i].tempactivities[j];
            } else {
              newtemp.push(stages[i].tempactivities[j]);
            }

            j = j + 1;
          }

          newstages.push({id: stages[i].id, name: stages[i].name, activities: stages[i].activities, tempactivities: newtemp, editmode: stages[i].editmode, open: stages[i].open});

        } else {
          newstages.push(stages[i]);
        }

        i = i + 1;
      }

      setStages(newstages);

      createactivity(stageId, movingactivity.name, movingactivity.reward, movingactivity.description0, movingactivity.description1);
    }
  }





  function onActivityChange(stageId, activityId, field, value) {

    const newstages = [];

    let i = 0;

    while (i < stages.length) {

      if (stages[i].id == stageId) {

        const newactivities = [];

        let j = 0;

        while (j < stages[i].activities.length) {

          if (stages[i].activities[j].id == activityId) {

            let updatedactivity = {id: stages[i].activities[j].id, name: stages[i].activities[j].name, description0: stages[i].activities[j].description0, description1: stages[i].activities[j].description1, reward: stages[i].activities[j].reward, editmode: stages[i].activities[j].editmode};

            if (field == 'name') {
              updatedactivity.name = value;
            } else if (field == 'description0') {
              updatedactivity.description0 = value;
            } else if (field == 'description1') {
              updatedactivity.description1 = value;
            } else if (field == 'reward') {
              updatedactivity.reward = value;
            }

            newactivities.push(updatedactivity);

          } else {
            newactivities.push(stages[i].activities[j]);
          }

          j = j + 1;
        }

        const newtemp = [];

        j = 0;

        while (j < stages[i].tempactivities.length) {

          if (stages[i].tempactivities[j].id == activityId) {

            let updatedactivity = {id: stages[i].tempactivities[j].id, name: stages[i].tempactivities[j].name, description0: stages[i].tempactivities[j].description0, description1: stages[i].tempactivities[j].description1, reward: stages[i].tempactivities[j].reward, editmode: stages[i].tempactivities[j].editmode};

            if (field == 'name') {
              updatedactivity.name = value;
            } else if (field == 'description0') {
              updatedactivity.description0 = value;
            } else if (field == 'description1') {
              updatedactivity.description1 = value;
            } else if (field == 'reward') {
              updatedactivity.reward = value;
            }

            newtemp.push(updatedactivity);

          } else {
            newtemp.push(stages[i].tempactivities[j]);
          }

          j = j + 1;
        }

        newstages.push({id: stages[i].id, name: stages[i].name, activities: newactivities, tempactivities: newtemp, editmode: stages[i].editmode, open: stages[i].open});

      } else {
        newstages.push(stages[i]);
      }

      i = i + 1;
    }

    setStages(newstages);
  }





  function deletetempactivity(stageId, activityId) {

    const newstages = [];

    let i = 0;

    while (i < stages.length) {

      if (stages[i].id == stageId) {

        const newtemp = [];

        let j = 0;

        while (j < stages[i].tempactivities.length) {

          if (stages[i].tempactivities[j].id != activityId) {
            newtemp.push(stages[i].tempactivities[j]);
          }

          j = j + 1;
        }

        newstages.push({id: stages[i].id, name: stages[i].name, activities: stages[i].activities, tempactivities: newtemp, editmode: stages[i].editmode, open: stages[i].open});

      } else {
        newstages.push(stages[i]);
      }

      i = i + 1;
    }

    setStages(newstages);
  }





  async function deleteactivity(stageId, activityId) {

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
          method: 'remove',
          activityId: activityId
        })
      });

      const responsetext = await response.text();

      console.log('POST /activities remove: ', response.status);
      console.log('POST /activities remove: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/activities remove not JSON: ' + responsetext);
      }

      console.log('POST /activities remove JSON:', data);

      onFetchStages();

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





  useEffect(() => {
    onFetchStages();
  }, []);





  return (
    <div>
      <div>
        <div style = {{width: '100%', height: '100%', position: 'relative', top: '0%', left: '0%', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div style = {{width: '100%', position: 'relative', top: '0%', left: '0%', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem'}}>
            <div style = {{margin: '0', color: 'rgb(227, 224, 247)', fontSize: '1.75rem', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}>Ekwipunek</div>
          </div>
          <div style = {{margin: '0', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}>Brak zakupionych przedmiotów.</div>

        </div>





      </div>





    </div>
  )
}



