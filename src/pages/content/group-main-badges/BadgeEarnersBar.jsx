import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CurrencyDisplay from '../../../components/ui/Currency/CurrencyDisplay.jsx';
import PlayerAvatar from '../../../components/ui/PlayerAvatar/PlayerAvatar.jsx';
import { positionAnchoredTooltip } from '../../../utils/ui/positionTooltipInViewport.js';
import './BadgeEarnersBar.css';

const DEFAULT_MAX_VISIBLE = 15;

function OverflowBadge({ hiddenStudents }) {
  const triggerRef = useRef(null);
  const bubbleRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [layout, setLayout] = useState(null);

  const updateLayout = useCallback(() => {
    const trigger = triggerRef.current;
    const bubble = bubbleRef.current;
    if (!trigger || !bubble) {
      return;
    }

    setLayout(positionAnchoredTooltip({
      triggerRect: trigger.getBoundingClientRect(),
      bubbleRect: bubble.getBoundingClientRect(),
    }));
  }, []);

  useLayoutEffect(() => {
    if (!visible) {
      setLayout(null);
      return undefined;
    }

    updateLayout();
    const rafId = window.requestAnimationFrame(updateLayout);

    window.addEventListener('scroll', updateLayout, true);
    window.addEventListener('resize', updateLayout);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updateLayout, true);
      window.removeEventListener('resize', updateLayout);
    };
  }, [visible, hiddenStudents.length, updateLayout]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="badge-earners-bar__overflow"
        aria-label={`${hiddenStudents.length} dodatkowych uczestników`}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        …
      </button>

      {visible
        ? createPortal(
          <div
            ref={bubbleRef}
            className="badge-earners-bar__overflow-tooltip"
            style={{
              visibility: layout ? 'visible' : 'hidden',
              left: layout ? `${layout.left}px` : 0,
              top: layout ? `${layout.top}px` : 0,
            }}
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
