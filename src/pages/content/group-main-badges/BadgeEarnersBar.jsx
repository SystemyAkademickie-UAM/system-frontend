import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CurrencyDisplay from '../../../components/ui/Currency/CurrencyDisplay.jsx';
import PlayerAvatar from '../../../components/ui/PlayerAvatar/PlayerAvatar.jsx';
import './BadgeEarnersBar.css';

const DEFAULT_MAX_VISIBLE = 15;

function OverflowBadge({ hiddenStudents }) {
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
        className="badge-earners-bar__overflow"
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
            className="badge-earners-bar__overflow-tooltip"
            style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
            role="tooltip"
          >
            <p className="badge-earners-bar__overflow-title">Pozostali uczestnicy</p>
            <ul className="badge-earners-bar__overflow-list">
              {hiddenStudents.map((student) => (
                <li key={student.id}>
                  <span>{student.nickname}</span>
                  <CurrencyDisplay
                    amount={student.totalEarned}
                    size="sm"
                    className="badge-earners-bar__overflow-earned"
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
 * Awatary studentów, którzy zdobyli odznakę.
 *
 * @param {Object} props
 * @param {import('./badgeTreasuryModel.js').TreasuryStudent[]} props.students
 * @param {number} [props.maxVisible]
 */
export default function BadgeEarnersBar({
  students,
  maxVisible = DEFAULT_MAX_VISIBLE,
  className = '',
}) {
  if (!students.length) {
    return <div className={['badge-earners-bar', 'badge-earners-bar--empty', className].filter(Boolean).join(' ')} aria-hidden="true" />;
  }

  const visibleStudents = students.slice(0, maxVisible);
  const hiddenStudents = students.slice(maxVisible);

  return (
    <div
      className={['badge-earners-bar', className].filter(Boolean).join(' ')}
      aria-label={`${students.length} uczestników z tą odznaką`}
    >
      {visibleStudents.map((student) => (
        <PlayerAvatar
          key={student.id}
          nickname={student.nickname}
          avatarUrl={student.avatarUrl}
          totalEarned={student.totalEarned}
          size="md"
          tooltipPlacement="top"
        />
      ))}
      {hiddenStudents.length > 0 ? (
        <OverflowBadge hiddenStudents={hiddenStudents} />
      ) : null}
    </div>
  );
}
