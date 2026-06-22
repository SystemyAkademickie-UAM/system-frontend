import { useParams } from 'react-router-dom';
import { useGroupCurrency } from '../../../context/GroupCurrencyContext.jsx';
import RankPathBoard from './RankPathBoard.jsx';
import { useGroupMainRanks } from './useGroupMainRanks.js';
import { GroupMainEmptyNotice, useGroupMainEmptyLink } from '../group-main/GroupMainHomeContent.jsx';
import '../group-main/GroupMainHomeContent.css';
import './GroupMainRanksContent.css';

export default function GroupMainRanksContent() {
  const { groupId } = useParams();
  const { symbol } = useGroupCurrency();
  const {
    ranks,
    students,
    studentProfile,
    isLoading,
    error,
    isStudentView,
  } = useGroupMainRanks();

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
      <div className="group-main-ranks__title-row">
        <header className="group-main-ranks__page-header">
          <p className="group-main-ranks__eyebrow">Skarbiec</p>
          <h1 className="group-main-ranks__title">Rangi</h1>
        </header>
      </div>

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
          totalEarned={studentProfile?.totalEarned ?? 0}
          studentNickname={studentProfile?.nickname || studentProfile?.name || 'Student'}
          studentAvatarUrl={studentProfile?.avatarUrl ?? null}
          currencySymbol={symbol}
          showHeader={false}
        />
      )}
    </section>
  );
}

