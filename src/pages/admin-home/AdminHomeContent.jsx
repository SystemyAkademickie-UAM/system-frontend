/**
 * @file AdminHomeContent.jsx
 * @description Główny komponent widoku panelu organizacji dla osoby administrującej.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useState } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const PAGETITLE__TEXTLABEL = {
  polish: 'Zarządzanie organizacją',
  english: 'Organization Management',
};

const PAGEDESCRIPTION__TEXTLABEL = {
  polish: 'Przeglądaj podsumowanie organizacji, parametry działania oraz kluczowe ustawienia instytucji.',
  english: 'Overview of organization metrics, operating parameters, and key institution settings.',
};

// === ZARZĄDZANIE ORGANIZACJĄ (OSOBA ADMINISTRUJĄCA: /home) ===
/**
 * Rola: Osoba administrująca (Admin).
 * Ścieżka: /home (strona główna administratora).
 * Uprawnienia:
 * - Zarządzanie parametrami organizacji
 * - Przegląd podsumowania aktywności i struktury
 * - Konfiguracja reguł instytucji
 */
export default function AdminHomeContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  // === RENDEROWANIE WIDOKU ===
  return (
    <AppSectionPage
      title={PAGETITLE__TEXTLABEL[LANGUAGE]}
      description={PAGEDESCRIPTION__TEXTLABEL[LANGUAGE]}
    />
  );
}

