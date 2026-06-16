import { Link, useParams } from 'react-router-dom';
import { TexturedSurface } from '../../../components/ui/index.js';
import ContentWithMeasuredDivider from '../../../components/ui/ContentWithMeasuredDivider/ContentWithMeasuredDivider.jsx';
import { groupActivitiesPath, groupRewardsBadgesPath, groupRewardsPath } from '../../../routes/pathRegistry.js';
import { useGroupDetails } from '../group-shared/useGroupDetails.js';
import GroupMainSubpageHeader from './shared/GroupMainSubpageHeader.jsx';
import './GroupMainHomeContent.css';
import './shared/groupMainSubpageHeader.css';

function InfoRow({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className="group-main-home__row">
      <span className="group-main-home__label">{label}</span>
      <span className="group-main-home__value">{value}</span>
    </div>
  );
}

export default function GroupMainHomeContent() {
  const { groupId } = useParams();
  const { group, isLoading, errorMessage } = useGroupDetails(groupId);

  if (isLoading) {
    return <p className="group-main-home__message">Ładowanie danych grupy…</p>;
  }

  if (errorMessage) {
    return (
      <p className="group-main-home__message group-main-home__message--error" role="alert">
        {errorMessage}
      </p>
    );
  }

  return (
    <div className="group-main-home">
      <GroupMainSubpageHeader eyebrow="Witamy" title="Strona główna" />

      <TexturedSurface className="group-main-home__surface">
        <section className="group-main-home__section group-main-home__section--description" aria-label="Opis grupy">
          <ContentWithMeasuredDivider
            className="group-main-home__description"
            dividerClassName="group-main-home__description-divider"
          >
            {group?.description?.trim() || 'Brak opisu fabularnego grupy.'}
          </ContentWithMeasuredDivider>
        </section>

        <section className="group-main-home__section" aria-label="Dane grupy">
          <h2 className="group-main-home__section-title">Dane grupy</h2>
          <InfoRow label="Nazwa fabularna" value={group?.storyName} />
          <InfoRow label="Przedmiot" value={group?.subject} />
          <InfoRow label="Prowadzący" value={group?.lecturer} />
          <InfoRow label="Waluta" value={group?.currencyName || group?.currency} />
          <InfoRow label="System żyć" value={group?.lives != null ? String(group.lives) : null} />
        </section>
      </TexturedSurface>
    </div>
  );
}

export function GroupMainEmptyNotice({ message, linkLabel, linkTo }) {
  return (
    <p className="group-main-home__empty-notice">
      {message}{' '}
      {linkLabel && linkTo ? (
        <Link className="group-main-home__empty-link" to={linkTo}>
          {linkLabel}
        </Link>
      ) : null}
    </p>
  );
}

export const GROUP_MAIN_EMPTY_LINKS = {
  ranks: { message: 'Nie dodano jeszcze rang.', linkLabel: 'Dodaj je w systemie nagród', path: groupRewardsPath },
  badges: { message: 'Nie dodano jeszcze odznak.', linkLabel: 'Dodaj je w systemie nagród', path: groupRewardsBadgesPath },
  activities: { message: 'Nie dodano jeszcze aktywności.', linkLabel: 'Dodaj je w module aktywności', path: groupActivitiesPath },
};
