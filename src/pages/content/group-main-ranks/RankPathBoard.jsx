import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Rank } from '../../../components/ui/index.js';

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

  const rowsRef = useRef(null);

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



          {!isStudentView || showMemberAvatars ? (

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

        <div className={['rank-path-board__canvas', isStudentView ? 'rank-path-board__canvas--student' : 'rank-path-board__canvas--lecturer'].filter(Boolean).join(' ')}>

          <div className="rank-path-board__track">

            {axisContent}

            {rowsContent}

          </div>

        </div>

      )}

    </div>

  );

}


