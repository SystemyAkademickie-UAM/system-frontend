import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PlayerAvatar from '../../../components/ui/PlayerAvatar/PlayerAvatar.jsx';
import { groupStudentProfilePath } from '../../../routes/pathRegistry.js';
import { positionAnchoredTooltip } from '../../../utils/ui/positionTooltipInViewport.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './BadgeEarnersBar.css';

const OVERFLOWARIA__TEXTLABEL = {
  polish: 'dodatkowych uczestników',
  english: 'additional participants'
};

const OVERFLOWTITLE__TEXTLABEL = {
  polish: 'Pozostali uczestnicy',
  english: 'Other participants'
};

function OverflowBadge({ hiddenStudents, groupId, LANGUAGE }) {
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
        aria-label={`${hiddenStudents.length} ${OVERFLOWARIA__TEXTLABEL[LANGUAGE]}`}
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
            <p className="badge-earners-bar__overflow-title">{OVERFLOWTITLE__TEXTLABEL[LANGUAGE]}</p>
            <ul className="badge-earners-bar__overflow-list">
              {hiddenStudents.map((student) => (
                <li key={student.id}>
                  <span className="badge-earners-bar__overflow-name">{student.nickname}</span>
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

const BARIARIA__TEXTLABEL = {
  polish: 'uczestników',
  english: 'participants'
};

/**
 * Awatary studentów na kafelku odznaki lub rangi.
 *
 * @param {Object} props
 * @param {Array<{ id: string | number, accountId?: number, position?: number, nickname: string, avatarUrl?: string | null, totalEarned?: number }>} props.students
 * @param {number} [props.maxVisible]
 * @param {string | number} [props.groupId]
 * @param {string} [props.className]
 * @param {string} [props.LANGUAGE]
 */
export default function BadgeEarnersBar({
  students = [],
  maxVisible: explicitMaxVisible,
  groupId,
  className = '',
  LANGUAGE = 'polish',
}) {
  const barRef = useRef(null);
  const [autoMaxVisible, setAutoMaxVisible] = useState(students.length);

  useLayoutEffect(() => {
    if (explicitMaxVisible !== undefined) {
      return undefined;
    }

    const el = barRef.current;
    if (!el) {
      return undefined;
    }

    const calculateFit = () => {
      const parentWidth = el.parentElement?.offsetWidth || el.offsetWidth;
      if (!parentWidth) return;

      const availableWidth = Math.max(80, parentWidth - 28);
      const itemWidth = 40;
      const gap = 6;
      const maxSlots = Math.max(1, Math.floor((availableWidth + gap) / (itemWidth + gap)));

      if (students.length <= maxSlots) {
        setAutoMaxVisible(students.length);
      } else {
        setAutoMaxVisible(Math.max(1, maxSlots - 1));
      }
    };

    calculateFit();
    const ro = new ResizeObserver(calculateFit);
    if (el.parentElement) {
      ro.observe(el.parentElement);
    }
    ro.observe(el);

    return () => ro.disconnect();
  }, [students.length, explicitMaxVisible]);

  if (!students.length) {
    return <div ref={barRef} className={['badge-earners-bar', 'badge-earners-bar--empty', className].filter(Boolean).join(' ')} aria-hidden="true" />;
  }

  const effectiveMaxVisible = explicitMaxVisible !== undefined ? explicitMaxVisible : autoMaxVisible;
  const visibleStudents = students.slice(0, effectiveMaxVisible);
  const hiddenStudents = students.slice(effectiveMaxVisible);

  return (
    <div
      ref={barRef}
      className={['badge-earners-bar', className].filter(Boolean).join(' ')}
      aria-label={`${students.length} ${BARIARIA__TEXTLABEL[LANGUAGE]}`}
    >
      {visibleStudents.map((student) => (
        <PlayerAvatar
          key={student.id}
          nickname={student.nickname}
          avatarUrl={student.avatarUrl}
          totalEarned={student.totalEarned}
          size="md"
          tooltipPlacement="top"
          href={groupId && (student.position || student.accountId)
            ? groupStudentProfilePath(groupId, student.position ?? student.accountId)
            : undefined}
        />
      ))}
      {hiddenStudents.length > 0 ? (
        <OverflowBadge hiddenStudents={hiddenStudents} groupId={groupId} LANGUAGE={LANGUAGE} />
      ) : null}
    </div>
  );
}
