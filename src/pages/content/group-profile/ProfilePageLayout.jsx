import { useEffect, useState } from 'react';
import { Divider, SubNav, CurrencyDisplay } from '../../../components/ui/index.js';
import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import { useGroupLives } from '../../../context/GroupLivesContext.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import { formatProfileNumber } from '../../../services/studentProfile.api.js';
import { fetchGroupInventoryHistory, fetchStudentInventoryHistory } from '../../../services/shop.api.js';
import {
  GROUP_INVENTORY_INVALIDATED,
  STUDENT_PROFILE_INVALIDATED,
  subscribeGroupScopedEvent,
} from '../../../services/studentProfileEvents.js';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { ProfileStudentProfileContext } from './ProfileStudentProfileContext.js';
import { useGroupStudentProfile } from './useGroupStudentProfile.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './ProfilePageLayout.css';

const LOADING_MESSAGE__TEXTLABEL = {
  polish: 'Ładowanie profilu…',
  english: 'Loading profile…'
};

const EYEBROW_LABEL__TEXTLABEL = {
  polish: 'Profil',
  english: 'Profile'
};

const DEFAULT_STUDENT_NAME__TEXTLABEL = {
  polish: 'Student',
  english: 'Student'
};

const NO_RANK_TEXT__TEXTLABEL = {
  polish: 'Brak rangi',
  english: 'No rank'
};

const STATS_LABELS = {
  currency: { polish: 'Stan konta', english: 'Balance' },
  totalEarned: { polish: 'Łącznie zdobyta waluta', english: 'Total earned' },
  badgesCount: { polish: 'Liczba odznak', english: 'Badges count' },
  purchasedItems: { polish: 'Zakupione przedmioty', english: 'Purchased items' },
  usedItems: { polish: 'Użyte przedmioty', english: 'Used items' },
  lives: { polish: 'Liczba żyć', english: 'Lives' },
  lostLives: { polish: 'Utracone życia', english: 'Lost lives' },
};

function ProfileStatLine({ label, value, isCurrency = false }) {
  return (
    <div className="profile-page-layout__stat-line">
      <span className="profile-page-layout__stat-label">{label}</span>
      {isCurrency ? (
        <CurrencyDisplay amount={value} size="sm" className="profile-page-layout__stat-value" />
      ) : (
        <span className="profile-page-layout__stat-value">{value}</span>
      )}
    </div>
  );
}

