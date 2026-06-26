import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, SearchBar } from '../../../../components/ui/index.js';
import { fetchStudentBadges, toggleStudentBadge } from '../../../../services/students.api.js';
import '../../group-rewards/shared/rewardsModals.css';

export default function BadgeGiveModal({
  isOpen,
  badge,
  groupId,
  students,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const initialIdsRef = useRef([]);

  useEffect(() => {
    if (!isOpen || !badge || !groupId) return;

    setSearchQuery('');
    setSelectedIds([]);
    initialIdsRef.current = [];

    async function loadEarnedStudents() {
      setIsFetching(true);
      try {
        const results = await Promise.all(students.map(async (student) => {
          const studentBadges = await fetchStudentBadges(groupId, student.accountId);
          const hasBadge = studentBadges.some((item) => (
            item.id === badge.dbId && item.isEarned
          ));
          return hasBadge ? student.id : null;
        }));

        const earnedIds = results.filter(Boolean);
        initialIdsRef.current = earnedIds;
        setSelectedIds(earnedIds);
      } catch (err) {
        console.error('Failed to load badge assignment state:', err);
        initialIdsRef.current = [];
        setSelectedIds([]);
      } finally {
        setIsFetching(false);
      }
    }

    loadEarnedStudents();
  }, [isOpen, badge, groupId, students]);

  const visibleStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;

    return students.filter((student) => student.name.toLowerCase().includes(query));
  }, [students, searchQuery]);

  const toggleStudent = (studentId) => {
    setSelectedIds((prev) => (
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    ));
  };

  const handleConfirm = async () => {
    if (!badge?.dbId || !groupId) return;

    const initialSet = new Set(initialIdsRef.current);
    const selectedSet = new Set(selectedIds);
    const changedStudents = students.filter((student) => {
      const wasSelected = initialSet.has(student.id);
      const isSelected = selectedSet.has(student.id);
      return wasSelected !== isSelected;
    });

    if (changedStudents.length === 0) {
      onConfirm?.({ changed: 0 });
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      const results = await Promise.all(changedStudents.map((student) => (
        toggleStudentBadge(groupId, student.accountId, badge.dbId)
      )));

      const failed = results.filter((result) => !result.ok);
      if (failed.length > 0) {
        onConfirm?.({ changed: 0, error: failed[0].error || 'Nie udało się zaktualizować odznak.' });
        return;
      }

      onConfirm?.({ changed: changedStudents.length });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (!badge) return null;

  const busy = isLoading || isFetching || isSaving;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Przydziel odznakę"
      subtitle={badge.name}
      onConfirm={handleConfirm}
      confirmDisabled={busy}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__toolbar">
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj studenta…"
          name="badge-give-search"
          aria-label="Szukaj studenta"
        />
      </div>

      {isFetching ? (
        <p className="rewards-modal__loading">Ładowanie przypisań…</p>
      ) : (
        <ul className="rewards-modal__student-list">
          {visibleStudents.map((student) => {
            const isSelected = selectedIds.includes(student.id);

            return (
              <li key={student.id}>
                <label
                  className={[
                    'rewards-modal__student-option',
                    isSelected ? 'rewards-modal__student-option--selected' : '',
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    className="rewards-modal__student-checkbox"
                    checked={isSelected}
                    disabled={busy}
                    onChange={() => toggleStudent(student.id)}
                  />
                  <span className="rewards-modal__student-name">{student.name}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
