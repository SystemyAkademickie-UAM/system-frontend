Treści ekranów (zawartość główna pod layoutem)

- pages/content/<nazwa>/ — komponent *Content.jsx + *Content.css
- pages/links/ — cienkie strony podpięte w createAppRouter.jsx (importują treść z content)
- Wspólne style nagłówka prostych stron: pages/content/RouteContent.css (@import w lokalnym *.css)

Layouty z pod-nawigacją (bez osobnego „content”): pages/links/groups/layouts/, pages/links/groups/control/
