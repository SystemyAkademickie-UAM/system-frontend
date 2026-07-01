import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Divider } from '../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import RankPathBoard from './RankPathBoard.jsx';
import { useGroupMainRanks } from './useGroupMainRanks.js';
import GroupMainEmptyNotice from '../../../components/group-main/GroupMainEmptyNotice.jsx';
import { useGroupMainEmptyLink } from '../../../hooks/group-main/useGroupMainEmptyLink.js';
import '../group-main/shared/groupMainSubpageHeader.css';
import '../group-main/GroupMainHomeContent.css';
import './GroupMainRanksContent.css';

const LOADINGMESSAGE__TEXTLABEL = {
  polish: 'Ładowanie ścieżki rozwoju…',
  english: 'Loading rank path…',
};

const SECTIONLABEL__TEXTLABEL = {
  polish: 'Ścieżka rozwoju',
  english: 'Rank Path',
};

const TITLE__TEXTLABEL = {
  polish: 'Skarbiec',
  english: 'Treasury',
};

const PAGETITLE__TEXTLABEL = {
  polish: 'Rangi',
  english: 'Ranks',
};

const STUDENTNAME__TEXTLABEL = {
  polish: 'Student',
  english: 'Student',
};

const EMPTYMESSAGE__TEXTLABEL = {
  polish: 'Nie dodano jeszcze rang.',
  english: 'No ranks have been added yet.',
};

const EMPTYSTUDENTMESSAGE__TEXTLABEL = {
  polish: 'Nie dodano jeszcze rang w tej grupie.',
  english: 'No ranks have been added to this group.',
};

const EMPTYLINKLABEL__TEXTLABEL = {
  polish: 'Dodaj je w systemie nagród',
  english: 'Add them in the rewards system',
};

export default function GroupMainRanksContent({
  embedded = false,
  showMemberAvatars: showMemberAvatarsOverride,
  showLecturerActions = false,
  onEditRank,
  onDeleteRank,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const { groupId } = useParams();
  const {
    ranks,
    students,
    studentProfile,
    isLoading,
    error,
    isStudentView,
    showMemberAvatars: showMemberAvatarsFromHook,
  } = useGroupMainRanks();
  const showMemberAvatars = showMemberAvatarsOverride ?? showMemberAvatarsFromHook;
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (!isStudentView || isLoading || ranks.length === 0 || hasScrolledRef.current) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const marker = document.getElementById('rank-student-marker');
      if (marker) {
        marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
        hasScrolledRef.current = true;
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [isStudentView, isLoading, ranks.length, studentProfile?.totalEarned]);

  if (isLoading) {
    return <p className="group-main-ranks__message" role="status">{LOADINGMESSAGE__TEXTLABEL[LANGUAGE]}</p>;
  }

  if (error) {
    return (
      <p className="group-main-ranks__message group-main-ranks__message--error" role="alert">
        {error}
      </p>
    );
  }

  const emptyLink = useGroupMainEmptyLink('ranks', groupId);

  return (
    <section className="group-main-ranks" aria-label={SECTIONLABEL__TEXTLABEL[LANGUAGE]}>
      {!embedded ? (
        <>
          <div className="group-main-ranks__title-row">
            <header className="group-main-ranks__page-header">
              <p className="group-main-ranks__eyebrow">{TITLE__TEXTLABEL[LANGUAGE]}</p>
              <h1 className="group-main-ranks__title">{PAGETITLE__TEXTLABEL[LANGUAGE]}</h1>
            </header>
          </div>
          <Divider className="group-main-subpage__divider" />
        </>
      ) : null}

      {ranks.length === 0 ? (
        <GroupMainEmptyNotice
          message={isStudentView ? EMPTYSTUDENTMESSAGE__TEXTLABEL[LANGUAGE] : EMPTYMESSAGE__TEXTLABEL[LANGUAGE]}
          linkLabel={isStudentView ? null : EMPTYLINKLABEL__TEXTLABEL[LANGUAGE]}
          linkTo={isStudentView ? null : emptyLink.linkTo}
        />
      ) : (
        <RankPathBoard
          ranks={ranks}
          students={students}
          isStudentView={isStudentView}
          showMemberAvatars={showMemberAvatars}
          totalEarned={studentProfile?.totalEarned ?? 0}
          studentNickname={studentProfile?.nickname || studentProfile?.name || STUDENTNAME__TEXTLABEL[LANGUAGE]}
          studentAvatarUrl={studentProfile?.avatarUrl ?? null}
          showHeader={false}
          showLecturerActions={showLecturerActions}
          onEditRank={onEditRank}
          onDeleteRank={onDeleteRank}
        />
      )}
    </section>
  );
}
