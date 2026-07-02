import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useToast } from '../../../components/ui/Toast/Toast.jsx';
import { loginPath } from '../../../routes/pathRegistry.js';
import './WelcomeContent.css';

function IntroParagraph() {
  return (
    <p className="welcome-hero__intro">
      Witaj, Wędrowcze. Stoisz u bram portalu łączącego uczelnie zrzeszające adeptów wszelkich{' '}
      <span className="welcome-hero__highlight">sztuk</span>
      {' '}oraz nauk gotowych zdobywać wiedzę i poszerzać swoje{' '}
      <span className="welcome-hero__highlight">umiejętności</span>
      {' '}w najodleglejszych krainach i czasach. Po drugiej stronie próżno szukać{' '}
      <span className="welcome-hero__highlight">wykładów i warsztatów</span>
      . Ich miejsce zajmują epickie kampanie, sekretne misje oraz ekscytujące{' '}
      <span className="welcome-hero__highlight">ekspedycje</span>
      . Czy nie brak Ci sprytu i odwagi by przejść do świata, gdzie nauka i przygoda stanowią{' '}
      <span className="welcome-hero__highlight">jedno?</span>
    </p>
  );
}

export default function WelcomeContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess } = useToast();
  const pickRandom = (array) => array[Math.floor(Math.random() * array.length)];
  const words0 = ['zabawa', 'przygoda', 'wyprawa', 'ekspedycja', 'podróż', 'eksploracja'];
  const [randomword0, setrandomword0] = useState('');
  const words1 = ['portalu', 'magii', 'przygodzie'];
  const [randomword1, setrandomword1] = useState('');

  const lines0 = ['sztuk', 'dziedzin', 'dyscyplin', 'rzemiosł', 'profesji'];
  const [randomline0, setrandomline0] = useState('');
  const lines1 = ['umiejętności', 'talenty', 'kompetencje', 'moce', 'atuty'];
  const [randomline1, setrandomline1] = useState('');
  const lines2 = ['wykładów i warsztatów', 'zajęć i seminariów', 'lekcji i ćwiczeń', 'kursów i treningów'];
  const [randomline2, setrandomline2] = useState('');
  const lines3 = ['ekspedycje', 'wyprawy', 'misje', 'podróże', 'eskapady', 'kampanie'];
  const [randomline3, setrandomline3] = useState('');
  const lines4 = ['jedno', 'jedność', 'całość', 'harmonię', 'nierozłączną całość'];
  const [randomline4, setrandomline4] = useState('');


  const refreshRandomWords = () => {
    setrandomword0(pickRandom(words0));
    setrandomword1(pickRandom(words1));

    setrandomline0(pickRandom(lines0));
    setrandomline1(pickRandom(lines1));
    setrandomline2(pickRandom(lines2));
    setrandomline3(pickRandom(lines3));
    setrandomline4(pickRandom(lines4));
  };




  const [screenwidth, setScreenwidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setScreenwidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);



  useEffect(() => {
    if (searchParams.get('loggedOut') != '1') {
      return;
    }
    showSuccess('Wylogowano pomyślnie.');
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, showSuccess]);

const [ticks, setTicks] = useState(0);
const [change, setChange] = useState(1);

useEffect(() => {
  const interval = setInterval(() => {
    setTicks(previous => {
      let next = previous + change;

      if (next >= 50) {
        next = 50;
        setChange(-1);
      }

      if (next <= 0) {
        next = 0;
        setChange(1);
      }

      return next;
    });
  }, 25);

  return () => clearInterval(interval);
}, [change]);

