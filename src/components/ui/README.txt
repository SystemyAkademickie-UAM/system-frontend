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

--- Badge (odznaka) ---
  import { Badge, BADGE_RARITY } from '../../components/ui/index.js';

  <Badge
    rarity={BADGE_RARITY.common}
    name="Dzielny Królik"
    storyDescription="Królik nie uciekł z pola misji."
    didacticDescription="Opis warunków zdobycia…"
    rewardAmount={10}
    rewardEmoji="🥕"
    earnedAt="Dzisiaj"
    showEarnedAt={true}
  />

  rarity: common | uncommon | rare | epic
  showEarnedAt={false} — ukrywa stopkę z czasem zdobycia

--- BadgeMini (mini odznaka + podgląd pełnej) ---
  <BadgeMini
    rarity={BADGE_RARITY.common}
    name="Dzielny Królik"
    storyDescription="…"
    didacticDescription="…"
    rewardAmount={10}
    previewOnHover
    selected={isSelected}
    onSelectedChange={setIsSelected}
  />

  previewOnHover — pełna odznaka przy kursorze
  klik — przełącza stan zaznaczenia (odznaczona / zaznaczona)

--- Rank (ranga) ---
  import { Rank } from '../../components/ui/index.js';

  <Rank
    name="Rekrut"
    costAmount={0}
    costEmoji="🥕"
    storyDescription="Świeżo zrekrutowany królik. Lubi marchew i Sędzię Annę Marię Wesołowską na tefałenie."
    shopItems={['+0,5 do oceny', 'zaliczenie wejściówki']}
  />

  theme — motyw kolorystyczny (domyślnie 'default'; rozszerzalny)
  accentColor — dynamiczny kolor akcentu (gradient rang)
  isLocked — szary wariant dla studenta (ranga nieodblokowana)

--- ProductCard (kafelek produktu sklepu) ---
  import { ProductCard } from '../../components/ui/index.js';

  <ProductCard
    name="Konsultacja z Mistrzem"
    storyDescription="Trzydzieści minut bezpośredniego łącza z Wielkim Mistrzem programu."
    didacticDescription="Indywidualna rozmowa wideo 15 minut w celu rozwiązania blokad na ścieżce nauki."
    priceAmount={1200}
    priceEmoji="🥕"
    imageUrl="/api/..."
    badgeLabel="Epicka"
    onBuy={() => {}}
  />

  priceEmoji — opcjonalne nadpisanie symbolu waluty (jak rewardEmoji w Badge);
  bez propsa CurrencyDisplay korzysta z GroupCurrencyContext (placeholder 🥕).

--- PlayerAvatar (awatar użytkownika) ---
  import { PlayerAvatar } from '../../components/ui/index.js';

  <PlayerAvatar
    nickname="KrólikMarcin"
    avatarUrl="/api/..."
    totalEarned={150}
    currencySymbol="🥕"
    tooltipPlacement="left"
  />

  tooltipPlacement: right | left | top
  Po najechaniu: nick + zgromadzona waluta

Kolory: src/styles/tokens.css
