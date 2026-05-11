import { useState, useEffect } from 'react';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import './ProfileContent.css';

export default function ProfileContent() {
  const [errorMessage, setErrorMessage] = useState('');
  const [allactivities, setAllactivities] = useState(0);
  const [allbadges, setAllbadges] = useState(0);
  const [activitieslabel, setActivitieslabel] = useState('WSZYSTKIE AKTYWNOŚCI');
  const [badgeslabel, setBadgeslabel] = useState('WSZYSTKIE ODZNAKI');
  const [livesslots, setLivesslots] = useState([]);
  const [currency, setCurrency] = useState(0);
  const [title, setTitle] = useState('');
  const [backgroundheight, setBackgroundheight] = useState('100%');

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
    {id: 0, image: 'rgb(66, 243, 125)', name: 'Kolokwium z Algebry', description: 'Zdobyto 85% punktów z kolokwium', time: '2 godziny temu'},
    {id: 1, image: 'rgb(99, 179, 237)', name: 'Obecność na wykładzie', description: 'Uczestnictwo w wykładzie z Analizy Matematycznej', time: '5 godzin temu'},
    {id: 2, image: 'rgb(245, 158, 11)', name: 'Zadanie domowe', description: 'Oddano zadanie z programowania obiektowego', time: 'Wczoraj, 18:30'},
    {id: 3, image: 'rgb(168, 85, 247)', name: 'Aktywność na zajęciach', description: 'Odpowiedź na pytanie prowadzącego', time: 'Wczoraj, 10:15'},
    {id: 4, image: 'rgb(239, 68, 68)', name: 'Quiz z Baz Danych', description: 'Ukończono quiz online — wynik 90%', time: '2 dni temu'},
    {id: 5, image: 'rgb(34, 197, 94)', name: 'Projekt zespołowy', description: 'Przesłano milestone projektu semestralnego', time: '3 dni temu'},
    {id: 6, image: 'rgb(59, 130, 246)', name: 'Konsultacje', description: 'Uczestnictwo w konsultacjach z prowadzącym', time: '4 dni temu'},
    {id: 7, image: 'rgb(236, 72, 153)', name: 'Laboratoria', description: 'Zaliczono ćwiczenia z sieci komputerowych', time: '5 dni temu'},
    {id: 8, image: 'rgb(251, 191, 36)', name: 'Referat', description: 'Wygłoszono prezentację na seminarium', time: 'Tydzień temu'},
    {id: 9, image: 'rgb(139, 92, 246)', name: 'Pomoc koleżeńska', description: 'Pomoc innemu studentowi w zrozumieniu materiału', time: 'Tydzień temu'}
  ];
  i = 0;
  while (i < receivedactivities.length) {
    receivedactivities[i].top = i * 12.25 + 38 + '%';
    i = i + 1;
  }
  const [activities, setActivities] = useState(receivedactivities.slice(0, 5));

  var receivedbadges = [
    {id: 0, image: 'rgb(66, 243, 125)', name: 'Pierwszy krok', description0: 'Rozpocząłeś swoją akademicką przygodę w świecie wiedzy.', description1: 'Zarejestrowano pierwsze logowanie do systemu.', reward: 50, time: 'Miesiąc temu', rarity: 'common'},
    {id: 1, image: 'rgb(99, 179, 237)', name: 'Systematyk', description0: 'Twoja wytrwałość buduje fundamenty sukcesu.', description1: 'Uczestnictwo w 10 zajęciach z rzędu bez nieobecności.', reward: 150, time: '2 tygodnie temu', rarity: 'uncommon'},
    {id: 2, image: 'rgb(245, 158, 11)', name: 'Mistrz Algebry', description0: 'Liczby i równania nie mają przed Tobą tajemnic.', description1: 'Uzyskano 100% z kolokwium z Algebry Liniowej.', reward: 300, time: 'Tydzień temu', rarity: 'rare'},
    {id: 3, image: 'rgb(168, 85, 247)', name: 'Nocny Marek', description0: 'Gdy inni śpią, Ty zdobywasz wiedzę.', description1: 'Oddano 5 zadań po godzinie 23:00.', reward: 100, time: '3 dni temu', rarity: 'uncommon'},
    {id: 4, image: 'rgb(239, 68, 68)', name: 'Pomocna dłoń', description0: 'Twoja wiedza oświetla drogę innym.', description1: 'Pomoc 3 różnym studentom potwierdzona przez prowadzącego.', reward: 200, time: '5 dni temu', rarity: 'rare'},
    {id: 5, image: 'rgb(34, 197, 94)', name: 'Pogromca Deadlineów', description0: 'Czas płynie, a Ty zawsze jesteś o krok przed nim.', description1: 'Wszystkie zadania oddane przed terminem przez cały semestr.', reward: 500, time: '2 dni temu', rarity: 'legendary'},
    {id: 6, image: 'rgb(59, 130, 246)', name: 'Aktywista', description0: 'Twój głos rozbrzmiewał na salach wykładowych.', description1: 'Zadano 20 pytań podczas zajęć.', reward: 120, time: '4 dni temu', rarity: 'common'},
    {id: 7, image: 'rgb(236, 72, 153)', name: 'Wszechstronny', description0: 'Poszerzasz horyzonty we wszystkich kierunkach.', description1: 'Zdobyto punkty w 5 różnych kategoriach aktywności.', reward: 180, time: '6 dni temu', rarity: 'uncommon'},
    {id: 8, image: 'rgb(251, 191, 36)', name: 'Legenda Wydziału', description0: 'Twoje imię zapisze się w annałach akademii.', description1: 'Osiągnięto najwyższą pozycję w rankingu semestralnym.', reward: 1000, time: 'Wczoraj', rarity: 'mythic'},
    {id: 9, image: 'rgb(139, 92, 246)', name: 'Projektant', description0: 'Z chaosu kodu wyłania się dzieło sztuki.', description1: 'Ukończono projekt zespołowy z oceną bardzo dobrą.', reward: 350, time: '3 dni temu', rarity: 'rare'}
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
      receivedbadges[i].left = '1%';
    } else {
      receivedbadges[i].left = '34%';
    }
    receivedbadges[i].top = Math.floor(i / 2) * 31 + 38 + '%';
    i = i + 1;
  }
  const [badges, setBadges] = useState(receivedbadges.slice(0, 4));

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
    setBackgroundheight(Math.max(100, activitiesheight, badgesheight) + '%');
  }

  useEffect(() => {
    onFetchStudent();
  }, []);

  return (
    <div className="profile-content">
      <div className="profile-content__inner">
      
        <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '65%', height: '30%', position: 'absolute', top: '1%', left: '1%', borderBottom: '4px solid rgb(66, 243, 125)', borderRadius: '16px'}}>
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
        <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '32%', height: '30%', position: 'absolute', top: '1%', left: '67%', borderBottom: '4px solid rgb(66, 243, 125)', borderRadius: '16px'}}>
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
        <div style = {{width: '32.5%', height: '7%', position: 'absolute', top: '31%', left: '1%', color: 'rgb(227, 224, 247)', fontSize: '150%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Odznaki</div>
        <div style = {{width: '32.5%', height: '7%', position: 'absolute', top: '31%', left: '33.5%', color: 'rgb(66, 243, 125)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-end', paddingRight: '1%'}}><span onClick={() => toggleAll('badges')} style={{cursor: 'pointer'}}>{badgeslabel}</span></div>
        <div style = {{width: '16%', height: '7%', position: 'absolute', top: '31%', left: '67%', color: 'rgb(227, 224, 247)', fontSize: '150%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Aktywności</div>
        <div style = {{width: '16%', height: '7%', position: 'absolute', top: '31%', left: '83%', color: 'rgb(66, 243, 125)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-end', paddingRight: '1%'}}><span onClick={() => toggleAll('activities')} style={{cursor: 'pointer'}}>{activitieslabel}</span></div>
        {badges.map((badge) => (

          <div key = {'badge' + badge.id} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '32%', height: '30%', position: 'absolute', top: badge.top, left: badge.left, borderLeft: '4px solid ' + badge.colour, borderRadius: '16px'}}>
            <div style = {{backgroundColor: badge.image, width: '13%', height: '25%', position: 'absolute', top: '2.5%', left: '2.5%', borderRadius: '50%'}}></div>
            <div style = {{width: '82%', height: '8%', position: 'absolute', top: '2.5%', left: '18%', color: 'rgb(227, 224, 247)', fontSize: '100%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{badge.name}</span></div>
            <div style = {{width: '82%', height: '7%', position: 'absolute', top: '12.5%', left: '18%', color: 'rgb(66, 243, 125)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>OPIS FABULARNY</span></div>
            <div style = {{width: '82%', height: '19%', position: 'absolute', top: '21.5%', left: '18%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden'}}>{badge.description0}</span></div>
            <div style = {{width: '82%', height: '7%', position: 'absolute', top: '42.5%', left: '18%', color: 'rgb(66, 243, 125)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>OPIS DYDAKTYCZNY</span></div>
            <div style = {{width: '82%', height: '19%', position: 'absolute', top: '51.5%', left: '18%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden'}}>{badge.description1}</span></div>
            <div style = {{width: '82%', height: '7%', position: 'absolute', top: '72.5%', left: '18%'}}>
              <div style = {{width: '75%', height: '100%', position: 'absolute', top: '0%', left: '0%', color: 'rgb(66, 243, 125)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>NAGRODA</span></div>
              <div style = {{width: '12.5%', height: '100%', position: 'absolute', top: '0%', left: '75%', color: 'rgb(66, 243, 125)', fontSize: '100%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{badge.reward}</span></div>
              <div style = {{backgroundColor: 'rgb(255, 0, 255)', width: '7.5%', height: '100%', position: 'absolute', top: '0%', left: '90%'}}></div>
            </div>
            <div style = {{width: '82%', height: '7%', position: 'absolute', top: '81.5%', left: '18%', color: 'rgb(187, 203, 185)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>• {badge.time}</span></div>
            <div style = {{width: '82%', height: '7%', position: 'absolute', top: '90.5%', left: '18%', color: 'rgb(187, 203, 185)', fontSize: '75%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{badge.rarity}</span></div>
          </div>
        ))}

        {activities.map((activity) => (
          <div key={'activity' + activity.id} style={{backgroundColor: 'rgb(26, 26, 42)', width: '32%', height: '12%', position: 'absolute', top: activity.top, left: '67%', borderLeft: '4px solid rgb(66, 243, 125)', borderRadius: '16px'}}>
            <div style={{backgroundColor: activity.image, width: '16%', height: '75%', position: 'absolute', top: '12.5%', left: '2.5%', borderRadius: '50%'}}></div>
            <div style={{width: '79%', height: '25%', position: 'absolute', top: '5%', left: '21%', color: 'rgb(227, 224, 247)', fontSize: '100%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{activity.name}</span></div>
            <div style={{width: '79%', height: '25%', position: 'absolute', top: '35%', left: '21%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style={{whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis'}}>{activity.description}</span></div>
            <div style={{width: '79%', height: '25%', position: 'absolute', top: '65%', left: '21%', color: 'rgb(187, 203, 185)', fontSize: '75%', display: 'flex', fontWeight: 100, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>• {activity.time}</span></div>
          </div>
        ))}
      </div>
      {errorMessage && <p className="profile-content__error">{errorMessage}</p>}
    </div>
  );
}
