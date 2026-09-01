import { useState } from 'react';
import AppSectionPage from '../../../components/page/AppSectionPage.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const PAGETITLE__TEXTLABEL = {
  polish: 'Zarządzanie kursami',
  english: 'Course Management'
};

const PAGEDDESCRIPTION__TEXTLABEL = {
  polish: 'Przeglądaj kursy, szablony grup i konfiguracje grywalizacji w organizacji.',
  english: 'Browse courses, group templates, and gamification configurations in your organization.'
};

export default function CourseManagementContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <AppSectionPage
      title={PAGETITLE__TEXTLABEL[LANGUAGE]}
      description={PAGEDDESCRIPTION__TEXTLABEL[LANGUAGE]}
    />
  );
}
