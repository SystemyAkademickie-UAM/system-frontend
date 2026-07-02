import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import AssetSvg from '../../../components/ui/AssetSvg/AssetSvg.jsx';
import { Rank } from '../../../components/ui/index.js';
import { SVG_ICONS } from '../../../constants/svgIcons.js';

import PlayerAvatar from '../../../components/ui/PlayerAvatar/PlayerAvatar.jsx';

import {

  getRankAxisGradientCss,

  interpolateHexColor,

  RANK_GRADIENT_END,

  RANK_GRADIENT_START,

  RANK_LOCKED_COLOR,

} from '../../../utils/rankGradient.js';

import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

import { getStudentManualRankProgressPx, getStudentProgressPx, groupStudentsByRank } from './rankPathModel.js';

import RankPathMembers from './RankPathMembers.jsx';

import LecturerTileActions from '../group-rewards/shared/LecturerTileActions.jsx';

import '../../../components/ui/ProductCard/ProductCard.css';

import './RankPathBoard.css';

const HEADEREYEBROW__TEXTLABEL = {
  polish: 'Ścieżka rozwoju',
  english: 'Rank Path',
};

const HEADERTITLE__TEXTLABEL = {
  polish: 'Rangi',
  english: 'Ranks',
};

const EMPTYMESSAGE__TEXTLABEL = {
  polish: 'Brak zdefiniowanych rang w tej grupie.',
  english: 'No ranks defined in this group.',
};

const MOBILE_AXIS_MAX_WIDTH_PX = 960;

const AXISTOGGLELABEL__TEXTLABEL = {
  polish: 'Pokaż oś postępu',
  english: 'Show progress axis',
};

const AXISPANELTITLE__TEXTLABEL = {
  polish: 'Oś postępu',
  english: 'Progress axis',
};

const AXISCLOSELABEL__TEXTLABEL = {
  polish: 'Zamknij oś postępu',
  english: 'Close progress axis',
};

const AXISBACKDROPLABEL__TEXTLABEL = {
  polish: 'Zamknij oś postępu',
  english: 'Close progress axis',
};

const MEMBERSTOGGLELABEL__TEXTLABEL = {
  polish: 'Pokaż uczestników na rangach',
  english: 'Show participants on ranks',
};

const MEMBERSPANELTITLE__TEXTLABEL = {
  polish: 'Uczestnicy',
  english: 'Participants',
};

const MEMBERSCLOSELABEL__TEXTLABEL = {
  polish: 'Zamknij listę uczestników',
  english: 'Close participants list',
};

const MEMBERSBACKDROPLABEL__TEXTLABEL = {
  polish: 'Zamknij listę uczestników',
  english: 'Close participants list',
};

