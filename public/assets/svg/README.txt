Pliki SVG — public/assets/svg/
================================

Ścieżka w przeglądarce: /assets/svg/<podfolder>/<plik>.svg
W kodzie: import { SVG_ICONS } from 'src/constants/svgIcons.js'
          <AssetSvg name={SVG_ICONS.actions.add} />

Stałe ścieżek: src/constants/svgIcons.js
Resolver URL: src/utils/svgAssetPath.js (resolveSvgAssetName, svgAssetPath)

Gdy brak pliku, emoji zamiast .svg lub błąd ładowania → shared/placeholder.svg


Struktura folderów
--------------------

shared/
  placeholder.svg     — jedyny plik zastępczy w całej aplikacji

actions/
  add.svg             — dodaj element (etap, rekord, itd.)
  assign.svg          — przypisz (aktywność, rangę, uczestnika)
  grant.svg           — nadaj / przyznaj (np. odznakę)
  delete.svg          — usuń
  manage-badges.svg   — zarządzaj odznakami uczestnika
  manage-progress.svg — zarządzaj postępem uczestnika

controls/
  close.svg           — zamknij (modal, panel)
  search.svg          — wyszukiwarka
  more.svg            — menu kontekstowe (⋮)
  chevron-left.svg    — strzałka w lewo
  chevron-right.svg   — strzałka w prawo

content/
  star.svg            — gwiazda / wyróżnienie (SuperBar)
  money.svg           — waluta (SuperBar)
  settings.svg        — ustawienia (SuperBar)
  user.svg            — użytkownik (SuperBar)

status/
  check.svg           — ukończone (aktywność)
  lock.svg            — zablokowane (aktywność)
  check-circle.svg    — potwierdzenie / lista
  info.svg            — podpowiedź (InfoTooltip)

nav/
  breadcrumb-home.svg — domek w breadcrumb SuperBar (lista grup)
  group-main.svg      — siatka „Strona główna” w sidebarze
  home.svg            — legacy (nie używać w nowym kodzie)
  profile.svg         — profil
  shop.svg            — sklep
  ranking.svg         — ranking
  settings.svg        — ustawienia aplikacji
  users.svg           — użytkownicy / członkowie
  activity.svg        — aktywności
  posts.svg           — wpisy
  rewards.svg         — nagrody
  group-settings.svg  — ustawienia grupy
  groups.svg          — lista grup
  stats.svg           — statystyki
  organization.svg    — organizacja
  courses.svg         — kursy
  logout.svg          — wyloguj


Nawigacja boczna (Sidebar)
----------------------------
iconId w shellTemplates.config.js = ścieżka bez .svg, np. nav/group-main
NavGlyph ładuje: nav/group-main.svg (Strona główna grupy)

Breadcrumb SuperBar
-------------------
SuperBarBreadcrumb używa SVG_ICONS.nav.breadcrumbHome → nav/breadcrumb-home.svg


Dodawanie nowej ikony
---------------------
1. Wrzuć plik do właściwego podfolderu (angielska nazwa, uniwersalna akcja/treść).
2. Dodaj stałą w src/constants/svgIcons.js.
3. Użyj SVG_ICONS w komponencie — nie hardkoduj ścieżek w JSX.
4. Uzupełnij ten README.
