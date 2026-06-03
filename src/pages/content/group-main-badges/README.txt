Skarbiec (/groups/:groupId/main/badges)
========================================

Strona katalogu odznak kursu z wyszukiwarką, filtrami, sortowaniem oraz listą
uczestników, którzy zdobyli daną odznakę.

Pliki
-----
- GroupMainBadgesContent.jsx — layout strony, filtry, siatka kafelków
- useGroupMainBadges.js — pobieranie odznak, profilu studenta i mapy zdobywców
- badgeTreasuryModel.js — mapowanie, sortowanie, filtrowanie
- BadgeTreasuryCard.jsx — kafelek odznaki + pasek awatarów
- BadgeEarnersBar.jsx — do 15 awatarów PlayerAvatar + overflow „…”

Zachowanie
----------
- Prowadzący: wszystkie odznaki kolorowe, domyślne sortowanie po jakości (epic → common)
- Student: nieodblokowane odznaki szare (`Badge isLocked`), domyślne sortowanie:
  odblokowane → zablokowane, potem jakość malejąco
- Student nie widzi własnego awatara w pasku zdobywców; prowadzący widzi wszystkich
- Odświeżanie danych przy powrocie do karty (focus / visibilitychange)

Testy: badgeTreasuryModel.test.js
