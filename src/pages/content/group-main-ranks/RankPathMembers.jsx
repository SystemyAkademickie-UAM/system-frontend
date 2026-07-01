import { Link, useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CurrencyDisplay from '../../../components/ui/Currency/CurrencyDisplay.jsx';
import PlayerAvatar from '../../../components/ui/PlayerAvatar/PlayerAvatar.jsx';
import { groupStudentProfilePath } from '../../../routes/pathRegistry.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './RankPathMembers.css';

const DEFAULT_MAX_VISIBLE = 15;

const OVERFLOW__TEXTLABEL = {
  polish: 'Pozostali uczestnicy',
  english: 'Other Participants',
};

const MEMBERS__TEXTLABEL = {
  polish: (count) => `${count} uczestników z tą rangą`,
  english: (count) => `${count} participants with this rank`,
};

const OVERFLOWBUTTON__TEXTLABEL = {
  polish: (count) => `${count} dodatkowych uczestników`,
  english: (count) => `${count} additional participants`,
};

function OverflowBadge({ hiddenStudents, groupId }) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const triggerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleEnter = () => {
    if (!triggerRef.current) {
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ x: rect.left, y: rect.bottom + 8 });
    setVisible(true);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="rank-path-members__overflow"
        aria-label={OVERFLOWBUTTON__TEXTLABEL[LANGUAGE](hiddenStudents.length)}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setVisible(false)}
        onFocus={handleEnter}
        onBlur={() => setVisible(false)}
      >
        …
      </button>

      {visible
        ? createPortal(
          <div
            className="rank-path-members__overflow-tooltip"
            style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
            role="tooltip"
          >
            <p className="rank-path-members__overflow-title">{OVERFLOW__TEXTLABEL[LANGUAGE]}</p>
            <ul className="rank-path-members__overflow-list">
              {hiddenStudents.map((student) => (
                <li key={student.id}>
                  {groupId && student.accountId ? (
                    <Link
                      className="rank-path-members__overflow-link"
                      to={groupStudentProfilePath(groupId, student.accountId)}
                    >
                      {student.nickname}
                    </Link>
                  ) : (
                    <span>{student.nickname}</span>
                  )}
                  <CurrencyDisplay
                    amount={student.totalEarned}
                    size="sm"
                    className="rank-path-members__overflow-earned"
                  />
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )
        : null}
    </>
  );
}

/**
 * Awatary studentów przypisanych do rangi (prowadzący).
 */
export default function RankPathMembers({
  students,
  maxVisible = DEFAULT_MAX_VISIBLE,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const { groupId } = useParams();

  if (!students.length) {
    return <div className="rank-path-members rank-path-members--empty" aria-hidden="true" />;
  }

  const visibleStudents = students.slice(0, maxVisible);
  const hiddenStudents = students.slice(maxVisible);

  return (
    <div className="rank-path-members" aria-label={MEMBERS__TEXTLABEL[LANGUAGE](students.length)}>
      {visibleStudents.map((student) => (
        <PlayerAvatar
          key={student.id}
          nickname={student.nickname}
          avatarUrl={student.avatarUrl}
          totalEarned={student.totalEarned}
          size="md"
          tooltipPlacement="left"
          href={groupId && student.accountId
            ? groupStudentProfilePath(groupId, student.accountId)
            : undefined}
        />
      ))}
      {hiddenStudents.length > 0 ? (
        <OverflowBadge
          hiddenStudents={hiddenStudents}
          groupId={groupId}
        />
      ) : null}
    </div>
  );
}
