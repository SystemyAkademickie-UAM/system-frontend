import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Divider } from '../../../components/ui/index.js';
import RankPathBoard from './RankPathBoard.jsx';
import { useGroupMainRanks } from './useGroupMainRanks.js';
import GroupMainEmptyNotice from '../../../components/group-main/GroupMainEmptyNotice.jsx';
import { useGroupMainEmptyLink } from '../../../hooks/group-main/useGroupMainEmptyLink.js';
import '../group-main/shared/groupMainSubpageHeader.css';
import '../group-main/GroupMainHomeContent.css';
import './GroupMainRanksContent.css';

export default function GroupMainRanksContent({
  embedded = false,
  showMemberAvatars: showMemberAvatarsOverride,
  showLecturerActions = false,
  onEditRank,
  onDeleteRank,
}) {
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
    return <p className="group-main-ranks__message" role="status">Ładowanie ścieżki rozwoju…</p>;
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
    <section className="group-main-ranks" aria-label="Ścieżka rozwoju">
      {!embedded ? (
        <>
          <div className="group-main-ranks__title-row">
            <header className="group-main-ranks__page-header">
              <p className="group-main-ranks__eyebrow">Skarbiec</p>
              <h1 className="group-main-ranks__title">Rangi</h1>
            </header>
          </div>
          <Divider className="group-main-subpage__divider" />
        </>
      ) : null}

      {ranks.length === 0 ? (
        <GroupMainEmptyNotice
          message={emptyLink.message}
          linkLabel={emptyLink.linkLabel}
          linkTo={emptyLink.linkTo}
        />
      ) : (
        <RankPathBoard
          ranks={ranks}
          students={students}
          isStudentView={isStudentView}
          showMemberAvatars={showMemberAvatars}
          totalEarned={studentProfile?.totalEarned ?? 0}
          studentNickname={studentProfile?.nickname || studentProfile?.name || 'Student'}
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

