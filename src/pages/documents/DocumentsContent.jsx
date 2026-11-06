/**
 * @file DocumentsContent.jsx
 * @description Główny komponent widoku zarządzania dokumentami i patch notesami dla osoby nadzorującej.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useState } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const PAGETITLE__TEXTLABEL = {
  polish: 'Zarządzanie dokumentami i patch notes',
  english: 'Document and Patch Notes Management',
};

const PAGEDESCRIPTION__TEXTLABEL = {
  polish: 'Publikuj i zarządzaj dokumentacją wydań, plikami PDF z informacjami o aktualizacjach oraz regulaminami.',
  english: 'Publish and manage release documentation, patch note PDF documents, and institutional regulations.',
};

// === ZARZĄDZANIE DOKUMENTAMI (OSOBA NADZORUJĄCA: /documents) ===
/**
 * Rola: Osoba nadzorująca (Superadmin).
 * Ścieżka: /documents.
 * Uprawnienia:
 * - Wgrywanie i usuwanie plików PDF z patch notesami
 * - Wersjonowanie dokumentów wydań i historii zmian
 * - Zarządzanie dokumentami prawnymi i regulaminami
 */
export default function DocumentsContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  // === RENDEROWANIE WIDOKU ===
  return (
    <AppSectionPage
      title={PAGETITLE__TEXTLABEL[LANGUAGE]}
      description={PAGEDESCRIPTION__TEXTLABEL[LANGUAGE]}
    />
  );
}

