import { useState } from 'react';
import AppLogo from '../../../components/ui/AppLogo/AppLogo.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './GroupsListHero.css';

const SYSTEMLABEL__TEXTLABEL = {
  polish: 'System do grywalizacji',
  english: 'Gamification System',
};
const APPDESCRIPTION__TEXTLABEL = {
  polish: 'Witaj, Wędrowcze! Przed Tobą most łączący akademię z epickimi kampaniami i misjami. Wybierz swoją drużynę, zdobywaj odznaki i wymieniaj zasoby na korzyści dydaktyczne.',
  english: 'Welcome, Wanderer! Ahead of you lies a bridge connecting academia with epic campaigns and missions. Choose your team, earn badges and exchange resources for educational benefits.',
};

export default function GroupsListHero() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  return (
    <header className="groups-list-hero" aria-labelledby="groups-list-hero-title">
      <div className="groups-list-hero__content">
        <p className="groups-list-hero__eyebrow">{SYSTEMLABEL__TEXTLABEL[LANGUAGE]}</p>
        <h1 id="groups-list-hero-title" className="groups-list-hero__title">
          MyAcademyQuest
        </h1>
        <p className="groups-list-hero__description">
          {APPDESCRIPTION__TEXTLABEL[LANGUAGE]}
        </p>
      </div>

      <div className="groups-list-hero__logo-wrap" aria-hidden="true">
        <AppLogo className="groups-list-hero__logo" width={120} height={120} alt="" />
      </div>
    </header>
  );
}
