Treści ekranów (zawartość główna pod layoutem)

- pages/content/<nazwa>/ — komponent *Content.jsx (+ opcjonalnie *Content.css przy własnych stylach)
- pages/links/ — cienkie strony podpięte w createAppRouter.jsx (importują treść z content)
- Wspólne style prostych stron z nagłówkiem: import '../RouteContent.css' w *Content.jsx

Layouty z pod-nawigacją (bez osobnego „content”): pages/links/groups/layouts/, pages/links/groups/control/
