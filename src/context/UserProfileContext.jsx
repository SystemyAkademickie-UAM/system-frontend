import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchAvatars, fetchProfile } from '../services/profile.api.js';
import { useSession } from './SessionContext.jsx';

const UserProfileContext = createContext(null);

/**
 * Profil użytkownika (ksywka, awatar) — wspólne dla SuperBar i ustawień.
 */
export function UserProfileProvider({ children }) {
  const { isAuthenticated } = useSession();
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const refetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setProfile(null);
      setAvatarUrl(null);
      return null;
    }

    setIsLoading(true);
    try {
      const [userProfile, avatars] = await Promise.all([
        fetchProfile(),
        fetchAvatars(),
      ]);

      setProfile(userProfile);

      if (userProfile?.avatarId) {
        const avatar = avatars.find((item) => item.id === userProfile.avatarId);
        setAvatarUrl(avatar?.imageUrl ?? null);
      } else {
        setAvatarUrl(null);
      }

      return userProfile;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refetchProfile();
  }, [refetchProfile]);

  const value = useMemo(
    () => ({
      profile,
      avatarUrl,
      isLoading,
      refetchProfile,
    }),
    [profile, avatarUrl, isLoading, refetchProfile],
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return ctx;
}
