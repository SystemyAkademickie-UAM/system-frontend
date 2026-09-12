import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useAppSubNav from '../../../navigation/useAppSubNav.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './TemplatesPageLayout.css';

const PAGE_TITLE__TEXTLABEL = {
  polish: 'Szablony',
  english: 'Templates'
};

export default function TemplatesPageLayout() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const nav = useAppSubNav('app-templates');

  return (
    <SectionPageLayout
      className="templates-page page-unavailable"
      title={PAGE_TITLE__TEXTLABEL[LANGUAGE]}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
    >
      <Outlet />
    </SectionPageLayout>
  );
}
