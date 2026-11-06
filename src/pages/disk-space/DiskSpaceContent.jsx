/**
 * @file DiskSpaceContent.jsx
 * @description Główny komponent widoku zarządzania przestrzenią dyskową dla osoby administrującej.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useState } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const PAGETITLE__TEXTLABEL = {
  polish: 'Zarządzanie przestrzenią dyskową',
  english: 'Disk Space Management',
};

const PAGEDESCRIPTION__TEXTLABEL = {
  polish: 'Monitoruj zużycie miejsca na dysku, limity przestrzeni oraz pliki i banery grup w organizacji.',
  english: 'Monitor disk space utilization, quotas, and group files and banners within your organization.',
};

// === ZARZĄDZANIE PRZESTRZENIĄ DYSKOWĄ (OSOBA ADMINISTRUJĄCA: /disk-space) ===
/**
 * Rola: Osoba administrująca (Admin).
 * Ścieżka: /disk-space.
 * Uprawnienia:
 * - Zarządzanie przestrzenią dyskową i limitami organizacji
 * - Monitorowanie wolumenu plików i wykorzystania dysku
 * - Kontrola retencji oraz optymalizacja zasobów multimedialnych
 */
export default function DiskSpaceContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  // === RENDEROWANIE WIDOKU ===
  return (
    <AppSectionPage
      title={PAGETITLE__TEXTLABEL[LANGUAGE]}
      description={PAGEDESCRIPTION__TEXTLABEL[LANGUAGE]}
    />
  );
}

