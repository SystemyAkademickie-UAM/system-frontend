components/ui/ — współdzielone elementy interfejsu

Import:
  import { Button, PageHeader, SubNav, SearchBar, ConfirmActions } from '../../components/ui/index.js';

--- PageHeader ---
  <PageHeader title="Tytuł" description="Opis podstrony" />

--- SubNav (zakładki) ---
  // z React Router (ścieżki względne):
  <SubNav
    ariaLabel="Sekcje"
    items={[
      { id: 'a', label: 'Użytkownicy', to: '.', end: true },
      { id: 'b', label: 'Wpisy', to: 'posts' },
    ]}
  />

  // bez routera (stan lokalny):
  <SubNav
    ariaLabel="Sekcje"
    items={[{ id: 'a', label: 'Użytkownicy' }]}
    activeId={activeId}
    onSelect={setActiveId}
  />

--- SearchBar ---
  <SearchBar value={q} onChange={(e) => setQ(e.target.value)} placeholder="Szukaj…" />

--- Button ---
  <Button onClick={fn}>Zapisz</Button>
  <Button to="/groups" variant="primary">Lista grup</Button>
  variant: primary | secondary | ghost | text | danger
  size: sm | md | lg

--- ConfirmActions ---
  <ConfirmActions onReject={fn} onConfirm={fn} />

Kolory: src/styles/tokens.css
