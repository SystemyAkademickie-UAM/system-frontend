import { publicAssetPath } from '../../../utils/publicAssetUrl.js';
import './GroupsListHero.css';

export default function GroupsListHero() {
  const logoSrc = publicAssetPath('assets/logomyacademyquest.png');

  return (
    <header className="groups-list-hero" aria-labelledby="groups-list-hero-title">
      <div className="groups-list-hero__content">
        <p className="groups-list-hero__eyebrow">System do grywalizacji</p>
        <h1 id="groups-list-hero-title" className="groups-list-hero__title">
          MyAcademyQuest
        </h1>
        <p className="groups-list-hero__description">
          Witaj, Wędrowcze! Przed Tobą most łączący akademię z epickimi kampaniami i misjami. Wybierz
          swoją drużynę, zdobywaj odznaki i wymieniaj zasoby na korzyści dydaktyczne.
        </p>
      </div>

      <div className="groups-list-hero__logo-wrap" aria-hidden="true">
        <img
          className="groups-list-hero__logo"
          src={logoSrc}
          alt=""
          width={120}
          height={120}
          decoding="async"
        />
      </div>
    </header>
  );
}
