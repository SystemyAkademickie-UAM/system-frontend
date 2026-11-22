/**
 * @file DocumentsContent.jsx
 * @description Główny komponent widoku zarządzania dokumentami i patch notesami dla osoby nadzorującej.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import DocumentsContentContent from './DocumentsContentContent.jsx';

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

  // === RENDEROWANIE WIDOKU ===
  return (
    <DocumentsContentContent />
  );
}

