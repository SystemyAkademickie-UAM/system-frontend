import { useState } from 'react';
import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import './UserManagementContent.css';

const SUB_NAV_ITEMS = [
  { id: 'users', label: 'Użytkownicy' },
  { id: 'activity', label: 'Etapy i aktywności' },
  { id: 'posts', label: 'Wpisy' },
];

export default function UserManagementContent() {
  const [activeSection, setActiveSection] = useState('users');

  return (
    <PageUnavailable
      className="user-management"
      title="Zarządzanie użytkownikami"
      description="Zarządzaj dostępem, rolami i przypisaniami użytkowników w organizacji."
      subNavAriaLabel="Sekcje zarządzania"
      subNavItems={SUB_NAV_ITEMS}
      activeSubNavId={activeSection}
      onSubNavSelect={setActiveSection}
    />
  );
}
