import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl, getSamlLoginUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';


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

        receivedstages.push({
          id: receiveddata.stages[i].id,
          name: receiveddata.stages[i].name,
          activities: [],
          editmode: 0,
          open: 'none'
        });

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

      const newstages = [];

      let i = 0;

      while (i < stages.length) {

        if (stages[i].id == stageId) {

          const newactivities = [];

          let j = 0;

          while (j < receiveddata.activities.length) {

            newactivities.push({
              id: receiveddata.activities[j].id,
              name: receiveddata.activities[j].name,
              description0: receiveddata.activities[j].storyDescription,
              description1: receiveddata.activities[j].educationalDescription,
              reward: receiveddata.activities[j].currency,
              editmode: 0
            });

            j = j + 1;
          }

          newstages.push({
            id: stages[i].id,
            name: stages[i].name,
            activities: newactivities,
            editmode: stages[i].editmode,
            open: stages[i].open
          });

        } else {

          newstages.push(stages[i]);
        }

        i = i + 1;
      }

      setStages(newstages);

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





  function togglestage(stageId) {

    let newstages = [];

    let i = 0;
    while (i < stages.length) {

      if (stages[i].id == stageId) {

        let newstage = {
          id: stages[i].id,
          name: stages[i].name,
          activities: stages[i].activities,
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





  function editactivity() {
    console.log();
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
    <div className="profile-content">
      <div className="profile-content__inner">
        <div style = {{backgroundColor: 'rgb(0, 0, 0)', width: '100%', height: '100%', position: 'absolute', top: '0%', left: '0%'}}>
          <div style = {{width: '98%', height: '7.5%', position: 'absolute', top: '3%', left: '1%', color: 'rgb(227, 224, 247)', fontSize: '42px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Zarzadzanie aktywnosciami i etapami</div>
          <div style = {{width: '98%', height: '5%', position: 'absolute', top: '10.5%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>Panel pozwalajacy na tworzenie nowych etapow oraz przypisywanie im aktywnosci.</span></div>
        </div>

        <div style={{backgroundColor: 'rgb(26, 26, 42)', width: '98%', height: '20%', position: 'absolute', top: '17.5%', left: '1%', borderRadius: '16px'}}>
          <div style = {{width: '98%', height: '25%', position: 'absolute', top: '10%', left: '1%', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>NAZWA NOWEGO ETAPU</span></div>
          <input onChange={(event) => setStageName(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '82%', height: '40%', position: 'absolute', top: '45%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px'}} value={stagename} placeholder = 'np. Laboratorium nr 1: Zajecia organizacyjne'></input>
          <div onClick={() => createstage(stagename)} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '15%', height: '40%', position: 'absolute', top: '45%', left: '84%', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Dodaj etap</div>
        </div>










        <div style = {{width: '81.25%', height: '7.5%', position: 'absolute', top: '40%', left: '1%', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Lista etapow</div>
        <div style = {{backgroundColor: 'rgba(227, 224, 247, 0.2)', width: '15%', height: '7.5%', position: 'absolute', top: '40%', left: '83.75%', borderRadius: '32px', color: 'rgb(227, 224, 247)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>Etapy {0}</div>
        <div style={{width: '98%', top: '50%', position: 'absolute', left: '1%', display: 'flex', flexDirection: 'column', gap: '1vh', alignItems: 'center'}}>


          {stages.map((stage) => (
            <div key = {'stage' + stage.id} style={{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', paddingBottom: '0%', gap: '0vh'}}>
              <div style={{backgroundColor: 'rgb(41, 40, 57)', width: '100%', height: '10vh', position: 'relative', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', display: 'flex', flexDirection: 'row', paddingTop: '1%', paddingLeft: '1%', paddingBottom: '1%', gap: '1vh'}}>
                <img onClick = {createstage} style = {{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'}}/>


                <div style = {{width: '76%', height: '100%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', alignItems: 'center'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{stage.name}</span></div>



                <div onClick = {() => editstage(stage.id)} style = {{width: '5%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                  <img style = {{width: '50%', height: '50%'}}/>
                </div>
                <div onClick = {() => copystage(stage.id)} style = {{width: '5%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                  <img style = {{width: '50%', height: '50%'}}/>
                </div>
                <div onClick = {() => deletestage(stage.id)} style = {{width: '5%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                  <img style = {{width: '50%', height: '50%'}}/>
                </div>
                <div onClick = {() => togglestage(stage.id)} style = {{width: '5%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                  <img style = {{width: '50%', height: '50%'}}/>
                </div>
              </div>


              <div style = {{display: stage.open}}>
                <div style={{backgroundColor: 'rgb(26, 26, 42)', width: '100%', height: '10vh', position: 'relative', display: 'flex', flexDirection: 'row', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%'}}>
                  <div style = {{width: '20%', height: '100%', position: 'relative', display: 'flex', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                    <span>NAZWA AKTYWNOSCI</span>
                  </div>
                  <div style = {{width: '30%', height: '100%', position: 'relative', display: 'flex', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                    <span>OPIS FABULARNY</span>
                  </div>
                  <div style = {{width: '30%', height: '100%', position: 'relative', display: 'flex', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                   <span>OPIS DYDAKTYCZNY</span>
                  </div>
                  <div style = {{width: '10%', height: '100%', position: 'relative', display: 'flex', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                    <span>NAGRODA</span>
                  </div>
                  <div style = {{width: '10%', height: '100%', position: 'relative', display: 'flex', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                    <span>OPCJE</span>
                  </div>
                </div>

                {stage.activities.map((activity) => (

                <div key = {'activity' + stage.id + activity.id} style={{backgroundColor: 'rgb(41, 40, 57)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '1%', paddingRight: '1%', borderLeft: '4px solid rgb(66, 243, 125)', borderRadius: '16px'}}>
                 <div style = {{width: '20%', height: '100%', position: 'relative', display: 'flex', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                    <span>{activity.name}</span>
                  </div>
                  <div style = {{width: '30%', height: '100%', position: 'relative', display: 'flex', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                    <span>{activity.description0}</span>
                  </div>
                  <div style = {{width: '30%', height: '100%', position: 'relative', display: 'flex', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                    <span>{activity.description1}</span>
                  </div>
                  <div style = {{width: '10%', height: '100%', position: 'relative', display: 'flex', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '5%'}}>
                    <span>{activity.reward}</span>
                    <div style = {{backgroundColor: 'rgb(255, 0, 255)', width: '25%', height: '3vh', position: 'relative'}}></div>
                  </div>
                  <div onClick = {editactivity} style = {{width: '5%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img style = {{width: '50%', height: '50%'}}/>
                  </div>
                  <div onClick={() => deleteactivity(stage.id, activity.id)} style = {{width: '5%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img style = {{width: '50%', height: '50%'}}/>
                  </div>
                </div>


))}
            <div onClick = {createactivity} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '40%', height: '10%', position: 'relative', left: '30%', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '0%', cursor: 'pointer', marginTop: '2.5vh', marginBottom: '2.5vh', paddingTop: '1vh', paddingBottom: '1vh'}}>Dodaj nowa aktywnosc</div>
            </div>


          </div>
))}


        </div>





      </div>





    </div>
  )
}