function useMobileAxisLayout() {
  const [isMobileAxis, setIsMobileAxis] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia(`(max-width: ${MOBILE_AXIS_MAX_WIDTH_PX}px)`).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_AXIS_MAX_WIDTH_PX}px)`);
    const onChange = () => setIsMobileAxis(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return isMobileAxis;
}

function resolveScrollElement(startEl) {
  let el = startEl?.parentElement ?? null;

  while (el) {
    const { overflowY } = getComputedStyle(el);
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
      if (el.scrollHeight > el.clientHeight + 1) {
        return el;
      }
    }
    el = el.parentElement;
  }

  return document.getElementById('main-content') ?? document.documentElement;
}

function readPanelContentTop(panelBody) {
  const panelBodyRect = panelBody.getBoundingClientRect();
  const paddingTop = Number.parseFloat(getComputedStyle(panelBody).paddingTop) || 0;
  return panelBodyRect.top + paddingTop;
}



/**

 * @param {Object} props

 * @param {import('./rankPathModel.js').RankPathRank[]} props.ranks

 * @param {import('./rankPathModel.js').RankPathStudent[]} [props.students]

 * @param {boolean} props.isStudentView

 * @param {number} [props.totalEarned]
 * @param {number | null | undefined} [props.studentRankId]
 * @param {boolean} [props.studentAutoRankEnabled=true]

 * @param {string | null | undefined} [props.studentNickname]

 * @param {string | null | undefined} [props.studentAvatarUrl]

 * @param {boolean} [props.showHeader=true]
 * @param {boolean} [props.showLecturerActions=false]
 * @param {(rank: import('./rankPathModel.js').RankPathRank) => void} [props.onEditRank]
 * @param {(rank: import('./rankPathModel.js').RankPathRank) => void} [props.onDeleteRank]
 * @param {(rank: import('./rankPathModel.js').RankPathRank) => void} [props.onAssignRank]
 */

export default function RankPathBoard({
  ranks,

  students = [],

  isStudentView,

  totalEarned = 0,

  studentRankId = null,

  studentAutoRankEnabled = true,

  studentNickname = 'Student',

  studentAvatarUrl = null,

  showHeader = true,

  showMemberAvatars = true,

  showLecturerActions = false,
  onEditRank,
  onDeleteRank,
  onAssignRank,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [isAxisPanelOpen, setIsAxisPanelOpen] = useState(false);
  const [isMembersPanelOpen, setIsMembersPanelOpen] = useState(false);
  const isMobileAxis = useMobileAxisLayout();

  const rowsRef = useRef(null);
  const axisPanelBodyRef = useRef(null);
  const membersPanelBodyRef = useRef(null);
  const isSyncingAxisScrollRef = useRef(false);
  const isSyncingMembersScrollRef = useRef(false);

  const showMembersColumn = showMemberAvatars;
  const showMembersMobilePanel = isMobileAxis && showMembersColumn;
  const showMembersDesktopColumn = showMembersColumn && !showMembersMobilePanel;

  const [rowCenters, setRowCenters] = useState([]);

  const [boardHeight, setBoardHeight] = useState(0);



  const studentsByRank = useMemo(

    () => groupStudentsByRank(ranks, students),

    [ranks, students],

  );



  useLayoutEffect(() => {

    const container = rowsRef.current;

    if (!container) {

      return undefined;

    }



    const measure = () => {

      const rowElements = Array.from(container.querySelectorAll('.rank-path-row'));

      const containerRect = container.getBoundingClientRect();

      const centers = rowElements.map((row) => {

        const rect = row.getBoundingClientRect();

        return rect.top - containerRect.top + rect.height / 2;

      });

      setRowCenters(centers);

      setBoardHeight(containerRect.height);

    };



    measure();



    const observer = new ResizeObserver(measure);

    observer.observe(container);

    window.addEventListener('resize', measure);



    return () => {

      observer.disconnect();

      window.removeEventListener('resize', measure);

    };

  }, [ranks.length, isStudentView, studentRankId, studentAutoRankEnabled]);

  useEffect(() => {
    if (!isMobileAxis) {
      setIsAxisPanelOpen(false);
      setIsMembersPanelOpen(false);
    }
  }, [isMobileAxis]);

  useEffect(() => {
    if (!isAxisPanelOpen && !isMembersPanelOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsAxisPanelOpen(false);
        setIsMembersPanelOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isAxisPanelOpen, isMembersPanelOpen]);

  const axisTop = rowCenters[0] ?? 0;

  const axisBottom = rowCenters[rowCenters.length - 1] ?? axisTop;

  const axisSpan = Math.max(0, axisBottom - axisTop);

  const useManualRankPosition = isStudentView
    && studentAutoRankEnabled === false
    && studentRankId != null;

  const progressPx = isStudentView
    ? (useManualRankPosition
      ? getStudentManualRankProgressPx(rowCenters, ranks, studentRankId)
      : getStudentProgressPx(rowCenters, ranks, totalEarned))
    : axisBottom;

  const progressRatio = axisSpan > 0

    ? Math.max(0, Math.min(1, (progressPx - axisTop) / axisSpan))

    : 0;

  const progressLineHeight = Math.max(0, progressPx - axisTop);

  const futureLineTop = progressPx;

  const futureLineHeight = Math.max(0, axisBottom - progressPx);



  const axisGradient = getRankAxisGradientCss();

  const studentProgressGradient = `linear-gradient(to bottom, ${RANK_GRADIENT_START}, ${interpolateHexColor(RANK_GRADIENT_START, RANK_GRADIENT_END, progressRatio)})`;

  const syncAxisFromPage = useCallback(() => {
    if (isSyncingAxisScrollRef.current) {
      return;
    }

    const rows = rowsRef.current;
    const panelBody = axisPanelBodyRef.current;

    if (!rows || !panelBody) {
      return;
    }

    const rowsRect = rows.getBoundingClientRect();
    const panelContentTop = readPanelContentTop(panelBody);
    const targetScrollTop = panelContentTop - rowsRect.top;
    const maxScrollTop = Math.max(0, panelBody.scrollHeight - panelBody.clientHeight);
    const nextScrollTop = Math.min(Math.max(0, targetScrollTop), maxScrollTop);

    if (Math.abs(panelBody.scrollTop - nextScrollTop) > 0.5) {
      isSyncingAxisScrollRef.current = true;
      panelBody.scrollTop = nextScrollTop;
      requestAnimationFrame(() => {
        isSyncingAxisScrollRef.current = false;
      });
    }
  }, []);

  const syncPageFromAxis = useCallback(() => {
    if (isSyncingAxisScrollRef.current) {
      return;
    }

    const rows = rowsRef.current;
    const panelBody = axisPanelBodyRef.current;
    const scrollRoot = resolveScrollElement(rows);

    if (!rows || !panelBody || !scrollRoot) {
      return;
    }

    const rowsRect = rows.getBoundingClientRect();
    const panelContentTop = readPanelContentTop(panelBody);
    const desiredRowsTop = panelContentTop - panelBody.scrollTop;
    const delta = rowsRect.top - desiredRowsTop;

    if (Math.abs(delta) > 0.5) {
      isSyncingAxisScrollRef.current = true;
      scrollRoot.scrollTop += delta;
      requestAnimationFrame(() => {
        isSyncingAxisScrollRef.current = false;
      });
    }
  }, []);

  const syncMembersFromPage = useCallback(() => {
    if (isSyncingMembersScrollRef.current) {
      return;
    }

    const rows = rowsRef.current;
    const panelBody = membersPanelBodyRef.current;

    if (!rows || !panelBody) {
      return;
    }

    const rowsRect = rows.getBoundingClientRect();
    const panelContentTop = readPanelContentTop(panelBody);
    const targetScrollTop = panelContentTop - rowsRect.top;
    const maxScrollTop = Math.max(0, panelBody.scrollHeight - panelBody.clientHeight);
    const nextScrollTop = Math.min(Math.max(0, targetScrollTop), maxScrollTop);

    if (Math.abs(panelBody.scrollTop - nextScrollTop) > 0.5) {
      isSyncingMembersScrollRef.current = true;
      panelBody.scrollTop = nextScrollTop;
      requestAnimationFrame(() => {
        isSyncingMembersScrollRef.current = false;
      });
    }
  }, []);

  const syncPageFromMembers = useCallback(() => {
    if (isSyncingMembersScrollRef.current) {
      return;
    }

    const rows = rowsRef.current;
    const panelBody = membersPanelBodyRef.current;
    const scrollRoot = resolveScrollElement(rows);

    if (!rows || !panelBody || !scrollRoot) {
      return;
    }

    const rowsRect = rows.getBoundingClientRect();
    const panelContentTop = readPanelContentTop(panelBody);
    const desiredRowsTop = panelContentTop - panelBody.scrollTop;
    const delta = rowsRect.top - desiredRowsTop;

    if (Math.abs(delta) > 0.5) {
      isSyncingMembersScrollRef.current = true;
      scrollRoot.scrollTop += delta;
      requestAnimationFrame(() => {
        isSyncingMembersScrollRef.current = false;
      });
    }
  }, []);

  useEffect(() => {
    if (!isMobileAxis || !isAxisPanelOpen) {
      return undefined;
    }

    const rows = rowsRef.current;
    const panelBody = axisPanelBodyRef.current;
    if (!rows || !panelBody) {
      return undefined;
    }

    const scrollRoot = resolveScrollElement(rows);
    if (!scrollRoot) {
      return undefined;
    }

    let frameId = 0;
    const scheduleAxisSync = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(syncAxisFromPage);
    };

    const onPanelScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(syncPageFromAxis);
    };

    scheduleAxisSync();
    scrollRoot.addEventListener('scroll', scheduleAxisSync, { passive: true });
    panelBody.addEventListener('scroll', onPanelScroll, { passive: true });
    window.addEventListener('resize', scheduleAxisSync);

    return () => {
      cancelAnimationFrame(frameId);
      scrollRoot.removeEventListener('scroll', scheduleAxisSync);
      panelBody.removeEventListener('scroll', onPanelScroll);
      window.removeEventListener('resize', scheduleAxisSync);
    };
  }, [
    boardHeight,
    isAxisPanelOpen,
    isMobileAxis,
    rowCenters.length,
    syncAxisFromPage,
    syncPageFromAxis,
  ]);

  useLayoutEffect(() => {
    if (!isMobileAxis || !isAxisPanelOpen) {
      return;
    }

    syncAxisFromPage();
  }, [boardHeight, isAxisPanelOpen, isMobileAxis, rowCenters.length, syncAxisFromPage]);

  useEffect(() => {
    if (!isMobileAxis || !isMembersPanelOpen) {
      return undefined;
    }

    const rows = rowsRef.current;
    const panelBody = membersPanelBodyRef.current;
    if (!rows || !panelBody) {
      return undefined;
    }

    const scrollRoot = resolveScrollElement(rows);
    if (!scrollRoot) {
      return undefined;
    }

    let frameId = 0;
    const scheduleMembersSync = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(syncMembersFromPage);
    };

    const onPanelScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(syncPageFromMembers);
    };

    scheduleMembersSync();
    scrollRoot.addEventListener('scroll', scheduleMembersSync, { passive: true });
    panelBody.addEventListener('scroll', onPanelScroll, { passive: true });
    window.addEventListener('resize', scheduleMembersSync);

    return () => {
      cancelAnimationFrame(frameId);
      scrollRoot.removeEventListener('scroll', scheduleMembersSync);
      panelBody.removeEventListener('scroll', onPanelScroll);
      window.removeEventListener('resize', scheduleMembersSync);
    };
  }, [
    boardHeight,
    isMembersPanelOpen,
    isMobileAxis,
    rowCenters.length,
    syncMembersFromPage,
    syncPageFromMembers,
  ]);

  useLayoutEffect(() => {
    if (!isMobileAxis || !isMembersPanelOpen) {
      return;
    }

    syncMembersFromPage();
  }, [boardHeight, isMembersPanelOpen, isMobileAxis, rowCenters.length, syncMembersFromPage]);



  const axisContent = rowCenters.length > 0 ? (
    <div
      className="rank-path-board__axis"
      style={{ height: boardHeight > 0 ? `${boardHeight}px` : undefined }}
      aria-hidden="true"
    >
      <div
        className="rank-path-board__axis-track"
        style={{ top: `${axisTop}px`, height: `${axisSpan}px` }}
      >
      {isStudentView ? (

        <>

          <div

            className="rank-path-board__axis-line rank-path-board__axis-line--progress"

            style={{

              top: 0,

              height: `${progressLineHeight}px`,

              background: studentProgressGradient,

            }}

          />

          <div

            className="rank-path-board__axis-line rank-path-board__axis-line--future"

            style={{

              top: `${futureLineTop - axisTop}px`,

              height: `${futureLineHeight}px`,

            }}

          />

        </>

      ) : (

        <div

          className="rank-path-board__axis-line rank-path-board__axis-line--full"

          style={{ background: axisGradient }}

        />

      )}



      {rowCenters.map((center, index) => {

        const rank = ranks[index];

        if (!rank) {

          return null;

        }



        return (

          <span

            key={rank.id}

            className="rank-path-board__axis-node"

            style={{

              top: `${center - axisTop}px`,

              borderColor: isStudentView && !rank.isUnlocked ? RANK_LOCKED_COLOR : rank.accentColor,

              background: isStudentView && !rank.isUnlocked ? RANK_LOCKED_COLOR : rank.accentColor,

            }}

          />

        );

      })}



      {isStudentView && boardHeight > 0 ? (

        <div
          id="rank-student-marker"
          className="rank-path-board__student-marker"
          style={{ top: `${progressPx - axisTop}px` }}
        >

          <PlayerAvatar

            nickname={studentNickname}

            avatarUrl={studentAvatarUrl}

            totalEarned={totalEarned}

            size="lg"

            tooltipPlacement="left"
            tooltipPlain
            className="rank-path-board__student-avatar"

          />

        </div>

      ) : null}
      </div>
    </div>
  ) : null;

  const membersPanelContent = rowCenters.length > 0 ? (
    <div
      className="rank-path-board__members-stack"
      style={{ height: boardHeight > 0 ? `${boardHeight}px` : undefined }}
    >
      {ranks.map((rank, index) => {
        const center = rowCenters[index];
        if (center == null) {
          return null;
        }

        return (
          <div
            key={rank.id}
            className="rank-path-board__members-slot"
            style={{ top: `${center - axisTop}px` }}
          >
            <RankPathMembers
              students={studentsByRank.get(rank.id) ?? []}
            />
          </div>
        );
      })}
    </div>
  ) : null;

  const rowsContent = (

    <div className="rank-path-board__rows" ref={rowsRef}>

      {ranks.map((rank) => (

        <div key={rank.id} className="rank-path-row">

          <div className={[
            'rank-path-row__rank',
            showLecturerActions ? 'rank-path-row__rank--lecturer' : '',
          ].filter(Boolean).join(' ')}>
            {showLecturerActions ? (
              <LecturerTileActions
                entityLabel="rangę"
                name={rank.name}
                onEdit={onEditRank ? () => onEditRank(rank) : undefined}
                onDelete={onDeleteRank ? () => onDeleteRank(rank) : undefined}
                onAssign={onAssignRank ? () => onAssignRank(rank) : undefined}
                assignLabel="Przydziel rangę"
                className="rank-path-row__actions"
              />
            ) : null}

            <Rank

              name={rank.name}

              costAmount={rank.costAmount}

              storyDescription={rank.storyDescription}

              shopItems={rank.shopItems}

              discountPercent={rank.discount ?? 0}

              iconFile={rank.iconFile}

              accentColor={rank.accentColor}

              isLocked={isStudentView && !rank.isUnlocked}

            />

          </div>



          {!showMembersMobilePanel && showMembersColumn ? (

            <RankPathMembers

              students={studentsByRank.get(rank.id) ?? []}

            />

          ) : null}

        </div>

      ))}

    </div>

  );



  return (

    <div className="rank-path-board">

      {showHeader ? (

        <header className="rank-path-board__header">

          <p className="rank-path-board__eyebrow">{HEADEREYEBROW__TEXTLABEL[LANGUAGE]}</p>

          <h2 className="rank-path-board__title">{HEADERTITLE__TEXTLABEL[LANGUAGE]}</h2>

        </header>

      ) : null}



      {ranks.length === 0 ? (

        <p className="rank-path-board__empty" role="status">

          {EMPTYMESSAGE__TEXTLABEL[LANGUAGE]}

        </p>

      ) : (

        <div className={[
          'rank-path-board__canvas',
          isStudentView ? 'rank-path-board__canvas--student' : 'rank-path-board__canvas--lecturer',
          isStudentView && showMembersDesktopColumn ? 'rank-path-board__canvas--student-desktop-members' : '',
          showMembersMobilePanel ? 'rank-path-board__canvas--members-mobile' : '',
        ].filter(Boolean).join(' ')}>

          {isMobileAxis ? (
            <>
              {!isAxisPanelOpen ? (
                <button
                  type="button"
                  className="rank-path-board__axis-toggle"
                  aria-expanded={isAxisPanelOpen}
                  aria-controls="rank-path-axis-panel"
                  aria-label={AXISTOGGLELABEL__TEXTLABEL[LANGUAGE]}
                  onClick={() => setIsAxisPanelOpen(true)}
                >
                  <AssetSvg
                    name={SVG_ICONS.actions.manageProgress}
                    className="rank-path-board__axis-toggle-icon"
                    width={22}
                    height={22}
                    alt=""
                  />
                </button>
              ) : null}

              {showMembersMobilePanel && !isMembersPanelOpen ? (
                <button
                  type="button"
                  className="rank-path-board__members-toggle"
                  aria-expanded={isMembersPanelOpen}
                  aria-controls="rank-path-members-panel"
                  aria-label={MEMBERSTOGGLELABEL__TEXTLABEL[LANGUAGE]}
                  onClick={() => setIsMembersPanelOpen(true)}
                >
                  <AssetSvg
                    name={SVG_ICONS.nav.members}
                    className="rank-path-board__members-toggle-icon"
                    width={22}
                    height={22}
                    alt=""
                  />
                </button>
              ) : null}

              {isAxisPanelOpen ? (
                <button
                  type="button"
                  className="rank-path-board__axis-backdrop"
                  aria-label={AXISBACKDROPLABEL__TEXTLABEL[LANGUAGE]}
                  onClick={() => setIsAxisPanelOpen(false)}
                />
              ) : null}

              {isMembersPanelOpen ? (
                <button
                  type="button"
                  className="rank-path-board__members-backdrop"
                  aria-label={MEMBERSBACKDROPLABEL__TEXTLABEL[LANGUAGE]}
                  onClick={() => setIsMembersPanelOpen(false)}
                />
              ) : null}

              <aside
                id="rank-path-axis-panel"
                className={[
                  'rank-path-board__axis-panel',
                  isAxisPanelOpen ? 'rank-path-board__axis-panel--open' : '',
                ].filter(Boolean).join(' ')}
                aria-hidden={!isAxisPanelOpen}
                aria-label={AXISPANELTITLE__TEXTLABEL[LANGUAGE]}
              >
                <div className="rank-path-board__axis-panel-head">
                  <span className="rank-path-board__axis-panel-title">{AXISPANELTITLE__TEXTLABEL[LANGUAGE]}</span>
                  <button
                    type="button"
                    className="rank-path-board__axis-panel-close"
                    aria-label={AXISCLOSELABEL__TEXTLABEL[LANGUAGE]}
                    onClick={() => setIsAxisPanelOpen(false)}
                  >
                    <AssetSvg
                      name={SVG_ICONS.controls.close}
                      className="rank-path-board__axis-panel-close-icon"
                      width={18}
                      height={18}
                      alt=""
                    />
                  </button>
                </div>
                <div className="rank-path-board__axis-panel-body" ref={axisPanelBodyRef}>
                  {axisContent}
                </div>
              </aside>

              {showMembersMobilePanel ? (
                <aside
                  id="rank-path-members-panel"
                  className={[
                    'rank-path-board__members-panel',
                    isMembersPanelOpen ? 'rank-path-board__members-panel--open' : '',
                  ].filter(Boolean).join(' ')}
                  aria-hidden={!isMembersPanelOpen}
                  aria-label={MEMBERSPANELTITLE__TEXTLABEL[LANGUAGE]}
                >
                  <div className="rank-path-board__members-panel-head">
                    <span className="rank-path-board__members-panel-title">{MEMBERSPANELTITLE__TEXTLABEL[LANGUAGE]}</span>
                    <button
                      type="button"
                      className="rank-path-board__members-panel-close"
                      aria-label={MEMBERSCLOSELABEL__TEXTLABEL[LANGUAGE]}
                      onClick={() => setIsMembersPanelOpen(false)}
                    >
                      <AssetSvg
                        name={SVG_ICONS.controls.close}
                        className="rank-path-board__members-panel-close-icon"
                        width={18}
                        height={18}
                        alt=""
                      />
                    </button>
                  </div>
                  <div className="rank-path-board__members-panel-body" ref={membersPanelBodyRef}>
                    {membersPanelContent}
                  </div>
                </aside>
              ) : null}
            </>
          ) : null}

          <div className="rank-path-board__track">

            {!isMobileAxis ? axisContent : null}

            {rowsContent}

          </div>

        </div>

      )}

    </div>

  );

}


