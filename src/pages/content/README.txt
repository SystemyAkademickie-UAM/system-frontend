Treści ekranów (zawartość główna pod layoutem)

- pages/content/<nazwa>/ — komponent *Content.jsx (+ opcjonalnie *Content.css)
- pages/links/ — cienkie strony podpięte w createAppRouter.jsx (importują treść z content)
- Wspólne style prostych stron z nagłówkiem: import '../RouteContent.css' w *Content.jsx

Konwencja nazw folderów content dla grup:
- group-<sekcja>/              — strona główna sekcji (np. group-main, group-members)
- group-<sekcja>-<podstrona>/  — podstrona (np. group-settings-currency, group-ranking-group)

Layouty z pod-nawigacją (bez osobnego content): pages/links/groups/layouts/
