/**
 * @file TemplatesPageLayout.jsx
 * @description Komponent układu strony (layout) dla sekcji TemplatesPageLayout.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SectionPageLayout from '../../components/layout/sectionPage/SectionPageLayout.jsx';
import useAppSubNav from '../../navigation/useAppSubNav.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import '../shared/groupSectionPage.css';
import './TemplatesPageLayout.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const PAGE_TITLE__TEXTLABEL = {
  polish: 'Szablony',

english: 'Templates'
};

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function TemplatesPageLayout() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

const nav = useAppSubNav('app-templates');

// === RENDEROWANIE WIDOKU ===
  return (
    <div className="app-page-layout">
      <SectionPageLayout
        className="templates-page page-unavailable"
        title={PAGE_TITLE__TEXTLABEL[LANGUAGE]}
        subNavItems={nav.items}
        subNavAriaLabel={nav.ariaLabel}
      >
        <Outlet />
      </SectionPageLayout>
    </div>
  );
}
