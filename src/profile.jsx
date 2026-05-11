import { useCallback, useState, useEffect } from 'react';
import { getApiBaseUrl, getSamlLoginUrl } from './constants/api.constants.js';
import { COUNTER_INCREMENT_PATH } from './constants/apiPaths.constants.js';
import './App.css';

export default function App() {

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allactivities, setAllactivities] = useState(0);
  const [allbadges, setAllbadges] = useState(0);
  const [activitieslabel, setActivitieslabel] = useState('WSZYSTKIE AKTYWNOŚCI');
  const [badgeslabel, setBadgeslabel] = useState('WSZYSTKIE ODZNAKI');
  const [livesslots, setLivesslots] = useState([]);
  const [currency, setCurrency] = useState(0);
  const [title, setTitle] = useState('');


  async function onFetchStudent() {
    setErrorMessage('');
    try {
      const base = getApiBaseUrl();
      const url = base + '/student/profile';
      const response = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });
      const data = await response.json();
     console.log(data);
  let receivedlives = data.zycia;

  let additionallives = 0;
  if (receivedlives > 27) {
    additionallives = receivedlives - 27;
    receivedlives = 27;
  }
  let temporarylivesslots = [];
  var i = 0;
  while (i < receivedlives) {
    if (i < 26) {
      temporarylivesslots.push({id: 'life' + i, lives: ''});
    } else {
      temporarylivesslots.push({id: 'life' + i, lives: '+' + additionallives});
    }
    i = i + 1
  }
  setLivesslots(temporarylivesslots);
  let temporarycurrency = String(data.waluta);
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
  setTitle(data.ranga);
    } catch (error) {
      const message = error.message;
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
        setActivities(receivedactivities.slice(0, 5));
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
    setBackgroundheight(Math.max(100, activitiesheight, badgesheight) + 'vh');
  }

  const [backgroundheight, setBackgroundheight] = useState('100vh');


  var role = 'STUDENT';
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
  {id:0, image:'rgb(255, 99, 71)', name:'Morning Yoga', description:'Stretch and energize your body', time:'6:30 AM'},
  {id:1, image:'rgb(135, 206, 235)', name:'Coffee Break', description:'Relax with a hot cup of coffee', time:'9:00 AM'},
  {id:2, image:'rgb(60, 179, 113)', name:'Team Meeting', description:'Discuss project updates', time:'10:30 AM'},
  {id:3, image:'rgb(255, 215, 0)', name:'Coding Session', description:'Work on your side project', time:'1:00 PM'},
  {id:4, image:'rgb(138, 43, 226)', name:'Lunch with Friends', description:'Catch up over a meal', time:'12:30 PM'},
  {id:5, image:'rgb(255, 105, 180)', name:'Afternoon Walk', description:'Refresh your mind with a stroll', time:'3:00 PM'},
  {id:6, image:'rgb(70, 130, 180)', name:'Read a Book', description:'Dive into a new story', time:'4:30 PM'},
  {id:7, image:'rgb(240, 128, 128)', name:'Gym Time', description:'Strengthen your body', time:'6:00 PM'},
  {id:8, image:'rgb(50, 205, 50)', name:'Cooking Practice', description:'Try a new recipe', time:'7:30 PM'},
  {id:9, image:'rgb(218, 112, 214)', name:'Evening Meditation', description:'Calm your mind before bed', time:'9:00 PM'}
];
  const [activities, setActivities] = useState(receivedactivities.slice(0, 5));

  var receivedbadges = [
  {id:0, image:'rgb(255, 223, 0)', name:'Early Bird', description0:'Wake up before 6 AM', description1:'Start your day right', reward:50, time:'6:00 AM', rarity:'common'},
  {id:1, image:'rgb(30, 144, 255)', name:'Coffee Lover', description0:'Drink 3 cups of coffee', description1:'Stay energized', reward:30, time:'9:00 AM', rarity:'common'},
  {id:2, image:'rgb(60, 179, 113)', name:'Team Player', description0:'Attend 5 meetings', description1:'Collaborate effectively', reward:70, time:'10:30 AM', rarity:'uncommon'},
  {id:3, image:'rgb(255, 99, 71)', name:'Code Master', description0:'Complete 2 coding challenges', description1:'Sharpen your skills', reward:100, time:'1:00 PM', rarity:'rare'},
  {id:4, image:'rgb(138, 43, 226)', name:'Social Butterfly', description0:'Have lunch with 3 friends', description1:'Stay connected', reward:40, time:'12:30 PM', rarity:'common'},
  {id:5, image:'rgb(255, 105, 180)', name:'Nature Walker', description0:'Walk 5000 steps', description1:'Enjoy the outdoors', reward:60, time:'3:00 PM', rarity:'uncommon'},
  {id:6, image:'rgb(70, 130, 180)', name:'Bookworm', description0:'Read 50 pages', description1:'Expand your knowledge', reward:80, time:'4:30 PM', rarity:'rare'},
  {id:7, image:'rgb(240, 128, 128)', name:'Fitness Fan', description0:'Finish 1 workout', description1:'Boost your health', reward:90, time:'6:00 PM', rarity:'uncommon'},
  {id:8, image:'rgb(50, 205, 50)', name:'Chef Apprentice', description0:'Cook a new dish', description1:'Enhance your culinary skills', reward:70, time:'7:30 PM', rarity:'rare'},
  {id:9, image:'rgb(218, 112, 214)', name:'Zen Master', description0:'Meditate for 20 mins', description1:'Relax and focus', reward:60, time:'9:00 PM', rarity:'uncommon'}
];
  i = 0;
  while (i < receivedbadges.length) {
    if (receivedbadges[i].rarity == 'common') {
      receivedbadges[i].rarity = 'ZWYKLA';
      receivedbadges[i].colour = 'rgb(133, 149, 132)';
    } else if (receivedbadges[i].rarity == 'uncommon') {
      receivedbadges[i].rarity = 'NIEZWYKLA';
      receivedbadges[i].colour = 'rgb(66, 243, 125)';
    } else if (receivedbadges[i].rarity == 'rare') {
      receivedbadges[i].rarity = 'RZADKA';
      receivedbadges[i].colour = 'rgb(255, 202, 181)';
    } else if (receivedbadges[i].rarity == 'legendary') {
      receivedbadges[i].rarity = 'LEGENDARNA';
      receivedbadges[i].colour = 'rgb(200, 200, 100)';
    } else {
      receivedbadges[i].rarity = 'MITYCZNA';
      receivedbadges[i].colour = 'rgb(255, 0, 128)';
    }
    if (i % 2 == 0) {
      receivedbadges[i].left = '1vw';
    } else {
      receivedbadges[i].left = '34vw';
    }
    receivedbadges[i].top = Math.floor(i / 2) * 31 + 38 + 'vh';
    i = i + 1;
  }
  const [badges, setBadges] = useState(receivedbadges.slice(0, 4));


  useEffect(() => {
    onFetchStudent();
  }, []);

  return (
    <main>
      <div style = {{backgroundColor: 'rgb(40, 40, 52)', width: '100vw', height: backgroundheight}}>
        <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '65vw', height: '30vh', position: 'absolute', top: '1vh', left: '1vw', borderBottom: '4px solid rgb(66, 243, 125)', borderRadius: '16px'}}>
          <div style = {{backgroundColor: 'rgb(255, 0, 255)', width: '13%', height: '50%', position: 'absolute', top: '25%', left: '2.5%'}}></div>
          <div style = {{backgroundColor: 'rgba(255, 202, 181, 0.25)', width: '22%', height: '10%', position: 'absolute', top: '5%', left: '18%', borderRadius: '8px', color: 'rgb(255, 202, 181)', fontSize: '100%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{role}</span></div>
          <div style = {{backgroundColor: 'rgba(66, 243, 125, 0.25)', width: '22%', height: '30%', position: 'absolute', top: '20%', left: '18%', borderRadius: '8px', color: 'rgb(66, 243, 125)', fontSize: '100%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1%'}}>{title}</div>
          <div style = {{backgroundColor: 'rgba(66, 243, 125, 0.25)', width: '22%', height: '15%', position: 'absolute', top: '55%', left: '18%', borderRadius: '8px', color: 'rgb(66, 243, 125)', fontSize: '100%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1%'}}>{rank}</div>
          <div style = {{width: '52%', height: '20%', position: 'absolute', top: '75%', left: '18%', color: 'rgb(227, 224, 247)', fontSize: '300%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{nickname}</span></div>
          <div style = {{width: '20%', height: '20%', position: 'absolute', top: '75%', left: '70%', color: 'rgb(66, 243, 125)', fontSize: '300%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', paddingLeft: '1%'}}>#{position}</div>
          <div style = {{width: '10%', height: '20%', position: 'absolute', top: '75%', left: '90%', color: 'rgb(227, 224, 247)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'flex-end', justifyContent: 'center', textAlign: 'center'}}>/{total}</div>
          <div style = {{width: '20%', height: '15%', position: 'absolute', top: '55%', left: '77.5%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1%'}}>RANKING</div>
          <div style = {{width: '55%', height: '65%', position: 'absolute', top: '5%', left: '42.5%', display: 'flex', flexWrap: 'wrap', overflow: 'hidden', columnGap: '1.67%', rowGap: '5%'}}>
            {livesslots.map((liveslot) => (
              <div key = {liveslot.id} style = {{backgroundColor: 'rgb(255, 0, 255)', width: '8.5%', height: '30%', borderRadius: '50%', color: 'rgb(227, 224, 247)', fontSize: '150%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}>{liveslot.lives}</div>
            ))}
          </div>
        </div>
        <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '32vw', height: '30vh', position: 'absolute', top: '1vh', left: '67vw', borderBottom: '4px solid rgb(66, 243, 125)', borderRadius: '16px'}}>
          <div style = {{width: '90%', height: '15%', position: 'absolute', top: '5%', left: '5%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingLeft: '1%'}}>STAN KONTA</div>
          <div style = {{width: '71.5%', height: '35%', position: 'absolute', top: '25%', left: '5%', color: 'rgb(66, 243, 125)', fontSize: '300%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingLeft: '1%'}}>{currency}</div>
          <div style = {{backgroundColor: 'rgba(255, 0, 255)', width: '18.5%', height: '35%', position: 'absolute', top: '25%', left: '75%'}}></div>
          <div style = {{backgroundColor: 'rgb(41, 40, 57)', width: '42.5%', height: '30%', position: 'absolute', top: '65%', left: '5%', borderRadius: '16px'}}>
            <div style = {{width: '90%', height: '30%', position: 'absolute', top: '5%', left: '5%', color: 'rgb(187, 203, 185)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingLeft: '1%'}}>ZDOBYTA WALUTA</div>
            <div style = {{width: '90%', height: '50%', position: 'absolute', top: '45%', left: '5%', color: 'rgb(227, 224, 247)', fontSize: '150%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1%'}}>{totalcurrency}</div>
          </div>
          <div style = {{backgroundColor: 'rgb(41, 40, 57)', width: '42.5%', height: '30%', position: 'absolute', top: '65%', left: '52.5%', borderRadius: '16px'}}>
            <div style = {{width: '90%', height: '30%', position: 'absolute', top: '5%', left: '5%', color: 'rgb(187, 203, 185)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingLeft: '1%'}}>ZDOBYTE ODZNAKI</div>
            <div style = {{width: '90%', height: '50%', position: 'absolute', top: '45%', left: '5%', color: 'rgb(227, 224, 247)', fontSize: '150%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1%'}}>{totalbadges}</div>
          </div>
        </div>
        <div style = {{width: '32.5vw', height: '7vh', position: 'absolute', top: '31vh', left: '1vw', color: 'rgb(227, 224, 247)', fontSize: '150%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1vw'}}>Odznaki</div>
        <div style = {{width: '32.5vw', height: '7vh', position: 'absolute', top: '31vh', left: '33.5vw', color: 'rgb(66, 243, 125)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-end', paddingRight: '1vw'}}><span onClick={() => toggleAll('badges')} style={{cursor: 'pointer'}}>{badgeslabel}</span></div>
        <div style = {{width: '16vw', height: '7vh', position: 'absolute', top: '31vh', left: '67vw', color: 'rgb(227, 224, 247)', fontSize: '150%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1vw'}}>Aktywności</div>
        <div style = {{width: '16vw', height: '7vh', position: 'absolute', top: '31vh', left: '83vw', color: 'rgb(66, 243, 125)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-end', paddingRight: '1vw'}}><span onClick={() => toggleAll('activities')} style={{cursor: 'pointer'}}>{activitieslabel}</span></div>
        {badges.map((badge) => (

          <div key = {'badge' + badge.id} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '32vw', height: '30vh', position: 'absolute', top: badge.top, left: badge.left, borderLeft: '4px solid ' + badge.colour, borderRadius: '16px'}}>
            <div style = {{backgroundColor: badge.image, width: '13%', height: '25%', position: 'absolute', top: '2.5%', left: '2.5%', borderRadius: '50%'}}></div>
            <div style = {{width: '82%', height: '8%', position: 'absolute', top: '0%', left: '18%', color: 'rgb(227, 224, 247)', fontSize: '100%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{badge.name}</span></div>
            <div style = {{width: '82%', height: '8%', position: 'absolute', top: '10%', left: '18%', color: 'rgb(66, 243, 125)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>OPIS FABULARNY</span></div>
            <div style = {{width: '82%', height: '19%', position: 'absolute', top: '20%', left: '18%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden'}}>{badge.description0}</span></div>
            <div style = {{width: '82%', height: '8%', position: 'absolute', top: '41%', left: '18%', color: 'rgb(66, 243, 125)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>OPIS DYDAKTYCZNY</span></div>
            <div style = {{width: '82%', height: '19%', position: 'absolute', top: '51%', left: '18%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden'}}>{badge.description1}</span></div>
            <div style = {{width: '82%', height: '8%', position: 'absolute', top: '72%', left: '18%'}}>
              <div style = {{width: '75%', height: '100%', position: 'absolute', top: '0%', left: '0%', color: 'rgb(66, 243, 125)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>NAGRODA</span></div>
              <div style = {{width: '12.5%', height: '100%', position: 'absolute', top: '0%', left: '75%', color: 'rgb(66, 243, 125)', fontSize: '100%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{badge.reward}</span></div>
              <div style = {{backgroundColor: 'rgb(255, 0, 255)', width: '12.5%', height: '100%', position: 'absolute', top: '0%', left: '87.5%'}}></div>
            </div>
            <div style = {{width: '82%', height: '8%', position: 'absolute', top: '82%', left: '18%', color: 'rgb(187, 203, 185)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>• {badge.time}</span></div>
            <div style = {{width: '82%', height: '8%', position: 'absolute', top: '92%', left: '18%', color: 'rgb(187, 203, 185)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{badge.rarity}</span></div>
          </div>
        ))}

        <div style={{width: '28vw', height: activities.length * 12.25 - 0.25 + 'vh', position: 'absolute', top: '38vh', left: '67vw', display: 'flex', flexDirection: 'column', gap: '0.25vh'}}>
          {activities.map((activity) => (
            <div key={'activity' + activity.id} style={{backgroundColor: 'rgb(26, 26, 42)', width: '32vw', height: '12vh', position: 'relative', borderLeft: '4px solid rgb(66, 243, 125)', borderRadius: '16px'}}>
              <div style={{backgroundColor: activity.image, width: '16%', height: '75%', position: 'absolute', top: '12.5%', left: '2.5%', borderRadius: '50%'}}></div>
              <div style={{width: '79%', height: '25%', position: 'absolute', top: '5%', left: '21%', color: 'rgb(227, 224, 247)', fontSize: '100%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{activity.name}</span></div>
              <div style={{width: '79%', height: '25%', position: 'absolute', top: '35%', left: '21%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style={{whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis'}}>{activity.description}</span></div>
              <div style={{width: '79%', height: '25%', position: 'absolute', top: '65%', left: '21%', color: 'rgb(187, 203, 185)', fontSize: '75%', display: 'flex', fontWeight: 100, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>• {activity.time}</span></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


