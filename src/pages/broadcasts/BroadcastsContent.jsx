/**
 * @file BroadcastsContent.jsx
 * @description Główny komponent widoku komunikatów i trybu przerwy technicznej dla osoby nadzorującej.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useState } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const PAGETITLE__TEXTLABEL = {
  polish: 'Komunikaty i przerwa techniczna',
  english: 'Broadcasts and Maintenance',
};

const PAGEDESCRIPTION__TEXTLABEL = {
  polish: 'Rozgłaszaj globalne powiadomienia do wszystkich użytkowników oraz kontroluj tryb przerwy technicznej serwisu.',
  english: 'Broadcast announcements to all users and control system maintenance mode status.',
};

// === ROZGŁASZANIE I PRZERWA TECHNICZNA (OSOBA NADZORUJĄCA: /broadcasts) ===
/**
 * Rola: Osoba nadzorująca (Superadmin).
 * Ścieżka: /broadcasts (oraz alias /boardcasts).
 * Uprawnienia:
 * - Tworzenie i emisja globalnych ogłoszeń broadcast
 * - Harmonogramowanie komunikatów systemowych
 * - Włączanie i wyłączanie ekranu blokady "przerwa techniczna"
 */
export default function BroadcastsContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  // === RENDEROWANIE WIDOKU ===
  return (
    <AppSectionPage
      title={PAGETITLE__TEXTLABEL[LANGUAGE]}
      description={PAGEDESCRIPTION__TEXTLABEL[LANGUAGE]}
    />
  );
}

