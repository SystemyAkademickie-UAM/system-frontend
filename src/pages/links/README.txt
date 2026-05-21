Strony podpięte w routerze (createAppRouter.jsx)

- pages/links/<obszar>/ — cienkie *Page.jsx importujące treść z pages/content/
- pages/links/groups/ — trasy grupowe; podfoldery odpowiadają segmentom URL pod /groups/:groupId/
  - groups-list/     → /groups
  - main/            → /main/*
  - profile/         → /profile/*
  - members/         → /members/*
  - activities/      → /activities/*
  - posts/           → /posts
  - rewards/         → /rewards/*
  - group-settings/  → /groupsettings/*  (folder ≠ segment URL)
  - shop/            → /shop/*
  - ranking/         → /ranking/*
  - layouts/         → layouty z <Outlet /> dla sekcji z podstronami
