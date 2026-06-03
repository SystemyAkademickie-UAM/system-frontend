group-main-ranks/ — Ścieżka rozwoju (/groups/:groupId/main/ranks)

Pliki:
- GroupMainRanksContent.jsx — strona
- RankPathBoard.jsx — plansza z osią, kafelkami rang i awatarami
- RankPathMembers.jsx — kolumna uczestników (prowadzący)
- useGroupMainRanks.js — pobieranie rang + studentów / profilu studenta
- rankPathModel.js — sortowanie, gradient, pozycja postępu

Oś pionowa:
- TODO: podmienić `.rank-path-board__axis-node` na docelowe ikony SVG (np. wykres / poziom rangi)
- Tymczasowo renderowane są kolorowe kółka powiązane z gradientem rang

Widok prowadzącego:
- rangi kolorowe (zielony → czerwono-pomarańczowy)
- po prawej awatary studentów przypisanych do rangi (max 15 + „…”)

Widok studenta:
- zablokowane rangi szare
- oś: kolorowy postęp do aktualnej waluty, reszta szara
- marker awatara studenta na osi + dymek z zgromadzoną walutą

Odświeżanie:
- dane przeładowują się przy focus / powrocie na kartę (np. po edycji rang w panelu nagród)
