import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../content/api-test/mock/browserIdStorage.js';
//import './ProfileContent.css';

export default function ProfileContent() {
  const { groupId } = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [allactivities, setAllactivities] = useState(0);
  const [allbadges, setAllbadges] = useState(0);
  const [activitieslabel, setActivitieslabel] = useState('WSZYSTKIE AKTYWNOŚCI');
  const [badgeslabel, setBadgeslabel] = useState('WSZYSTKIE ODZNAKI');
  const [livesslots, setLivesslots] = useState([]);
  const [currency, setCurrency] = useState(0);
  const [title, setTitle] = useState('');
  const [backgroundheight, setBackgroundheight] = useState('100%');

  var role = '';
  var rank = '';
  var nickname = 'Nickname';
  var position = 1;
  var total = 123;
  var totalcurrency = 987654321;
  var totalbadges = 123;

  totalcurrency = String(totalcurrency);
  var newtotalcurrency = '';
  var i = totalcurrency.length - 1;
  var j = 0;
  while (i >= 0) {
    newtotalcurrency = newtotalcurrency + totalcurrency[i];
    j = j + 1;
    if (j == 3) {
      newtotalcurrency = newtotalcurrency + ' ';
      j = 0;
    }
    i = i - 1;
  }
  totalcurrency = '';
  i = newtotalcurrency.length - 1;
  while (i >= 0) {
    totalcurrency = totalcurrency + newtotalcurrency[i];
    i = i - 1;
  }
  totalcurrency = totalcurrency.trim();

  var receivedactivities = [
    {id: 0, image: 'rgb(255, 0, 0)', name: 'Zlota marchewka', description: 'Osiagnij maksymalny wynik z kolokwium.', time: '2 godziny temu'},
    {id: 1, image: 'rgb(0, 255, 0)', name: 'Mistrz marchewki', description: 'Wykonanaj 3 trudne zadania.', time: 'Wczoraj'},
    {id: 2, image: 'rgb(0, 0, 255)', name: 'Agent specjalny', description: 'Wykonaj obie prace domowe.', time: 'Tydzien temu'}
  ];
  
  i = 0;
  while (i < receivedactivities.length) {
    receivedactivities[i].top = i * 12.25 + 38 + '%';
    i = i + 1;
  }
  const [activities, setActivities] = useState(receivedactivities.slice(0, 2));

  var receivedbadges = [];
  i = 0;
  while (i < receivedbadges.length) {
    if (receivedbadges[i].rarity == 'common') {
      receivedbadges[i].rarity = 'ZWYKLA';
      receivedbadges[i].colour = 'rgb(0, 238, 255)';
    } else if (receivedbadges[i].rarity == 'uncommon') {
      receivedbadges[i].rarity = 'NIEZWYKLA';
      receivedbadges[i].colour = 'rgb(255, 145, 66)';
    } else if (receivedbadges[i].rarity == 'rare') {
      receivedbadges[i].rarity = 'RZADKA';
      receivedbadges[i].colour = 'rgb(228, 134, 219)';
    } else if (receivedbadges[i].rarity == 'legendary') {
      receivedbadges[i].rarity = 'LEGENDARNA';
      receivedbadges[i].colour = 'rgb(221, 255, 0)';
    } else {
      receivedbadges[i].rarity = 'MITYCZNA';
      receivedbadges[i].colour = 'rgb(191, 0, 0)';
    }
    if (i % 2 == 0) {
      receivedbadges[i].left = '1%';
    } else {
      receivedbadges[i].left = '34%';
    }
    receivedbadges[i].top = Math.floor(i / 2) * 31 + 38 + '%';
    i = i + 1;
  }
  const [badges, setBadges] = useState(receivedbadges.slice(0, 8));

  async function onFetchStudent() {
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





      let temporarycurrency = String(data.currency);
      var newcurrency = '';
      i = temporarycurrency.length - 1;
      var j = 0;
      while (i >= 0) {
        newcurrency = newcurrency + temporarycurrency[i];
        j = j + 1;
        if (j == 3) {
          newcurrency = newcurrency + ' ';
          j = 0;
        }
        i = i - 1;
      }

      temporarycurrency = '';
      i = newcurrency.length - 1;
      while (i >= 0) {
        temporarycurrency = temporarycurrency + newcurrency[i];
        i = i - 1;
      }
      temporarycurrency = temporarycurrency.trim();

      setCurrency(temporarycurrency);
      setTitle('');
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

  function toggleAll(stringvalue) {
    let activitiesheight = 0;
    let badgesheight = 0;
    if (stringvalue == 'activities' && allactivities == 0) {
      activitiesheight = receivedactivities.length * 12.25 - 0.25 + 38 + 1;
    } else if (stringvalue == 'activities' && allactivities == 1) {
      activitiesheight = 100;
    } else if (allactivities == 0) {
      activitiesheight = 100;
    } else if (allactivities == 1) {
      activitiesheight = receivedactivities.length * 12.25 - 0.25 + 38 + 1;
    }
    if (stringvalue == 'badges' && allbadges == 0) {
      badgesheight = Math.ceil(receivedbadges.length / 2) * 31 + 38;
    } else if (stringvalue == 'badges' && allbadges == 1) {
      badgesheight = 100;
    } else if (allbadges == 0) {
      badgesheight = 100;
    } else if (allbadges == 1) {
      badgesheight = Math.ceil(receivedbadges.length / 2) * 31 + 38;
    }
    if (stringvalue == 'activities') {
      if (allactivities == 0) {
        setAllactivities(1);
        setActivities(receivedactivities);
        setActivitieslabel('UKRYJ AKTYWNOŚCI');
      } else {
        setAllactivities(0);
        setActivities(receivedactivities.slice(0, 2));
        setActivitieslabel('WSZYSTKIE AKTYWNOŚCI');
      }
    } else {
      if (allbadges == 0) {
        setAllbadges(1);
        setBadges(receivedbadges);
        setBadgeslabel('UKRYJ ODZNAKI');
      } else {
        setAllbadges(0);
        setBadges(receivedbadges.slice(0, 4));
        setBadgeslabel('WSZYSTKIE ODZNAKI');
      }
    }
    setBackgroundheight(Math.max(100, activitiesheight, badgesheight) + '%');
  }

  useEffect(() => {
    onFetchStudent();
  }, []);

  return (
    <div className="profile-content">
      <div className="profile-content__inner">
      
        <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '98%', height: '30%', position: 'absolute', top: '1%', left: '1%', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: '2.5%', gap: '2.5%', borderRadius: '16px'}}>
          <div style = {{backgroundColor: 'rgb(255, 0, 255)', aspectRatio: '1 / 1', width: '15%', position: 'relative'}}></div>
          <div style = {{backgroundColor: 'rgb(26, 26, 42)', position: 'relative', display: 'flex', width: '80%', flexDirection: 'column', paddingTop: '1%', paddingBottom: '1%', gap: '2vh'}}>
            <div style = {{backgroundColor: 'rgba(227, 224, 247, 0.25)', width: 'fit-content', position: 'relative', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '2.5vw', paddingRight: '2.5vw', paddingTop: '1vh', paddingBottom: '1vh'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{role}</span></div>
            <div style = {{backgroundColor: 'rgba(227, 224, 247, 0.25)', width: 'fit-content', position: 'relative', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1%', paddingLeft: '2.5vw', paddingRight: '2.5vw', paddingTop: '1vh', paddingBottom: '1vh'}}>{title}</div>
            <div style = {{backgroundColor: 'rgba(227, 224, 247, 0.25)', width: 'fit-content', position: 'relative', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1%', paddingLeft: '2.5vw', paddingRight: '2.5vw', paddingTop: '1vh', paddingBottom: '1vh'}}>{rank}</div>
            <div style = {{width: 'fit-content', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '42px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{nickname}</span></div>
          </div>
        </div>

        <div style = {{width: '98%', height: '15%', position: 'absolute', top: '33%', left: '1%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6%'}}>

          <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '20%', height: '80%', position: 'relative', borderRadius: '16px'}}>
            <div style = {{width: '90%', height: '30%', position: 'absolute', top: '5%', left: '5%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingLeft: '1%'}}>ZDOBYTA WALUTA</div>
            <div style = {{width: '90%', height: '50%', position: 'absolute', top: '45%', left: '5%', color: 'rgb(227, 224, 247)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1%'}}>{totalcurrency}</div>
          </div>
          <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '20%', height: '80%', position: 'relative', borderRadius: '16px'}}>
            <div style = {{width: '90%', height: '30%', position: 'absolute', top: '5%', left: '5%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingLeft: '1%'}}>ZDOBYTE ODZNAKI</div>
            <div style = {{width: '90%', height: '50%', position: 'absolute', top: '45%', left: '5%', color: 'rgb(227, 224, 247)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1%'}}>{totalbadges}</div>
          </div>
          <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '20%', height: '80%', position: 'relative', borderRadius: '16px'}}>
            <div style = {{width: '90%', height: '30%', position: 'absolute', top: '5%', left: '5%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingLeft: '1%'}}>OBECNY RANKING</div>
            <div style = {{width: '50%', height: '50%', position: 'absolute', top: '45%', left: '5%', color: 'rgb(227, 224, 247)', fontSize: '42px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', paddingLeft: '1%'}}>#{position}</div>
            <div style = {{width: '40%', height: '50%', position: 'absolute', top: '45%', left: '55%', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '17px', paddingLeft: '1%'}}>/{total}</div>
          </div>
          <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '20%', height: '80%', position: 'relative', borderRadius: '16px'}}>
            <div style = {{width: '90%', height: '30%', position: 'absolute', top: '5%', left: '5%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingLeft: '1%'}}>NAJWYZSZA POZYCJA</div>
            <div style = {{width: '50%', height: '50%', position: 'absolute', top: '45%', left: '5%', color: 'rgb(227, 224, 247)', fontSize: '42px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', paddingLeft: '1%'}}>#{position}</div>
            <div style = {{width: '40%', height: '50%', position: 'absolute', top: '45%', left: '55%', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '17px', paddingLeft: '1%'}}>/{total}</div>
          </div>



        </div>


        <div style = {{width: '49%', height: '7%', position: 'absolute', top: '48%', left: '1%', color: 'rgb(227, 224, 247)', fontSize: '28px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Aktywności</div>
        <div style = {{width: '49%', height: '7%', position: 'absolute', top: '48%', left: '50%', color: 'rgb(66, 243, 125)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-end', paddingRight: '1%'}}><span onClick={() => toggleAll('activities')} style={{cursor: 'pointer'}}>{activitieslabel}</span></div>


        <div style = {{width: '98%', position: 'absolute', top: '56%', left: '1%', display: 'flex', flexDirection: 'column', flexWrap: 'wrap', columnGap: '2.5%', rowGap: '3.5vh', paddingBottom: '2vh', borderRadius: '8px'}}>
          {activities.map((activity) => (
            <div key = {'activity' + activity.id} style={{backgroundColor: 'rgb(26, 26, 42)', width: '100%', height: '20%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderLeft: '4px solid rgb(66, 243, 125)', paddingLeft: '2.5%', paddingRight: '2.5%', paddingTop: '1%', paddingBottom: '1%', gap: '2.5%', borderRadius: '16px'}}>
              <div style = {{backgroundColor: activity.image, width: '7.5%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', borderRadius: '50%'}}></div>
              <div style={{width: '25%', height: '25%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style={{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden'}}>{activity.name}</span></div>
              <div style={{width: '60%', height: '25%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style={{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 5, overflow: 'hidden'}}>{activity.description}</span></div>
              <div style={{width: '15%', height: '25%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 100, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>• {activity.time}</span></div>
            </div>
          ))}
        </div>

      </div>
      {errorMessage && <p className="profile-content__error">{errorMessage}</p>}
    </div>
  );
}


