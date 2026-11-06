/**
 * @file ProfileStudentProfileContext.js
 * @description Główny komponent widoku strony dla obszaru ProfileStudentProfileContext.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { createContext, useContext } from 'react';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/** @type {import('react').Context<ReturnType<typeof import('./useGroupStudentProfile.js').useGroupStudentProfile> | null>} */

export const ProfileStudentProfileContext = createContext(null);

// === GŁÓWNY KOMPONENT WIDOKU ===
export function useProfileStudentProfileContext() {
  const context = useContext(ProfileStudentProfileContext);

if (!context) {
    throw new Error('useProfileStudentProfileContext must be used within ProfilePageLayout');
  }

// === RENDEROWANIE WIDOKU ===
  return context;
}
