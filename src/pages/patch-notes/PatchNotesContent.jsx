/**
 * @file PatchNotesContent.jsx
 * @description Główny komponent widoku informacji o aktualizacjach systemu dla użytkowników.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useState } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const PAGETITLE__TEXTLABEL = {
  polish: 'Informacje o aktualizacji',
  english: 'Patch Notes',
};

const PAGEDESCRIPTION__TEXTLABEL = {
  polish: 'Przeglądaj historię wydań, najnowsze ulepszenia i pobieraj oficjalne zestawienia zmian w formacie PDF.',
  english: 'Browse release history, recent enhancements, and download official PDF changelogs.',
};

// === INFORMACJE O WYDANIACH (DOSTĘPNE DLA WSZYSTKICH: /patch-notes) ===
/**
 * Rola: Wszyscy użytkownicy systemu.
 * Ścieżka: /patch-notes.
 * Możliwości:
 * - Przeglądanie listy ostatnich aktualizacji platformy
 * - Pobieranie pełnych dokumentów PDF z opisem zmian
 * - Dostęp do archiwum historycznych wydań
 */
export default function PatchNotesContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  // === RENDEROWANIE WIDOKU ===
  return (
    <AppSectionPage
      title={PAGETITLE__TEXTLABEL[LANGUAGE]}
      description={PAGEDESCRIPTION__TEXTLABEL[LANGUAGE]}
    />
  );
}

