import { useEffect } from 'react';
import { SubNav } from '../../../components/ui/index.js';
import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import { formatProfileNumber } from '../../../services/studentProfile.api.js';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { ProfileStudentProfileContext } from './ProfileStudentProfileContext.js';
import { useGroupStudentProfile } from './useGroupStudentProfile.js';
import './ProfilePageLayout.css';

function ProfileStatTile({ label, value }) {
  return (
    <div className="profile-page-layout__stat">
      <span className="profile-page-layout__stat-label">{label}</span>
      <span className="profile-page-layout__stat-value">{value}</span>
    </div>
  );
}

export default function ProfilePageLayout({ children }) {
  const nav = useGroupSubNav('group-profile');
  const profileState = useGroupStudentProfile();
  const { profile, isLoading, error, refetch } = profileState;
  const { profile: userProfile, avatarUrl: userAvatarUrl } = useUserProfile();

  useEffect(() => {
    if (userProfile) {
      refetch();
    }
  }, [userProfile?.nickname, userProfile?.avatarId, refetch, userProfile]);

  const nickname = (profile?.nickname || userProfile?.nickname || '').trim();
  const legalName = [profile?.name, profile?.surname].filter(Boolean).join(' ').trim();
  const displayName = nickname || legalName || 'Student';
  const avatarUrl = profile?.avatarUrl || userAvatarUrl;

  return (
    <ProfileStudentProfileContext.Provider value={profileState}>
      <section className="profile-page profile-page-layout" aria-label={nav.sectionTitle}>
      {isLoading ? (
        <p className="profile-page-layout__message">Ładowanie profilu…</p>
      ) : null}

      {error ? (
        <p className="profile-page-layout__error" role="alert">{error}</p>
      ) : null}

      {profile ? (
        <>
          <div className="profile-page-layout__hero">
            <div className="profile-page-layout__avatar-wrap">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className={getAvatarImageClassName(avatarUrl, 'profile-page-layout__avatar')}
                />
              ) : (
                <div className="profile-page-layout__avatar profile-page-layout__avatar--placeholder" />
              )}
            </div>

            <div className="profile-page-layout__identity">
              <h1 className="profile-page-layout__name">{displayName}</h1>
              {legalName && legalName !== displayName ? (
                <p className="profile-page-layout__legal-name">{legalName}</p>
              ) : null}
              <div className="profile-page-layout__chips">
                {profile.lives ? (
                  <span className="profile-page-layout__chip">{profile.lives}</span>
                ) : null}
                {profile.groupCurrency ? (
                  <span className="profile-page-layout__chip">{profile.groupCurrency}</span>
                ) : null}
                <span className="profile-page-layout__chip">
                  {profile.rankName || 'Brak rangi'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-page-layout__stats">
            <ProfileStatTile
              label="Zdobyta waluta"
              value={formatProfileNumber(profile.totalEarned)}
            />
            <ProfileStatTile
              label="Zdobyte odznaki"
              value={formatProfileNumber(profile.badgesCount)}
            />
            <ProfileStatTile label="Obecny ranking" value="X" />
            <ProfileStatTile label="Najwyższa pozycja" value="X" />
          </div>
        </>
      ) : null}

      <div className="profile-page-layout__sub-nav-wrap">
        <SubNav
          ariaLabel={nav.ariaLabel}
          items={nav.items}
          className="profile-page-layout__sub-nav"
        />
      </div>

      <div className="profile-page-layout__content">
        {children}
      </div>
      </section>
    </ProfileStudentProfileContext.Provider>
  );
}
