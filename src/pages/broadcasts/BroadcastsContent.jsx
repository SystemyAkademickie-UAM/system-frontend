/**
 * @file BroadcastsContent.jsx
 * @description Główny komponent widoku komunikatów i trybu przerwy technicznej dla osoby nadzorującej.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import BroadcastsContentContent from './BroadcastsContentContent.jsx';

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

  // === RENDEROWANIE WIDOKU ===
  return (
    <BroadcastsContentContent />
  );
}