export default function ProfilePageLayout({ children }) {
  const profileState = useGroupStudentProfile();
  const { groupId, profile, isLoading, error, refetch, studentId } = profileState;
  const { livesEnabled: groupLivesEnabled } = useGroupLives();
  const navKey = studentId ? 'group-student-profile' : 'group-profile';
  const nav = useGroupSubNav(navKey);
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const { profile: userProfile, avatarUrl: userAvatarUrl } = useUserProfile();

  const [historyStats, setHistoryStats] = useState({ purchasedCount: 0, usedCount: 0 });

  const loadHistoryStats = async () => {
    if (!groupId) return;
    if (studentId && !profile?.studentAccountId) return;
    try {
      const targetAccountId = studentId ? profile?.studentAccountId : null;
      const res = targetAccountId
        ? await fetchStudentInventoryHistory(groupId, targetAccountId)
        : await fetchGroupInventoryHistory(groupId);
      if (res.ok && Array.isArray(res.history)) {
        const purchased = res.history.filter((h) => h.type === 'SHOP_PURCHASE').length;
        const used = res.history.filter((h) => h.type === 'ITEM_USED').length;
        setHistoryStats({ purchasedCount: purchased, usedCount: used });
      }
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    if (!studentId && userProfile) {
      refetch();
    }
  }, [studentId, userProfile?.nickname, userProfile?.avatarId, refetch, userProfile]);

  useEffect(() => {
    loadHistoryStats();
  }, [groupId, studentId, profile?.studentAccountId]);

  useEffect(() => {
    if (!groupId) return undefined;
    const unsubInv = subscribeGroupScopedEvent(GROUP_INVENTORY_INVALIDATED, (evGroupId) => {
      if (evGroupId === String(groupId)) {
        loadHistoryStats();
      }
    });
    const unsubProf = subscribeGroupScopedEvent(STUDENT_PROFILE_INVALIDATED, (evGroupId) => {
      if (evGroupId === String(groupId)) {
        refetch();
        loadHistoryStats();
      }
    });
    return () => {
      unsubInv();
      unsubProf();
    };
  }, [groupId, refetch]);

  const avatarUrl = profile?.avatarUrl ?? userAvatarUrl;
  const displayName = profile?.nickname
    ? `${profile.name || ''} ${profile.surname || ''} (${profile.nickname})`.trim()
    : `${profile?.name || ''} ${profile?.surname || ''}`.trim() || DEFAULT_STUDENT_NAME__TEXTLABEL[LANGUAGE];

  const subNavItems = nav.items.map((item) => {
    if (item.id === 'badges') {
      const count = profile?.badgesCount ?? profile?.earnedBadges?.length ?? 0;
      return { ...item, badge: count };
    }
    return item;
  });

  const purchasedDisplay = profile?.purchasedItemsCount != null
    ? formatProfileNumber(profile.purchasedItemsCount)
    : formatProfileNumber(historyStats.purchasedCount);

  const usedDisplay = profile?.usedItemsCount != null
    ? formatProfileNumber(profile.usedItemsCount)
    : formatProfileNumber(historyStats.usedCount);

  const showLivesStats = profile?.livesEnabled != null
    ? Boolean(profile.livesEnabled)
    : Boolean(groupLivesEnabled);
  const livesDisplay = profile?.lives != null ? formatProfileNumber(profile.lives) : '-';
  const lostLivesDisplay = profile?.lostLivesCount != null ? formatProfileNumber(profile.lostLivesCount) : '-';
  const eyebrowLabel = studentId
    ? (LANGUAGE === 'polish' ? 'Profil uczestnika' : 'Participant profile')
    : EYEBROW_LABEL__TEXTLABEL[LANGUAGE];

  return (
    <ProfileStudentProfileContext.Provider value={profileState}>
      <section className="profile-page profile-page-layout" aria-label={nav.sectionTitle}>
        {isLoading ? <p className="profile-page-layout__message">{LOADING_MESSAGE__TEXTLABEL[LANGUAGE]}</p> : null}
        {error ? <p className="profile-page-layout__error" role="alert">{error}</p> : null}

        {profile ? (
          <>
            <header className="profile-page-layout__header">
              <p className="profile-page-layout__eyebrow">{eyebrowLabel}</p>
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
                <p className="profile-page-layout__rank-caption">{profile.rankName || NO_RANK_TEXT__TEXTLABEL[LANGUAGE]}</p>
              </div>

              <Divider orientation="vertical" className="profile-page-layout__summary-divider" />

              <div className="profile-page-layout__stats-column">
                <ProfileStatLine
                  label={STATS_LABELS.currency[LANGUAGE]}
                  value={profile.currency ?? 0}
                  isCurrency
                />
                <ProfileStatLine
                  label={STATS_LABELS.totalEarned[LANGUAGE]}
                  value={profile.totalEarned ?? 0}
                  isCurrency
                />
                <ProfileStatLine
                  label={STATS_LABELS.badgesCount[LANGUAGE]}
                  value={formatProfileNumber(profile.badgesCount ?? profile.earnedBadges?.length ?? 0)}
                />
                <ProfileStatLine
                  label={STATS_LABELS.purchasedItems[LANGUAGE]}
                  value={purchasedDisplay}
                />
                <ProfileStatLine
                  label={STATS_LABELS.usedItems[LANGUAGE]}
                  value={usedDisplay}
                />
                {showLivesStats ? (
                  <>
                    <ProfileStatLine
                      label={STATS_LABELS.lives[LANGUAGE]}
                      value={livesDisplay}
                    />
                    <ProfileStatLine
                      label={STATS_LABELS.lostLives[LANGUAGE]}
                      value={lostLivesDisplay}
                    />
                  </>
                ) : null}
              </div>
            </div>

            <Divider className="profile-page-layout__section-divider" />

            <div className="profile-page-layout__sub-nav-wrap">
              <SubNav ariaLabel={nav.ariaLabel} items={subNavItems} className="profile-page-layout__sub-nav" />
            </div>

            <div className="profile-page-layout__content">{children}</div>
          </>
        ) : null}
      </section>
    </ProfileStudentProfileContext.Provider>
  );
}
