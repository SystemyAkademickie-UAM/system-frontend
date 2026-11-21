/**
 * @file AdminSwitchUserModal.jsx
 * @description Modal wyboru użytkownika (prowadzący lub student grupy) dla perspektywy grupy.
 */

import { useMemo, useState } from 'react';
import { Button, Modal, SearchBar } from '../../../components/ui/index.js';
import './AdminGroupPerspective.css';

export default function AdminSwitchUserModal({
  isOpen,
  onClose,
  teacher,
  students = [],
  activeUser,
  onSelectUser,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const matchName = s.name?.toLowerCase().includes(q);
      const matchEmail = s.email?.toLowerCase().includes(q);
      const matchNum = s.studentNumber?.toLowerCase().includes(q);
      return matchName || matchEmail || matchNum;
    });
  }, [students, searchQuery]);

  if (!isOpen) return null;

  const isTeacherActive = activeUser?.type === 'lecturer';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Zmień perspektywę użytkownika"
      showFooter={false}
      size="lg"
      className="admin-switch-user-modal"
    >
      <div className="admin-switch-user__body">
        {/* Prowadzący */}
        <div className="admin-switch-user__section">
          <h4 className="admin-switch-user__title">Osoba prowadząca</h4>
          <div
            className={[
              'admin-switch-user__item',
              isTeacherActive ? 'admin-switch-user__item--active' : '',
            ].filter(Boolean).join(' ')}
          >
            <div className="admin-switch-user__item-info">
              <span className="admin-switch-user__item-name">
                {teacher?.name || 'Prowadzący grupy'}
              </span>
              <span className="admin-switch-user__item-meta">
                {teacher?.email || 'Konto prowadzącego'}
              </span>
            </div>
            {isTeacherActive ? (
              <span className="admin-switch-user__active-badge">Aktywny</span>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onSelectUser({
                    type: 'lecturer',
                    accountId: teacher?.accountId || teacher?.id,
                    name: teacher?.name || 'Prowadzący',
                  });
                  onClose();
                }}
              >
                Przełącz na prowadzącego
              </Button>
            )}
          </div>
        </div>

        {/* Studenci */}
        <div className="admin-switch-user__section">
          <div className="admin-switch-user__section-header">
            <h4 className="admin-switch-user__title">
              Studenci grupy ({students.length})
            </h4>
          </div>

          <SearchBar
            className="admin-switch-user__search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj studenta po nazwisku, e-mailu lub indeksie..."
          />

          <div className="admin-switch-user__list">
            {filteredStudents.length === 0 ? (
              <p className="admin-switch-user__empty">
                {searchQuery ? 'Brak studentów pasujących do wyszukiwania.' : 'Brak studentów w tej grupie.'}
              </p>
            ) : (
              filteredStudents.map((s) => {
                const isCurrentActive =
                  activeUser?.type === 'student' &&
                  Number(activeUser.accountId) === Number(s.accountId);

                return (
                  <div
                    key={s.accountId}
                    className={[
                      'admin-switch-user__item',
                      isCurrentActive ? 'admin-switch-user__item--active' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <div className="admin-switch-user__item-info">
                      <span className="admin-switch-user__item-name">{s.name}</span>
                      <span className="admin-switch-user__item-meta">
                        {s.email} {s.studentNumber ? `• Nr indeksu: ${s.studentNumber}` : ''}
                      </span>
                      <span className="admin-switch-user__item-stats">
                        Punkty: {s.currency ?? 0} {s.lives != null ? `• Życia: ${s.lives}` : ''}
                      </span>
                    </div>

                    {isCurrentActive ? (
                      <span className="admin-switch-user__active-badge">Aktywny</span>
                    ) : (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          onSelectUser({
                            type: 'student',
                            accountId: s.accountId,
                            name: s.name,
                            studentNumber: s.studentNumber,
                            currency: s.currency ?? 0,
                            lives: s.lives ?? 0,
                          });
                          onClose();
                        }}
                      >
                        Przełącz na studenta
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

