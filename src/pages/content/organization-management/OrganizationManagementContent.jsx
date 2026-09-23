import { useState } from 'react';
import AppSectionPage from '../../../components/page/AppSectionPage.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const PAGETITLE__TEXTLABEL = {
  polish: 'Zarządzanie organizacjami',
  english: 'Organization Management'
};

const PAGEDESCRIPTION__TEXTLABEL = {
  polish: 'Twórz i konfiguruj organizacje oraz nadawaj uprawnienia pozwalające na administrowanie nimi.',
  english: 'Create and configure organizations and assign administrator permissions.'
};

export default function OrganizationManagementContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <AppSectionPage
      title={PAGETITLE__TEXTLABEL[LANGUAGE]}
      description={PAGEDESCRIPTION__TEXTLABEL[LANGUAGE]}
    />
  );
}
