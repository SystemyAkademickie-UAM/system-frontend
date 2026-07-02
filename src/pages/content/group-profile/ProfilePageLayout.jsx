import { useEffect, useState } from 'react';
import { Divider, SubNav, CurrencyDisplay } from '../../../components/ui/index.js';
import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import { fetchGroupRanks } from '../../../services/ranks.api.js';
import { formatProfileNumber } from '../../../services/studentProfile.api.js';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { mapRankDiscountValue } from '../group-main-ranks/rankPathModel.js';
import { ProfileStudentProfileContext } from './ProfileStudentProfileContext.js';
import { useGroupStudentProfile } from './useGroupStudentProfile.js';
import './ProfilePageLayout.css';

function ProfileCurrencyStat({ amount }) {
  return (
    <div className="profile-page-layout__stat-line">
      <span className="profile-page-layout__stat-label">Zdobyta waluta</span>
      <CurrencyDisplay amount={amount} size="sm" className="profile-page-layout__stat-value" />
    </div>
  );
}

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
  const { groupId, profile, isLoading, error, refetch, studentId } = profileState;
  const { profile: userProfile, avatarUrl: userAvatarUrl } = useUserProfile();
  const [shopDiscountPercent, setShopDiscountPercent] = useState(0);

  useEffect(() => {
    if (!studentId && userProfile) {
      refetch();
    }
  }, [studentId, userProfile?.nickname, userProfile?.avatarId, refetch, userProfile]);

  useEffect(() => {
    if (!groupId || profile?.rankId == null) {
      setShopDiscountPercent(0);
      return undefined;
    }

    let cancelled = false;

    fetchGroupRanks(groupId)
      .then((ranks) => {
        if (cancelled) {
          return;
        }
        const rank = ranks.find((entry) => entry.id === profile.rankId);
        setShopDiscountPercent(rank ? mapRankDiscountValue(rank) : 0);
      })
      .catch(() => {
        if (!cancelled) {
          setShopDiscountPercent(0);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [groupId, profile?.rankId]);

  const subNavItems = nav.items;

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

            <Divider className="maq-section-page__divider profile-page-layout__head-divider" />

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
                <ProfileCurrencyStat amount={profile.totalEarned} />
                <ProfileStatLine label="Zdobyte odznaki" value={formatProfileNumber(profile.badgesCount)} />
                <ProfileStatLine label="Zniżka w sklepie" value={`${shopDiscountPercent}%`} />
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
