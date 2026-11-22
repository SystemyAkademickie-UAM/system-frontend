/**
 * @file AdminGroupPerspectiveLayout.jsx
 * @description Układ „perspektywy grupy” (VirtualBox shell) dla administratora/nadzorcy.
 * Umożliwia symulację i interakcję jako prowadzący lub wybrany student danej grupy
 * bez duplikacji komponentów stron aplikacji.
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchGroupMembersManage } from '../../../services/groups.api.js';
import { setImpersonatedStudentId } from '../../../services/api-client.js';
import { AppRoleContext } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { useToast } from '../../../components/ui/index.js';
import AdminPerspectiveNav from './AdminPerspectiveNav.jsx';
import AdminSwitchUserModal from './AdminSwitchUserModal.jsx';
import './AdminGroupPerspective.css';

export default function AdminGroupPerspectiveLayout() {
  const { groupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [studentsList, setStudentsList] = useState([]);

  // Active perspective user: { type: 'lecturer' | 'student', accountId, name, studentNumber?, currency?, lives? }
  const [activeUser, setActiveUser] = useState({
    type: 'lecturer',
    accountId: null,
    name: 'Prowadzący',
  });

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  // Load group details & members
  useEffect(() => {
    if (!groupId) return;
    let isCancelled = false;
    setIsLoading(true);

    fetchGroupMembersManage(groupId).then((result) => {
      if (isCancelled) return;
      setIsLoading(false);

      if (!result.ok) {
        showError(result.error || 'Nie udało się pobrać danych perspektywy grupy.');
        return;
      }

      const g = result.group || {};
      const teacher = result.availableLecturers?.find((l) => Number(l.accountId) === Number(g.teacherAccountId))
        || g.teacher
        || (g.teacherAccountId ? { accountId: g.teacherAccountId, name: 'Prowadzący grupy' } : null);

      setGroupData(g);
      setTeacherData(teacher);
      setStudentsList(result.students || []);

      // Default active user is group teacher if present, otherwise first student or unassigned
      if (teacher?.accountId) {
        setActiveUser({
          type: 'lecturer',
          accountId: teacher.accountId,
          name: teacher.name || 'Prowadzący',
        });
      } else if (result.students && result.students.length > 0) {
        const firstStudent = result.students[0];
        setActiveUser({
          type: 'student',
          accountId: firstStudent.accountId,
          name: `${firstStudent.name} ${firstStudent.surname}`.trim() || firstStudent.nickname || 'Student',
          currency: firstStudent.currency,
          lives: firstStudent.lives,
        });
      } else {
        setActiveUser({
          type: 'lecturer',
          accountId: null,
          name: 'Brak prowadzącego',
        });
      }
      setImpersonatedStudentId(null);
    });

    return () => {
      isCancelled = true;
      setImpersonatedStudentId(null);
    };
  }, [groupId, showError]);

  // Update impersonation header whenever activeUser changes
  useEffect(() => {
    if (activeUser?.type === 'student' && activeUser?.accountId) {
      setImpersonatedStudentId(activeUser.accountId);
    } else {
      setImpersonatedStudentId(null);
    }
  }, [activeUser]);

  const handleSelectUser = useCallback(
    (user) => {
      setActiveUser(user);
      if (user.type === 'student') {
        setImpersonatedStudentId(user.accountId);
        showSuccess(`Przełączono perspektywę na studenta: ${user.name}`);

        // If currently on a lecturer-only page, redirect to home
        const lecturerOnlySubpaths = ['members', 'activities', 'rewards', 'group-settings'];
        const isLecturerPage = lecturerOnlySubpaths.some((sub) =>
          location.pathname.includes(`/admin/${sub}`)
        );
        if (isLecturerPage) {
          navigate(`/groups/${groupId}/admin/home`, { replace: true });
        }
      } else {
        setImpersonatedStudentId(null);
        showSuccess(`Przełączono perspektywę na prowadzącego: ${user.name}`);

        // If currently on a student-only page, redirect to home
        const studentOnlySubpaths = ['posts', 'users', 'activity-list', 'badges', 'ranks', 'profile'];
        const isStudentPage = studentOnlySubpaths.some((sub) =>
          location.pathname.includes(`/admin/${sub}`)
        );
        if (isStudentPage) {
          navigate(`/groups/${groupId}/admin/home`, { replace: true });
        }
      }
    },
    [groupId, location.pathname, navigate, showSuccess]
  );

  const effectiveRole = activeUser.type === 'lecturer' ? APP_ROLE.LECTURER : APP_ROLE.STUDENT;
  const roleContextValue = useMemo(() => ({ role: effectiveRole }), [effectiveRole]);

  if (isLoading) {
    return (
      <div className="admin-persp-loading">
        <p>Inicjalizacja perspektywy grupy...</p>
      </div>
    );
  }

  const groupName = groupData?.name || `Grupa ${groupId}`;

  return (
    <div className="admin-persp-shell">
      {/* Wewnętrzny pasek górny perspektywy (VirtualBox topbar) */}
      <header className="admin-persp-topbar">
        <div className="admin-persp-topbar__start">
          <span className="admin-persp-topbar__title" title={groupName}>
            Perspektywa: {groupName}
          </span>
        </div>

        <div className="admin-persp-topbar__end">
          {activeUser.type === 'student' ? (
            <div className="admin-persp-topbar__stats">
              {activeUser.lives != null ? (
                <span className="admin-persp-stat-pill admin-persp-stat-pill--lives" title="Liczba żyć studenta">
                  Życia: {activeUser.lives}
                </span>
              ) : null}
              <span className="admin-persp-stat-pill admin-persp-stat-pill--currency" title="Waluta studenta">
                Punkty: {activeUser.currency ?? 0}
              </span>
            </div>
          ) : null}

          <div className="admin-persp-topbar__user-identity">
            {activeUser.accountId ? (
              <>
                <span className="admin-persp-topbar__user-name" title={activeUser.name}>
                  {activeUser.name}
                </span>
                <span className="admin-persp-topbar__user-role">
                  {activeUser.type === 'lecturer' ? 'Prowadzący' : 'Student'}
                </span>
              </>
            ) : (
              <span className="admin-persp-topbar__user-role admin-persp-topbar__user-role--empty">
                Grupa bez prowadzącego
              </span>
            )}
          </div>

          <button
            type="button"
            className="admin-persp-btn-switch"
            onClick={() => setIsSwitchModalOpen(true)}
          >
            Zmień użytkownika
          </button>

          <Link to="/groups" className="admin-persp-btn-leave" title="Powrót do listy grup">
            Opuść perspektywę
          </Link>
        </div>
      </header>

      {/* Kontener wewnętrzny: wewnętrzna nawigacja + treść */}
      <div className="admin-persp-container">
        <AdminPerspectiveNav groupId={groupId} role={effectiveRole} />

        <main className="admin-persp-content">
          <AppRoleContext.Provider value={roleContextValue}>
            <Outlet context={{ activeUser, isPerspective: true }} />
          </AppRoleContext.Provider>
        </main>
      </div>

      <AdminSwitchUserModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        teacher={teacherData}
        students={studentsList}
        activeUser={activeUser}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
}

