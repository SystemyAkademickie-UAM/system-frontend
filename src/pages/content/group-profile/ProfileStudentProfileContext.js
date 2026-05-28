import { createContext, useContext } from 'react';

/** @type {import('react').Context<ReturnType<typeof import('./useGroupStudentProfile.js').useGroupStudentProfile> | null>} */
export const ProfileStudentProfileContext = createContext(null);

export function useProfileStudentProfileContext() {
  const context = useContext(ProfileStudentProfileContext);
  if (!context) {
    throw new Error('useProfileStudentProfileContext must be used within ProfilePageLayout');
  }
  return context;
}
