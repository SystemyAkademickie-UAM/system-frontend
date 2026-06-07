import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl, getSamlLoginUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';
import {useToast} from '../../../components/ui/index.js';

import itemicon from '../../../../public/assets/icons/arrow-circle-right-svgrepo-com.svg';
import infoicon from '../../../../public/assets/icons/info-circle-svgrepo-com.svg';
import copyicon from '../../../../public/assets/icons/copy-01-svgrepo-com.svg';
import editicon from '../../../../public/assets/icons/edit-02-svgrepo-com.svg';
import deleteicon from '../../../../public/assets/icons/trash-01-svgrepo-com.svg';

export default function App() {

  const {showSuccess, showError} = useToast();

  const {groupId} = useParams();
  const [errorMessage, setErrorMessage] = useState('');

  const [stages, setStages] = useState([]);
  const [stagename, setStageName] = useState('');

  var mockitems = [{id: 1, name: 'a', description0: 'aa', description1: 'aaa', cost: 11}, {id: 2, name: 'b', description0: 'bb', description1: 'bbb', cost: 22}, {id: 3, name: 'c', description0: 'cc', description1: 'ccc', cost: 33}, {id: 4, name: 'd', description0: 'dd', description1: 'ddd', cost: 44}, {id: 5, name: 'e', description0: 'ee', description1: 'eee', cost: 55}];
  var mockranks = [{id: 1, icon: 'rgb(255, 0, 0)', name: 'A', discount: 0.9}, {id: 2, icon: 'rgb(0, 255, 0)', name: 'B', discount: 0.85}, {id: 3, icon: 'rgb(0, 0, 255)', name: 'C', discount: 0.8}, {id: 4, icon: 'rgb(255, 255, 0)', name: 'D', discount: 0.75}, {id: 5, icon: 'rgb(255, 0, 255)', name: 'E', discount: 0.7}];
  var mockbadges = [{id: 1, name: 'AA'}, {id: 2, name: 'BB'}, {id: 3, name: 'CC'}, {id: 4, name: 'DD'}, {id: 5, name: 'EE'}];

  const [itemname, setItemname] = useState('');
  const [description0, setDescription0] = useState('');
  const [description1, setDescription1] = useState('');
  const [cost, setCost] = useState(0);
  const [grouplimit, setGrouplimit] = useState(0);
  const [studentlimit, setStudentlimit] = useState(0);
  const [ranks, setRanks] = useState(function () {
    const initialranks = [];
    let i = 0;
    while (i < mockranks.length) {
      initialranks.push({id: mockranks[i].id, icon: mockranks[i].icon, name: mockranks[i].name, discount: mockranks[i].discount, costafter: 0});
      i = i + 1;
    }
    return initialranks;
  });
  const [badgediscounts, setBadgediscounts] = useState([]);
  const [selectedbadge, setSelectedbadge] = useState('Wybierz odznakę');
  const [pendingdiscounttype, setPendingdiscounttype] = useState('Stała kwota');
  const [pendingdiscountvalue, setPendingdiscountvalue] = useState('');


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





  function recalculatediscounts(basecostvalue) {

    const basecost = basecostvalue;

    const newranks = [];

    let i = 0;

    while (i < ranks.length) {

      let newcostafter = '';

      if (basecostvalue != '' && basecost.length > 0) {
        newcostafter = Math.round(basecost * ranks[i].discount);
      }

      newranks.push({id: ranks[i].id, icon: ranks[i].icon, name: ranks[i].name, discount: ranks[i].discount, costafter: newcostafter});

      i = i + 1;
    }

    setRanks(newranks);
  }





  function onrankcostchange(rankId, value) {

    const newranks = [];

    let i = 0;

    while (i < ranks.length) {

      if (ranks[i].id == rankId) {
        newranks.push({id: ranks[i].id, icon: ranks[i].icon, name: ranks[i].name, discount: ranks[i].discount, costafter: value});
      } else {
        newranks.push(ranks[i]);
      }

      i = i + 1;
    }

    setRanks(newranks);
  }





  function togglependingdiscounttype() {

    if (pendingdiscounttype == 'Stała kwota') {
      setPendingdiscounttype('Zniżka procentowa');
    } else {
      setPendingdiscounttype('Stała kwota');
    }
  }





  function togglebadgediscounttype(discountId) {

    const newdiscounts = [];

    let i = 0;

    while (i < badgediscounts.length) {

      if (badgediscounts[i].id == discountId) {

        let newtype = 'Stała kwota';

        if (badgediscounts[i].type == 'Stała kwota') {
          newtype = 'Zniżka procentowa';
        }

        newdiscounts.push({id: badgediscounts[i].id, badgeid: badgediscounts[i].badgeid, badgename: badgediscounts[i].badgename, type: newtype, value: badgediscounts[i].value});

      } else {
        newdiscounts.push(badgediscounts[i]);
      }

      i = i + 1;
    }

    setBadgediscounts(newdiscounts);
  }





  function onbadgediscountchange(discountId, value) {

    const newdiscounts = [];

    let i = 0;

    while (i < badgediscounts.length) {

      if (badgediscounts[i].id == discountId) {
        newdiscounts.push({id: badgediscounts[i].id, badgeid: badgediscounts[i].badgeid, badgename: badgediscounts[i].badgename, type: badgediscounts[i].type, value: value});
      } else {
        newdiscounts.push(badgediscounts[i]);
      }

      i = i + 1;
    }

    setBadgediscounts(newdiscounts);
  }





  function addbadgediscount() {

    if (selectedbadge == 'Wybierz odznakę') {
      showError('Prosze wybrac odznake.');
      return;
    }

    let alreadyused = 0;

    let i = 0;

    while (i < badgediscounts.length) {

      if (badgediscounts[i].badgename == selectedbadge) {
        alreadyused = 1;
      }

      i = i + 1;
    }

    if (alreadyused == 1) {
      showError('Znizka zwiazana z ta odznaka juz istnieje.');
      return;
    }

    if (pendingdiscountvalue.length == 0) {
      showError('Prosze wpisac wartosc znizki.');
      return;
    }

    let badgeid = 0;

    i = 0;

    while (i < mockbadges.length) {

      if (mockbadges[i].name == selectedbadge) {
        badgeid = mockbadges[i].id;
      }

      i = i + 1;
    }

    const newdiscounts = [];

    i = 0;

    while (i < badgediscounts.length) {
      newdiscounts.push(badgediscounts[i]);
      i = i + 1;
    }

    newdiscounts.push({id: badgediscounts.length, badgeid: badgeid, badgename: selectedbadge, type: pendingdiscounttype, value: pendingdiscountvalue});

    setBadgediscounts(newdiscounts);
    setSelectedbadge('Wybierz odznakę');
    setPendingdiscountvalue('');
    setPendingdiscounttype('Stała kwota');
    showSuccess('Znizka dla odznaki zostala utworzona.');
  }





  function deletebadgediscount(discountId) {

    const newdiscounts = [];

    let i = 0;

    while (i < badgediscounts.length) {

      if (badgediscounts[i].id != discountId) {
        newdiscounts.push(badgediscounts[i]);
      }

      i = i + 1;
    }

    setBadgediscounts(newdiscounts);
    showSuccess('Znizka za odznake zostala usunieta.');
  }





  function goback() {
    window.location.href = '/groups/' + groupId + '/shop';
    showSuccess('Anulowano tworzenie przedmiotu.');
  }





  function createitem() {
    showSuccess('Przedmiot został utworzony!');
    console.log('OK');
  }





  return (
    <div>
      <div>
        <div style = {{width: '75vw', height: '100%', position: 'relative', top: '0%', left: '0%'}}>


          <div style = {{width: '98%', position: 'relative', top: '0%', left: '1%', display: 'flex', flexDirection: 'column', gap: '2vh', paddingBottom: '4vh'}}>

            <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.5vh', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2%', paddingRight: '2%'}}>
              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%'}}>
                <div style = {{width: '35%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Nazwa przedmiotu</div>
                <input onChange = {(event) => setItemname(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '63%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none'}} value = {itemname} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = 'none')}></input>
              </div>
              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '2%'}}>
                <div style = {{width: '35%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', paddingTop: '1vh'}}>Opis fabularny</div>
                <textarea onChange = {(event) => setDescription0(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '63%', height: '10vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: '1%', paddingRight: '1%', paddingTop: '1vh', borderRadius: '8px', border: 'none', outline: 'none', resize: 'none', overflow: 'auto'}} value = {description0} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = 'none')}></textarea>
              </div>
              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '2%'}}>
                <div style = {{width: '35%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', paddingTop: '1vh'}}>Opis dydaktyczny</div>
                <textarea onChange = {(event) => setDescription1(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '63%', height: '10vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: '1%', paddingRight: '1%', paddingTop: '1vh', borderRadius: '8px', border: 'none', outline: 'none', resize: 'none', overflow: 'auto'}} value = {description1} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = 'none')}></textarea>
              </div>
              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%'}}>
                <div style = {{width: '35%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Koszt</div>
                <input type = 'number' onInput = {(event) => {setCost(event.target.value); recalculatediscounts(event.target.value);}} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '63%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none', paddingRight: '1%', textAlign: 'center'}} value = {cost} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = 'none')}></input>
              </div>
              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%'}}>
                <div style = {{width: '35%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Limit sztuk na grupę (0 = bez limitu)</div>
                <input type = 'number' onChange = {(event) => setGrouplimit(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '63%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none', paddingRight: '1%', textAlign: 'center'}} value = {grouplimit} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = 'none')}></input>
              </div>
              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%'}}>
                <div style = {{width: '35%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Limit sztuk na studenta (0 = bez limitu)</div>
                <input type = 'number' onChange = {(event) => setStudentlimit(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '63%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none', paddingRight: '1%', textAlign: 'center'}} value = {studentlimit} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = 'none')}></input>
              </div>
            </div>

            <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1vh', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2%', paddingRight: '2%'}}>
              <div style = {{width: '100%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', paddingBottom: '1vh'}}>Zniżki za rangi</div>
              {ranks.map((rank) => (
                <div key = {'rank' + rank.id} style = {{backgroundColor: 'rgb(41, 40, 57)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '2.5%', paddingRight: '1%', borderRadius: '16px', gap: '2%'}}>
                  <div style = {{backgroundColor: rank.icon, width: '5%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', borderRadius: '50%'}}></div>
                  <div style = {{width: '25%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{rank.name}</span></div>
                  <div style = {{width: '20%', position: 'relative', left: '2.5%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>{rank.discount}</span></div>
                  <input type = 'number' onChange = {(event) => onrankcostchange(rank.id, event.target.value)} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '20%', height: '5vh', position: 'relative', left: '22.5%', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none', paddingRight: '1%', textAlign: 'center'}} value = {rank.costafter} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = 'none')}></input>
                </div>
              ))}
            </div>

            <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.5vh', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2%', paddingRight: '2%'}}>
              <div style = {{width: '100%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', paddingBottom: '1vh'}}>Zniżki za odznaki</div>

              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%'}}>
                <select onChange = {(event) => setSelectedbadge(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '40%', height: '5vh', position: 'relative', color: 'rgb(66, 243, 125)', fontSize: '14px', fontWeight: 900, paddingLeft: '2%', border: 'none', outline: 'none', borderRadius: '8px', cursor: 'pointer'}} value = {selectedbadge}>
                  <option value = 'Wybierz odznakę'>Wybierz odznakę</option>
                  {mockbadges.map((badge) => (
                    <option key = {'badgeoption' + badge.id} value = {badge.name}>{badge.name}</option>
                  ))}
                </select>
                <div onClick = {() => togglependingdiscounttype()} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '20%', height: '5vh', position: 'relative', borderRadius: '8px', color: 'rgb(66, 243, 125)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>{pendingdiscounttype}</div>
                <input onChange = {(event) => setPendingdiscountvalue(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '35%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none', textAlign: 'center'}} value = {pendingdiscountvalue} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = 'none')}></input>
                <div onClick = {() => addbadgediscount()} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '25%', position: 'relative', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Dodaj zniżkę</div>
              </div>
              {badgediscounts.map((discount) => (
                <div key = {'badgediscount' + discount.id} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%'}}>
                  <div style = {{backgroundColor: 'rgb(41, 40, 57)', width: '40%', height: '5vh', position: 'relative', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', paddingLeft: '2%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{discount.badgename}</span></div>
                  <div onClick = {() => togglebadgediscounttype(discount.id)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '20%', height: '5vh', position: 'relative', borderRadius: '8px', color: 'rgb(66, 243, 125)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>{discount.type}</div>
                  <input onChange = {(event) => onbadgediscountchange(discount.id, event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '30%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none', textAlign: 'center'}} value = {discount.value} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = 'none')}></input>
                  <div onClick = {() => deletebadgediscount(discount.id)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '5%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img src = {deleteicon} style = {{width: '35%', height: '35%'}}/>
                  </div>
                </div>
              ))}
            </div>

            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2%'}}>
              <div onClick = {() => goback()} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '15%', position: 'relative', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Cofnij</div>
              <div onClick = {() => createitem()} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '20%', position: 'relative', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Stwórz przedmiot</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}