useEffect(() => {

  setrandomword0(words0[Math.floor(Math.random() * words0.length)]);

  setrandomword1(words1[Math.floor(Math.random() * words1.length)]);


  setrandomline0(lines0[Math.floor(Math.random() * lines0.length)]);

  setrandomline1(lines1[Math.floor(Math.random() * lines1.length)]);

  setrandomline2(lines2[Math.floor(Math.random() * lines2.length)]);

  setrandomline3(lines3[Math.floor(Math.random() * lines3.length)]);

  setrandomline4(lines4[Math.floor(Math.random() * lines4.length)]);

}, []);

  return (
    <div className = "welcome-hero">
      <div className = "welcome-hero__bg" aria-hidden = "true">
        <div className = "welcome-hero__bg-image" />
        <div className = "welcome-hero__bg-glow" />
        <div className = "welcome-hero__stars" />
        <div className = "welcome-hero__vignette" />
      </div>

      <div className="welcome-hero__content">



        <div style = {{width: '100%', height: '10%', position: 'fixed', display: 'flex', top: '10%', alignItems: 'center', justifyContent: 'center'}}>
          <div style = {{width: '50%', height: '20%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>

              <img src = "/images/maq-logo.png" style = {{height: '1000%', objectFit: 'contain'}} />

            <span style = {{color: 'rgb(187, 203, 185)', fontWeight: 900, fontSize: '172px'}}>A</span>
            <span style = {{color: 'rgb(30, 204, 56)', fontWeight: 900, fontSize: '172px'}}>Q</span>
          </div>
        </div>

        <div onMouseEnter={() => setrandomword0(pickRandom(words0))} style = {{width: '30%', height: '10%', position: 'fixed', top: '20%', left: '70%', fontSize: 'clamp(21px, 2vw, 28px)', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', transform: `rotate(-15deg) scale(${1 - ticks * 0.01})`}}><span style = {{color: 'rgb(187, 203, 185)'}}>Nauka to</span> <span style = {{color: 'rgb(30, 204, 56)'}}>{randomword0}</span></div>


        <div onMouseEnter={() => setrandomline0(pickRandom(lines0))} style = {{width: '100%', height: '7.5%', position: 'fixed', top: '47.5%', left: '0%', fontSize: 'clamp(12px, 2vw, 28px)', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span style = {{color: 'rgb(187, 203, 185)'}}>Witaj, Wędrowcze. Stoisz u bram portalu łączącego uczelnie zrzeszające adeptów wszelkich</span> <span style = {{color: 'rgb(30, 204, 56)'}}>{randomline0}</span></div>
        <div onMouseEnter={() => setrandomline1(pickRandom(lines1))} style = {{width: '100%', height: '7.5%', position: 'fixed', top: '55%', left: '0%', fontSize: 'clamp(12px, 2vw, 28px)', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span style = {{color: 'rgb(187, 203, 185)'}}>oraz nauk gotowych zdobywać wiedzę i poszerzać swoje</span> <span style = {{color: 'rgb(30, 204, 56)'}}>{randomline1}</span></div>
        <div onMouseEnter={() => setrandomline2(pickRandom(lines2))} style = {{width: '100%', height: '7.5%', position: 'fixed', top: '62.5%', left: '0%', fontSize: 'clamp(12px, 2vw, 28px)', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span style = {{color: 'rgb(187, 203, 185)'}}>w najodleglejszych krainach i czasach. Po drugiej stronie próżno szukać</span> <span style = {{color: 'rgb(30, 204, 56)'}}>{randomline2}.</span></div>
        <div onMouseEnter={() => setrandomline3(pickRandom(lines3))} style = {{width: '100%', height: '7.5%', position: 'fixed', top: '70%', left: '0%', fontSize: 'clamp(12px, 2vw, 28px)', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span style = {{color: 'rgb(187, 203, 185)'}}>Ich miejsce zajmują epickie kampanie, sekretne misje oraz ekscytujące</span> <span style = {{color: 'rgb(30, 204, 56)'}}>{randomline3}.</span></div>

        <div onMouseEnter={() => setrandomline4(pickRandom(lines4))} style = {{width: '100%', height: '7.5%', position: 'fixed', top: '80%', left: '0%', fontSize: 'clamp(12px, 2vw, 28px)', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span style = {{color: 'rgb(187, 203, 185)'}}>Czy nie brak Ci sprytu i odwagi by przejść do świata, gdzie nauka i przygoda stanowią</span> <span style = {{color: 'rgb(30, 204, 56)'}}>{randomline4}?</span></div>


          <div style = {{width: '100%', height: '10%', position: 'fixed', top: '32.5%', left: '0%', fontSize: 'clamp(35px, 10vw, 70px)', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}><span style = {{color: 'rgb(187, 203, 185)'}}>MyAcademy</span><span style = {{color: 'rgb(30, 204, 56)'}}>Quest</span></div>
        <Link to = {loginPath()}>
            <div onMouseEnter={(event) => {setrandomword1(pickRandom(words1)); event.currentTarget.style.backgroundColor = 'rgba(30, 204, 56, 0.2)';}} onMouseLeave={(event) => (event.currentTarget.style.backgroundColor = 'rgba(30, 204, 56, 0.1)')} style = {{backgroundColor: 'rgba(30, 204, 56, 0.1)', width: '20%', height: '10%', position: 'fixed', top: '2.5%', left: '77.5%', fontSize: 'clamp(10px, 1.5vw, 28px)', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', color: 'rgb(187, 203, 185)', borderRadius: '32px'}}><span style = {{color: 'rgb(187, 203, 185)'}}>Zanurz się w</span> <span style = {{color: 'rgb(30, 204, 56)'}}>{randomword1}</span></div>
        </Link>
      </div>


      <footer className = "welcome-hero__footer welcome-hero__reveal welcome-hero__reveal--4">
        MyAcademyQuest 2026 ©
      </footer>
    </div>
  );
}



