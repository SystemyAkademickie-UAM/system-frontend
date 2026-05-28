import AppLogo from '../../../components/ui/AppLogo/AppLogo.jsx';
import './GroupsListHero.css';

export default function GroupsListHero() {
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
        <AppLogo className="groups-list-hero__logo" width={120} height={120} alt="" />
      </div>
    </header>
  );
}
