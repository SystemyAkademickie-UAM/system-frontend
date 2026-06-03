import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PlayerAvatar from '../../../components/ui/PlayerAvatar/PlayerAvatar.jsx';
import './RankPathMembers.css';

const DEFAULT_MAX_VISIBLE = 15;

function OverflowBadge({ hiddenStudents, currencySymbol }) {
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
        aria-label={`${hiddenStudents.length} dodatkowych uczestników`}
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
            <p className="rank-path-members__overflow-title">Pozostali uczestnicy</p>
            <ul className="rank-path-members__overflow-list">
              {hiddenStudents.map((student) => (
                <li key={student.id}>
                  <span>{student.nickname}</span>
                  <span className="rank-path-members__overflow-earned">
                    {student.totalEarned}
                    {currencySymbol ? ` ${currencySymbol}` : ''}
                  </span>
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
 *
 * @param {Object} props
 * @param {import('../rankPathModel.js').RankPathStudent[]} props.students
 * @param {string} [props.currencySymbol]
 * @param {number} [props.maxVisible]
 */
export default function RankPathMembers({
  students,
  currencySymbol,
  maxVisible = DEFAULT_MAX_VISIBLE,
}) {
  if (!students.length) {
    return <div className="rank-path-members rank-path-members--empty" aria-hidden="true" />;
  }

  const visibleStudents = students.slice(0, maxVisible);
  const hiddenStudents = students.slice(maxVisible);

  return (
    <div className="rank-path-members" aria-label={`${students.length} uczestników z tą rangą`}>
      {visibleStudents.map((student) => (
        <PlayerAvatar
          key={student.id}
          nickname={student.nickname}
          avatarUrl={student.avatarUrl}
          totalEarned={student.totalEarned}
          currencySymbol={currencySymbol}
          size="md"
          tooltipPlacement="left"
        />
      ))}
      {hiddenStudents.length > 0 ? (
        <OverflowBadge hiddenStudents={hiddenStudents} currencySymbol={currencySymbol} />
      ) : null}
    </div>
  );
}
