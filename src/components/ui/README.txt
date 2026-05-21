components/ui/ — współdzielone elementy interfejsu

Import:
  import { Button, PageHeader, SubNav, SearchBar, ConfirmActions, Pagination, DataTable } from '../../components/ui/index.js';

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

--- Pagination ---
  const [page, setPage] = useState(1);
  <Pagination totalPages={10} page={page} onPageChange={setPage} />

  // bez stanu nadrzędnego (wewnętrzny):
  <Pagination totalPages={5} defaultPage={1} onPageChange={(p) => fetchPage(p)} />

--- DataTable ---
  <DataTable
    columns={[
      { key: 'position', label: 'Numer', sort: 'number', width: '108px' },
      { key: 'name', label: 'Nazwa', sort: 'text', render: (row) => row.name },
      { key: 'rank', label: 'Ranga', sort: { type: 'custom', order: ['Rekrut', 'Uczeń', 'Adept'] } },
    ]}
    data={rows}
    tiebreakerKey="position"
    search={{ placeholder: 'Szukaj…', filter: (row, q) => row.name.includes(q) }}
    toolbarStart={<SubNav ariaLabel="Sekcje" items={items} />}
    rowActions={{
      onDelete: (row) => remove(row.id),
      menuItems: [
        { id: 'edit', label: 'Edytuj', description: 'Krótki opis akcji', onSelect: (row) => {} },
      ],
    }}
  />

  sort kolumny: 'number' | 'text' | { type: 'custom', order: [...] } | false (bez sortowania)

Kolory: src/styles/tokens.css
