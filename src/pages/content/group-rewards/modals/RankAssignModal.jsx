import { useMemo, useState } from 'react';
import { Modal, SearchBar } from '../../../../components/ui/index.js';
import '../../group-rewards/shared/rewardsModals.css';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const ASSIGNMODALTITLE__TEXTLABEL = {
  polish: 'Zmień rangę',
  english: 'Change rank',
};

const SEARCHPLACEHOLDER__TEXTLABEL = {
  polish: 'Szukaj osoby…',
  english: 'Search student…',
};

const SEARCHARIA__TEXTLABEL = {
  polish: 'Szukaj osoby',
  english: 'Search student',
};

const CONFIRMLABEL__TEXTLABEL = {
  polish: 'Zapisz',
  english: 'Save',
};

const SAVINGLABEL__TEXTLABEL = {
  polish: 'Zapisywanie…',
  english: 'Saving…',
};

const NOSTUDENTS__TEXTLABEL = {
  polish: 'Brak studentów w tej grupie.',
  english: 'No students in this group.',
};

const NORESULTS__TEXTLABEL = {
  polish: 'Brak wyników wyszukiwania.',
  english: 'No search results.',
};

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Object} props.rank
 * @param {Array<Object>} [props.students]
 * @param {() => void} props.onClose
 * @param {(selectedIds: string[]) => void} props.onConfirm
 * @param {boolean} [props.isLoading=false]
 */
export default function RankAssignModal({
  isOpen,
  rank,
  students = [],
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial selection computed synchronously so checkboxes don't jump/flicker on first frame
  const initialIds = useMemo(() => {
    if (!isOpen || !rank || !Array.isArray(students)) return [];
    return students
      .filter((student) => student.rankId === rank.id || student.dbRankId === rank.dbId)
      .map((student) => student.id);
  }, [isOpen, rank, students]);

  const [selectedIds, setSelectedIds] = useState(initialIds);
  const [prevModalKey, setPrevModalKey] = useState(null);

  const modalKey = isOpen && rank ? `${rank.id}-${isOpen}` : null;
  if (modalKey !== prevModalKey) {
    setPrevModalKey(modalKey);
    setSelectedIds(initialIds);
    setSearchQuery('');
  }

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
  };

  if (!isOpen || !rank) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ASSIGNMODALTITLE__TEXTLABEL[LANGUAGE]}
      subtitle={rank.name}
      onConfirm={handleConfirm}
      confirmLabel={isLoading ? SAVINGLABEL__TEXTLABEL[LANGUAGE] : CONFIRMLABEL__TEXTLABEL[LANGUAGE]}
      confirmDisabled={isLoading}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__toolbar">
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={SEARCHPLACEHOLDER__TEXTLABEL[LANGUAGE]}
          name="rank-assign-search"
          aria-label={SEARCHARIA__TEXTLABEL[LANGUAGE]}
          disabled={isLoading}
        />
      </div>

      {students.length === 0 ? (
        <p className="rewards-modal__empty page-unavailable__notice">{NOSTUDENTS__TEXTLABEL[LANGUAGE]}</p>
      ) : visibleStudents.length === 0 ? (
        <p className="rewards-modal__empty page-unavailable__notice">{NORESULTS__TEXTLABEL[LANGUAGE]}</p>
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
                    disabled={isLoading}
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
