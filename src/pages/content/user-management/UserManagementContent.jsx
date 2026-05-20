import { useState } from 'react';
import {
  Button,
  ConfirmActions,
  PageHeader,
  Pagination,
  SearchBar,
  SubNav,
} from '../../../components/ui/index.js';
import './UserManagementContent.css';

const SUB_NAV_ITEMS = [
  { id: 'users', label: 'Użytkownicy' },
  { id: 'activity', label: 'Etapy i aktywności' },
  { id: 'posts', label: 'Wpisy' },
];

export default function UserManagementContent() {
  const [activeSection, setActiveSection] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [listPage, setListPage] = useState(1);

  return (
    <section className="user-management" aria-labelledby="user-management-page-title">
      <PageHeader
        title="Zarządzanie Użytkownikami"
        description="Zarządzaj wszystkim wygodnie z jednego miejsca"
      />

      <SubNav
        ariaLabel="Sekcje zarządzania"
        items={SUB_NAV_ITEMS}
        activeId={activeSection}
        onSelect={setActiveSection}
      />

      <div className="user-management__toolbar">
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj kampanii..."
        />
        <Button onClick={() => {}}>Kup teraz</Button>
      </div>

      <Pagination totalPages={10} page={listPage} onPageChange={setListPage} />

      <ConfirmActions
        onReject={() => {}}
        onConfirm={() => {}}
      />
    </section>
  );
}
