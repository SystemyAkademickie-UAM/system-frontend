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
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './ProfilePageLayout.css';

const CURRENCY_LABEL__TEXTLABEL = {
  polish: 'Zdobyta waluta',
  english: 'Earned currency'
};

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

const BADGES_COUNT_LABEL__TEXTLABEL = {
  polish: 'Zdobyte odznaki',
  english: 'Earned badges'
};

const SHOP_DISCOUNT_LABEL__TEXTLABEL = {
  polish: 'Zniżka w sklepie',
  english: 'Shop discount'
};

function ProfileCurrencyStat({ amount, LANGUAGE }) {
  return (
    <div className="profile-page-layout__stat-line">
      <span className="profile-page-layout__stat-label">{CURRENCY_LABEL__TEXTLABEL[LANGUAGE]}</span>
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
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
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
  const displayName = nickname || legalName || DEFAULT_STUDENT_NAME__TEXTLABEL[LANGUAGE];
  const avatarUrl = profile?.avatarUrl || userAvatarUrl;

  return (
    <ProfileStudentProfileContext.Provider value={profileState}>
      <section className="profile-page profile-page-layout" aria-label={nav.sectionTitle}>
        {isLoading ? <p className="profile-page-layout__message">{LOADING_MESSAGE__TEXTLABEL[LANGUAGE]}</p> : null}
        {error ? <p className="profile-page-layout__error" role="alert">{error}</p> : null}

        {profile ? (
          <>
            <header className="profile-page-layout__header">
              <p className="profile-page-layout__eyebrow">{EYEBROW_LABEL__TEXTLABEL[LANGUAGE]}</p>
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
                <ProfileCurrencyStat amount={profile.totalEarned} LANGUAGE={LANGUAGE} />
                <ProfileStatLine label={BADGES_COUNT_LABEL__TEXTLABEL[LANGUAGE]} value={formatProfileNumber(profile.badgesCount)} />
                <ProfileStatLine label={SHOP_DISCOUNT_LABEL__TEXTLABEL[LANGUAGE]} value={`${shopDiscountPercent}%`} />
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
