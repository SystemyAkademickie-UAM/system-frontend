/**
 * @file FaqContent.jsx
 * @description Główny komponent widoku bazy wiedzy i najczęściej zadawanych pytań (FAQ).
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useState } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const PAGETITLE__TEXTLABEL = {
  polish: 'Najczęściej zadawane pytania (FAQ)',
  english: 'Frequently Asked Questions (FAQ)',
};

const PAGEDESCRIPTION__TEXTLABEL = {
  polish: 'Baza wiedzy i odpowiedzi na najczęstsze pytania dotyczące korzystania z aplikacji MyAcademyQuest.',
  english: 'Knowledge base and answers to frequently asked questions about using the MyAcademyQuest platform.',
};

// === BAZA WIEDZY I FAQ (DOSTĘPNA DLA WSZYSTKICH / ZARZĄDZANIE DLA OSOBY NADZORUJĄCEJ: /faq) ===
/**
 * Rola: Wszyscy użytkownicy (przeglądanie); Osoba nadzorująca (zarządzanie).
 * Ścieżka: /faq.
 * Uprawnienia:
 * - Wszyscy użytkownicy: przeglądanie kategorii, wyszukiwanie pytań i odpowiedzi
 * - Osoba nadzorująca: dodawanie, edycja i publikacja wpisów FAQ
 */
export default function FaqContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  // === RENDEROWANIE WIDOKU ===
  return (
    <AppSectionPage
      title={PAGETITLE__TEXTLABEL[LANGUAGE]}
      description={PAGEDESCRIPTION__TEXTLABEL[LANGUAGE]}
    />
  );
}

