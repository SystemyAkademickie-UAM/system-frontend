/**
 * @file GroupEditModal.jsx
 * @description Modal edycji grupy i zarządzania jej użytkownikami (prowadzący + studenci) przez administratora.
 */

import { useEffect, useMemo, useState } from 'react';
import { Button, Modal, SearchBar, useToast } from '../../../../components/ui/index.js';
import {
  fetchGroupMembersManage,
  updateGroup,
  updateGroupMembersManage,
} from '../../../../services/groups.api.js';
import './GroupEditModal.css';

export default function GroupEditModal({
  isOpen,
  group,
  onClose,
  onSaved,
}) {
  const { showSuccess, showError } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Group fields
  const [name, setName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');

  // Members data
  const [teacherAccountId, setTeacherAccountId] = useState('');
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [availableLecturers, setAvailableLecturers] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);

  // Change tracking for students
  const [pendingAddIds, setPendingAddIds] = useState([]);
  const [pendingRemoveIds, setPendingRemoveIds] = useState([]);

  // Search filter for available students
  const [searchAvailableStudent, setSearchAvailableStudent] = useState('');
  const [isAddStudentsOpen, setIsAddStudentsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen || !group?.id) return;

    let isCancelled = false;
    setIsLoading(true);
    setPendingAddIds([]);
    setPendingRemoveIds([]);
    setSearchAvailableStudent('');
    setIsAddStudentsOpen(false);

    fetchGroupMembersManage(group.id).then((result) => {
      if (isCancelled) return;
      setIsLoading(false);

      if (!result.ok) {
        showError(result.error || 'Nie udało się pobrać danych grupy.');
        return;
      }

      const g = result.group || {};
      setName(g.name || group.storyName || '');
      setSubjectName(g.subjectName || group.subject || '');
      setDescription(g.description || '');

      setTeacherAccountId(g.teacherAccountId != null ? String(g.teacherAccountId) : '');
      setAssignedStudents(result.students || []);
      setAvailableLecturers(result.availableLecturers || []);
      setAvailableStudents(result.availableStudents || []);
    });

    return () => {
      isCancelled = true;
    };
  }, [isOpen, group?.id, group?.storyName, group?.subject, showError]);

  const effectiveAssignedStudents = useMemo(() => {
    // Current assigned minus pending removed, plus pending added from available
    const existing = assignedStudents.filter((s) => !pendingRemoveIds.includes(s.accountId));
    const added = availableStudents.filter((s) => pendingAddIds.includes(s.accountId));
    return [...existing, ...added];
  }, [assignedStudents, availableStudents, pendingAddIds, pendingRemoveIds]);

  const effectiveAvailableStudents = useMemo(() => {
    const assignedIds = new Set(effectiveAssignedStudents.map((s) => s.accountId));
    const candidates = availableStudents.filter((s) => !assignedIds.has(s.accountId));

    const query = searchAvailableStudent.trim().toLowerCase();
    if (!query) return candidates;

    return candidates.filter((s) => {
      const matchName = s.name?.toLowerCase().includes(query);
      const matchEmail = s.email?.toLowerCase().includes(query);
      const matchNum = s.studentNumber?.toLowerCase().includes(query);
      return matchName || matchEmail || matchNum;
    });
  }, [effectiveAssignedStudents, availableStudents, searchAvailableStudent]);

  const handleToggleRemoveStudent = (accountId) => {
    if (pendingAddIds.includes(accountId)) {
      setPendingAddIds((prev) => prev.filter((id) => id !== accountId));
    } else {
      setPendingRemoveIds((prev) => [...prev, accountId]);
    }
  };

  const handleAddStudent = (accountId) => {
    if (pendingRemoveIds.includes(accountId)) {
      setPendingRemoveIds((prev) => prev.filter((id) => id !== accountId));
    } else {
      setPendingAddIds((prev) => [...prev, accountId]);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showError('Nazwa grupy jest wymagana.');
      return;
    }
    if (!subjectName.trim()) {
      showError('Nazwa przedmiotu jest wymagana.');
      return;
    }

    setIsSaving(true);
    try {
      const selectedTeacherId = teacherAccountId ? Number(teacherAccountId) : undefined;

      // 1. Update basic group details + teacher
      const updateResult = await updateGroup(group.id, {
        name: name.trim(),
        subjectName: subjectName.trim(),
        description: description.trim(),
        teacherAccountId: selectedTeacherId,
      });

      if (!updateResult.ok) {
        showError(updateResult.error || 'Nie udało się zapisać zmian w grupie.');
        setIsSaving(false);
        return;
      }

      // 2. Update members assignments
      const membersResult = await updateGroupMembersManage(group.id, {
        teacherAccountId: selectedTeacherId,
        addStudentAccountIds: pendingAddIds,
        removeStudentAccountIds: pendingRemoveIds,
      });

      if (!membersResult.ok) {
        showError(membersResult.error || 'Nie udało się zapisać listy członków.');
        setIsSaving(false);
        return;
      }

      showSuccess('Grupa i lista użytkowników zostały pomyślnie zaktualizowane.');
      setIsSaving(false);
      onSaved?.();
      onClose();
    } catch (err) {
      setIsSaving(false);
      showError(err instanceof Error ? err.message : 'Wystąpił błąd zapisu.');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSaving) onClose();
      }}
      title="Edycja grupy i członków"
      confirmLabel={isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
      confirmVariant="primary"
      confirmDisabled={isSaving || isLoading}
      onConfirm={handleSave}
      size="xl"
      className="group-edit-modal"
    >
      {isLoading ? (
        <div className="group-edit-modal__loading">
          <p>Ładowanie szczegółów grupy i użytkowników...</p>
        </div>
      ) : (
        <div className="group-edit-modal__body">
          {/* Sekcja 1: Dane podstawowe */}
          <section className="group-edit-modal__section">
            <h3 className="group-edit-modal__section-title">Dane grupy</h3>
            <div className="group-edit-modal__grid-fields">
              <div className="group-edit-modal__field">
                <label className="group-edit-modal__label" htmlFor="group-edit-name">
                  Nazwa grupy*
                </label>
                <input
                  id="group-edit-name"
                  type="text"
                  className="group-edit-modal__input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="group-edit-modal__field">
                <label className="group-edit-modal__label" htmlFor="group-edit-subject">
                  Przedmiot*
                </label>
                <input
                  id="group-edit-subject"
                  type="text"
                  className="group-edit-modal__input"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="group-edit-modal__field" style={{ marginTop: '0.75rem' }}>
              <label className="group-edit-modal__label" htmlFor="group-edit-desc">
                Opis grupy
              </label>
              <textarea
                id="group-edit-desc"
                className="group-edit-modal__textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSaving}
              />
            </div>
          </section>

          {/* Sekcja 2: Prowadzący */}
          <section className="group-edit-modal__section">
            <h3 className="group-edit-modal__section-title">Osoba prowadząca grupę</h3>
            <div className="group-edit-modal__field">
              <label className="group-edit-modal__label" htmlFor="group-edit-teacher">
                Wybierz prowadzącego
              </label>
              <select
                id="group-edit-teacher"
                className="group-edit-modal__select"
                value={teacherAccountId}
                onChange={(e) => setTeacherAccountId(e.target.value)}
                disabled={isSaving}
              >
                <option value="">(Brak przypisanego prowadzącego)</option>
                {availableLecturers.map((lec) => (
                  <option key={lec.accountId} value={lec.accountId}>
                    {lec.name} {lec.email ? `(${lec.email})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Sekcja 3: Studenci */}
          <section className="group-edit-modal__section">
            <h3 className="group-edit-modal__section-title">
              Przypisani studenci ({effectiveAssignedStudents.length})
            </h3>

            {effectiveAssignedStudents.length === 0 ? (
              <p className="group-edit-modal__empty-hint">Brak przypisanych studentów w grupie.</p>
            ) : (
              <div className="group-edit-modal__students-list">
                {effectiveAssignedStudents.map((s) => (
                  <div key={s.accountId} className="group-edit-modal__student-item">
                    <div className="group-edit-modal__student-info">
                      <span className="group-edit-modal__student-name">{s.name}</span>
                      <span className="group-edit-modal__student-meta">
                        {s.email} {s.studentNumber ? `• Nr indeksu: ${s.studentNumber}` : ''}
                      </span>
                      {s.currency != null ? (
                        <span className="group-edit-modal__student-stats">
                          Punkty: {s.currency} • Życia: {s.lives ?? 0}
                        </span>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleToggleRemoveStudent(s.accountId)}
                      disabled={isSaving}
                    >
                      Odłącz
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Dodawanie nowych studentów z organizacji - domyślnie zwinięte */}
            <div className="group-edit-modal__add-students-wrap">
              <div className="group-edit-modal__add-students-header">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddStudentsOpen((prev) => !prev)}
                >
                  {isAddStudentsOpen ? '▲ Zwiń dodawanie studentów' : `▼ Dodaj studentów z organizacji (${effectiveAvailableStudents.length} dostępnych)`}
                </Button>
              </div>

              {isAddStudentsOpen ? (
                <>
                  <SearchBar
                    className="group-edit-modal__search"
                    value={searchAvailableStudent}
                    onChange={(e) => setSearchAvailableStudent(e.target.value)}
                    placeholder="Szukaj studenta po nazwisku, e-mailu lub indeksie..."
                  />

                  <div className="group-edit-modal__available-list">
                    {effectiveAvailableStudents.length === 0 ? (
                      <p className="group-edit-modal__empty-hint">
                        {searchAvailableStudent
                          ? 'Brak pasujących studentów w organizacji.'
                          : 'Wszyscy studenci z organizacji są już przypisani do tej grupy.'}
                      </p>
                    ) : (
                      effectiveAvailableStudents.map((s) => (
                        <div key={s.accountId} className="group-edit-modal__student-item">
                          <div className="group-edit-modal__student-info">
                            <span className="group-edit-modal__student-name">{s.name}</span>
                            <span className="group-edit-modal__student-meta">
                              {s.email} {s.studentNumber ? `• Nr indeksu: ${s.studentNumber}` : ''}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleAddStudent(s.accountId)}
                            disabled={isSaving}
                          >
                            + Dodaj
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
}

