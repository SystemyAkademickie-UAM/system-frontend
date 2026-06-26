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

import { getStudentProgressPx, groupStudentsByRank } from './rankPathModel.js';

import RankPathMembers from './RankPathMembers.jsx';

import './RankPathBoard.css';



/**

 * @param {Object} props

 * @param {import('./rankPathModel.js').RankPathRank[]} props.ranks

 * @param {import('./rankPathModel.js').RankPathStudent[]} [props.students]

 * @param {boolean} props.isStudentView

 * @param {number} [props.totalEarned]

 * @param {string | null | undefined} [props.studentNickname]

 * @param {string | null | undefined} [props.studentAvatarUrl]

 * @param {boolean} [props.showHeader=true]

 */

export default function RankPathBoard({

  ranks,

  students = [],

  isStudentView,

  totalEarned = 0,

  studentNickname = 'Student',

  studentAvatarUrl = null,

  showHeader = true,

  showMemberAvatars = true,

}) {

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

  }, [ranks.length, isStudentView]);



  const axisTop = rowCenters[0] ?? 0;

  const axisBottom = rowCenters[rowCenters.length - 1] ?? axisTop;

  const axisSpan = Math.max(0, axisBottom - axisTop);

  const progressPx = isStudentView

    ? getStudentProgressPx(rowCenters, ranks, totalEarned)

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

          <div className="rank-path-row__rank">

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

          <p className="rank-path-board__eyebrow">Ścieżka rozwoju</p>

          <h2 className="rank-path-board__title">Rangi</h2>

        </header>

      ) : null}



      {ranks.length === 0 ? (

        <p className="rank-path-board__empty" role="status">

          Brak zdefiniowanych rang w tej grupie.

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


