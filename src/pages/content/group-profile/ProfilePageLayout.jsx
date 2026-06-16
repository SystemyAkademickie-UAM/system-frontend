import { useEffect } from 'react';
import { Divider, SubNav } from '../../../components/ui/index.js';
import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import { formatProfileNumber } from '../../../services/studentProfile.api.js';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { ProfileStudentProfileContext } from './ProfileStudentProfileContext.js';
import { useGroupStudentProfile } from './useGroupStudentProfile.js';
import './ProfilePageLayout.css';

function ProfileStatLine({ label, value }) {
  return (
    <div className="profile-page-layout__stat-line">
      <span className="profile-page-layout__stat-label">{label}</span>
      <span className="profile-page-layout__stat-value">{value}</span>
    </div>
  );
}

export default function ProfilePageLayout({ children }) {
  const nav = useGroupSubNav('group-profile');
  const profileState = useGroupStudentProfile();
  const { profile, isLoading, error, refetch, studentId } = profileState;
  const { profile: userProfile, avatarUrl: userAvatarUrl } = useUserProfile();

  useEffect(() => {
    if (!studentId && userProfile) {
      refetch();
    }
  }, [studentId, userProfile?.nickname, userProfile?.avatarId, refetch, userProfile]);

  const subNavItems = studentId
    ? nav.items.map((item) => ({
        ...item,
        to: item.to
          ? item.to.replace(
              `/groups/${profileState.groupId}/profile`,
              `/groups/${profileState.groupId}/studentprofile/${studentId}`,
            )
          : item.to,
      }))
    : nav.items;

  const nickname = (profile?.nickname || userProfile?.nickname || '').trim();
  const legalName = [profile?.name, profile?.surname].filter(Boolean).join(' ').trim();
  const displayName = nickname || legalName || 'Student';
  const avatarUrl = profile?.avatarUrl || userAvatarUrl;

  return (
    <ProfileStudentProfileContext.Provider value={profileState}>
      <section className="profile-page profile-page-layout" aria-label={nav.sectionTitle}>
        {isLoading ? <p className="profile-page-layout__message">Ładowanie profilu…</p> : null}
        {error ? <p className="profile-page-layout__error" role="alert">{error}</p> : null}

        {profile ? (
          <>
            <header className="profile-page-layout__header">
              <p className="profile-page-layout__eyebrow">Profil</p>
              <h1 className="profile-page-layout__title">{displayName}</h1>
            </header>

            <div className="profile-page-layout__summary">
              <div className="profile-page-layout__avatar-column">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className={getAvatarImageClassName(avatarUrl, 'profile-page-layout__avatar')}
                  />
                ) : (
                  <div className="profile-page-layout__avatar profile-page-layout__avatar--placeholder" />
                )}
                <p className="profile-page-layout__rank-caption">{profile.rankName || 'Brak rangi'}</p>
              </div>

              <Divider orientation="vertical" className="profile-page-layout__summary-divider" />

              <div className="profile-page-layout__stats-column">
                <ProfileStatLine label="Zdobyta waluta" value={formatProfileNumber(profile.totalEarned)} />
                <ProfileStatLine label="Zdobyte odznaki" value={formatProfileNumber(profile.badgesCount)} />
                <ProfileStatLine label="Obecny ranking" value="X" />
                <ProfileStatLine label="Najwyższa pozycja" value="X" />
              </div>
            </div>

            <Divider className="profile-page-layout__section-divider" />

            <div className="profile-page-layout__sub-nav-wrap">
              <SubNav ariaLabel={nav.ariaLabel} items={subNavItems} className="profile-page-layout__sub-nav" />
            </div>
          </>
        ) : null}

        <div className="profile-page-layout__content">{children}</div>
      </section>
    </ProfileStudentProfileContext.Provider>
  );
}
