/**
 * @file AdminPerspectiveNav.jsx
 * @description Wewnętrzna nawigacja boczna perspektywy grupy (odpowiednik paska bocznego prowadzącego lub studenta).
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import AssetSvg from '../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import './AdminGroupPerspective.css';

export default function AdminPerspectiveNav({
  groupId,
  role, // 'lecturer' | 'student'
}) {
  const [openGroups, setOpenGroups] = useState({
    members: true,
    activities: true,
    rewards: true,
    settings: true,
    profile: true,
  });

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isLecturer = role === 'lecturer';

  return (
    <nav className="admin-persp-nav" aria-label="Nawigacja wewnętrzna grupy">
      <div className="admin-persp-nav__items">
        {/* Strona Główna */}
        <NavLink
          to={`/groups/${groupId}/admin/home`}
          end
          className={({ isActive }) =>
            `admin-persp-nav__link ${isActive ? 'admin-persp-nav__link--active' : ''}`
          }
        >
          <AssetSvg name={SVG_ICONS.nav.groupMain} className="admin-persp-nav__icon" width={18} height={18} alt="" />
          <span>Strona Główna</span>
        </NavLink>

        {isLecturer ? (
          <>
            {/* Użytkownicy / Członkowie */}
            <div className="admin-persp-nav__group">
              <button
                type="button"
                className="admin-persp-nav__group-trigger"
                onClick={() => toggleGroup('members')}
              >
                <div className="admin-persp-nav__group-label">
                  <AssetSvg name={SVG_ICONS.nav.users} className="admin-persp-nav__icon" width={18} height={18} alt="" />
                  <span>Użytkownicy</span>
                </div>
                <span className={`admin-persp-nav__arrow ${openGroups.members ? 'admin-persp-nav__arrow--open' : ''}`}>▾</span>
              </button>
              {openGroups.members ? (
                <div className="admin-persp-nav__sublinks">
                  <NavLink
                    to={`/groups/${groupId}/admin/members`}
                    end
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Osoby uczestniczące
                  </NavLink>
                  <NavLink
                    to={`/groups/${groupId}/admin/members/codes`}
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Kody dostępu
                  </NavLink>
                </div>
              ) : null}
            </div>

            {/* Aktywności */}
            <div className="admin-persp-nav__group">
              <button
                type="button"
                className="admin-persp-nav__group-trigger"
                onClick={() => toggleGroup('activities')}
              >
                <div className="admin-persp-nav__group-label">
                  <AssetSvg name={SVG_ICONS.nav.activity} className="admin-persp-nav__icon" width={18} height={18} alt="" />
                  <span>Aktywności</span>
                </div>
                <span className={`admin-persp-nav__arrow ${openGroups.activities ? 'admin-persp-nav__arrow--open' : ''}`}>▾</span>
              </button>
              {openGroups.activities ? (
                <div className="admin-persp-nav__sublinks">
                  <NavLink
                    to={`/groups/${groupId}/admin/activities`}
                    end
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Etapy i zadania
                  </NavLink>
                  <NavLink
                    to={`/groups/${groupId}/admin/activities/posts`}
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Wpisy
                  </NavLink>
                  <NavLink
                    to={`/groups/${groupId}/admin/activities/tools`}
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Raporty
                  </NavLink>
                </div>
              ) : null}
            </div>

            {/* Systemy nagród */}
            <div className="admin-persp-nav__group">
              <button
                type="button"
                className="admin-persp-nav__group-trigger"
                onClick={() => toggleGroup('rewards')}
              >
                <div className="admin-persp-nav__group-label">
                  <AssetSvg name={SVG_ICONS.nav.rewards} className="admin-persp-nav__icon" width={18} height={18} alt="" />
                  <span>Systemy nagród</span>
                </div>
                <span className={`admin-persp-nav__arrow ${openGroups.rewards ? 'admin-persp-nav__arrow--open' : ''}`}>▾</span>
              </button>
              {openGroups.rewards ? (
                <div className="admin-persp-nav__sublinks">
                  <NavLink
                    to={`/groups/${groupId}/admin/rewards`}
                    end
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Odznaki
                  </NavLink>
                  <NavLink
                    to={`/groups/${groupId}/admin/rewards/ranks`}
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Rangi
                  </NavLink>
                  <NavLink
                    to={`/groups/${groupId}/admin/rewards/shop-items`}
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Zarządzanie sklepem
                  </NavLink>
                </div>
              ) : null}
            </div>

            {/* Ustawienia grupy */}
            <div className="admin-persp-nav__group">
              <button
                type="button"
                className="admin-persp-nav__group-trigger"
                onClick={() => toggleGroup('settings')}
              >
                <div className="admin-persp-nav__group-label">
                  <AssetSvg name={SVG_ICONS.nav.settings} className="admin-persp-nav__icon" width={18} height={18} alt="" />
                  <span>Ustawienia grupy</span>
                </div>
                <span className={`admin-persp-nav__arrow ${openGroups.settings ? 'admin-persp-nav__arrow--open' : ''}`}>▾</span>
              </button>
              {openGroups.settings ? (
                <div className="admin-persp-nav__sublinks">
                  <NavLink
                    to={`/groups/${groupId}/admin/group-settings`}
                    end
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Edytor
                  </NavLink>
                  <NavLink
                    to={`/groups/${groupId}/admin/group-settings/currency`}
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Waluta
                  </NavLink>
                  <NavLink
                    to={`/groups/${groupId}/admin/group-settings/lives`}
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    System żyć
                  </NavLink>
                </div>
              ) : null}
            </div>

            {/* Sklep (widok sklepu) */}
            <NavLink
              to={`/groups/${groupId}/admin/shop`}
              className={({ isActive }) =>
                `admin-persp-nav__link ${isActive ? 'admin-persp-nav__link--active' : ''}`
              }
            >
              <AssetSvg name={SVG_ICONS.nav.shop} className="admin-persp-nav__icon" width={18} height={18} alt="" />
              <span>Sklep</span>
            </NavLink>
          </>
        ) : (
          /* Student nav */
          <>
            <NavLink
              to={`/groups/${groupId}/admin/posts`}
              className={({ isActive }) =>
                `admin-persp-nav__link ${isActive ? 'admin-persp-nav__link--active' : ''}`
              }
            >
              <AssetSvg name={SVG_ICONS.nav.posts} className="admin-persp-nav__icon" width={18} height={18} alt="" />
              <span>Wpisy</span>
            </NavLink>

            {/* Profil studenta */}
            <div className="admin-persp-nav__group">
              <button
                type="button"
                className="admin-persp-nav__group-trigger"
                onClick={() => toggleGroup('profile')}
              >
                <div className="admin-persp-nav__group-label">
                  <AssetSvg name={SVG_ICONS.nav.profile} className="admin-persp-nav__icon" width={18} height={18} alt="" />
                  <span>Profil</span>
                </div>
                <span className={`admin-persp-nav__arrow ${openGroups.profile ? 'admin-persp-nav__arrow--open' : ''}`}>▾</span>
              </button>
              {openGroups.profile ? (
                <div className="admin-persp-nav__sublinks">
                  <NavLink
                    to={`/groups/${groupId}/admin/profile/activity`}
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Dziennik aktywności
                  </NavLink>
                  <NavLink
                    to={`/groups/${groupId}/admin/profile`}
                    end
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Odznaki
                  </NavLink>
                  <NavLink
                    to={`/groups/${groupId}/admin/profile/eq`}
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Ekwipunek
                  </NavLink>
                  <NavLink
                    to={`/groups/${groupId}/admin/profile/purchases`}
                    className={({ isActive }) =>
                      `admin-persp-nav__sublink ${isActive ? 'admin-persp-nav__sublink--active' : ''}`
                    }
                  >
                    Historia zakupów
                  </NavLink>
                </div>
              ) : null}
            </div>

            <NavLink
              to={`/groups/${groupId}/admin/activity-list`}
              className={({ isActive }) =>
                `admin-persp-nav__link ${isActive ? 'admin-persp-nav__link--active' : ''}`
              }
            >
              <AssetSvg name={SVG_ICONS.nav.activity} className="admin-persp-nav__icon" width={18} height={18} alt="" />
              <span>Lista aktywności</span>
            </NavLink>

            <NavLink
              to={`/groups/${groupId}/admin/badges`}
              className={({ isActive }) =>
                `admin-persp-nav__link ${isActive ? 'admin-persp-nav__link--active' : ''}`
              }
            >
              <AssetSvg name={SVG_ICONS.nav.badges} className="admin-persp-nav__icon" width={18} height={18} alt="" />
              <span>Odznaki</span>
            </NavLink>

            <NavLink
              to={`/groups/${groupId}/admin/ranks`}
              className={({ isActive }) =>
                `admin-persp-nav__link ${isActive ? 'admin-persp-nav__link--active' : ''}`
              }
            >
              <AssetSvg name={SVG_ICONS.nav.ranks} className="admin-persp-nav__icon" width={18} height={18} alt="" />
              <span>Rangi</span>
            </NavLink>

            <NavLink
              to={`/groups/${groupId}/admin/users`}
              className={({ isActive }) =>
                `admin-persp-nav__link ${isActive ? 'admin-persp-nav__link--active' : ''}`
              }
            >
              <AssetSvg name={SVG_ICONS.nav.users} className="admin-persp-nav__icon" width={18} height={18} alt="" />
              <span>Osoby uczestniczące</span>
            </NavLink>

            <NavLink
              to={`/groups/${groupId}/admin/shop`}
              className={({ isActive }) =>
                `admin-persp-nav__link ${isActive ? 'admin-persp-nav__link--active' : ''}`
              }
            >
              <AssetSvg name={SVG_ICONS.nav.shop} className="admin-persp-nav__icon" width={18} height={18} alt="" />
              <span>Sklep</span>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

