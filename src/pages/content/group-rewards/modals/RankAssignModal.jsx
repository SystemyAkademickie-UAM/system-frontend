import { useEffect, useMemo, useState } from 'react';
import { Modal, SearchBar } from '../../../../components/ui/index.js';
import '../../group-rewards/shared/rewardsModals.css';

export default function RankAssignModal({
  isOpen,
  rank,
  students,
  onClose,
  onConfirm,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (!isOpen || !rank) return;

    setSearchQuery('');
    setSelectedIds(
      students
        .filter((student) => student.rankId === rank.id)
        .map((student) => student.id),
    );
  }, [isOpen, rank, students]);

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

  const handleConfirm = () => {
    onConfirm?.(selectedIds);
    onClose();
  };

  if (!rank) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Zmień rangę"
      subtitle={rank.name}
      onConfirm={handleConfirm}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__toolbar">
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj studenta…"
          name="rank-assign-search"
          aria-label="Szukaj studenta"
        />
      </div>

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
                  onChange={() => toggleStudent(student.id)}
                />
                <span className="rewards-modal__student-name">{student.name}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
