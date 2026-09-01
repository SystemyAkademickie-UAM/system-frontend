import { useState } from 'react';
import AppSectionPage from '../../../components/page/AppSectionPage.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './UserManagementContent.css';

const PAGETITLE__TEXTLABEL = {
  polish: 'Zarządzanie użytkownikami',
  english: 'User Management'
};

const PAGEDESCRIPTION__TEXTLABEL = {
  polish: 'Zarządzaj dostępem, rolami i przypisaniami użytkowników w organizacji.',
  english: 'Manage access, roles, and user assignments in your organization.'
};

const SUBNAVITEMS__TEXTLABEL = {
  polish: [
    { id: 'users', label: 'Użytkownicy' },
    { id: 'activity', label: 'Etapy i aktywności' },
    { id: 'posts', label: 'Wpisy' }
  ],
  english: [
    { id: 'users', label: 'Users' },
    { id: 'activity', label: 'Stages and Activities' },
    { id: 'posts', label: 'Posts' }
  ]
};

const SUBNAVLABEL__TEXTLABEL = {
  polish: 'Sekcje zarządzania',
  english: 'Management Sections'
};

const UNAVAILABILEMESSAGE__TEXTLABEL = {
  polish: 'Ta strona jest obecnie niedostępna. Funkcjonalność zostanie udostępniona w kolejnej wersji aplikacji.',
  english: 'This page is currently unavailable. The functionality will be available in the next version of the application.'
};

export default function UserManagementContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [activeSection, setActiveSection] = useState('users');

  return (
    <AppSectionPage
      className="user-management-page"
      title={PAGETITLE__TEXTLABEL[LANGUAGE]}
      description={PAGEDESCRIPTION__TEXTLABEL[LANGUAGE]}
      subNavAriaLabel={SUBNAVLABEL__TEXTLABEL[LANGUAGE]}
      subNavItems={SUBNAVITEMS__TEXTLABEL[LANGUAGE]}
      activeSubNavId={activeSection}
      onSubNavSelect={setActiveSection}
      unavailableMessage={UNAVAILABILEMESSAGE__TEXTLABEL[LANGUAGE]}
    />
  );
}
